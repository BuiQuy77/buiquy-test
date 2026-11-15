import React, { useState, useMemo, useEffect } from 'react';
import MathView from './MathView';
import LessonQuizSection from './LessonQuizSection';
import LessonVideoSection from './LessonVideoSection';
import { useAuth } from '../context/AuthContext';
import {
  getStoredLessons,
  switchToPhysicsSubject,
  switchToMathSubject,
  addSingleCustomLesson,
  exportLessonsToJsonFile,
  importLessonsFromJsonFile
} from '../services/curriculumDatabase';
import { getAppConfig } from '../services/customizationService';
import {
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  GraduationCap,
  BookOpen,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Columns,
  Image as ImageIcon,
  AlignLeft,
  Target,
  Award,
  Download,
  RefreshCw,
  Copy,
  Check,
  Film,
  Upload,
  PlusCircle,
  Trash2,
  Settings,
  X
} from 'lucide-react';

export default function CurriculumList({
  resetTrigger = 0,
  onSelectModule,
  onSelectCalculusSubTab,
  onSelectDerivativeSubTab
}) {
  const [selectedGrade, setSelectedGrade] = useState(12); // 12 | 11 | 10
  const [selectedVolume, setSelectedVolume] = useState('all'); // 'all' | 1 | 2
  const [searchQuery, setSearchQuery] = useState('');

  // Active lesson in the Interactive OCR Textbook Viewer (null = show catalog grid)
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentPrintedPage, setCurrentPrintedPage] = useState(5);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'image' | 'text' | 'pdf'
  const [ocrDisplayMode, setOcrDisplayMode] = useState('blocks'); // 'blocks' | 'raw'
  const [imageZoom, setImageZoom] = useState(1.0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1.0);
  const [imgError, setImgError] = useState(false);
  const [imgFallbackStage, setImgFallbackStage] = useState(0); // 0: static WebP, 1: /api, 2: localhost:5000

  // Live in-browser Re-OCR state
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [copiedOcr, setCopiedOcr] = useState(false);
  const { isTeacher } = useAuth();
  const [lessons, setLessons] = useState(() => getStoredLessons());
  const [curriculumNotice, setCurriculumNotice] = useState(null);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const fileInputCurriculumRef = React.useRef(null);

  // Form thêm bài học mới
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonChapter, setNewLessonChapter] = useState('Chương I: Dao động cơ');
  const [newLessonNumber, setNewLessonNumber] = useState('BÀI 1');
  const [newLessonSubtitle, setNewLessonSubtitle] = useState('');
  const [newLessonStartPage, setNewLessonStartPage] = useState(5);
  const [newLessonEndPage, setNewLessonEndPage] = useState(12);
  const [newLessonSubject, setNewLessonSubject] = useState('Vật lý');

  const appConfig = getAppConfig();

  const handleAddLessonSubmit = (e) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }
    const res = addSingleCustomLesson({
      title: newLessonTitle,
      chapter: newLessonChapter,
      number: newLessonNumber,
      subtitle: newLessonSubtitle,
      startPage: Number(newLessonStartPage),
      endPage: Number(newLessonEndPage),
      subject: newLessonSubject,
      grade: selectedGrade
    });
    if (res.success) {
      setLessons(getStoredLessons());
      setIsAddLessonModalOpen(false);
      setNewLessonTitle('');
      setNewLessonSubtitle('');
      setCurriculumNotice({ type: 'success', text: `Đã thêm bài học "${newLessonTitle}" thành công!` });
      setTimeout(() => setCurriculumNotice(null), 4000);
    }
  };

  const [customOcrMap, setCustomOcrMap] = useState(() => {
    try {
      const saved = localStorage.getItem('mathmate_custom_ocr_2026');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (resetTrigger > 0) {
      setActiveLesson(null);
      setIsLightboxOpen(false);
    }
  }, [resetTrigger]);

  // Filter lessons for the catalog view
  const filteredLessons = useMemo(() => {
    return lessons.filter((item) => {
      if (item.grade && item.grade !== selectedGrade) return false;
      if (selectedVolume !== 'all' && item.volume !== selectedVolume) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSub = (item.subtitle || '').toLowerCase().includes(q);
        const matchNum = item.number.toLowerCase().includes(q);
        const matchSubject = item.subject.toLowerCase().includes(q);
        const matchChapter = (item.chapter || '').toLowerCase().includes(q);
        return matchTitle || matchSub || matchNum || matchSubject || matchChapter;
      }
      return true;
    });
  }, [selectedGrade, selectedVolume, searchQuery]);

  // Open lesson detail viewer when clicking a card
  const handleOpenLessonDetail = (lesson) => {
    setActiveLesson(lesson);
    setCurrentPrintedPage(lesson.startPage || 5);
    setImageZoom(1.0);
    setImgError(false);
    setImgFallbackStage(0);
    const elem = document.getElementById('module-content');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Launch interactive 3D/2D simulation for a lesson
  const handleLaunchInteractiveLab = (lesson) => {
    if (!lesson) return;
    if (lesson.moduleTarget === 'part1' && lesson.subTab && onSelectDerivativeSubTab) {
      onSelectDerivativeSubTab(lesson.subTab);
    } else if (lesson.moduleTarget === 'part2' && lesson.subTab && onSelectCalculusSubTab) {
      onSelectCalculusSubTab(lesson.subTab);
    } else if (lesson.moduleTarget && onSelectModule) {
      onSelectModule(lesson.moduleTarget);
    } else if (onSelectModule) {
      onSelectModule('part1');
    }
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStaticPageWebpUrl = (sourceFile, printedPage) => {
    const pdfPage = printedPage + 1;
    const bookSlug = String(sourceFile || 'SGK-Toan12-1.pdf').replace(/\.pdf$/i, '');
    return `/sgk_pages/${bookSlug}/p_${pdfPage}.webp`;
  };

  // Open clean printable / Save-as-PDF full lesson window
  const openPrintableLesson = (lesson, focusPage = null, autoPrint = false) => {
    if (!lesson) return;
    const pages =
      lesson.printed_pages ||
      Array.from(
        { length: lesson.endPage - lesson.startPage + 1 },
        (_, i) => lesson.startPage + i
      );
    const win = window.open('', '_blank');
    if (!win) return;
    const origin = window.location.origin;
    const imgsHtml = pages
      .map((p) => {
        const url = `${origin}${getStaticPageWebpUrl(lesson.sourceFile, p)}`;
        const isFocus = focusPage === p;
        return `<div id="page-${p}" class="page-wrap${isFocus ? ' focus' : ''}">
          <div class="page-caption">${lesson.number}: ${lesson.title} — Trang ${p} (${lesson.sourceFile})</div>
          <img src="${url}" alt="Trang ${p}" loading="eager" />
        </div>`;
      })
      .join('\n');

    win.document.write(`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${lesson.number} - ${lesson.title} (SGK Toán ${lesson.grade})</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; }
    .toolbar { position: sticky; top: 0; z-index: 20; background: #020617; border-bottom: 1px solid #1e293b; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .title { font-size: 13px; font-weight: 700; color: #e2e8f0; }
    .btn { background: #14b8a6; color: #020617; border: none; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; }
    .btn:hover { background: #2dd4bf; }
    .container { max-width: 1180px; margin: 16px auto; padding: 0 12px 40px; display: flex; flex-direction: column; gap: 18px; }
    .page-wrap { background: #ffffff; border-radius: 12px; padding: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
    .page-caption { color: #475569; font-size: 11px; font-weight: 700; margin-bottom: 8px; text-align: right; }
    img { width: 100%; height: auto; display: block; border-radius: 6px; }
    @media print {
      body { background: #fff; }
      .toolbar, .page-caption { display: none !important; }
      .container { max-width: 100%; margin: 0; padding: 0; gap: 0; }
      .page-wrap { box-shadow: none; padding: 0; border-radius: 0; page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="title">${lesson.number}: ${lesson.title} • Trang ${lesson.startPage}–${lesson.endPage} (SGK Toán ${lesson.grade} - Tập ${lesson.volume})</div>
    <button class="btn" onclick="window.print()">🖨️ In / Lưu thành PDF</button>
  </div>
  <div class="container">${imgsHtml}</div>
  <script>
    ${focusPage ? `const el = document.getElementById('page-${focusPage}'); if (el) el.scrollIntoView();` : ''}
    ${autoPrint ? `window.addEventListener('load', () => setTimeout(() => window.print(), 450));` : ''}
  </script>
</body>
</html>`);
    win.document.close();
  };

  // Live in-browser Re-OCR using Tesseract.js (Vietnamese traineddata)
  const handleRescanPageOcr = async () => {
    if (!activeLesson || isScanningOcr) return;
    setIsScanningOcr(true);
    setOcrProgress(5);
    try {
      const TesseractModule = await import('tesseract.js');
      const recognizeFn = TesseractModule.recognize || TesseractModule.default?.recognize;
      const imgUrl = getStaticPageWebpUrl(activeLesson.sourceFile, currentPrintedPage);
      const result = await recognizeFn(imgUrl, 'vie', {
        logger: (m) => {
          if (m && typeof m.progress === 'number') {
            setOcrProgress(Math.max(8, Math.min(99, Math.round(m.progress * 100))));
          }
        }
      });
      const rawText = (result?.data?.text || '')
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      if (rawText) {
        const key = `${activeLesson.id}_${currentPrintedPage}`;
        const paragraphs = rawText
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter((p) => p.length > 5);

        const customEntry = {
          raw_text: rawText,
          scannedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          blocks: paragraphs.slice(0, 12).map((p, idx) => ({
            type: idx === 0 ? 'theorem' : 'note',
            title: idx === 0 ? `Bản quét OCR trực tiếp (Trang ${currentPrintedPage})` : `Đoạn ${idx + 1}`,
            content: p
          }))
        };

        setCustomOcrMap((prev) => {
          const next = { ...prev, [key]: customEntry };
          try {
            localStorage.setItem('mathmate_custom_ocr_2026', JSON.stringify(next));
          } catch {
            // ignore storage quota
          }
          return next;
        });
        setOcrDisplayMode('raw');
      }
    } catch (err) {
      console.error('Re-OCR error:', err);
    } finally {
      setIsScanningOcr(false);
      setOcrProgress(0);
    }
  };

  const handleResetPageOcr = () => {
    if (!activeLesson) return;
    const key = `${activeLesson.id}_${currentPrintedPage}`;
    setCustomOcrMap((prev) => {
      const next = { ...prev };
      delete next[key];
      try {
        localStorage.setItem('mathmate_custom_ocr_2026', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleCopyOcrText = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedOcr(true);
    setTimeout(() => setCopiedOcr(false), 1800);
  };

  // Build textbook page scan image URL (static CDN WebP first, API fallback second)
  const getPageImageUrl = (sourceFile, printedPage) => {
    if (imgFallbackStage === 0) {
      return getStaticPageWebpUrl(sourceFile, printedPage);
    }
    const pdfPage = printedPage + 1;
    const baseUrl = imgFallbackStage === 2 ? 'http://localhost:5000' : '';
    return `${baseUrl}/api/learning/textbook-page?source=${encodeURIComponent(
      sourceFile
    )}&page=${pdfPage}&printed_page=${printedPage}`;
  };

  const handleImageLoadError = () => {
    if (imgFallbackStage < 2) {
      setImgFallbackStage((s) => s + 1);
    } else {
      setImgError(true);
    }
  };

  // Keyboard navigation when Lightbox is open
  useEffect(() => {
    if (!isLightboxOpen || !activeLesson) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentPrintedPage((prev) => Math.max(activeLesson.startPage, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPrintedPage((prev) => Math.min(activeLesson.endPage, prev + 1));
      } else if (e.key === '+' || e.key === '=') {
        setLightboxZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)));
      } else if (e.key === '-' || e.key === '_') {
        setLightboxZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeLesson]);

  // Helper for subject badge colors
  const getSubjectBadgeStyle = (subject, color) => {
    switch (color) {
      case 'amber':
        return 'bg-[#fef3c7] text-[#92400e]';
      case 'purple':
        return 'bg-[#ede9fe] text-[#6d28d9]';
      case 'indigo':
        return 'bg-[#e0e7ff] text-[#4338ca]';
      case 'emerald':
        return 'bg-[#d1fae5] text-[#065f46]';
      case 'rose':
        return 'bg-[#ffe4e6] text-[#9f1239]';
      case 'teal':
        return 'bg-[#ccfbf1] text-[#115e59]';
      case 'blue':
      default:
        return 'bg-[#e0f2fe] text-[#0369a1]';
    }
  };

  /* ============================================================================
     CHẾ ĐỘ 1: CHI TIẾT BÀI HỌC & SÁCH GIÁO KHOA SỐ HÓA OCR
     ============================================================================ */
  if (activeLesson) {
    const printedPages =
      activeLesson.printed_pages ||
      Array.from(
        { length: activeLesson.endPage - activeLesson.startPage + 1 },
        (_, i) => activeLesson.startPage + i
      );
    const currentPageIdx = printedPages.indexOf(currentPrintedPage);
    const currentPdfPage = currentPrintedPage + 1;
    const baseOcrPage = activeLesson.ocr_pages?.[String(currentPrintedPage)] || {
      heading: `${activeLesson.chapter} • ${activeLesson.number}: ${activeLesson.title}`,
      summary: `Trang in ${currentPrintedPage} (PDF trang ${currentPdfPage}) — Nguồn: datasource/${activeLesson.sourceFile}`,
      blocks: [
        {
          type: 'theorem',
          title: `${activeLesson.number}: ${activeLesson.title}`,
          content: activeLesson.subtitle,
        },
      ],
    };

    const customOcrEntry = customOcrMap[`${activeLesson.id}_${currentPrintedPage}`] || null;
    const currentOcrPage = customOcrEntry
      ? {
          ...baseOcrPage,
          blocks: customOcrEntry.blocks,
          raw_text: customOcrEntry.raw_text,
        }
      : baseOcrPage;
    const activeRawText =
      currentOcrPage.raw_text ||
      (currentOcrPage.blocks || []).map((b) => `${b.title}\n${b.content}`).join('\n\n');

    const allIdx = lessons.findIndex((l) => l.id === activeLesson.id);
    const prevLesson = allIdx > 0 ? lessons[allIdx - 1] : null;
    const nextLesson =
      allIdx >= 0 && allIdx < lessons.length - 1 ? lessons[allIdx + 1] : null;

    return (
      <div className="space-y-5">
        {/* 1. Header Bài Học Gọn Gàng */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <button
              onClick={() => setActiveLesson(null)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#005a54] text-slate-700 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách bài học</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openPrintableLesson(activeLesson, currentPrintedPage, false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#005a54]" />
                <span>Mở trọn bài SGK ({activeLesson.number})</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={() => openPrintableLesson(activeLesson, null, true)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#005a54]" />
                <span>In / Lưu PDF</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('lesson-video-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Film className="w-3.5 h-3.5 text-rose-600" />
                <span>Video tóm tắt</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('lesson-quiz-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-[#005a54] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-[#005a54]" />
                <span>Đề luyện tập</span>
              </button>

              {activeLesson.hasInteractive && (
                <button
                  onClick={() => handleLaunchInteractiveLab(activeLesson)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#005a54] hover:bg-[#004742] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Mô phỏng 3D / Tương tác</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#00796b] font-extrabold text-xs uppercase tracking-wider">
                {activeLesson.number}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${getSubjectBadgeStyle(
                  activeLesson.subject,
                  activeLesson.subjectColor
                )}`}
              >
                {activeLesson.subject}
              </span>
              <span className="bg-[#005a54] text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                {activeLesson.pageOcr}
              </span>
              <span className="text-xs text-slate-500">
                • {activeLesson.chapter} (Lớp {activeLesson.grade} - Tập {activeLesson.volume})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {activeLesson.title}
            </h1>
          </div>
        </div>

        {/* 2. Trình Đọc Trang Sách Giáo Khoa Cụ Thể & Văn Bản OCR */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
          {/* Thanh điều khiển chọn trang sách cụ thể */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            {/* Nút Trang trước / Trang sau */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setCurrentPrintedPage((p) => Math.max(activeLesson.startPage, p - 1));
                  setImgError(false);
                  setImgFallbackStage(0);
                }}
                disabled={currentPrintedPage <= activeLesson.startPage}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 disabled:opacity-40 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trước</span>
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-[#005a54]/10 text-[#005a54] text-xs font-extrabold">
                Trang {currentPrintedPage} ({currentPageIdx + 1}/{printedPages.length})
              </span>

              <button
                onClick={() => {
                  setCurrentPrintedPage((p) => Math.min(activeLesson.endPage, p + 1));
                  setImgError(false);
                  setImgFallbackStage(0);
                }}
                disabled={currentPrintedPage >= activeLesson.endPage}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 disabled:opacity-40 transition-all cursor-pointer"
              >
                <span>Sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Các nút chọn từng trang cụ thể của bài học */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
              {printedPages.map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => {
                    setCurrentPrintedPage(pNum);
                    setImgError(false);
                    setImgFallbackStage(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer shrink-0 ${
                    currentPrintedPage === pNum
                      ? 'bg-[#005a54] text-white font-bold shadow-sm'
                      : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium'
                  }`}
                >
                  Trang {pNum}
                </button>
              ))}
            </div>

            {/* Chế độ hiển thị & Phóng to */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-[#005a54] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Song song</span>
                </button>
                <button
                  onClick={() => setViewMode('image')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === 'image'
                      ? 'bg-[#005a54] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Trang sách</span>
                </button>
                <button
                  onClick={() => setViewMode('text')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === 'text'
                      ? 'bg-[#005a54] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>OCR</span>
                </button>
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    viewMode === 'pdf'
                      ? 'bg-[#005a54] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Trọn bài</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setLightboxZoom(1.0);
                  setIsLightboxOpen(true);
                }}
                className="p-1.5 rounded-lg bg-[#005a54] hover:bg-[#004742] text-white transition-all cursor-pointer"
                title="Xem trang sách toàn màn hình"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Khung 2 cột: Trang sách gốc bên trái (rộng 7/12) | Văn bản OCR bên phải (5/12) */}
          <div
            className={`grid gap-4 min-h-[780px] ${
              viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
            }`}
          >
            {/* CỘT TRÁI: Hình ảnh trang sách gốc từ datasource/ */}
            {(viewMode === 'split' || viewMode === 'image') && (
              <div
                className={`${
                  viewMode === 'split' ? 'lg:col-span-7' : ''
                } bg-slate-100 rounded-2xl border border-slate-200/90 flex flex-col overflow-hidden`}
              >
                <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#005a54]" />
                    <span>
                      Trang {currentPrintedPage} ({activeLesson.sourceFile})
                    </span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setImageZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="Thu nhỏ"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setImageZoom(1.0)}
                      className="text-[11px] font-mono font-bold text-slate-700 hover:text-[#005a54] min-w-[44px] text-center cursor-pointer"
                      title="Đặt lại 100%"
                    >
                      {Math.round(imageZoom * 100)}%
                    </button>
                    <button
                      onClick={() => setImageZoom((z) => Math.min(3.0, +(z + 0.2).toFixed(2)))}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="Phóng to"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-1.5 sm:p-2.5 max-h-[88vh]">
                  {!imgError ? (
                    <img
                      src={getPageImageUrl(activeLesson.sourceFile, currentPrintedPage)}
                      alt={`${activeLesson.title} - Trang ${currentPrintedPage}`}
                      style={{ width: `${Math.round(imageZoom * 100)}%` }}
                      onClick={() => {
                        setLightboxZoom(1.15);
                        setIsLightboxOpen(true);
                      }}
                      onError={handleImageLoadError}
                      className="max-w-none mx-auto block rounded-xl shadow-md border border-slate-200 transition-all duration-150 cursor-zoom-in bg-white"
                    />
                  ) : (
                    <div
                      style={{ width: `${Math.round(imageZoom * 100)}%` }}
                      className="bg-[#fffefb] rounded-xl shadow-sm border border-slate-300 p-6 sm:p-8 space-y-5 text-slate-900 min-h-[540px] flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b-2 border-[#005a54] pb-2.5 text-xs">
                          <span className="font-bold text-[#005a54] uppercase tracking-wider">
                            {activeLesson.chapter} • {activeLesson.number}
                          </span>
                          <span className="font-mono font-semibold text-slate-500">
                            {activeLesson.sourceFile} • Tr.{currentPrintedPage}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-[-0.02em]">
                          {currentOcrPage.heading || `${activeLesson.number}: ${activeLesson.title}`}
                        </h3>

                        <div className="space-y-3.5">
                          {(currentOcrPage.blocks || []).map((b, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-lg bg-[#f8faf9] border-l-4 border-[#005a54] space-y-2"
                            >
                              <div className="text-xs font-bold text-[#005a54] uppercase">
                                {b.title}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                                {b.content}
                              </div>
                              {b.math && (
                                <div className="p-2.5 rounded bg-white border border-slate-200 overflow-x-auto text-center">
                                  <MathView math={b.math} block={true} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                        <span>Sách giáo khoa Toán {activeLesson.grade} (Kết nối tri thức)</span>
                        <span className="px-2.5 py-0.5 rounded bg-[#005a54] text-white font-bold">
                          Trang {currentPrintedPage}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CỘT PHẢI: Nội dung văn bản OCR của trang sách + Nút Quét OCR lại */}
            {(viewMode === 'split' || viewMode === 'text') && (
              <div
                className={`${
                  viewMode === 'split' ? 'lg:col-span-5' : ''
                } bg-white rounded-2xl border border-slate-200/90 flex flex-col overflow-hidden`}
              >
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#005a54] shrink-0" />
                    <span className="text-xs font-bold text-[#005a54]">
                      Nội dung OCR — Trang {currentPrintedPage}
                    </span>
                    {customOcrEntry && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Vừa quét lại ({customOcrEntry.scannedAt})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Chuyển đổi Khối kiến thức / Toàn văn OCR */}
                    <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                      <button
                        onClick={() => setOcrDisplayMode('blocks')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          ocrDisplayMode === 'blocks'
                            ? 'bg-[#005a54] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Theo mục
                      </button>
                      <button
                        onClick={() => setOcrDisplayMode('raw')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          ocrDisplayMode === 'raw'
                            ? 'bg-[#005a54] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Toàn văn
                      </button>
                    </div>

                    {/* Nút Sao chép */}
                    <button
                      onClick={() => handleCopyOcrText(activeRawText)}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Sao chép văn bản OCR trang này"
                    >
                      {copiedOcr ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Chép</span>
                        </>
                      )}
                    </button>

                    {/* Nút Quét OCR lại trang này trực tiếp trên trình duyệt */}
                    <button
                      onClick={handleRescanPageOcr}
                      disabled={isScanningOcr}
                      className="px-2.5 py-1 rounded-lg bg-[#005a54] hover:bg-[#004742] disabled:opacity-60 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                      title="Quét nhận dạng chữ (Tesseract Tiếng Việt) trực tiếp từ ảnh trang sách này"
                    >
                      <RefreshCw className={`w-3 h-3 ${isScanningOcr ? 'animate-spin' : ''}`} />
                      <span>
                        {isScanningOcr ? `Đang OCR ${ocrProgress}%...` : 'OCR lại trang này'}
                      </span>
                    </button>

                    {customOcrEntry && !isScanningOcr && (
                      <button
                        onClick={handleResetPageOcr}
                        className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold cursor-pointer"
                        title="Khôi phục bản OCR chuẩn đã tiền xử lý"
                      >
                        Mặc định
                      </button>
                    )}
                  </div>
                </div>

                {isScanningOcr && (
                  <div className="px-4 py-2 bg-teal-50 border-b border-teal-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#005a54]">
                      <span>Đang nhận dạng văn bản Tiếng Việt từ ảnh scan gốc Trang {currentPrintedPage}...</span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-teal-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#005a54] transition-all duration-200"
                        style={{ width: `${ocrProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[88vh] leading-relaxed">
                  {ocrDisplayMode === 'blocks' ? (
                    (currentOcrPage.blocks || []).map((block, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2"
                      >
                        <div className="text-xs font-extrabold text-[#005a54] uppercase tracking-wide">
                          {block.title}
                        </div>
                        <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                          {block.content}
                        </div>
                        {block.math && (
                          <div className="p-3 rounded-xl bg-white border border-slate-200/80 overflow-x-auto text-center">
                            <MathView math={block.math} block={true} />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                      <div className="text-[11px] font-extrabold text-[#005a54] uppercase tracking-wider mb-2">
                        Toàn văn OCR Trang {currentPrintedPage} ({activeLesson.sourceFile} • PDF tr.{currentPdfPage})
                      </div>
                      <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                        {activeRawText}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHẾ ĐỘ XEM TRỌN BÀI SÁCH GIÁO KHOA LIÊN TỤC (CỠ LỚN) */}
            {viewMode === 'pdf' && (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden h-[88vh] min-h-[820px]">
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-400" />
                    <span>
                      Trọn Bài SGK • {activeLesson.number}: {activeLesson.title} (Trang{' '}
                      {activeLesson.startPage}–{activeLesson.endPage})
                    </span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-0.5 border border-slate-700">
                      <button
                        onClick={() => setImageZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
                        className="p-0.5 rounded hover:bg-slate-700 text-slate-200 cursor-pointer"
                        title="Thu nhỏ"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setImageZoom(1.0)}
                        className="text-[11px] font-mono font-bold px-1.5 min-w-[44px] text-center cursor-pointer"
                      >
                        {Math.round(imageZoom * 100)}%
                      </button>
                      <button
                        onClick={() => setImageZoom((z) => Math.min(2.6, +(z + 0.2).toFixed(2)))}
                        className="p-0.5 rounded hover:bg-slate-700 text-slate-200 cursor-pointer"
                        title="Phóng to"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => openPrintableLesson(activeLesson, currentPrintedPage, false)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Mở tab riêng</span>
                    </button>
                    <button
                      onClick={() => openPrintableLesson(activeLesson, null, true)}
                      className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>In / Lưu PDF</span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-2 sm:p-4 space-y-4 bg-slate-900">
                  {printedPages.map((pNum) => (
                    <div
                      key={pNum}
                      style={{ width: `${Math.round(imageZoom * 100)}%` }}
                      className="max-w-none mx-auto bg-white rounded-xl p-2 sm:p-3 shadow-xl space-y-2"
                    >
                      <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500">
                        <span>
                          {activeLesson.number}: {activeLesson.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#005a54]/10 text-[#005a54]">
                          Trang {pNum} / {activeLesson.endPage}
                        </span>
                      </div>
                      <img
                        src={getStaticPageWebpUrl(activeLesson.sourceFile, pNum)}
                        alt={`Trang ${pNum}`}
                        loading="lazy"
                        className="w-full h-auto rounded-lg border border-slate-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. MỤC TIÊU BÀI HỌC (1 mục thống nhất duy nhất chuẩn SGK) */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Target className="w-5 h-5 text-[#005a54]" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Mục tiêu bài học (Kiến thức, kĩ năng & Thuật ngữ trọng tâm)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Thuật ngữ */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="text-xs font-extrabold text-[#005a54] uppercase tracking-wider">
                Thuật ngữ trọng tâm
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {(activeLesson.terms || []).map((t, idx) => (
                  <li key={idx}>
                    <strong className="text-slate-900">{t.term}: </strong>
                    <span>{t.definition}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yêu cầu cần đạt (Kiến thức, kĩ năng) */}
            <div className="lg:col-span-8 p-4 rounded-xl bg-teal-50/40 border border-teal-200/80 space-y-2.5">
              <div className="text-xs font-extrabold text-[#005a54] uppercase tracking-wider">
                Kiến thức, kĩ năng cần đạt
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {(activeLesson.objectives || []).map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#005a54] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tóm tắt lý thuyết & Công thức cốt lõi */}
          {(activeLesson.sections || []).map((sec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3"
            >
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#005a54]" />
                <span>{sec.title}</span>
              </div>

              {sec.paragraphs && sec.paragraphs.length > 0 && (
                <div className="space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              )}

              {sec.formulas && sec.formulas.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {sec.formulas.map((f, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto text-center"
                    >
                      <MathView math={f} block={true} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* 4. VIDEO TÓM TẮT BÀI HỌC (Requirement 2) */}
        <div id="lesson-video-section" className="scroll-mt-16">
          <LessonVideoSection lesson={activeLesson} />
        </div>

        {/* 5. ĐỀ LUYỆN TẬP CỦNG CỐ SAU BÀI HỌC (Requirement 1) */}
        <div id="lesson-quiz-section" className="scroll-mt-16">
          <LessonQuizSection lesson={activeLesson} />
        </div>

        {/* 6. Chuyển bài học Trước / Tiếp theo */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {prevLesson ? (
            <button
              onClick={() => handleOpenLessonDetail(prevLesson)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#005a54] text-left flex items-center gap-2.5 shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-xs font-bold text-slate-800">
                {prevLesson.number}: {prevLesson.title}
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextLesson && (
            <button
              onClick={() => handleOpenLessonDetail(nextLesson)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#005a54] hover:bg-[#004742] text-white text-right flex items-center justify-end gap-2.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="text-xs font-bold">
                {nextLesson.number}: {nextLesson.title}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>

        {/* Lightbox xem trang sách toàn màn hình */}
        {isLightboxOpen && (
          <div className="fixed top-14 md:top-0 left-0 md:left-64 right-0 bottom-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col">
            <div className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="text-sm font-bold truncate max-w-md">
                {activeLesson.number}: {activeLesson.title} — Trang {currentPrintedPage}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-2 py-1">
                  <button
                    onClick={() => setLightboxZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(2)))}
                    className="p-0.5 rounded hover:bg-slate-700 text-slate-200 cursor-pointer"
                    title="Thu nhỏ"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold px-1.5 min-w-[44px] text-center">
                    {Math.round(lightboxZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setLightboxZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2)))}
                    className="p-0.5 rounded hover:bg-slate-700 text-slate-200 cursor-pointer"
                    title="Phóng to"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCurrentPrintedPage((p) => Math.max(activeLesson.startPage, p - 1));
                    setImgError(false);
                    setImgFallbackStage(0);
                  }}
                  disabled={currentPrintedPage <= activeLesson.startPage}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  ‹ Trước
                </button>
                <span className="text-xs font-bold px-2">
                  Trang {currentPrintedPage} / {activeLesson.endPage}
                </span>
                <button
                  onClick={() => {
                    setCurrentPrintedPage((p) => Math.min(activeLesson.endPage, p + 1));
                    setImgError(false);
                    setImgFallbackStage(0);
                  }}
                  disabled={currentPrintedPage >= activeLesson.endPage}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Sau ›
                </button>

                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="ml-1 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Thu nhỏ</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-3 sm:p-5">
              <img
                src={getStaticPageWebpUrl(activeLesson.sourceFile, currentPrintedPage)}
                alt={`Trang ${currentPrintedPage}`}
                style={{
                  width: `${Math.round(lightboxZoom * 1050)}px`
                }}
                className="max-w-none mx-auto block rounded-xl shadow-2xl bg-white transition-all duration-150"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ============================================================================
     CHẾ ĐỘ 2: DANH SÁCH BÀI HỌC (GỌN GÀNG, CHUẨN 100% HÌNH MẪU)
     ============================================================================ */
  return (
    <div className="space-y-4">
      {/* Thông báo trạng thái chuyển đổi SGK */}
      {curriculumNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{curriculumNotice.text}</span>
          </div>
          <button
            onClick={() => setCurriculumNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 underline text-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* THANH CÔNG CỤ QUẢN TRỊ DỮ LIỆU NGUỒN SGK & ĐỀ THI (DÀNH CHO GIÁO VIÊN / ADMIN) */}
      {isTeacher && (
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-teal-700/60 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-300">
                    Bảng Quản Trị Dữ Liệu Nguồn SGK &amp; Chuyển Đổi Môn Học
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Môn hiện tại: <strong className="text-white uppercase">{appConfig.subjectName}</strong> • Đang có <strong className="text-teal-300 font-bold">{lessons.length}</strong> bài học trong hệ thống
                </p>
              </div>
            </div>

            {/* Các nút chuyển đổi SGK 1-Click */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  switchToPhysicsSubject();
                  setLessons(getStoredLessons());
                  setCurriculumNotice({ type: 'success', text: 'Đã chuyển thành công toàn bộ SGK sang Môn Vật Lý 12 (10 bài học chuẩn GDPT 2018)!' });
                  setTimeout(() => setCurriculumNotice(null), 6000);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ring-2 ring-blue-400/20"
                title="Thay thế toàn bộ sách Toán bằng SGK Vật lý 12"
              >
                <span>⚡ Đổi sang SGK Vật Lý 12</span>
              </button>

              <button
                onClick={() => {
                  switchToMathSubject();
                  setLessons(getStoredLessons());
                  setCurriculumNotice({ type: 'success', text: 'Đã khôi phục toàn bộ SGK sang Môn Toán Học THPT ban đầu!' });
                  setTimeout(() => setCurriculumNotice(null), 6000);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                title="Khôi phục lại SGK Toán học 10-12"
              >
                <span>📐 Khôi phục SGK Toán 12</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAddLessonModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Thêm Bài Học Mới</span>
              </button>

              <button
                onClick={() => {
                  if (onSelectModule) onSelectModule('admin_customization');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/20 cursor-pointer flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-teal-300" />
                <span>Mở Dashboard Tùy Biến Đề &amp; Câu Hỏi</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportLessonsToJsonFile}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-medium border border-white/10 cursor-pointer flex items-center gap-1"
                title="Tải về file JSON danh mục bài học hiện tại"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất file SGK (.json)</span>
              </button>

              <input
                type="file"
                accept=".json"
                ref={fileInputCurriculumRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const res = importLessonsFromJsonFile(ev.target.result);
                    if (res.success) {
                      setLessons(getStoredLessons());
                      setCurriculumNotice({ type: 'success', text: `Đã nạp thành công ${res.count} bài học mới từ file JSON!` });
                      setTimeout(() => setCurriculumNotice(null), 5000);
                    } else {
                      alert(res.message);
                    }
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputCurriculumRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-medium border border-white/10 cursor-pointer flex items-center gap-1"
                title="Nạp file JSON bài học môn khác do thầy chuẩn bị"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nạp file SGK (.json)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thanh chọn khối lớp & Tìm kiếm gọn trên 1 khung */}
      <div className="bg-white rounded-2xl border border-slate-200/90 px-5 py-3.5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            {[12, 11, 10].map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGrade(g);
                  setSelectedVolume('all');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-[#005a54] text-white shadow-sm'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'Cả năm' },
              { id: 1, label: 'Tập 1' },
              { id: 2, label: 'Tập 2' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVolume(v.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedVolume === v.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ô tìm kiếm bài học */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài học..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005a54] transition-all"
          />
        </div>
      </div>

      {/* Khung Danh sách bài học gom nhóm theo từng Khối Chương thống nhất */}
      <div className="space-y-5">
        {(() => {
          const chapterGroups = [];
          const groupMap = new Map();

          filteredLessons.forEach((lesson) => {
            const chapKey = lesson.chapter || `Chương trình Toán Lớp ${lesson.grade}`;
            if (!groupMap.has(chapKey)) {
              const newGroup = {
                chapter: chapKey,
                volume: lesson.volume,
                moduleTarget: lesson.moduleTarget,
                startPage: lesson.startPage,
                endPage: lesson.endPage,
                lessons: []
              };
              groupMap.set(chapKey, newGroup);
              chapterGroups.push(newGroup);
            }
            const g = groupMap.get(chapKey);
            g.lessons.push(lesson);
            if (lesson.startPage && (!g.startPage || lesson.startPage < g.startPage)) {
              g.startPage = lesson.startPage;
            }
            if (lesson.endPage && (!g.endPage || lesson.endPage > g.endPage)) {
              g.endPage = lesson.endPage;
            }
          });

          return chapterGroups.map((group, gIdx) => {
            const isChapter1 =
              selectedGrade === 12 &&
              group.chapter.toLowerCase().includes('chương i:');
            const isChapter4 =
              selectedGrade === 12 &&
              group.chapter.toLowerCase().includes('chương iv:');
            const isUnifiedChapter = isChapter1 || isChapter4;

            return (
              <div
                key={group.chapter || gIdx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Header Khối Chương Thống Nhất */}
                <div
                  className={`px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isUnifiedChapter
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-slate-50/90 text-slate-900 border-slate-200/80'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                          isUnifiedChapter
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : 'bg-[#005a54] text-white'
                        }`}
                      >
                        Lớp {selectedGrade} • Tập {group.volume}
                      </span>
                      {group.startPage && group.endPage && (
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isUnifiedChapter
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-white border border-slate-200 text-slate-600'
                          }`}
                        >
                          Trang {group.startPage}–{group.endPage} SGK ({group.lessons.length} mục)
                        </span>
                      )}
                    </div>
                    <h2
                      className={`text-base sm:text-lg font-bold tracking-[-0.02em] ${
                        isUnifiedChapter ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {group.chapter}
                    </h2>
                  </div>

                  {group.moduleTarget && (
                    <button
                      onClick={() => {
                        if (isChapter1 && onSelectDerivativeSubTab) {
                          onSelectDerivativeSubTab('all');
                        } else if (isChapter4 && onSelectCalculusSubTab) {
                          onSelectCalculusSubTab('all');
                        } else if (onSelectModule) {
                          onSelectModule(group.moduleTarget);
                        }
                      }}
                      className={`self-start sm:self-center px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        isUnifiedChapter
                          ? 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                          : 'bg-[#005a54] hover:bg-[#004742] text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isChapter1
                          ? 'Mở Khối Tương Tác Chương I'
                          : isChapter4
                          ? 'Mở Khối Tương Tác Chương IV'
                          : 'Mở Phòng Thí Nghiệm Chương'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Lưới các mục/bài học bên trong Khối Chương */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleOpenLessonDetail(lesson)}
                      className="bg-white rounded-xl border border-slate-200/90 p-4 hover:shadow-md hover:border-[#005a54] transition-all cursor-pointer flex flex-col justify-between gap-2 group"
                    >
                      <div className="space-y-1.5">
                        {/* Hàng 1: BÀI X + Phân môn bên trái | Trang X-Y OCR bên phải */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[#00796b] font-bold text-xs uppercase tracking-wide shrink-0">
                              {lesson.number}
                            </span>
                            <span
                              className={`text-[11px] font-medium px-2 py-0.5 rounded truncate ${getSubjectBadgeStyle(
                                lesson.subject,
                                lesson.subjectColor
                              )}`}
                            >
                              {lesson.subject}
                            </span>
                          </div>

                          <span className="bg-[#005a54] text-white text-[11px] font-bold px-2.5 py-0.5 rounded tracking-tight shrink-0">
                            {lesson.pageOcr}
                          </span>
                        </div>

                        {/* Hàng 2: Tên bài học */}
                        <h3 className="font-bold text-slate-900 text-[15px] leading-snug group-hover:text-[#005a54] transition-colors">
                          {lesson.title}
                        </h3>

                        {/* Hàng 3: Tóm tắt bài học */}
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal">
                          {lesson.subtitle || lesson.title}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-[#005a54]">
                        <span>Đọc trang sách &amp; OCR</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          });
        })()}

        {filteredLessons.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center text-slate-500 text-xs">
            Không tìm thấy bài học phù hợp.
          </div>
        )}
      </div>

      {/* MODAL THÊM BÀI HỌC SGK MỚI */}
      {isAddLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Thêm Bài Học Mới Vào Sách Giáo Khoa
                </h3>
              </div>
              <button
                onClick={() => setIsAddLessonModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLessonSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chương / Chuyên đề:
                </label>
                <input
                  type="text"
                  required
                  value={newLessonChapter}
                  onChange={(e) => setNewLessonChapter(e.target.value)}
                  placeholder="VD: Chương I: Dao động cơ hoặc Chương V: Hạt nhân"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Thứ tự bài:
                  </label>
                  <input
                    type="text"
                    required
                    value={newLessonNumber}
                    onChange={(e) => setNewLessonNumber(e.target.value)}
                    placeholder="VD: BÀI 1 hoặc BÀI 10"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phân môn / Nhãn:
                  </label>
                  <input
                    type="text"
                    value={newLessonSubject}
                    onChange={(e) => setNewLessonSubject(e.target.value)}
                    placeholder="VD: Nhiệt học, Cơ học, Quang học..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-teal-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên bài học:
                </label>
                <input
                  type="text"
                  required
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="VD: Dao động điều hòa và các đại lượng đặc trưng"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tóm tắt nội dung bài học:
                </label>
                <input
                  type="text"
                  value={newLessonSubtitle}
                  onChange={(e) => setNewLessonSubtitle(e.target.value)}
                  placeholder="VD: Khái niệm li độ, vận tốc, gia tốc và phương trình x = A cos(ωt + φ)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Trang bắt đầu:
                  </label>
                  <input
                    type="number"
                    value={newLessonStartPage}
                    onChange={(e) => setNewLessonStartPage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Trang kết thúc:
                  </label>
                  <input
                    type="number"
                    value={newLessonEndPage}
                    onChange={(e) => setNewLessonEndPage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Lưu Bài Học Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
