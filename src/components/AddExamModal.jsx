import React, { useState, useRef } from 'react';
import {
  Award,
  Upload,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  X,
  PlusCircle,
  FileCheck,
  FolderOpen
} from 'lucide-react';
import { addCustomExam, getCustomExams } from '../services/customizationService';
import { saveExamPdfFile } from '../services/pdfStorage';

export default function AddExamModal({ isOpen, onClose, onExamAdded }) {
  if (!isOpen) return null;

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(90);
  const [highlights, setHighlights] = useState('');

  // File PDF từ máy tính
  const [examFile, setExamFile] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);
  const [customExamUrl, setCustomExamUrl] = useState('');
  const [customSolutionUrl, setCustomSolutionUrl] = useState('');

  const examFileInputRef = useRef(null);
  const solutionFileInputRef = useRef(null);

  // Đáp án Phần I: 12 câu
  const [p1Answers, setP1Answers] = useState(Array(12).fill('A'));
  const [quickPasteP1, setQuickPasteP1] = useState('');

  // Đáp án Phần II: 4 câu, mỗi câu 4 ý a, b, c, d (true = Đúng, false = Sai)
  const [p2Answers, setP2Answers] = useState([
    { a: true, b: false, c: true, d: false },
    { a: true, b: true, c: false, d: true },
    { a: false, b: true, c: true, d: false },
    { a: true, b: false, c: false, d: true }
  ]);

  // Đáp án Phần III: 6 câu trả lời ngắn
  const [p3Answers, setP3Answers] = useState(['1', '2', '3', '4', '5', '6']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Xử lý dán nhanh chuỗi đáp án Phần I
  const handleApplyQuickPaste = () => {
    if (!quickPasteP1.trim()) return;
    const cleanStr = quickPasteP1.toUpperCase().replace(/[^ABCD]/g, '');
    if (cleanStr.length === 0) {
      alert('Không tìm thấy ký tự đáp án A, B, C, D hợp lệ trong chuỗi dán!');
      return;
    }
    const newP1 = [...p1Answers];
    for (let i = 0; i < Math.min(12, cleanStr.length); i++) {
      newP1[i] = cleanStr[i];
    }
    setP1Answers(newP1);
    setStatusMsg({ type: 'success', text: `Đã tự động điền ${Math.min(12, cleanStr.length)}/12 câu Phần I!` });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleSelectExamFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        alert('Vui lòng chọn file định dạng PDF (.pdf)!');
        return;
      }
      setExamFile(file);
      setStatusMsg({ type: 'info', text: `Đã chọn file đề thi: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` });
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  const handleSelectSolutionFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        alert('Vui lòng chọn file định dạng PDF (.pdf)!');
        return;
      }
      setSolutionFile(file);
      setStatusMsg({ type: 'info', text: `Đã chọn file lời giải: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` });
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập Tiêu đề đề thi!');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Thêm đề vào customizationService
      const currentCustoms = getCustomExams();
      const generatedCode = code.trim() || `ĐỀ SỐ ${15 + currentCustoms.length + 1}`;

      // Xử lý link đề bài & lời giải
      let finalExamPdf = customExamUrl.trim() || (examFile ? URL.createObjectURL(examFile) : '/bo_de/de_1.pdf');
      let finalSolutionPdf = customSolutionUrl.trim() || (solutionFile ? URL.createObjectURL(solutionFile) : '/bo_de/giai_1.pdf');

      const res = addCustomExam({
        code: generatedCode,
        title: title.trim(),
        duration: Number(duration) || 90,
        examPdf: finalExamPdf,
        solutionPdf: finalSolutionPdf,
        highlights: highlights.trim() || 'Đề kiểm tra ôn tập chuẩn cấu trúc Bộ GD&ĐT 2026 do giáo viên biên soạn.',
        answers: {
          part1: p1Answers,
          part2: p2Answers,
          part3: p3Answers
        }
      });

      if (res && res.success && res.exam) {
        const newExamId = res.exam.id;

        // 2. Lưu file nhị phân vào IndexedDB để dùng lâu dài & offline
        if (examFile) {
          await saveExamPdfFile(newExamId, 'exam', examFile);
        }
        if (solutionFile) {
          await saveExamPdfFile(newExamId, 'solution', solutionFile);
        }

        if (onExamAdded) {
          onExamAdded(res.exam);
        }
        onClose();
      }
    } catch (err) {
      console.error('Lỗi khi thêm đề thi:', err);
      alert('Đã có lỗi xảy ra khi lưu đề thi. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                Thêm Đề Thi Mới &amp; Cài Đặt Đáp Án Tự Chấm OMR
              </h3>
              <p className="text-[11px] text-slate-500">
                Chuẩn cấu trúc ma trận khảo thí Tốt nghiệp THPT 2026 (Bộ GD&amp;ĐT)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mã đề thi:
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: ĐỀ SỐ 16"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Tiêu đề đề thi <span className="text-rose-500">*</span>:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Đề Khảo Sát Năng Lực Toán 12 — Đợt 1 (Chuyên Đề Oxyz &amp; Đạo Hàm)"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Thời gian làm bài:
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:border-teal-700"
              >
                <option value={90}>90 phút (Chuẩn thi Tốt nghiệp THPT)</option>
                <option value={60}>60 phút (Kiểm tra giữa kỳ)</option>
                <option value={45}>45 phút (Kiểm tra 1 tiết)</option>
                <option value={120}>120 phút (Đề thi thử chuyên sâu)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Điểm nhấn kiến thức / Ma trận:
              </label>
              <input
                type="text"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="VD: Khảo sát hàm số, Oxyz không gian, Xác suất Bayes..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          {/* CHỌN FILE PDF TỪ MÁY TÍNH */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-teal-50/40 rounded-2xl border border-teal-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-teal-700" />
              <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Chọn File Đề Bài &amp; Lời Giải Chi Tiết (Định Dạng PDF)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Thầy Cô có thể chọn file PDF trực tiếp từ máy tính để hệ thống hiển thị trong khung làm bài và xem giải.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Đề bài */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="block font-bold text-slate-800 text-[11px]">
                  1. File PDF Đề bài:
                </span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  ref={examFileInputRef}
                  onChange={handleSelectExamFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => examFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-teal-700" />
                  <span>
                    {examFile ? 'Đổi file Đề bài khác' : '📁 Chọn file PDF Đề bài từ máy'}
                  </span>
                </button>
                {examFile ? (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center justify-between text-[11px]">
                    <span className="truncate max-w-[200px]" title={examFile.name}>
                      ✓ {examFile.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-mono">
                      {(examFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 italic">
                    Chưa chọn file (sẽ dùng đề mẫu chuẩn nếu để trống)
                  </div>
                )}
              </div>

              {/* File Lời giải */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="block font-bold text-slate-800 text-[11px]">
                  2. File PDF Lời giải chi tiết:
                </span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  ref={solutionFileInputRef}
                  onChange={handleSelectSolutionFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => solutionFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-teal-700" />
                  <span>
                    {solutionFile ? 'Đổi file Lời giải khác' : '📁 Chọn file PDF Lời giải từ máy'}
                  </span>
                </button>
                {solutionFile ? (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center justify-between text-[11px]">
                    <span className="truncate max-w-[200px]" title={solutionFile.name}>
                      ✓ {solutionFile.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-mono">
                      {(solutionFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 italic">
                    Chưa chọn file (sẽ dùng giải mẫu chuẩn nếu để trống)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CÀI ĐẶT BẢNG ĐÁP ÁN CHUẨN OMR */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-extrabold text-teal-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-teal-700" />
                Cài Đặt Bảng Đáp Án Tự Chấm OMR (3 Phần Chuẩn Bộ)
              </span>
              <span className="text-[11px] text-slate-500">
                Hệ thống tự đối chiếu và chấm tự động theo ma trận này
              </span>
            </div>

            {/* Dán nhanh Phần I */}
            <div className="p-3 bg-teal-50/90 rounded-xl border border-teal-200 flex flex-col sm:flex-row items-center gap-2">
              <span className="font-bold text-[11px] text-teal-900 shrink-0">
                Dán nhanh đáp án P1:
              </span>
              <input
                type="text"
                value={quickPasteP1}
                onChange={(e) => setQuickPasteP1(e.target.value)}
                placeholder="VD: 1A 2B 3C... hoặc dán liền ABCDABCDABCD"
                className="w-full sm:flex-1 px-3 py-1.5 rounded-lg border border-teal-300 text-xs font-mono bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyQuickPaste}
                className="w-full sm:w-auto px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold text-xs cursor-pointer shrink-0"
              >
                Áp dụng
              </button>
            </div>

            {/* PHẦN I: 12 CÂU */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 text-[11px] block">
                Phần I: 12 câu trắc nghiệm nhiều phương án (Chọn A, B, C hoặc D)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {p1Answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between"
                  >
                    <span className="font-bold text-[11px] text-slate-600">
                      C{idx + 1}:
                    </span>
                    <div className="flex gap-1">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            const updated = [...p1Answers];
                            updated[idx] = opt;
                            setP1Answers(updated);
                          }}
                          className={`w-5 h-5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            ans === opt
                              ? 'bg-teal-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHẦN II: 4 CÂU ĐÚNG / SAI */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 text-[11px] block">
                Phần II: 4 câu trắc nghiệm Đúng / Sai (Mỗi câu gồm 4 ý a, b, c, d)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {p2Answers.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5"
                  >
                    <span className="font-bold text-xs text-teal-900 block">
                      Câu {qIdx + 1} (Phần II):
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['a', 'b', 'c', 'd'].map((sub) => {
                        const isTrue = q[sub];
                        return (
                          <div
                            key={sub}
                            className="flex flex-col items-center p-1 rounded-lg bg-slate-50 border border-slate-100"
                          >
                            <span className="font-extrabold text-[11px] text-slate-700">
                              Ý {sub})
                            </span>
                            <div className="flex gap-1 mt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...p2Answers];
                                  updated[qIdx] = { ...updated[qIdx], [sub]: true };
                                  setP2Answers(updated);
                                }}
                                className={`w-5 h-5 rounded text-[9px] font-black cursor-pointer ${
                                  isTrue
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                }`}
                              >
                                Đ
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...p2Answers];
                                  updated[qIdx] = { ...updated[qIdx], [sub]: false };
                                  setP2Answers(updated);
                                }}
                                className={`w-5 h-5 rounded text-[9px] font-black cursor-pointer ${
                                  !isTrue
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                }`}
                              >
                                S
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHẦN III: 6 CÂU TRẢ LỜI NGẮN */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 text-[11px] block">
                Phần III: 6 câu trả lời ngắn (Nhập giá trị số chuẩn)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {p3Answers.map((val, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-xl border border-slate-200">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Câu {idx + 1}:
                    </label>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const updated = [...p3Answers];
                        updated[idx] = e.target.value;
                        setP3Answers(updated);
                      }}
                      placeholder="0"
                      className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-center font-bold text-xs focus:outline-none focus:border-teal-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang Lưu...' : 'Lưu Đề Thi & Đưa Vào Kho Đề'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
