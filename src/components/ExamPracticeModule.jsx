import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Award,
  BookOpen,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  Calculator,
  Sparkles,
  CheckSquare,
  Eye,
  BarChart3,
  Search,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Columns,
  PlusCircle
} from 'lucide-react';
import { getAllExams, getAppConfig } from '../services/customizationService';
import { useAuth } from '../context/AuthContext';
import { getStoredAssignments, submitStudentExam } from '../services/assignmentDatabase';
import AddExamModal from './AddExamModal';
import { getExamPdfBlobUrl } from '../services/pdfStorage';

function normalizeShortAnswer(val) {
  if (val === undefined || val === null) return '';
  return String(val)
    .trim()
    .replace(/\s+/g, '')
    .replace(',', '.');
}

function isShortAnswerMatch(userVal, correctVal) {
  const u = normalizeShortAnswer(userVal);
  const c = normalizeShortAnswer(correctVal);
  if (!u || !c) return false;
  if (u === c) return true;
  const uNum = Number(u);
  const cNum = Number(c);
  if (!Number.isNaN(uNum) && !Number.isNaN(cNum)) {
    return Math.abs(uNum - cNum) <= 0.011;
  }
  return false;
}

function createEmptySheet() {
  return {
    part1: Array(12).fill(null),
    part2: [
      { a: null, b: null, c: null, d: null },
      { a: null, b: null, c: null, d: null },
      { a: null, b: null, c: null, d: null },
      { a: null, b: null, c: null, d: null }
    ],
    part3: Array(6).fill('')
  };
}

export default function ExamPracticeModule({
  activeSubTab = 'catalog',
  onSelectSubTab,
  onOpenCasioModal,
  onSelectAIRag,
  onOpenAdminCustomization
}) {
  const [internalTab, setInternalTab] = useState(activeSubTab || 'catalog');
  const currentTab = activeSubTab || internalTab;

  const switchTab = (tabId) => {
    setInternalTab(tabId);
    if (onSelectSubTab) onSelectSubTab(tabId);
  };

  const [selectedExamId, setSelectedExamId] = useState(1);
  const [pdfTab, setPdfTab] = useState('exam'); // 'exam' | 'solution'
  const [activeOmrPart, setActiveOmrPart] = useState('all'); // 'all' | 'part1' | 'part2' | 'part3'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPdfWide, setIsPdfWide] = useState(false); // true = full 12-col width for PDF
  const [pdfZoom, setPdfZoom] = useState('115'); // 'page-width' | '115' | '135' | '160' | '200'
  const [searchTag, setSearchTag] = useState('');
  const [examsList, setExamsList] = useState(() => getAllExams());
  const examsData = examsList;
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState('');
  const appConfig = getAppConfig();
  const { currentUser, isStudent, isTeacher } = useAuth();
  const [lmsSubmittedNotice, setLmsSubmittedNotice] = useState(null);

  const buildPdfSrc = (baseUrl) => {
    if (!baseUrl) return '';
    if (baseUrl.startsWith('blob:') || baseUrl.startsWith('data:')) {
      return baseUrl;
    }
    const separator = baseUrl.includes('?') ? '&' : '?';
    const versionedUrl = `${baseUrl}${separator}v=2026_nda`;
    if (pdfZoom === 'page-width') {
      return `${versionedUrl}#navpanes=0&scrollbar=1&view=FitH`;
    }
    return `${versionedUrl}#navpanes=0&scrollbar=1&zoom=${pdfZoom}`;
  };

  const [sheetsByExam, setSheetsByExam] = useState(() => {
    try {
      const saved = localStorage.getItem('mathmate_bo_de_sheets_2026');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [submittedByExam, setSubmittedByExam] = useState(() => {
    try {
      const saved = localStorage.getItem('mathmate_bo_de_submitted_2026');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mathmate_bo_de_sheets_2026', JSON.stringify(sheetsByExam));
    } catch {
      // ignore storage errors
    }
  }, [sheetsByExam]);

  useEffect(() => {
    try {
      localStorage.setItem('mathmate_bo_de_submitted_2026', JSON.stringify(submittedByExam));
    } catch {
      // ignore storage errors
    }
  }, [submittedByExam]);

  useEffect(() => {
    if (!isTimerRunning) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const currentExam = useMemo(
    () => examsData.find((e) => e.id === selectedExamId) || examsData[0] || { id: 1, title: '', code: '' },
    [selectedExamId, examsData]
  );

  useEffect(() => {
    let isMounted = true;
    if (currentExam) {
      const rawUrl = pdfTab === 'solution' ? currentExam.solutionPdf : currentExam.examPdf;
      getExamPdfBlobUrl(currentExam.id, pdfTab, rawUrl).then((url) => {
        if (isMounted) {
          setResolvedPdfUrl(url);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [currentExam?.id, currentExam?.examPdf, currentExam?.solutionPdf, pdfTab]);

  const handleExamAdded = (newExam) => {
    const updated = getAllExams();
    setExamsList(updated);
    if (newExam && newExam.id) {
      setSelectedExamId(newExam.id);
    }
    setLmsSubmittedNotice(`Đã thêm thành công đề thi: "${newExam?.code || ''} — ${newExam?.title || ''}" vào kho đề! Thầy Cô có thể bắt đầu thi thử hoặc giao bài ngay.`);
    setTimeout(() => setLmsSubmittedNotice(null), 5000);
  };

  const currentSheet = useMemo(
    () => sheetsByExam[currentExam.id] || createEmptySheet(),
    [sheetsByExam, currentExam.id]
  );

  const isSubmitted = Boolean(submittedByExam[currentExam.id]);

  const filteredExams = useMemo(() => {
    if (!searchTag.trim()) return examsData;
    const q = searchTag.toLowerCase();
    return examsData.filter(
      (e) =>
        e.code.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.highlights.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchTag]);

  const computeExamGrade = (exam, sheet) => {
    if (!exam || !sheet) {
      return {
        p1Score: 0,
        p1Correct: 0,
        p2Score: 0,
        p2Details: [
          { matchCount: 0, pts: 0 },
          { matchCount: 0, pts: 0 },
          { matchCount: 0, pts: 0 },
          { matchCount: 0, pts: 0 }
        ],
        p3Score: 0,
        p3Correct: 0,
        totalScore: 0,
        answeredCount: 0
      };
    }

    let p1Correct = 0;
    let answeredCount = 0;
    exam.answers.part1.forEach((ans, idx) => {
      if (sheet.part1[idx]) answeredCount += 1;
      if (sheet.part1[idx] === ans) p1Correct += 1;
    });
    const p1Score = p1Correct * 0.25;

    let p2Score = 0;
    const p2Details = exam.answers.part2.map((ansObj, idx) => {
      const userObj = sheet.part2[idx] || {};
      const subKeys = ['a', 'b', 'c', 'd'];
      const hasAny = subKeys.some((k) => userObj[k] !== null && userObj[k] !== undefined);
      if (hasAny) answeredCount += 1;

      let matchCount = 0;
      subKeys.forEach((k) => {
        if (userObj[k] === ansObj[k]) matchCount += 1;
      });
      let pts = 0;
      if (matchCount === 1) pts = 0.1;
      else if (matchCount === 2) pts = 0.25;
      else if (matchCount === 3) pts = 0.5;
      else if (matchCount === 4) pts = 1.0;
      p2Score += pts;
      return { matchCount, pts };
    });

    let p3Correct = 0;
    exam.answers.part3.forEach((ans, idx) => {
      if (String(sheet.part3[idx] || '').trim() !== '') answeredCount += 1;
      if (isShortAnswerMatch(sheet.part3[idx], ans)) p3Correct += 1;
    });
    const p3Score = p3Correct * 0.5;

    const totalScore = Number((p1Score + p2Score + p3Score).toFixed(2));
    return {
      p1Score,
      p1Correct,
      p2Score: Number(p2Score.toFixed(2)),
      p2Details,
      p3Score,
      p3Correct,
      totalScore,
      answeredCount
    };
  };

  const currentGrade = useMemo(
    () => computeExamGrade(currentExam, currentSheet),
    [currentExam, currentSheet]
  );

  // Analytics summary across all 15 exams
  const analyticsSummary = useMemo(() => {
    const completedExams = examsData.filter((e) => submittedByExam[e.id]);
    const grades = completedExams.map((e) => ({
      exam: e,
      grade: computeExamGrade(e, sheetsByExam[e.id])
    }));
    const avgScore =
      grades.length > 0
        ? (grades.reduce((acc, g) => acc + g.grade.totalScore, 0) / grades.length).toFixed(2)
        : '0.00';
    const maxScore =
      grades.length > 0
        ? Math.max(...grades.map((g) => g.grade.totalScore)).toFixed(2)
        : '0.00';
    return { completedCount: completedExams.length, grades, avgScore, maxScore };
  }, [submittedByExam, sheetsByExam]);

  const handleOpenExamRoom = (examId, startClock = false) => {
    setSelectedExamId(examId);
    setPdfTab('exam');
    switchTab('exam_room');
    if (startClock) {
      setTimeLeft(90 * 60);
      setIsTimerRunning(true);
    }
  };

  const handleOpenExamSolution = (examId) => {
    setSelectedExamId(examId);
    setPdfTab('solution');
    switchTab('solutions');
  };

  const handlePart1Change = (qIdx, choice) => {
    setSheetsByExam((prev) => {
      const base = prev[currentExam.id] || createEmptySheet();
      const nextPart1 = [...base.part1];
      nextPart1[qIdx] = nextPart1[qIdx] === choice ? null : choice;
      return { ...prev, [currentExam.id]: { ...base, part1: nextPart1 } };
    });
  };

  const handlePart2Change = (qIdx, subKey, boolVal) => {
    setSheetsByExam((prev) => {
      const base = prev[currentExam.id] || createEmptySheet();
      const nextPart2 = base.part2.map((item, idx) =>
        idx === qIdx
          ? { ...item, [subKey]: item[subKey] === boolVal ? null : boolVal }
          : item
      );
      return { ...prev, [currentExam.id]: { ...base, part2: nextPart2 } };
    });
  };

  const handlePart3Change = (qIdx, textVal) => {
    setSheetsByExam((prev) => {
      const base = prev[currentExam.id] || createEmptySheet();
      const nextPart3 = [...base.part3];
      nextPart3[qIdx] = textVal;
      return { ...prev, [currentExam.id]: { ...base, part3: nextPart3 } };
    });
  };

  const handleSubmitExam = () => {
    setIsTimerRunning(false);
    setSubmittedByExam((prev) => ({ ...prev, [currentExam.id]: true }));

    if (isStudent && currentUser) {
      try {
        const assignments = getStoredAssignments();
        const matchedAsg = assignments.find(
          (a) => a.examId === currentExam.id && (a.assignedClass === currentUser.className || a.assignedClass === 'ALL')
        );
        const usedMin = Math.max(1, Math.round((90 * 60 - timeLeft) / 60));
        submitStudentExam({
          assignmentId: matchedAsg ? matchedAsg.id : `asg_de_${currentExam.id}_${currentUser.className || '12A1'}`,
          studentId: currentUser.id,
          studentUsername: currentUser.username,
          studentName: currentUser.name,
          studentClass: currentUser.className || '12A1',
          examId: currentExam.id,
          gradeData: currentGrade,
          durationUsedMinutes: usedMin
        });
        setLmsSubmittedNotice(`Đã nộp bài thành công lên hệ thống LMS lớp ${currentUser.className}! Điểm đạt: ${currentGrade.totalScore.toFixed(2)} / 10`);
        setTimeout(() => setLmsSubmittedNotice(null), 6000);
      } catch (err) {
        console.error('Lỗi nộp bài LMS:', err);
      }
    }
  };

  const handleResetExam = () => {
    setSheetsByExam((prev) => ({ ...prev, [currentExam.id]: createEmptySheet() }));
    setSubmittedByExam((prev) => ({ ...prev, [currentExam.id]: false }));
    setTimeLeft(90 * 60);
    setIsTimerRunning(false);
    setPdfTab('exam');
  };

  const handleFillSampleKey = () => {
    const fullSheet = {
      part1: [...currentExam.answers.part1],
      part2: currentExam.answers.part2.map((o) => ({ ...o })),
      part3: [...currentExam.answers.part3]
    };
    setSheetsByExam((prev) => ({
      ...prev,
      [currentExam.id]: fullSheet
    }));
    setSubmittedByExam((prev) => ({ ...prev, [currentExam.id]: true }));

    if (isStudent && currentUser) {
      try {
        const grade = computeExamGrade(currentExam, fullSheet);
        const assignments = getStoredAssignments();
        const matchedAsg = assignments.find(
          (a) => a.examId === currentExam.id && (a.assignedClass === currentUser.className || a.assignedClass === 'ALL')
        );
        submitStudentExam({
          assignmentId: matchedAsg ? matchedAsg.id : `asg_de_${currentExam.id}_${currentUser.className || '12A1'}`,
          studentId: currentUser.id,
          studentUsername: currentUser.username,
          studentName: currentUser.name,
          studentClass: currentUser.className || '12A1',
          examId: currentExam.id,
          gradeData: grade,
          durationUsedMinutes: 85
        });
        setLmsSubmittedNotice(`Đã nộp đáp án mẫu lên hệ thống LMS lớp ${currentUser.className}! Điểm đạt: 10.0 / 10`);
        setTimeout(() => setLmsSubmittedNotice(null), 6000);
      } catch (err) {
        console.error('Lỗi nộp bài mẫu LMS:', err);
      }
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activePdfUrl = resolvedPdfUrl || (pdfTab === 'solution' ? currentExam.solutionPdf : currentExam.examPdf);

  const topTabs = [
    { id: 'catalog', label: '1. Kho 15 Đề Ôn Tập 2026', icon: Award },
    { id: 'exam_room', label: '2. Phòng Thi Thử 90 Phút', icon: Clock },
    { id: 'solutions', label: '3. Đáp Án & Lời Giải Chi Tiết', icon: CheckCircle2 },
    { id: 'analytics', label: '4. Thống Kê Điểm Luyện Đề', icon: BarChart3 }
  ];

  return (
    <div className="space-y-4">
      {/* Thông báo Nộp bài LMS cho Học sinh */}
      {lmsSubmittedNotice && (
        <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-md flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{lmsSubmittedNotice}</span>
          </div>
          <button
            onClick={() => setLmsSubmittedNotice(null)}
            className="text-white/80 hover:text-white text-xs underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Header Mục Luyện Đề Riêng Biệt */}
      {!isFullscreen && (
        <div className="bg-gradient-to-r from-slate-900 via-[#0d3b3e] to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-teal-800/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Chuyên Mục Luyện Đề &amp; Khảo Thí Tốt Nghiệp THPT 2026</span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                {appConfig?.examSectionTitle || 'Bộ 15 Đề Ôn Tập Thi Tốt Nghiệp THPT Môn Toán 2026 (Chuẩn Cấu Trúc Mới)'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-3xl">
                Sưu tầm &amp; biên soạn: <span className="font-bold text-white">Thầy Nguyễn Đức Anh</span> • Đầy
                đủ 3 phần chuẩn Bộ GD&amp;ĐT:{' '}
                <span className="text-teal-300 font-semibold">Phần I</span> (12 câu 4 lựa chọn •
                3,0đ) + <span className="text-amber-300 font-semibold">Phần II</span> (4 câu Đúng/Sai
                a,b,c,d • 4,0đ) + <span className="text-sky-300 font-semibold">Phần III</span> (6 câu
                trả lời ngắn • 3,0đ).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onOpenCasioModal && (
                <button
                  onClick={onOpenCasioModal}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-teal-300" />
                  <span>Máy Tính Casio 580/880</span>
                </button>
              )}
              {onSelectAIRag && (
                <button
                  onClick={onSelectAIRag}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hỏi Trợ Lý AI Giải Đề</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Dedicated Sub-Module Navigation Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-white/15">
            {topTabs.map((t) => {
              const Icon = t.icon;
              const active = currentTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                    active
                      ? 'bg-white text-slate-950 border-white shadow-md'
                      : 'bg-slate-900/50 text-slate-200 border-white/10 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#0d3b3e]' : 'text-teal-300'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1: KHO 15 ĐỀ ÔN TẬP THPT 2026 (CATALOG)
         ===================================================================== */}
      {currentTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-extrabold">
                Kho Đề: {filteredExams.length} đề thi
              </div>
              {isTeacher && (
                <button
                  type="button"
                  onClick={() => setIsAddExamModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Thêm Đề Thi / Câu Hỏi Mới</span>
                </button>
              )}
              <div className="text-xs text-slate-600 hidden md:block">
                Chọn đề để bắt đầu thi thử 90 phút hoặc xem lời giải chi tiết.
              </div>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                placeholder="Tìm đề theo chuyên đề (Oxyz, Bayes, thực tế)..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0d3b3e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredExams.map((exam) => {
              const done = Boolean(submittedByExam[exam.id]);
              const g = done ? computeExamGrade(exam, sheetsByExam[exam.id]) : null;
              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#0d3b3e] p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0d3b3e] text-white text-xs font-extrabold">
                        {exam.code}
                      </span>
                      {done ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
                          Đã chấm: {g.totalScore.toFixed(2)} / 10đ
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          90 phút • 22 câu
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900">{exam.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{exam.highlights}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exam.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenExamRoom(exam.id, true)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#0d3b3e] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-300" />
                      <span>{done ? 'Làm lại đề' : 'Vào thi 90 phút'}</span>
                    </button>
                    <button
                      onClick={() => handleOpenExamSolution(exam.id)}
                      className="py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lời giải ({exam.solutionPages} tr)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: PHÒNG THI THỬ 90 PHÚT (EXAM ROOM)
         ===================================================================== */}
      {currentTab === 'exam_room' && (
        <div
          className={
            isFullscreen
              ? 'fixed top-14 md:top-0 left-0 md:left-64 right-0 bottom-0 z-50 bg-[#f4f5f7] p-3 sm:p-4 flex flex-col overflow-hidden'
              : 'space-y-3'
          }
        >
          {/* Quick Exam Switcher & Timer Bar */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={currentExam.id}
                onChange={(e) => {
                  setSelectedExamId(Number(e.target.value));
                  setPdfTab('exam');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold cursor-pointer focus:outline-none"
              >
                {examsData.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.code} — {ex.examPages} trang đề
                  </option>
                ))}
              </select>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                {currentExam.highlights}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5">
                <Clock
                  className={`w-4 h-4 ${
                    isTimerRunning ? 'text-rose-600 animate-pulse' : 'text-slate-600'
                  }`}
                />
                <span className="font-mono text-sm font-extrabold text-slate-900">
                  {formatTimer(timeLeft)}
                </span>
                <button
                  onClick={() => setIsTimerRunning((r) => !r)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                    isTimerRunning
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Tính giờ</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(90 * 60);
                  }}
                  className="p-1 rounded hover:bg-slate-200 text-slate-600 cursor-pointer"
                  title="Đặt lại 90:00"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  onClick={() => setPdfTab('exam')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    pdfTab === 'exam'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Đề thi ({currentExam.examPages} tr)</span>
                </button>
                <button
                  onClick={() => setPdfTab('solution')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    pdfTab === 'solution'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lời giải ({currentExam.solutionPages} tr)</span>
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen((f) => !f)}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Thu nhỏ</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Phóng to</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Split Workspace: PDF Exam + OMR Sheet */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-3 ${
              isFullscreen ? 'flex-1 min-h-0 mt-2' : ''
            }`}
          >
            <div
              className={`${
                isPdfWide ? 'lg:col-span-12' : 'lg:col-span-8'
              } bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${
                isFullscreen ? 'h-full' : 'h-[88vh] min-h-[820px]'
              }`}
            >
              <div className="px-4 py-2 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 shrink-0">
                <span className="text-xs font-bold">
                  {pdfTab === 'solution'
                    ? `LỜI GIẢI CHI TIẾT • ${currentExam.code}`
                    : `ĐỀ THI CHÍNH THỨC • ${currentExam.code}`}
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Chỉnh cỡ phóng to PDF trực tiếp */}
                  <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                    {[
                      { id: 'page-width', label: 'Vừa khung' },
                      { id: '115', label: '115%' },
                      { id: '135', label: '135%' },
                      { id: '160', label: '160%' },
                      { id: '200', label: '200%' }
                    ].map((z) => (
                      <button
                        key={z.id}
                        onClick={() => setPdfZoom(z.id)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          pdfZoom === z.id
                            ? 'bg-teal-500 text-slate-950'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {z.label}
                      </button>
                    ))}
                  </div>

                  {/* Nút mở rộng PDF toàn chiều ngang */}
                  <button
                    onClick={() => setIsPdfWide((w) => !w)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      isPdfWide
                        ? 'bg-amber-400 text-slate-950 font-extrabold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                    title="Mở rộng khung đề PDF toàn chiều ngang"
                  >
                    <Columns className="w-3 h-3" />
                    <span>{isPdfWide ? 'Hiện phiếu OMR' : 'Rộng toàn khung'}</span>
                  </button>

                  <a
                    href={`${activePdfUrl}?v=2026_nda`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Mở tab mới</span>
                  </a>
                  <a
                    href={`${activePdfUrl}?v=2026_nda`}
                    download={`Toan_2026_De_${currentExam.id}_${pdfTab}.pdf`}
                    className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải PDF</span>
                  </a>
                </div>
              </div>
              <div className="flex-1 bg-slate-800">
                <iframe
                  key={`${currentExam.id}-${pdfTab}-${pdfZoom}-${isPdfWide}`}
                  src={buildPdfSrc(activePdfUrl)}
                  title={currentExam.title}
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            <div
              className={`${
                isPdfWide ? 'lg:col-span-12' : 'lg:col-span-4'
              } bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${
                isFullscreen ? (isPdfWide ? 'hidden' : 'h-full') : 'h-[88vh] min-h-[820px]'
              }`}
            >
              <div className="p-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-teal-400 text-[11px] font-bold uppercase tracking-wider">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Phiếu Trả Lời Trắc Nghiệm OMR 2026</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white mt-0.5">
                      {currentExam.code} • Đã điền {currentGrade.answeredCount}/22 câu
                    </h3>
                  </div>

                  {isSubmitted ? (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-right">
                      <div className="text-[10px] uppercase font-bold text-emerald-300">
                        Điểm bài thi
                      </div>
                      <div className="text-lg font-black text-emerald-300 leading-tight">
                        {currentGrade.totalScore.toFixed(2)} / 10.0
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleFillSampleKey}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold cursor-pointer"
                    >
                      Điền đáp án mẫu
                    </button>
                  )}
                </div>

                {isSubmitted && (
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-800 text-[11px]">
                    <div className="bg-slate-800/90 rounded-lg px-2.5 py-1.5">
                      <span className="text-slate-400 block">Phần I (12 câu)</span>
                      <span className="font-extrabold text-teal-300">
                        {currentGrade.p1Correct}/12 • {currentGrade.p1Score.toFixed(2)}đ
                      </span>
                    </div>
                    <div className="bg-slate-800/90 rounded-lg px-2.5 py-1.5">
                      <span className="text-slate-400 block">Phần II (Đúng/Sai)</span>
                      <span className="font-extrabold text-amber-300">
                        4 câu • {currentGrade.p2Score.toFixed(2)}đ
                      </span>
                    </div>
                    <div className="bg-slate-800/90 rounded-lg px-2.5 py-1.5">
                      <span className="text-slate-400 block">Phần III (Ngắn)</span>
                      <span className="font-extrabold text-sky-300">
                        {currentGrade.p3Correct}/6 • {currentGrade.p3Score.toFixed(2)}đ
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-1 mt-3 bg-slate-800 p-1 rounded-xl">
                  {[
                    { id: 'all', label: 'Tất cả (22)' },
                    { id: 'part1', label: 'Phần I (12)' },
                    { id: 'part2', label: 'Phần II (4)' },
                    { id: 'part3', label: 'Phần III (6)' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveOmrPart(tab.id)}
                      className={`py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        activeOmrPart === tab.id
                          ? 'bg-teal-500 text-slate-950 font-extrabold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-5 bg-slate-50">
                {(activeOmrPart === 'all' || activeOmrPart === 'part1') && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Phần I. Trắc nghiệm 4 lựa chọn (Câu 1 – 12 • 0,25đ/câu)
                    </h4>
                    <div
                      className={`grid gap-2 ${
                        isPdfWide
                          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                          : 'grid-cols-1'
                      }`}
                    >
                      {currentExam.answers.part1.map((correctChoice, qIdx) => {
                        const userChoice = currentSheet.part1[qIdx];
                        const isCorrect = isSubmitted && userChoice === correctChoice;
                        const isWrong = isSubmitted && userChoice !== correctChoice;
                        return (
                          <div
                            key={qIdx}
                            className={`px-3 py-2 rounded-xl border bg-white flex items-center justify-between gap-2 ${
                              isCorrect
                                ? 'border-emerald-400 bg-emerald-50/40'
                                : isWrong
                                ? 'border-rose-300 bg-rose-50/40'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs font-extrabold text-slate-800 shrink-0">
                                Câu {qIdx + 1}:
                              </span>
                              {isSubmitted && (
                                <span
                                  className={`text-[11px] font-bold truncate ${
                                    isCorrect ? 'text-emerald-700' : 'text-rose-600'
                                  }`}
                                >
                                  {isCorrect ? '✓ Đúng' : `Đ/A: ${correctChoice}`}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {['A', 'B', 'C', 'D'].map((opt) => {
                                const selected = userChoice === opt;
                                const isOptCorrect = isSubmitted && correctChoice === opt;
                                let btnClass =
                                  'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                                if (selected && !isSubmitted) {
                                  btnClass = 'bg-slate-900 text-white border-slate-900';
                                } else if (isSubmitted) {
                                  if (isOptCorrect) {
                                    btnClass = 'bg-emerald-600 text-white border-emerald-600';
                                  } else if (selected && !isOptCorrect) {
                                    btnClass = 'bg-rose-600 text-white border-rose-600';
                                  }
                                }
                                return (
                                  <button
                                    key={opt}
                                    onClick={() => handlePart1Change(qIdx, opt)}
                                    className={`w-8 h-8 rounded-lg text-xs font-extrabold border transition-all cursor-pointer shrink-0 ${btnClass}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(activeOmrPart === 'all' || activeOmrPart === 'part2') && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Phần II. Trắc nghiệm Đúng / Sai (Câu 1 – 4 • Tối đa 1,0đ/câu)
                    </h4>
                    <div className="space-y-2.5">
                      {currentExam.answers.part2.map((ansObj, qIdx) => {
                        const userObj = currentSheet.part2[qIdx] || {};
                        const detail = currentGrade.p2Details[qIdx] || { matchCount: 0, pts: 0 };
                        return (
                          <div
                            key={qIdx}
                            className="p-3 rounded-xl border border-slate-200 bg-white space-y-2"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                              <span className="text-xs font-extrabold text-slate-900">
                                Câu {qIdx + 1} (Phần II)
                              </span>
                              {isSubmitted && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                                  Đúng {detail.matchCount}/4 ý • +{detail.pts}đ
                                </span>
                              )}
                            </div>

                            <div
                              className={`grid gap-2 ${
                                isPdfWide ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'
                              }`}
                            >
                              {['a', 'b', 'c', 'd'].map((subKey) => {
                                const userVal = userObj[subKey];
                                const trueVal = ansObj[subKey];
                                const isSubCorrect = isSubmitted && userVal === trueVal;
                                const isSubWrong = isSubmitted && userVal !== trueVal;
                                return (
                                  <div
                                    key={subKey}
                                    className={`p-2 rounded-lg border flex flex-col gap-1.5 ${
                                      isSubCorrect
                                        ? 'border-emerald-300 bg-emerald-50/50'
                                        : isSubWrong
                                        ? 'border-rose-300 bg-rose-50/50'
                                        : 'border-slate-200 bg-slate-50/60'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-extrabold text-slate-800">
                                        Ý {subKey})
                                      </span>
                                      {isSubmitted && (
                                        <span
                                          className={`text-[10px] font-bold ${
                                            isSubCorrect ? 'text-emerald-700' : 'text-rose-600'
                                          }`}
                                        >
                                          Đ/A: {trueVal ? 'Đúng' : 'Sai'}
                                        </span>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      <button
                                        onClick={() => handlePart2Change(qIdx, subKey, true)}
                                        className={`py-1.5 px-1 rounded-md text-[11px] font-extrabold border cursor-pointer transition-colors ${
                                          userVal === true
                                            ? 'bg-teal-600 text-white border-teal-600'
                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                      >
                                        Đúng
                                      </button>
                                      <button
                                        onClick={() => handlePart2Change(qIdx, subKey, false)}
                                        className={`py-1.5 px-1 rounded-md text-[11px] font-extrabold border cursor-pointer transition-colors ${
                                          userVal === false
                                            ? 'bg-rose-600 text-white border-rose-600'
                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                      >
                                        Sai
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(activeOmrPart === 'all' || activeOmrPart === 'part3') && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Phần III. Trắc nghiệm trả lời ngắn (Câu 1 – 6 • 0,5đ/câu)
                    </h4>
                    <div
                      className={`grid gap-2 ${
                        isPdfWide ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                      }`}
                    >
                      {currentExam.answers.part3.map((correctVal, qIdx) => {
                        const userVal = currentSheet.part3[qIdx] || '';
                        const matched = isSubmitted && isShortAnswerMatch(userVal, correctVal);
                        const wrong = isSubmitted && !matched;
                        return (
                          <div
                            key={qIdx}
                            className={`px-3 py-2 rounded-xl border bg-white flex items-center justify-between gap-2.5 ${
                              matched
                                ? 'border-emerald-400 bg-emerald-50/40'
                                : wrong
                                ? 'border-rose-300 bg-rose-50/40'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="flex flex-col shrink-0">
                              <span className="text-xs font-extrabold text-slate-800">
                                Câu {qIdx + 1}:
                              </span>
                              {isSubmitted && (
                                <span
                                  className={`text-[10px] font-extrabold flex items-center gap-0.5 ${
                                    matched ? 'text-emerald-700' : 'text-rose-600'
                                  }`}
                                >
                                  {matched ? '✓ +0,5đ' : `Đ/A: ${correctVal}`}
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={userVal}
                              onChange={(e) => handlePart3Change(qIdx, e.target.value)}
                              placeholder="Nhập đáp số (VD: 14,5)..."
                              className="w-44 sm:w-48 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <button
                  onClick={handleResetExam}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại</span>
                </button>

                <div className="flex items-center gap-2">
                  {isSubmitted && (
                    <button
                      onClick={() => setPdfTab('solution')}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem lời giải</span>
                    </button>
                  )}
                  <button
                    onClick={handleSubmitExam}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>{isSubmitted ? 'Chấm lại điểm' : 'Nộp Bài & Chấm Điểm'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ĐÁP ÁN & LỜI GIẢI CHI TIẾT (SOLUTIONS)
         ===================================================================== */}
      {currentTab === 'solutions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase text-slate-500">
                  Chọn đề xem đáp án &amp; lời giải:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {examsData.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExamId(ex.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                        currentExam.id === ex.id
                          ? 'bg-[#0d3b3e] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Đề {String(ex.id).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleOpenExamRoom(currentExam.id, false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Mở phòng thi {currentExam.code}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Answer Key Matrix for Selected Exam */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/80 space-y-2">
                <div className="text-xs font-extrabold text-teal-950">
                  PHẦN I — 12 Câu Trắc Nghiệm (3,0 điểm)
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {currentExam.answers.part1.map((ans, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border border-teal-200 py-1 px-1.5 text-center"
                    >
                      <div className="text-[10px] text-slate-500 font-semibold">C{idx + 1}</div>
                      <div className="text-xs font-black text-teal-800">{ans}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="text-xs font-extrabold text-amber-950">
                  PHẦN II — 4 Câu Đúng / Sai (4,0 điểm)
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {currentExam.answers.part2.map((obj, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border border-amber-200 p-2 text-xs"
                    >
                      <div className="font-extrabold text-slate-800 mb-1">Câu {idx + 1}:</div>
                      <div className="flex flex-wrap gap-1 text-[11px] font-mono font-bold">
                        {['a', 'b', 'c', 'd'].map((k) => (
                          <span
                            key={k}
                            className={`px-1.5 py-0.5 rounded ${
                              obj[k]
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {k}:{obj[k] ? 'Đ' : 'S'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200/80 space-y-2">
                <div className="text-xs font-extrabold text-sky-950">
                  PHẦN III — 6 Câu Trả Lời Ngắn (3,0 điểm)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {currentExam.answers.part3.map((ans, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border border-sky-200 py-1.5 px-2 text-center"
                    >
                      <div className="text-[10px] text-slate-500 font-semibold">Câu {idx + 1}</div>
                      <div className="text-xs font-mono font-black text-sky-900">{ans}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Solution PDF Viewer */}
          <div
            className={
              isFullscreen
                ? 'fixed top-14 md:top-0 left-0 md:left-64 right-0 bottom-0 z-50 bg-slate-950 flex flex-col overflow-hidden'
                : 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[88vh] min-h-[840px] flex flex-col'
            }
          >
            <div className="px-4 py-2.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold">
                BẢN LỜI GIẢI CHI TIẾT TỪNG BƯỚC • {currentExam.code} ({currentExam.solutionPages}{' '}
                trang)
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  {[
                    { id: 'page-width', label: 'Vừa khung' },
                    { id: '115', label: '115%' },
                    { id: '135', label: '135%' },
                    { id: '160', label: '160%' },
                    { id: '200', label: '200%' }
                  ].map((z) => (
                    <button
                      key={z.id}
                      onClick={() => setPdfZoom(z.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        pdfZoom === z.id
                          ? 'bg-teal-500 text-slate-950'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Thu nhỏ</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Toàn màn hình</span>
                    </>
                  )}
                </button>

                <a
                  href={`${currentExam.solutionPdf}?v=2026_nda`}
                  download={`Loi_giai_Toan_2026_De_${currentExam.id}.pdf`}
                  className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1"
                >
                  <Download className="w-3 h-3.5" />
                  <span>Tải Lời Giải PDF</span>
                </a>
              </div>
            </div>
            <iframe
              key={`sol-${currentExam.id}-${pdfZoom}`}
              src={buildPdfSrc(currentExam.solutionPdf)}
              title={`Lời giải ${currentExam.title}`}
              className="w-full flex-1 border-0 bg-slate-800"
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: THỐNG KÊ ĐIỂM LUYỆN ĐỀ (ANALYTICS)
         ===================================================================== */}
      {currentTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Số đề đã hoàn thành</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {analyticsSummary.completedCount} / 15 đề
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Điểm trung bình</div>
              <div className="text-2xl font-black text-teal-700 mt-1">
                {analyticsSummary.avgScore} / 10.0
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase">Điểm cao nhất</div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {analyticsSummary.maxScore} / 10.0
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">
              Bảng Tổng Hợp Kết Quả 15 Đề Ôn Tập THPT 2026
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 px-3 font-bold">Mã đề</th>
                    <th className="py-2.5 px-3 font-bold">Trạng thái</th>
                    <th className="py-2.5 px-3 font-bold">Phần I (3,0đ)</th>
                    <th className="py-2.5 px-3 font-bold">Phần II (4,0đ)</th>
                    <th className="py-2.5 px-3 font-bold">Phần III (3,0đ)</th>
                    <th className="py-2.5 px-3 font-bold">Tổng điểm</th>
                    <th className="py-2.5 px-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examsData.map((ex) => {
                    const done = Boolean(submittedByExam[ex.id]);
                    const g = done ? computeExamGrade(ex, sheetsByExam[ex.id]) : null;
                    return (
                      <tr key={ex.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-extrabold text-slate-900">{ex.code}</td>
                        <td className="py-2.5 px-3">
                          {done ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                              Đã nộp bài
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                              Chưa làm
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {done ? `${g.p1Score.toFixed(2)}đ (${g.p1Correct}/12)` : '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {done ? `${g.p2Score.toFixed(2)}đ` : '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {done ? `${g.p3Score.toFixed(2)}đ (${g.p3Correct}/6)` : '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-black text-slate-900">
                          {done ? `${g.totalScore.toFixed(2)} / 10` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleOpenExamRoom(ex.id, false)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold cursor-pointer hover:bg-[#0d3b3e]"
                          >
                            {done ? 'Xem lại bài' : 'Làm đề'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Đề Thi Mới & Cài Đặt Đáp Án OMR */}
      <AddExamModal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        onExamAdded={handleExamAdded}
      />
    </div>
  );
}
