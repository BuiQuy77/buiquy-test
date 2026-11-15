import React, { useState, useMemo, useRef, useEffect } from 'react';
import MathView from './MathView';
import lessonsOcrData from '../data/lessons_ocr.json';
import {
  Send,
  BookOpen,
  Sparkles,
  Search,
  Calculator,
  Layers,
  CheckCircle2,
  ArrowRight,
  FileText,
  Trash2,
  Sliders,
  Key,
  Cpu,
  HelpCircle
} from 'lucide-react';

// Loại bỏ dấu tiếng Việt để phục vụ tìm kiếm BM25 + từ khóa không dấu
function stripAccents(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

// Nạp toàn bộ 28 chuyên đề ôn thi TN THPT Quốc Gia từ kho tri thức chuẩn hóa
import {
  TNTHPT_KNOWLEDGE_CHUNKS as SPECIALIZED_KNOWLEDGE_CHUNKS,
  TNTHPT_TOPIC_CATEGORIES,
  TNTHPT_SUGGESTED_QUESTIONS as SUGGESTED_QUESTIONS
} from '../data/tnthptExamKnowledge';

function mapLessonToTopicCategory(lesson) {
  const chap = (lesson?.chapter || '').toLowerCase();
  const title = (lesson?.title || '').toLowerCase();
  const subj = (lesson?.subject || '').toLowerCase();
  if (chap.includes('đạo hàm') || chap.includes('khảo sát') || title.includes('đạo hàm') || chap.includes('hàm số')) return 'calculus';
  if (chap.includes('nguyên hàm') || chap.includes('tích phân')) return 'integral';
  if (chap.includes('oxyz') || chap.includes('tọa độ của vectơ') || chap.includes('phương pháp tọa độ trong không gian')) return 'oxyz';
  if (chap.includes('xác suất') || chap.includes('thống kê') || chap.includes('phân tán') || chap.includes('xu thế trung tâm')) return 'prob_stat';
  if (chap.includes('mũ') || chap.includes('lôgarit') || chap.includes('logarit')) return 'exp_log';
  if (chap.includes('không gian') || chap.includes('song song') || chap.includes('vuông góc')) return 'spatial';
  if (chap.includes('lượng giác') || chap.includes('dãy số') || chap.includes('cấp số')) return 'trig_seq';
  if (chap.includes('tam giác') || chap.includes('conic') || chap.includes('tổ hợp') || chap.includes('bất phương trình') || subj.includes('hình học')) return 'algebra_oxy';
  return 'calculus';
}

export default function AIRagAssistant({
  onSelectModule,
  onSelectDerivativeSubTab,
  onSelectCalculusSubTab,
  onOpenCasioModal
}) {
  const [queryInput, setQueryInput] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all'); // 'all' | 12 | 11 | 10
  const [topicFilter, setTopicFilter] = useState('all'); // 'all' | topicId
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('mathmate_gemini_key') || '');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Xây dựng chỉ mục RAG toàn diện từ lessons_ocr.json (gồm cả cấp độ Bài học và cấp độ Trang sách OCR)
  const ragCorpus = useMemo(() => {
    const docs = [];

    // 1. Nạp các khối chuyên đề tổng hợp
    SPECIALIZED_KNOWLEDGE_CHUNKS.forEach((chunk) => {
      const rawText = [
        chunk.title,
        chunk.chapter,
        chunk.keywords.join(' '),
        chunk.formulas.join(' '),
        chunk.answerTemplate
      ].join(' ');
      docs.push({
        ...chunk,
        type: 'specialized',
        searchText: rawText.toLowerCase(),
        searchNoAccent: stripAccents(rawText)
      });
    });

    // 2. Nạp từng bài học và từng trang OCR từ lessons_ocr.json
    lessonsOcrData.forEach((lesson) => {
      const sectionTexts = (lesson.sections || [])
        .map((s) => `${s.title || ''} ${(s.paragraphs || []).join(' ')} ${(s.bullets || []).join(' ')}`)
        .join(' ');
      const sectionFormulas = (lesson.sections || []).flatMap((s) => s.formulas || []);
      const objTexts = (lesson.objectives || []).join(' ');

      // Bổ sung nội dung chi tiết từng trang trong ocr_pages
      const pageEntries = Object.entries(lesson.ocr_pages || {});
      const pageSummaries = pageEntries
        .map(([pNum, pObj]) => {
          const blockStr = (pObj.blocks || [])
            .map((b) => `[Tr.${pNum} - ${b.title}]: ${b.content || ''} ${b.math ? `$${b.math}$` : ''}`)
            .join('\n');
          return blockStr;
        })
        .join('\n');

      const fullRaw = [
        lesson.number,
        lesson.title,
        lesson.subtitle,
        lesson.chapter,
        lesson.subject,
        objTexts,
        sectionTexts,
        pageSummaries
      ].join(' ');

      docs.push({
        id: lesson.id,
        type: 'lesson',
        topicCategory: mapLessonToTopicCategory(lesson),
        grade: lesson.grade,
        volume: lesson.volume,
        chapter: lesson.chapter,
        lessonNumber: lesson.number,
        title: lesson.title,
        subtitle: lesson.subtitle,
        pageOcr: lesson.pageOcr,
        startPage: lesson.startPage,
        endPage: lesson.endPage,
        sourceFile: lesson.sourceFile,
        moduleTarget: lesson.moduleTarget,
        subTab: lesson.subTab,
        objectives: lesson.objectives || [],
        sections: lesson.sections || [],
        formulas: sectionFormulas,
        ocrPages: lesson.ocr_pages || {},
        searchText: fullRaw.toLowerCase(),
        searchNoAccent: stripAccents(fullRaw)
      });
    });

    return docs;
  }, []);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      role: 'assistant',
      timestamp: 'Sẵn sàng',
      query: '',
      answer: `### Trợ lý AI RAG Toán THPT (SGK Toán 10 • 11 • 12 KNTT)
- **Tra cứu nhanh & ngắn gọn:** Định nghĩa, định lí và công thức cốt lõi trích xuất trực tiếp từ 6 cuốn SGK.
- **Giải toán thực tế:** Tiệm cận, Đường trượt $Ox$, Ao nuôi tôm, Bình gốm Bát Tràng, Đường cong Lorenz, Tọa độ $Oxyz$, Công thức Bayes.`,
      citations: [
        {
          id: 'cit-c1',
          lessonNumber: 'CHƯƠNG I',
          title: 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
          chapter: 'Toán 12 Tập 1 • Trang 5–44 SGK',
          sourceFile: 'SGK-Toan12-1.pdf',
          pageOcr: 'Trang 5–44 OCR',
          moduleTarget: 'part1',
          subTab: 'all',
          score: 99
        },
        {
          id: 'cit-c4',
          lessonNumber: 'CHƯƠNG IV',
          title: 'Nguyên hàm, Tích phân & Ứng dụng hình học 3D',
          chapter: 'Toán 12 Tập 2 • Trang 4–28 SGK',
          sourceFile: 'SGK-Toan12-2.pdf',
          pageOcr: 'Trang 4–28 OCR',
          moduleTarget: 'part2',
          subTab: 'all',
          score: 98
        }
      ]
    }
  ]);

  const [latestCitations, setLatestCitations] = useState(messages[0].citations);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isGenerating]);

  // Thuật toán Hybrid BM25 + Keyword Matching trên tập dữ liệu SGK
  const retrieveRelevantDocs = (rawQuery) => {
    const STOP_WORDS = new Set([
      'là', 'gì', 'la', 'gi', 'của', 'cua', 'và', 'va', 'trong', 'cho',
      'như', 'nhu', 'thế', 'the', 'nào', 'nao', 'hãy', 'hay', 'nêu', 'neu',
      'trình', 'trinh', 'bày', 'bay', 'tìm', 'tim', 'tính', 'tinh', 'với', 'voi'
    ]);

    const qLower = rawQuery.toLowerCase().trim();
    const qNoAccent = stripAccents(rawQuery);

    // Cụm từ cốt lõi sau khi bỏ từ để hỏi ("là gì", "như thế nào", ...)
    const corePhrase = qLower
      .replace(/\b(là gì|như thế nào|ở đâu|khi nào|hãy nêu|trình bày|tóm tắt|giải thích)\b/gi, '')
      .replace(/[?.,!;:"'()[\]]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const corePhraseNoAccent = stripAccents(corePhrase);

    const tokens = qLower
      .split(/[\s,.;:?!"'()[\]]+/)
      .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
    const tokensNoAccent = tokens.map((w) => stripAccents(w));

    const scored = [];

    ragCorpus.forEach((doc) => {
      if (gradeFilter !== 'all' && doc.grade !== Number(gradeFilter)) return;
      if (topicFilter !== 'all' && doc.topicCategory && doc.topicCategory !== topicFilter) return;

      let score = 0;
      const titleLower = (doc.title || '').toLowerCase();
      const titleNoAccent = stripAccents(doc.title || '');
      const chapLower = (doc.chapter || '').toLowerCase();

      // Exact phrase matches (full query or core phrase)
      if (
        (corePhrase.length >= 4 && (titleLower.includes(corePhrase) || titleNoAccent.includes(corePhraseNoAccent))) ||
        titleLower.includes(qLower) ||
        titleNoAccent.includes(qNoAccent)
      ) {
        score += 55;
      }
      if (corePhrase.length >= 4 && doc.searchText.includes(corePhrase)) {
        score += 30;
      } else if (doc.searchText.includes(qLower)) {
        score += 25;
      }

      // Keyword boost for specialized chunks
      if (doc.keywords) {
        doc.keywords.forEach((kw) => {
          const kwLower = kw.toLowerCase();
          const kwNo = stripAccents(kwLower);
          if (qLower.includes(kwLower) || qNoAccent.includes(kwNo)) {
            score += kwLower.length >= 12 ? 42 : 24;
          } else if (corePhrase.length >= 4 && (kwLower.includes(corePhrase) || kwNo.includes(corePhraseNoAccent))) {
            score += 28;
          }
        });
      }

      // Token-level BM25-style scoring (excluding stop words)
      tokens.forEach((tk, idx) => {
        const tkNo = tokensNoAccent[idx] || tk;
        if (titleLower.includes(tk) || titleNoAccent.includes(tkNo)) score += 12;
        if (chapLower.includes(tk)) score += 6;
        if (doc.searchText.includes(tk) || doc.searchNoAccent.includes(tkNo)) score += 4;
      });

      if (score > 0) {
        scored.push({ doc, score });
      }
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4);
  };

  // Tổng hợp câu trả lời ngắn gọn, súc tích từ các tài liệu SGK truy xuất được
  const synthesizeLocalRagAnswer = (userQuery, retrievedItems) => {
    if (!retrievedItems || retrievedItems.length === 0) {
      return `Chưa tìm thấy nội dung khớp với **"${userQuery}"** trong bộ lọc hiện tại. Hãy chọn **"Tất cả 10–12"** hoặc hỏi về: *Đồ thị hàm số, Tiệm cận, Nguyên hàm, Tích phân, Bình gốm Bát Tràng, Oxyz, Bayes*.`;
    }

    const top = retrievedItems[0].doc;

    // Nếu khớp với khối kiến thức chuyên đề đã biên soạn rút gọn
    if (top.type === 'specialized' && top.answerTemplate) {
      return top.answerTemplate;
    }

    // Tổng hợp ngắn gọn từ bài học SGK (`lessons_ocr.json`) — lọc mục khớp nhất với câu hỏi
    const lesson = top;
    const lessonLabel = lesson.lessonNumber || lesson.number || 'BÀI HỌC SGK';
    const qNorm = stripAccents(userQuery);
    const qTokens = qNorm.split(/[\s,.;:?!"'()[\]]+/).filter((w) => w.length >= 2);

    const rankedSections = [...(lesson.sections || [])].sort((a, b) => {
      const aStr = stripAccents(`${a.title || ''} ${(a.paragraphs || []).join(' ')}`);
      const bStr = stripAccents(`${b.title || ''} ${(b.paragraphs || []).join(' ')}`);
      const aHits = qTokens.reduce((acc, tk) => acc + (aStr.includes(tk) ? 1 : 0), 0);
      const bHits = qTokens.reduce((acc, tk) => acc + (bStr.includes(tk) ? 1 : 0), 0);
      return bHits - aHits;
    });

    const topSections = rankedSections.slice(0, 2);
    const secContent = topSections
      .map((sec) => {
        const firstPara = (sec.paragraphs || [])[0] || '';
        const firstFormula = (sec.formulas || [])[0];
        const firstBullet = (sec.bullets || [])[0];
        const cleanSecTitle = (sec.title || 'Trọng tâm').replace(/^\d+\.\s*/, '');
        return `- **${cleanSecTitle}:** ${firstPara}${firstFormula ? `\n$$${firstFormula}$$` : ''}${
          !firstFormula && firstBullet ? ` (${firstBullet})` : ''
        }`;
      })
      .join('\n');

    const fallbackObj = (lesson.objectives || []).slice(0, 2).map((o) => `- ${o}`).join('\n');

    return `### ${lessonLabel}: ${lesson.title} (Lớp ${lesson.grade} Tập ${lesson.volume} • ${lesson.pageOcr})
${secContent || fallbackObj || `- ${lesson.subtitle}`}`;
  };

  const handleSendQuery = async (customQuery) => {
    const finalQuery = (typeof customQuery === 'string' ? customQuery : queryInput).trim();
    if (!finalQuery || isGenerating) return;

    if (typeof customQuery !== 'string') {
      setQueryInput('');
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      content: finalQuery
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    // Bước 1: Truy xuất ngữ cảnh từ kho SGK (RAG Retrieval)
    const retrieved = retrieveRelevantDocs(finalQuery);
    const maxScore = retrieved[0]?.score || 1;
    const citations = retrieved.map((item, idx) => ({
      id: `${item.doc.id}-${idx}`,
      lessonNumber: item.doc.lessonNumber || item.doc.number || `TÀI LIỆU ${idx + 1}`,
      title: item.doc.title,
      chapter: `${item.doc.chapter} (Lớp ${item.doc.grade || 12})`,
      sourceFile: item.doc.sourceFile || 'SGK-Toan12-1.pdf',
      pageOcr: item.doc.pageOcr || 'SGK KNTT',
      moduleTarget: item.doc.moduleTarget,
      subTab: item.doc.subTab,
      score: Math.min(99, Math.max(72, Math.round((item.score / maxScore) * 98)))
    }));

    setLatestCitations(citations);

    let finalAnswerText = '';

    // Bước 2: Nếu người dùng đã cấu hình Gemini API Key, thử chuỗi model Gemini (2.5-flash -> 2.0-flash -> 1.5-flash)
    if (geminiApiKey.trim()) {
      const contextBlocks = retrieved
        .slice(0, 2)
        .map(
          (r, i) =>
            `[Tài liệu ${i + 1}: ${r.doc.lessonNumber || r.doc.number || 'SGK'} - ${r.doc.title} (${r.doc.sourceFile}, ${r.doc.pageOcr})]\n${
              r.doc.answerTemplate || r.doc.searchText.slice(0, 800)
            }`
        )
        .join('\n\n');

      const promptBody = `Bạn là Trợ lý AI RAG Toán THPT của MathMate. Hãy trả lời câu hỏi dựa trên Ngữ cảnh SGK dưới đây.
YÊU CẦU BẮT BUỘC VỀ ĐỘ NGẮN GỌN:
- Trả lời CỰC KỲ NGẮN GỌN, SÚC TÍCH (tối đa 4–5 gạch đầu dòng, khoảng 80–130 từ).
- Đi thẳng vào định nghĩa/công thức cốt lõi và kết quả cuối cùng, KHÔNG viết lời chào hay diễn giải dài dòng.
- Dùng ký hiệu LaTeX trong $...$ hoặc dòng riêng $$...$$ và ghi kèm số trang SGK.

NGỮ CẢNH SGK:
${contextBlocks}

CÂU HỎI:
${finalQuery}`;

      const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const modelName of candidateModels) {
        if (finalAnswerText) break;
        try {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
              geminiApiKey.trim()
            )}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptBody }] }]
              })
            }
          );

          if (resp.ok) {
            const data = await resp.json();
            const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              finalAnswerText = candidateText;
            }
          }
        } catch {
          // Tiếp tục thử model kế tiếp hoặc fallback sang Local RAG
        }
      }
    }

    // Bước 3: Nếu chưa dùng API key hoặc gọi API không trả về, tổng hợp từ Local Hybrid RAG Engine
    if (!finalAnswerText) {
      finalAnswerText = synthesizeLocalRagAnswer(finalQuery, retrieved);
    }

    const assistantMsg = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      query: finalQuery,
      answer: finalAnswerText,
      citations
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsGenerating(false);
  };

  const handleSaveApiKey = (val) => {
    setGeminiApiKey(val);
    localStorage.setItem('mathmate_gemini_key', val);
  };

  const handleOpenCitationTarget = (cit) => {
    if (!cit) return;
    if (cit.moduleTarget === 'part1' && onSelectDerivativeSubTab) {
      onSelectDerivativeSubTab(cit.subTab || 'all');
    } else if (cit.moduleTarget === 'part2' && onSelectCalculusSubTab) {
      onSelectCalculusSubTab(cit.subTab || 'all');
    } else if (cit.moduleTarget && onSelectModule) {
      onSelectModule(cit.moduleTarget);
    } else if (onSelectModule) {
      onSelectModule('curriculum');
    }
  };

  // Làm sạch ký pháp markdown (**, *, `) ngoài vùng công thức toán trước khi đưa vào MathView
  const cleanMarkdownFormatting = (rawLine) => {
    return String(rawLine || '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*\n]+)\*/g, '$1');
  };

  // Render markdown + LaTeX paragraphs cleanly using MathView
  const renderFormattedAnswer = (text) => {
    const lines = String(text || '').split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            return (
              <h4
                key={idx}
                className="text-sm sm:text-base font-bold text-slate-900 pt-2 pb-1 border-b border-slate-200 tracking-[-0.01em]"
              >
                <MathView math={cleanMarkdownFormatting(trimmed.replace(/^#{2,3}\s+/, ''))} />
              </h4>
            );
          }

          if (trimmed.startsWith('#### ')) {
            return (
              <h5 key={idx} className="text-xs sm:text-sm font-bold text-teal-800 pt-1.5">
                <MathView math={cleanMarkdownFormatting(trimmed.replace(/^####\s+/, ''))} />
              </h5>
            );
          }

          // Block display equation $$...$$
          if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 my-1.5 overflow-x-auto"
              >
                <MathView math={trimmed} className="text-slate-900 font-semibold" />
              </div>
            );
          }

          // Bullet item
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const cleanLine = cleanMarkdownFormatting(trimmed.replace(/^[-•*]\s+/, ''));
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <MathView math={cleanLine} />
                </div>
              </div>
            );
          }

          const cleanParagraph = cleanMarkdownFormatting(trimmed);
          return (
            <p key={idx}>
              <MathView math={cleanParagraph} />
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 1. HEADER GỌN GÀNG TÍCH HỢP BỘ LỌC KHỐI LỚP & CẤU HÌNH API */}
      <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wide">
                HYBRID AI RAG • TOÁN 10–12 KNTT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                {ragCorpus.length} đơn vị tri thức & trang sách OCR
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-[-0.02em]">
              Trợ lý AI RAG Toán THPT — Truy xuất SGK & Giải toán từng bước
            </h2>
          </div>

          {/* Bộ lọc khối lớp + Cấu hình Key + Làm mới trên cùng 1 hàng điều khiển */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
              {[
                { id: 'all', label: 'Tất cả 10–12' },
                { id: 12, label: 'Lớp 12' },
                { id: 11, label: 'Lớp 11' },
                { id: 10, label: 'Lớp 10' }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGradeFilter(g.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    gradeFilter === g.id
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                geminiApiKey
                  ? 'bg-teal-500/15 border-teal-500/40 text-teal-300 hover:bg-teal-500/25'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-teal-400" />
              <span>{geminiApiKey ? 'Đã gắn Gemini Key' : 'Gemini Key'}</span>
            </button>

            <button
              onClick={() => {
                setMessages([messages[0]]);
                setLatestCitations(messages[0].citations);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Làm mới hội thoại"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Khung nhập Gemini API Key tùy chọn */}
        {showKeyConfig && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="text-xs text-slate-300 flex-1">
              <strong className="text-white">Chế độ mặc định:</strong> Hybrid Local RAG hoạt động tức thì không cần khóa API. Nhập khóa <strong>Gemini API</strong> nếu muốn kết hợp suy luận LLM mở rộng:
            </div>
            <div className="flex items-center gap-2 sm:w-96">
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="Nhập Gemini API Key (AIzaSy...)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
              />
              <button
                onClick={() => setShowKeyConfig(false)}
                className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. THANH CHUYÊN ĐỀ ÔN THI TN THPT QUỐC GIA (Requirement 3) */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chuyên đề TNTHPT:</span>
        </span>
        {TNTHPT_TOPIC_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setTopicFilter(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              topicFilter === cat.id
                ? 'bg-teal-500 text-slate-950 font-extrabold shadow-xs'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. THANH CHỦ ĐỀ GỢI Ý TRẢI ĐỀU (KHÔNG BỊ CẮT KHUẤT NGANG) */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-600" />
          <span>Chủ đề trọng tâm:</span>
        </span>
        {SUGGESTED_QUESTIONS.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSendQuery(item.query)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 text-[11px] font-semibold text-slate-700 hover:text-teal-900 transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 3. BỐ CỤC 2 CỘT CÂN ĐỐI CHIỀU CAO: CỘT TRÁI (8/12) HỎI ĐÁP • CỘT PHẢI (4/12) TRÍCH DẪN SGK */}
      <div className="grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x divide-slate-200">
        {/* CỘT TRÁI (8/12): LUỒNG HỘI THOẠI & THANH ĐẶT CÂU HỎI */}
        <div className="xl:col-span-8 flex flex-col h-[660px]">
          {/* Danh sách tin nhắn hỏi đáp */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/30">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-600">
                      {isUser ? 'Câu hỏi của bạn' : 'Trợ lý AI RAG Toán THPT'}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-2xl ${
                      isUser
                        ? 'max-w-[85%] bg-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm font-medium'
                        : 'w-full bg-white border border-slate-200/90 p-4 sm:p-5 shadow-2xs'
                    }`}
                  >
                    {isUser ? (
                      <MathView math={msg.content} />
                    ) : (
                      <div className="space-y-4">
                        {renderFormattedAnswer(msg.answer)}

                        {/* Các thẻ trích dẫn SGK đính kèm ngay dưới câu trả lời */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="pt-3 border-t border-slate-100 space-y-2">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                              <span>Nguồn SGK đối chiếu & Mở mô phỏng:</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.citations.slice(0, 2).map((cit) => (
                                <button
                                  key={cit.id}
                                  onClick={() => handleOpenCitationTarget(cit)}
                                  className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-left transition-colors cursor-pointer flex items-center justify-between gap-2 group"
                                >
                                  <div className="min-w-0">
                                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-teal-900 truncate">
                                      {cit.lessonNumber}: {cit.title}
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                      {cit.sourceFile} • {cit.pageOcr} ({cit.score}%)
                                    </div>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3 w-fit">
                <Cpu className="w-4 h-4 text-teal-600 animate-spin" />
                <span>Đang truy xuất đoạn trích SGK và tổng hợp lời giải toán học...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Thanh nhập câu hỏi dưới cùng */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Nhập câu hỏi toán học, định lí SGK hoặc bài toán thực tế (VD: Đồ thị hàm số là gì, Tiệm cận xiên, Bình gốm Bát Tràng...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!queryInput.trim() || isGenerating}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Hỏi AI RAG</span>
            </button>
          </form>
        </div>

        {/* CỘT PHẢI (4/12): ĐỒNG BỘ CHIỀU CAO h-[660px] VỚI CỘT TRÁI — KHÔNG CÒN KHOẢNG TRỐNG THỪA */}
        <div className="xl:col-span-4 h-[660px] bg-slate-50/60 flex flex-col justify-between">
          {/* Header Cột Phải */}
          <div className="px-4 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>Tài liệu SGK truy xuất</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bấm vào thẻ để mở bài học hoặc phòng thí nghiệm
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 font-mono text-[10px] font-bold shrink-0">
              Top-{latestCitations.length}
            </span>
          </div>

          {/* Danh sách thẻ tài liệu cuộn độc lập */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
            {latestCitations.map((cit, idx) => (
              <div
                key={cit.id || idx}
                onClick={() => handleOpenCitationTarget(cit)}
                className="bg-white rounded-xl border border-slate-200 p-3 hover:border-slate-900 transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide">
                    {cit.lessonNumber}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                    Khớp {cit.score}%
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 group-hover:text-teal-800 leading-snug">
                  {cit.title}
                </div>

                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <FileText className="w-3 h-3 text-teal-600" />
                    {cit.sourceFile}
                  </span>
                  <span>•</span>
                  <span>{cit.pageOcr}</span>
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">
                  <span>Mở học liệu & Mô phỏng</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>

          {/* Khung lối tắt công cụ bổ trợ ghim gọn dưới đáy cột phải */}
          <div className="p-3.5 bg-white border-t border-slate-200 space-y-2 shrink-0">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Chuyển nhanh phòng thực hành</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onSelectDerivativeSubTab && onSelectDerivativeSubTab('all')}
                className="px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-[11px] font-semibold text-slate-800 cursor-pointer truncate"
              >
                Khối Chương I (Hàm số)
              </button>
              <button
                onClick={() => onSelectCalculusSubTab && onSelectCalculusSubTab('all')}
                className="px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-[11px] font-semibold text-slate-800 cursor-pointer truncate"
              >
                Khối Chương IV (Tích phân)
              </button>
              <button
                onClick={() => onSelectModule && onSelectModule('geometry_studio')}
                className="px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-[11px] font-semibold text-slate-800 cursor-pointer flex items-center gap-1.5 truncate"
              >
                <Layers className="w-3 h-3 text-teal-700 shrink-0" />
                <span>Xưởng Vẽ 3D</span>
              </button>
              <button
                onClick={() => onOpenCasioModal && onOpenCasioModal()}
                className="px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-[11px] font-semibold text-slate-800 cursor-pointer flex items-center gap-1.5 truncate"
              >
                <Calculator className="w-3 h-3 text-teal-700 shrink-0" />
                <span>Máy tính Casio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
