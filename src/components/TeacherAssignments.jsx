import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getStoredAssignments,
  createAssignment,
  deleteAssignment,
  calculateAssignmentAnalytics,
  exportGradeSheetToExcel,
  resetAssignmentsToDefault
} from '../services/assignmentDatabase';
import { getClassesList } from '../services/studentDatabase';
import examsData from '../data/bo_de_2026.json';
import {
  FileText,
  PlusCircle,
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  ArrowLeft,
  Award,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Calendar,
  X,
  FileSpreadsheet,
  Check
} from 'lucide-react';

export default function TeacherAssignments({ onOpenExamRoom }) {
  const { isTeacher, promptLoginForFeature } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('asg_de_01_12a1'); // Mặc định mở bài Đề 1 để BGK thấy ngay phân tích
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  // Form tạo bài mới
  const [newTitle, setNewTitle] = useState('');
  const [newExamId, setNewExamId] = useState(1);
  const [newAssignedClass, setNewAssignedClass] = useState('12A1');
  const [newDuration, setNewDuration] = useState(90);
  const [newDeadline, setNewDeadline] = useState('2026-11-30');
  const [newDescription, setNewDescription] = useState('');

  const reloadData = () => {
    const asgs = getStoredAssignments();
    setAssignments(asgs);
    const cls = getClassesList();
    setClasses(cls);
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Lọc danh sách bài theo lớp
  const filteredAssignments = assignments.filter((a) => {
    if (selectedClassFilter === 'ALL') return true;
    return a.assignedClass === selectedClassFilter || a.assignedClass === 'ALL';
  });

  const selectedAnalytics = selectedAssignmentId
    ? calculateAssignmentAnalytics(selectedAssignmentId)
    : null;

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Vui lòng nhập tiêu đề bài kiểm tra!');
      return;
    }

    const res = createAssignment({
      title: newTitle,
      examId: Number(newExamId),
      assignedClass: newAssignedClass,
      durationMinutes: Number(newDuration),
      deadline: `${newDeadline}T23:59:59.000Z`,
      description: newDescription
    });

    if (res.success) {
      reloadData();
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setSelectedAssignmentId(res.assignment.id);
      setNotice({ type: 'success', text: `Đã giao bài kiểm tra mới cho lớp ${newAssignedClass}!` });
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleDeleteAssignment = (id, title) => {
    if (window.confirm(`Thầy có chắc chắn muốn xóa bài kiểm tra: "${title}" không?`)) {
      deleteAssignment(id);
      reloadData();
      if (selectedAssignmentId === id) {
        setSelectedAssignmentId(null);
      }
      setNotice({ type: 'success', text: 'Đã xóa bài kiểm tra thành công.' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Khôi phục bài kiểm tra và bài làm mẫu của học sinh lớp 12A1 về ban đầu?')) {
      resetAssignmentsToDefault();
      reloadData();
      setSelectedAssignmentId('asg_de_01_12a1');
      setNotice({ type: 'success', text: 'Đã khôi phục dữ liệu bài làm và phân tích mẫu.' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  if (!isTeacher) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-amber-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Khu vực Sư phạm dành riêng cho Giáo viên
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thầy/Cô vui lòng đăng nhập tài khoản Giáo viên để giao bài tập theo lớp, theo dõi tiến độ nộp bài và xem phân tích phổ điểm học sinh.
        </p>
        <button
          onClick={() => promptLoginForFeature('Vui lòng đăng nhập với vai trò Giáo viên để xem phân tích và giao bài.')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-md inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Đăng nhập vai Giáo viên (1-Click)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-[#0d3b3e] to-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-extrabold uppercase tracking-wider border border-teal-500/30">
              LMS Giáo Dục • GDPT 2018
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">Môn Toán THPT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Giao Đề Kiểm Tra &amp; Phân Tích Sư Phạm
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Phân công đề kiểm tra chuẩn cấu trúc Bộ GD&amp;ĐT cho từng lớp, tự động chấm điểm OMR, 
            trực quan hóa phổ điểm 3 phần và chẩn đoán lỗ hổng kiến thức của học sinh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Giao đề mới</span>
          </button>
          <button
            onClick={handleResetData}
            title="Khôi phục lại bài mẫu và kết quả thi của lớp 12A1"
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/15 cursor-pointer flex items-center gap-1.5"
          >
            <span>Dữ liệu mẫu demo</span>
          </button>
        </div>
      </div>

      {/* Thông báo trạng thái */}
      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice.text}</span>
        </div>
      )}

      {/* Bộ chọn và Tabs bài kiểm tra */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Lọc theo Lớp:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedClassFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedClassFilter === 'ALL'
                    ? 'bg-[#0d3b3e] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả ({assignments.length})
              </button>
              {classes.map((cls) => {
                const count = assignments.filter((a) => a.assignedClass === cls).length;
                return (
                  <button
                    key={cls}
                    onClick={() => setSelectedClassFilter(cls)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedClassFilter === cls
                        ? 'bg-[#0d3b3e] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Lớp {cls} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Tổng cộng: <strong className="text-slate-900">{filteredAssignments.length}</strong> bài kiểm tra
          </div>
        </div>

        {/* Danh sách thẻ bài kiểm tra dạng lưới */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredAssignments.map((asg) => {
            const isSelected = asg.id === selectedAssignmentId;
            const analytics = calculateAssignmentAnalytics(asg.id);
            const compRate = analytics?.completionRate || 0;
            const avg = analytics?.avgScore || 0;

            return (
              <div
                key={asg.id}
                onClick={() => setSelectedAssignmentId(asg.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/40 shadow-sm ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0d3b3e] text-white">
                      Lớp {asg.assignedClass}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {asg.durationMinutes} phút
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {asg.title}
                  </h3>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Hạn nộp: {new Date(asg.deadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      Đã nộp: <strong>{analytics?.submittedCount}/{analytics?.totalStudents}</strong> ({compRate}%)
                    </span>
                    <span className="text-emerald-700 font-bold">
                      Điểm TB: {avg}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-300"
                      style={{ width: `${compRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-semibold text-teal-700 flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Đang xem phân tích' : 'Bấm xem chi tiết'}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAssignment(asg.id, asg.title);
                      }}
                      title="Xóa bài này"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KHU VỰC PHÂN TÍCH SƯ PHẠM CHI TIẾT (ANALYTICS DASHBOARD) */}
      {selectedAnalytics && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header của bài đang chọn */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    Báo cáo Phân tích Điểm Sư phạm
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs font-semibold text-slate-600">
                    Lớp áp dụng: <strong>{selectedAnalytics.assignment.assignedClass}</strong>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedAnalytics.assignment.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedAnalytics.assignment.description}
                </p>
              </div>

              {/* Nút Xuất Bảng Điểm Excel */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => exportGradeSheetToExcel(selectedAnalytics.assignment.id)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  <span>Xuất Bảng Điểm Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* 4 Thẻ KPI chính */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500">Tỉ lệ hoàn thành</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedAnalytics.completionRate}%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {selectedAnalytics.submittedCount} / {selectedAnalytics.totalStudents} học sinh
                </div>
              </div>

              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200">
                <div className="text-[11px] font-semibold text-teal-800">Điểm trung bình lớp</div>
                <div className="text-xl font-extrabold text-teal-900 mt-0.5">
                  {selectedAnalytics.avgScore} <span className="text-xs font-normal text-teal-700">/ 10</span>
                </div>
                <div className="text-[11px] text-teal-700 mt-0.5">
                  Mức khá - tốt
                </div>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <div className="text-[11px] font-semibold text-emerald-800">Điểm cao nhất</div>
                <div className="text-xl font-extrabold text-emerald-900 mt-0.5">
                  {selectedAnalytics.maxScore} <span className="text-xs font-normal text-emerald-700">/ 10</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Thủ khoa lớp
                </div>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                <div className="text-[11px] font-semibold text-amber-800">Điểm thấp nhất</div>
                <div className="text-xl font-extrabold text-amber-900 mt-0.5">
                  {selectedAnalytics.minScore} <span className="text-xs font-normal text-amber-700">/ 10</span>
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  Cần bồi dưỡng thêm
                </div>
              </div>
            </div>
          </div>

          {/* Phổ Điểm & Ma Trận 3 Phần */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột 1: Biểu đồ Phổ Điểm Lớp Học */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-teal-700" />
                    <span>Phổ Điểm Lớp {selectedAnalytics.assignment.assignedClass}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Phân bố học lực theo các thang điểm chuẩn GDPT 2018
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'Xuất sắc (9.0 – 10.0)', count: selectedAnalytics.distribution.excellent, color: 'bg-emerald-600', textColor: 'text-emerald-700' },
                  { label: 'Giỏi (8.0 – 8.75)', count: selectedAnalytics.distribution.good, color: 'bg-teal-600', textColor: 'text-teal-700' },
                  { label: 'Khá (6.5 – 7.75)', count: selectedAnalytics.distribution.fair, color: 'bg-blue-600', textColor: 'text-blue-700' },
                  { label: 'Trung bình (5.0 – 6.25)', count: selectedAnalytics.distribution.average, color: 'bg-amber-500', textColor: 'text-amber-700' },
                  { label: 'Dưới trung bình (< 5.0)', count: selectedAnalytics.distribution.weak, color: 'bg-rose-500', textColor: 'text-rose-700' }
                ].map((tier, idx) => {
                  const pct = selectedAnalytics.submittedCount > 0
                    ? Math.round((tier.count / selectedAnalytics.submittedCount) * 100)
                    : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">{tier.label}</span>
                        <span className={tier.textColor}>
                          <strong>{tier.count}</strong> em ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${tier.color} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cột 2: Ma Trận Năng Lực 3 Phần Thi (Bộ GD&ĐT 2025-2026) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Tỉ Lệ Đạt Theo 3 Phần Cấu Trúc Bộ GD&amp;ĐT</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Đo lường mức độ tiếp thu qua từng hình thức trắc nghiệm mới
                </p>

                <div className="space-y-4 pt-4">
                  {/* Phần I */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">Phần I: Trắc nghiệm 4 lựa chọn (12 câu)</span>
                      <span className="text-teal-700">
                        {selectedAnalytics.partAverages.p1.avg} / 3.0 điểm ({selectedAnalytics.partAverages.p1.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full"
                        style={{ width: `${selectedAnalytics.partAverages.p1.percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Đo năng lực: Nhận biết &amp; Thông hiểu kiến thức trọng tâm
                    </div>
                  </div>

                  {/* Phần II */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">Phần II: Đúng / Sai đa ý (4 câu • 16 ý)</span>
                      <span className="text-blue-700">
                        {selectedAnalytics.partAverages.p2.avg} / 4.0 điểm ({selectedAnalytics.partAverages.p2.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${selectedAnalytics.partAverages.p2.percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Đo năng lực: Suy luận logic, phân tích đa chiều &amp; kiểm tra điều kiện
                    </div>
                  </div>

                  {/* Phần III */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-800">Phần III: Trả lời ngắn / Vận dụng cao (6 câu)</span>
                      <span className="text-amber-700">
                        {selectedAnalytics.partAverages.p3.avg} / 3.0 điểm ({selectedAnalytics.partAverages.p3.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${selectedAnalytics.partAverages.p3.percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Đo năng lực: Giải quyết vấn đề toán học thực tế &amp; tính toán chính xác
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Khuyến nghị Sư phạm & Chẩn đoán Lỗ hổng Kiến thức */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm font-bold text-amber-900">
                Chẩn Đoán Lỗ Hổng Kiến Thức &amp; Khuyến Nghị Sư Phạm (Dành Cho Giáo Viên)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {selectedAnalytics.recommendations.map((rec, i) => (
                <div key={i} className="bg-white/90 p-3.5 rounded-xl border border-amber-200 space-y-1 shadow-2xs">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    {rec.part}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {rec.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* BẢNG ĐIỂM CHI TIẾT TỪNG HỌC SINH */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Bảng Điểm Học Sinh Lớp {selectedAnalytics.assignment.assignedClass}
                </h3>
                <p className="text-xs text-slate-500">
                  Danh sách xếp hạng theo tổng điểm từ cao xuống thấp
                </p>
              </div>
              <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                Sĩ số: {selectedAnalytics.totalStudents} em
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">Hạng</th>
                    <th className="py-3 px-3">Học sinh</th>
                    <th className="py-3 px-3">Tài khoản</th>
                    <th className="py-3 px-3 text-center">Trạng thái</th>
                    <th className="py-3 px-3 text-center">Phần I (3đ)</th>
                    <th className="py-3 px-3 text-center">Phần II (4đ)</th>
                    <th className="py-3 px-3 text-center">Phần III (3đ)</th>
                    <th className="py-3 px-3 text-center">Tổng Điểm</th>
                    <th className="py-3 px-3 text-center">Thời gian</th>
                    <th className="py-3 px-3 text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedAnalytics.studentResults.map((st, idx) => {
                    let rankBadge = { bg: 'bg-slate-100 text-slate-600', text: 'Chưa nộp' };
                    if (st.isSubmitted) {
                      if (st.totalScore >= 9.0) rankBadge = { bg: 'bg-emerald-100 text-emerald-800 font-bold', text: 'Xuất sắc' };
                      else if (st.totalScore >= 8.0) rankBadge = { bg: 'bg-teal-100 text-teal-800 font-bold', text: 'Giỏi' };
                      else if (st.totalScore >= 6.5) rankBadge = { bg: 'bg-blue-100 text-blue-800 font-bold', text: 'Khá' };
                      else if (st.totalScore >= 5.0) rankBadge = { bg: 'bg-amber-100 text-amber-800 font-semibold', text: 'Trung bình' };
                      else rankBadge = { bg: 'bg-rose-100 text-rose-800 font-semibold', text: 'Yếu' };
                    }

                    return (
                      <tr key={st.studentId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{st.name}</div>
                          <div className="text-[10px] text-slate-400">Lớp {st.class}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                          {st.username}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {st.isSubmitted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="w-3 h-3" />
                              Đã nộp
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                              Chưa làm
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-700">
                          {st.isSubmitted ? st.p1Score : '—'}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-700">
                          {st.isSubmitted ? st.p2Score : '—'}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-700">
                          {st.isSubmitted ? st.p3Score : '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {st.isSubmitted ? (
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-600 text-white font-black text-xs shadow-xs">
                              {st.totalScore}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600">
                          {st.isSubmitted ? `${st.durationUsedMinutes} phút` : '—'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] ${rankBadge.bg}`}>
                            {rankBadge.text}
                          </span>
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

      {/* MODAL GIAO ĐỀ KIỂM TRA MỚI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Giao Đề Kiểm Tra Mới Cho Lớp Học
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề bài kiểm tra / nhiệm vụ:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Kiểm tra 1 tiết Đại số & Giải tích — Đề số 03"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Chọn Đề thi chuẩn 2026:
                  </label>
                  <select
                    value={newExamId}
                    onChange={(e) => setNewExamId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-600 text-xs bg-white"
                  >
                    {examsData.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.code} — {ex.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Giao cho Lớp:
                  </label>
                  <select
                    value={newAssignedClass}
                    onChange={(e) => setNewAssignedClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-600 text-xs bg-white font-semibold"
                  >
                    <option value="ALL">Tất cả các lớp</option>
                    {classes.map((c) => (
                      <option key={c} value={c}>
                        Lớp {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Thời lượng làm bài (phút):
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-600 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hạn nộp bài:
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ghi chú / Hướng dẫn học sinh:
                </label>
                <textarea
                  rows="2"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Lưu ý các em tô phiếu trắc nghiệm cẩn thận và điền số thập phân chính xác..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-teal-600 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Tạo &amp; Giao Đề Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
