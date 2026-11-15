import React, { useState, useEffect } from 'react';
import MathView from './MathView';
import {
  getLessonQuiz,
  saveCustomLessonQuiz,
  resetLessonQuiz
} from '../data/lessonMediaData';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Settings,
  Check,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LessonQuizSection({ lesson }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isGraded, setIsGraded] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Admin Modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQType, setNewQType] = useState('mcq'); // 'mcq' | 'tf' | 'short'
  const [newQText, setNewQText] = useState('');
  const [newQExplanation, setNewQExplanation] = useState('');
  const [newQOptions, setNewQOptions] = useState(['', '', '', '']);
  const [newQCorrectIdx, setNewQCorrectIdx] = useState(0);
  const [newQShortAnswer, setNewQShortAnswer] = useState('');
  const [newQTfItems, setNewQTfItems] = useState([
    { key: 'a', statement: '', correct: true },
    { key: 'b', statement: '', correct: false },
    { key: 'c', statement: '', correct: true },
    { key: 'd', statement: '', correct: true }
  ]);
  const [adminNotice, setAdminNotice] = useState('');

  // Nạp câu hỏi khi lesson thay đổi
  useEffect(() => {
    if (!lesson) return;
    const loaded = getLessonQuiz(lesson.id, lesson);
    setQuestions(loaded);
    setUserAnswers({});
    setIsGraded(false);
    setScoreResult(null);
  }, [lesson]);

  const handleSelectMcq = (qId, optionIdx) => {
    if (isGraded) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSelectTf = (qId, itemKey, val) => {
    if (isGraded) return;
    setUserAnswers((prev) => {
      const curTf = prev[qId] || {};
      return {
        ...prev,
        [qId]: { ...curTf, [itemKey]: val }
      };
    });
  };

  const handleInputShort = (qId, val) => {
    if (isGraded) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsGraded(false);
    setScoreResult(null);
  };

  const handleGradeQuiz = () => {
    if (!questions || questions.length === 0) return;

    let totalPoints = 0;
    const maxPoints = questions.length * 10;
    const details = [];

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = userAnswers[q.id];
        const isCorrect = userChoice === q.correctIndex;
        if (isCorrect) totalPoints += 10;
        details.push({ id: q.id, type: 'mcq', isCorrect, userChoice, correctIndex: q.correctIndex });
      } else if (q.type === 'tf') {
        const userTf = userAnswers[q.id] || {};
        let matched = 0;
        (q.items || []).forEach((item) => {
          if (userTf[item.key] === item.correct) matched += 1;
        });
        // Điểm lũy tiến chuẩn Bộ GD&ĐT: 1 ý = 1đ, 2 ý = 2.5đ, 3 ý = 5đ, 4 ý = 10đ
        let pts = 0;
        if (matched === 1) pts = 1.0;
        else if (matched === 2) pts = 2.5;
        else if (matched === 3) pts = 5.0;
        else if (matched === 4) pts = 10.0;
        totalPoints += pts;
        details.push({ id: q.id, type: 'tf', matched, pts, userTf });
      } else if (q.type === 'short') {
        const uVal = String(userAnswers[q.id] || '').trim().replace(/\s+/g, '').replace(',', '.');
        const cVal = String(q.correctAnswer || '').trim().replace(/\s+/g, '').replace(',', '.');
        let isCorrect = false;
        if (uVal && cVal) {
          if (uVal.toLowerCase() === cVal.toLowerCase()) {
            isCorrect = true;
          } else {
            const uNum = Number(uVal);
            const cNum = Number(cVal);
            if (!Number.isNaN(uNum) && !Number.isNaN(cNum) && Math.abs(uNum - cNum) <= 0.015) {
              isCorrect = true;
            }
          }
        }
        if (isCorrect) totalPoints += 10;
        details.push({ id: q.id, type: 'short', isCorrect, uVal, cVal });
      }
    });

    const scaledScore = +((totalPoints / maxPoints) * 10).toFixed(1);
    const resultObj = {
      score: scaledScore,
      totalPoints,
      maxPoints,
      details
    };

    setScoreResult(resultObj);
    setIsGraded(true);

    if (scaledScore >= 8.0) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  // ADMIN ACTIONS
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setNewQType('mcq');
    setNewQText('');
    setNewQExplanation('');
    setNewQOptions(['', '', '', '']);
    setNewQCorrectIdx(0);
    setNewQShortAnswer('');
    setNewQTfItems([
      { key: 'a', statement: '', correct: true },
      { key: 'b', statement: '', correct: false },
      { key: 'c', statement: '', correct: true },
      { key: 'd', statement: '', correct: true }
    ]);
    setAdminNotice('');
    setIsAdminOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    setNewQType(q.type || 'mcq');
    setNewQText(q.question || '');
    setNewQExplanation(q.explanation || '');
    setNewQOptions(q.options ? [...q.options] : ['', '', '', '']);
    setNewQCorrectIdx(q.correctIndex || 0);
    setNewQShortAnswer(q.correctAnswer || '');
    setNewQTfItems(
      q.items
        ? q.items.map((it) => ({ ...it }))
        : [
            { key: 'a', statement: '', correct: true },
            { key: 'b', statement: '', correct: false },
            { key: 'c', statement: '', correct: true },
            { key: 'd', statement: '', correct: true }
          ]
    );
    setAdminNotice('');
    setIsAdminOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!newQText.trim()) {
      setAdminNotice('Vui lòng nhập nội dung câu hỏi!');
      return;
    }

    let questionObj = {};
    const qId = editingQuestion ? editingQuestion.id : `custom-${lesson.id}-${Date.now()}`;

    if (newQType === 'mcq') {
      if (newQOptions.some((opt) => !opt.trim())) {
        setAdminNotice('Vui lòng điền đủ 4 phương án A, B, C, D!');
        return;
      }
      questionObj = {
        id: qId,
        type: 'mcq',
        question: newQText.trim(),
        options: newQOptions.map((o) => o.trim()),
        correctIndex: newQCorrectIdx,
        explanation: newQExplanation.trim()
      };
    } else if (newQType === 'tf') {
      if (newQTfItems.some((it) => !it.statement.trim())) {
        setAdminNotice('Vui lòng điền đủ 4 mệnh đề a, b, c, d!');
        return;
      }
      questionObj = {
        id: qId,
        type: 'tf',
        question: newQText.trim(),
        items: newQTfItems.map((it) => ({ ...it, statement: it.statement.trim() })),
        explanation: newQExplanation.trim()
      };
    } else if (newQType === 'short') {
      if (!newQShortAnswer.trim()) {
        setAdminNotice('Vui lòng nhập đáp án điền số chính xác!');
        return;
      }
      questionObj = {
        id: qId,
        type: 'short',
        question: newQText.trim(),
        correctAnswer: newQShortAnswer.trim(),
        explanation: newQExplanation.trim()
      };
    }

    let updatedList = [];
    if (editingQuestion) {
      updatedList = questions.map((q) => (q.id === editingQuestion.id ? questionObj : q));
    } else {
      updatedList = [...questions, questionObj];
    }

    setQuestions(updatedList);
    saveCustomLessonQuiz(lesson.id, updatedList);
    setIsAdminOpen(false);
    handleResetQuiz();
  };

  const handleDeleteQuestion = (qId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi đề luyện tập?')) {
      const updatedList = questions.filter((q) => q.id !== qId);
      setQuestions(updatedList);
      saveCustomLessonQuiz(lesson.id, updatedList);
      handleResetQuiz();
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Khôi phục lại bộ câu hỏi mặc định của hệ thống cho bài học này?')) {
      resetLessonQuiz(lesson.id);
      const def = getLessonQuiz(lesson.id, lesson);
      setQuestions(def);
      handleResetQuiz();
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header khu vực Đề Luyện Tập */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-50 text-[#005a54] rounded-xl border border-teal-100">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Đề Luyện Tập Củng Cố Sau Bài Học
            </h2>
            <p className="text-xs text-slate-500">
              {questions.length} câu hỏi chuẩn cấu trúc thi mới (Trắc nghiệm 4 lựa chọn, Đúng/Sai & Điền số)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isGraded && (
            <button
              onClick={handleResetQuiz}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-teal-300" />
            <span>Thêm câu hỏi (Admin/GV)</span>
          </button>

          <button
            onClick={handleResetToDefault}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer"
            title="Khôi phục câu hỏi mặc định của hệ thống"
          >
            Mặc định
          </button>
        </div>
      </div>

      {/* Kết quả chấm điểm khi đã nộp bài */}
      {isGraded && scoreResult && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-500 to-[#005a54] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="font-extrabold text-sm uppercase tracking-wider text-teal-100">
                Kết Quả Bài Luyện Tập
              </span>
            </div>
            <p className="text-xs text-teal-100">
              Chúc mừng bạn đã hoàn thành bài luyện tập củng cố kiến thức cho {lesson.number}!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20">
            <span className="text-xs font-semibold text-teal-100">Điểm số:</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300">
              {scoreResult.score}
            </span>
            <span className="text-xs font-bold text-teal-200">/ 10 điểm</span>
          </div>
        </div>
      )}

      {/* Danh sách các câu hỏi trong đề */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const isQGraded = isGraded && scoreResult;
          const qDetail = isQGraded ? scoreResult.details.find((d) => d.id === q.id) : null;

          return (
            <div
              key={q.id || qIdx}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isQGraded
                  ? q.type === 'mcq'
                    ? qDetail?.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-rose-200 bg-rose-50/30'
                    : q.type === 'short'
                    ? qDetail?.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-rose-200 bg-rose-50/30'
                    : 'border-slate-200 bg-slate-50/50'
                  : 'border-slate-200/90 bg-white hover:border-slate-300'
              }`}
            >
              {/* Tiêu đề câu hỏi & Nút sửa/xóa của Admin */}
              <div className="flex items-start justify-between gap-3 pb-2.5 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#005a54] text-white text-[11px] font-extrabold">
                    Câu {qIdx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                    {q.type === 'mcq' ? 'Trắc nghiệm 4 lựa chọn' : q.type === 'tf' ? 'Đúng / Sai' : 'Trả lời ngắn'}
                  </span>
                  {isQGraded && (
                    <span className="text-xs font-bold">
                      {q.type === 'mcq' && (qDetail?.isCorrect ? <span className="text-emerald-600 font-extrabold">Đúng (+10đ)</span> : <span className="text-rose-600 font-extrabold">Sai (0đ)</span>)}
                      {q.type === 'short' && (qDetail?.isCorrect ? <span className="text-emerald-600 font-extrabold">Đúng (+10đ)</span> : <span className="text-rose-600 font-extrabold">Sai (0đ)</span>)}
                      {q.type === 'tf' && <span className="text-teal-700 font-extrabold">Đạt: {qDetail?.pts}/10đ</span>}
                    </span>
                  )}
                </div>

                {/* Các nút quản trị cho câu hỏi này */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(q)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Chỉnh sửa câu hỏi này"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa câu hỏi này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Nội dung đề bài */}
              <div className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium mb-3">
                <MathView math={q.question} />
              </div>

              {/* PHẦN 1: TRẮC NGHIỆM 4 LỰA CHỌN */}
              {q.type === 'mcq' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {(q.options || []).map((opt, oIdx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = userAnswers[q.id] === oIdx;
                    const isCorrectOpt = q.correctIndex === oIdx;

                    let btnStyle = 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-800';
                    if (isGraded) {
                      if (isCorrectOpt) {
                        btnStyle = 'border-emerald-400 bg-emerald-100/70 text-emerald-950 font-bold';
                      } else if (isSelected && !isCorrectOpt) {
                        btnStyle = 'border-rose-400 bg-rose-100/70 text-rose-950 font-bold';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-70';
                      }
                    } else if (isSelected) {
                      btnStyle = 'border-[#005a54] bg-teal-50 text-[#005a54] font-bold shadow-xs';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isGraded}
                        onClick={() => handleSelectMcq(q.id, oIdx)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected || (isGraded && isCorrectOpt)
                              ? 'bg-[#005a54] text-white'
                              : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                        >
                          {letters[oIdx]}
                        </span>
                        <div className="text-xs sm:text-[13px] leading-relaxed pt-0.5">
                          <MathView math={opt} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* PHẦN 2: TRẮC NGHIỆM ĐÚNG / SAI (4 Ý) */}
              {q.type === 'tf' && (
                <div className="space-y-2 mt-2">
                  {(q.items || []).map((item) => {
                    const userVal = userAnswers[q.id]?.[item.key];
                    const isItemCorrect = isGraded ? userVal === item.correct : null;

                    return (
                      <div
                        key={item.key}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isGraded
                            ? isItemCorrect
                              ? 'border-emerald-200 bg-emerald-50/50'
                              : 'border-rose-200 bg-rose-50/50'
                            : 'border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-800 leading-relaxed">
                          <span className="font-extrabold text-[#005a54] uppercase shrink-0">
                            {item.key})
                          </span>
                          <span>
                            <MathView math={item.statement} />
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                          <button
                            disabled={isGraded}
                            onClick={() => handleSelectTf(q.id, item.key, true)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              userVal === true
                                ? isGraded
                                  ? item.correct
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'bg-rose-600 border-rose-600 text-white'
                                  : 'bg-[#005a54] border-[#005a54] text-white'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Đúng
                          </button>
                          <button
                            disabled={isGraded}
                            onClick={() => handleSelectTf(q.id, item.key, false)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              userVal === false
                                ? isGraded
                                  ? !item.correct
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'bg-rose-600 border-rose-600 text-white'
                                  : 'bg-[#005a54] border-[#005a54] text-white'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            Sai
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PHẦN 3: TRẢ LỜI NGẮN ĐIỀN SỐ */}
              {q.type === 'short' && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Điền đáp án:</span>
                    <input
                      type="text"
                      disabled={isGraded}
                      value={userAnswers[q.id] || ''}
                      onChange={(e) => handleInputShort(q.id, e.target.value)}
                      placeholder="Nhập số thập phân hoặc phân số..."
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#005a54] w-56"
                    />
                  </div>
                  {isGraded && (
                    <div className="text-xs">
                      <span className="text-slate-500 font-semibold">Đáp án chuẩn: </span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {q.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* LỜI GIẢI CHI TIẾT & GIẢI THÍCH (Hiển thị khi đã chấm điểm) */}
              {isGraded && q.explanation && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/80 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-[#005a54] flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Lời giải chi tiết:</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-slate-800 whitespace-pre-line leading-relaxed">
                    <MathView math={q.explanation} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nút hành động chấm điểm */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          * Đề thi tự động chấm điểm và hiển thị giải thích chi tiết có công thức Toán học KaTeX.
        </div>

        {!isGraded ? (
          <button
            onClick={handleGradeQuiz}
            className="px-5 py-2.5 rounded-xl bg-[#005a54] hover:bg-[#004742] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-300" />
            <span>Chấm điểm bài làm</span>
          </button>
        ) : (
          <button
            onClick={handleResetQuiz}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại bài luyện tập</span>
          </button>
        )}
      </div>

      {/* MODAL THÊM / SỬA CÂU HỎI (DÀNH CHO ADMIN & GIÁO VIÊN) */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-[#005a54] rounded-lg">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingQuestion ? 'Chỉnh Sửa Câu Hỏi Luyện Tập' : 'Thêm Câu Hỏi Luyện Tập Mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminNotice && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminNotice}</span>
              </div>
            )}

            {/* Chọn dạng câu hỏi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dạng câu hỏi (Chuẩn thi TN THPT 2025):
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'mcq', label: '1. Trắc nghiệm 4 lựa chọn (A, B, C, D)' },
                  { id: 'tf', label: '2. Đúng / Sai (4 ý a, b, c, d)' },
                  { id: 'short', label: '3. Trả lời ngắn (Điền số)' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setNewQType(type.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      newQType === type.id
                        ? 'bg-[#005a54] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nội dung đề bài */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nội dung câu hỏi (hỗ trợ công thức KaTeX trong $...$ hoặc $$...$$):
              </label>
              <textarea
                rows={3}
                value={newQText}
                onChange={(e) => setNewQText(e.target.value)}
                placeholder="Ví dụ: Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = 3x^2 - 6x$..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#005a54]"
              />
            </div>

            {/* Form cho MCQ */}
            {newQType === 'mcq' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  4 Phương án lựa chọn (Chọn nút tròn để chỉ định đáp án đúng):
                </label>
                {newQOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mcq-correct"
                      checked={newQCorrectIdx === idx}
                      onChange={() => setNewQCorrectIdx(idx)}
                      className="w-4 h-4 text-[#005a54] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-700 w-5">
                      {['A', 'B', 'C', 'D'][idx]}:
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newQOptions];
                        copy[idx] = e.target.value;
                        setNewQOptions(copy);
                      }}
                      placeholder={`Nội dung phương án ${['A', 'B', 'C', 'D'][idx]}...`}
                      className="flex-1 p-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#005a54]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Form cho Đúng / Sai */}
            {newQType === 'tf' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  4 Mệnh đề trắc nghiệm Đúng/Sai:
                </label>
                {newQTfItems.map((it, idx) => (
                  <div key={it.key} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#005a54] w-5 uppercase">
                      {it.key})
                    </span>
                    <input
                      type="text"
                      value={it.statement}
                      onChange={(e) => {
                        const copy = [...newQTfItems];
                        copy[idx].statement = e.target.value;
                        setNewQTfItems(copy);
                      }}
                      placeholder={`Nội dung mệnh đề ${it.key}...`}
                      className="flex-1 p-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#005a54]"
                    />
                    <select
                      value={it.correct ? 'true' : 'false'}
                      onChange={(e) => {
                        const copy = [...newQTfItems];
                        copy[idx].correct = e.target.value === 'true';
                        setNewQTfItems(copy);
                      }}
                      className="p-2 rounded-lg border border-slate-300 text-xs font-bold cursor-pointer"
                    >
                      <option value="true">ĐÚNG</option>
                      <option value="false">SAI</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Form cho Trả lời ngắn */}
            {newQType === 'short' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đáp án số chính xác (ví dụ: 12 hoặc 3.5 hoặc 4/3):
                </label>
                <input
                  type="text"
                  value={newQShortAnswer}
                  onChange={(e) => setNewQShortAnswer(e.target.value)}
                  placeholder="Nhập giá trị số..."
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold focus:outline-none focus:border-[#005a54]"
                />
              </div>
            )}

            {/* Lời giải thích */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lời giải chi tiết & ghi chú phương pháp giải:
              </label>
              <textarea
                rows={2}
                value={newQExplanation}
                onChange={(e) => setNewQExplanation(e.target.value)}
                placeholder="Trình bày các bước suy luận, công thức áp dụng..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#005a54]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="px-5 py-2 rounded-xl bg-[#005a54] hover:bg-[#004742] text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Lưu câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
