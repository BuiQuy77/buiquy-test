import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import AddExamModal from './AddExamModal';
import { removeExamPdfFiles } from '../services/pdfStorage';
import {
  getAppConfig,
  saveAppConfig,
  getAllExams,
  getCustomExams,
  addCustomExam,
  deleteCustomExam,
  exportSystemBackupFile,
  importSystemBackupFile,
  resetAllSystemCustomization,
  DEFAULT_APP_CONFIG
} from '../services/customizationService';
import {
  getStoredLessons,
  switchToPhysicsSubject,
  switchToMathSubject,
  exportLessonsToJsonFile,
  importLessonsFromJsonFile,
  deleteSingleLesson
} from '../services/curriculumDatabase';
import { getStoredTeacher, saveTeacher } from '../services/studentDatabase';
import {
  getCloudSyncConfig,
  saveCloudSyncConfig,
  testConnection,
  pushToCloud,
  pullFromCloud,
  generateShareSyncUrl,
  exportFullBackup,
  importFullBackup,
  subscribeSyncStatus
} from '../services/cloudSyncService';
import {
  Sliders,
  Palette,
  FileText,
  Upload,
  Download,
  RotateCcw,
  PlusCircle,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  BookOpen,
  Layers,
  Settings,
  HelpCircle,
  ExternalLink,
  Save,
  Check,
  Globe,
  Cloud,
  CloudLightning,
  Copy,
  Link,
  Wifi,
  RefreshCw
} from 'lucide-react';

export default function AdminCustomization({ initialTab = 'branding', openAddExamImmediately = false }) {
  const { isTeacher, promptLoginForFeature } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab); // 'branding' | 'exams' | 'sections' | 'backup'
  const [config, setConfig] = useState(DEFAULT_APP_CONFIG);
  const [exams, setExams] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [notice, setNotice] = useState(null);
  const fileInputRef = useRef(null);
  const fileInputCurriculumRef = useRef(null);

  // Form Thêm đề thi mới
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(openAddExamImmediately);
  const [newExamCode, setNewExamCode] = useState('');
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDuration, setNewExamDuration] = useState(90);
  const [newExamPdf, setNewExamPdf] = useState('/bo_de/de_1.pdf');
  const [newSolutionPdf, setNewSolutionPdf] = useState('/bo_de/giai_1.pdf');
  const [newExamHighlights, setNewExamHighlights] = useState('');

  // Đáp án OMR cho đề mới
  const [p1Answers, setP1Answers] = useState(Array(12).fill('A'));
  const [quickPasteP1, setQuickPasteP1] = useState('');
  const [p2Answers, setP2Answers] = useState([
    { a: true, b: false, c: true, d: false },
    { a: true, b: true, c: false, d: true },
    { a: false, b: true, c: true, d: false },
    { a: true, b: false, c: false, d: true }
  ]);
  const [p3Answers, setP3Answers] = useState(['1', '2', '3', '4', '5', '6']);

  const handleQuickPasteP1 = () => {
    const matches = quickPasteP1.toUpperCase().match(/[ABCD]/g);
    if (matches && matches.length > 0) {
      const next = [...p1Answers];
      for (let i = 0; i < Math.min(12, matches.length); i++) {
        next[i] = matches[i];
      }
      setP1Answers(next);
      setQuickPasteP1('');
    }
  };

  const [syncConfig, setSyncConfig] = useState(() => getCloudSyncConfig());
  const [syncEndpoint, setSyncEndpoint] = useState(() => getCloudSyncConfig().endpointUrl || '');
  const [syncStatus, setSyncStatus] = useState({ state: 'idle', message: '', lastSyncTime: null });
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const fullBackupFileRef = useRef(null);

  const loadData = () => {
    const curConfig = getAppConfig();
    setConfig(curConfig);
    const allExams = getAllExams();
    setExams(allExams);
    const allLessons = getStoredLessons();
    setLessons(allLessons);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeSyncStatus((st) => setSyncStatus(st));
    const handleSynced = () => loadData();
    window.addEventListener('mathmate_cloud_synced', handleSynced);
    return () => {
      unsubscribe();
      window.removeEventListener('mathmate_cloud_synced', handleSynced);
    };
  }, []);

  const handleSaveSyncConfig = (e) => {
    e?.preventDefault();
    const updated = saveCloudSyncConfig({
      ...syncConfig,
      endpointUrl: syncEndpoint.trim()
    });
    setSyncConfig(updated);
    setNotice({ type: 'success', text: 'Đã lưu cấu hình kết nối đám mây thành công!' });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testConnection(syncEndpoint.trim());
      setTestResult(res);
      if (res.success) {
        setNotice({ type: 'success', text: 'Kiểm tra kết nối đám mây thành công! Đã sẵn sàng đồng bộ.' });
        setTimeout(() => setNotice(null), 4000);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handlePushCloud = async () => {
    setIsPushing(true);
    try {
      const res = await pushToCloud();
      if (res.success) {
        setNotice({ type: 'success', text: 'Đã đẩy toàn bộ dữ liệu (Slide, Học sinh, Cấu hình) lên Đám mây thành công!' });
      } else {
        alert(res.message || 'Lỗi đẩy dữ liệu lên đám mây!');
      }
    } finally {
      setIsPushing(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handlePullCloud = async () => {
    setIsPulling(true);
    try {
      const res = await pullFromCloud(false);
      if (res.success) {
        loadData();
        setNotice({ type: 'success', text: 'Đã kéo và cập nhật dữ liệu mới nhất từ Đám mây về máy này thành công!' });
      } else {
        alert(res.message || 'Lỗi kéo dữ liệu từ đám mây!');
      }
    } finally {
      setIsPulling(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleCopySyncLink = () => {
    const url = generateShareSyncUrl();
    if (!url) {
      alert('Lỗi tạo link đồng bộ!');
      return;
    }
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => {
      prompt('Sao chép đường link đồng bộ dưới đây và mở trên máy tính khác:', url);
    });
  };

  const handleExportFull = () => {
    exportFullBackup();
    setNotice({ type: 'success', text: 'Đã xuất toàn bộ dữ liệu hệ thống (.json) thành công!' });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleImportFull = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importFullBackup(event.target.result);
      if (res.success) {
        loadData();
        setNotice({ type: 'success', text: 'Đã khôi phục toàn bộ hệ thống từ file (.json) và đồng bộ lên đám mây!' });
        setTimeout(() => setNotice(null), 4000);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveConfig = (e) => {
    e?.preventDefault();
    saveAppConfig(config);
    setNotice({ type: 'success', text: 'Đã lưu cấu hình nhận diện & môn học thành công!' });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!newExamTitle.trim()) {
      alert('Vui lòng nhập tên đề thi!');
      return;
    }

    const res = addCustomExam({
      code: newExamCode || `ĐỀ SỐ ${exams.length + 1}`,
      title: newExamTitle,
      duration: newExamDuration,
      examPdf: newExamPdf,
      solutionPdf: newSolutionPdf,
      highlights: newExamHighlights,
      answers: {
        part1: p1Answers,
        part2: p2Answers,
        part3: p3Answers
      }
    });

    if (res.success) {
      loadData();
      setIsAddExamModalOpen(false);
      setNewExamCode('');
      setNewExamTitle('');
      setNewExamHighlights('');
      setNotice({ type: 'success', text: `Đã thêm thành công: "${res.exam.code} — ${res.exam.title}"!` });
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleDeleteExam = (examId, title) => {
    if (window.confirm(`Thầy có chắc chắn muốn xóa đề thi: "${title}"?`)) {
      deleteCustomExam(examId);
      removeExamPdfFiles(examId);
      loadData();
      setNotice({ type: 'success', text: 'Đã xóa đề thi thành công.' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleBackupExport = () => {
    exportSystemBackupFile();
    setNotice({ type: 'success', text: 'Đã xuất file sao lưu cấu hình (.json) thành công!' });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleBackupImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importSystemBackupFile(event.target.result);
      if (res.success) {
        loadData();
        setNotice({ type: 'success', text: res.message });
        setTimeout(() => setNotice(null), 4000);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetSystem = () => {
    if (window.confirm('Khôi phục toàn bộ nhận diện và đề thi về cấu hình gốc ban đầu (Môn Toán THPT)?')) {
      resetAllSystemCustomization();
      loadData();
      setNotice({ type: 'success', text: 'Đã khôi phục cài đặt gốc thành công.' });
      setTimeout(() => setNotice(null), 3500);
    }
  };

  if (!isTeacher) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl border border-amber-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <Settings className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Khu vực Tùy biến Hệ thống dành cho Quản trị viên
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Vui lòng đăng nhập với tài khoản Giáo viên / Admin để tùy biến nhận diện môn học, chỉnh sửa ngân hàng câu hỏi và sao lưu hệ thống.
        </p>
        <button
          onClick={() => promptLoginForFeature('Vui lòng đăng nhập tài khoản Giáo viên để truy cập bảng tùy biến Admin.')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-md inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Đăng nhập vai Admin (1-Click)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-teal-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-extrabold uppercase tracking-wider border border-teal-500/30">
              Admin Dashboard • Tùy Biến
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-300 text-xs">Mô hình White-Label Đa Môn Học</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tùy Biến Nền Tảng &amp; Ngân Hàng Đề Thi
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Chủ động đổi tên môn học (Toán, Lý, Hóa...), tùy chỉnh thương hiệu và tiêu đề các mục,
            bổ sung đề thi mới kèm bảng đáp án tự chấm OMR, sao lưu và chuyển giao hệ thống dễ dàng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleResetSystem}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/15 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục gốc</span>
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

      {/* 6 Tabs Điều Khiển Admin */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'branding', label: '1. Nhận diện & Môn học', icon: Palette },
          { id: 'cloud_sync', label: '2. Đồng Bộ Đám Mây (Live Sync)', icon: Globe },
          { id: 'curriculum', label: '3. Quản lý Sách Giáo Khoa (SGK)', icon: BookOpen },
          { id: 'exams', label: '4. Ngân hàng Đề & Đáp án OMR', icon: Award },
          { id: 'sections', label: '5. Tùy biến Tiêu đề Phân hệ', icon: Layers },
          { id: 'backup', label: '6. Sao lưu & Chuyển giao (.json)', icon: Download }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: NHẬN DIỆN & MÔN HỌC */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-teal-700" />
              <span>Thông Tin Thương Hiệu &amp; Môn Học Phụ Trách</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cho phép giáo viên môn khác (Vật lý, Hóa học...) hoặc trường học khác đổi nhận diện toàn diện
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên nền tảng (Platform Name):
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                placeholder="VD: MathMate, PhysMate, STEM-Hub..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên Môn học chính:
              </label>
              <input
                type="text"
                value={config.subjectName}
                onChange={(e) => setConfig({ ...config, subjectName: e.target.value })}
                placeholder="VD: Toán học, Vật lý, Hóa học..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Dòng khẩu hiệu phụ (Subtitle):
              </label>
              <input
                type="text"
                value={config.appSubtitle}
                onChange={(e) => setConfig({ ...config, appSubtitle: e.target.value })}
                placeholder="VD: Toán THPT 10–12 • GDPT 2018"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Khối lớp áp dụng:
              </label>
              <input
                type="text"
                value={config.gradeLevels}
                onChange={(e) => setConfig({ ...config, gradeLevels: e.target.value })}
                placeholder="VD: 10–12 hoặc Lớp 12"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-medium text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Thông điệp chào mừng tại Trang chủ:
              </label>
              <input
                type="text"
                value={config.welcomeMessage}
                onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                placeholder="Thông điệp hiển thị trên banner chính..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cài Đặt Nhận Diện</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ĐỒNG BỘ ĐÁM MÂY (LIVE CLOUD SYNC) */}
      {activeTab === 'cloud_sync' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Trạng thái trực tiếp */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-teal-800/50 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-extrabold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-300" />
                    Đồng Bộ Đa Thiết Bị • Web Động
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-teal-200 text-xs">Realtime Cloud Sync</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Đồng Bộ Dữ Liệu Đám Mây &amp; Quản Trị Trung Tâm
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Khi Admin thêm link slide HTML, đổi tên giáo viên, tạo học sinh hay sửa bài tập trên một máy tính bất kỳ, dữ liệu sẽ tự động lưu lên đám mây và đồng bộ sang tất cả máy tính khác.
                </p>
              </div>

              {/* Status Badge */}
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 min-w-[220px] space-y-1.5">
                <div className="text-[11px] text-slate-300 font-medium">Trạng thái kết nối:</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      syncStatus.state === 'synced'
                        ? 'bg-emerald-400 animate-pulse'
                        : syncStatus.state === 'syncing'
                        ? 'bg-blue-400 animate-spin'
                        : syncStatus.state === 'error'
                        ? 'bg-rose-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span className="font-extrabold text-xs text-white">
                    {syncStatus.state === 'synced'
                      ? 'Đã Đồng Bộ Với Đám Mây'
                      : syncStatus.state === 'syncing'
                      ? 'Đang Đồng Bộ Dữ Liệu...'
                      : syncStatus.state === 'error'
                      ? 'Lỗi Kết Nối Máy Chủ'
                      : 'Chế Độ Ngoại Tuyến (Offline)'}
                  </span>
                </div>
                {syncStatus.lastSyncTime && (
                  <div className="text-[10px] text-teal-200">
                    Lần cuối: {new Date(syncStatus.lastSyncTime).toLocaleTimeString('vi-VN')}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="pt-3 border-t border-teal-800/40 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handlePullCloud}
                disabled={isPulling}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPulling ? 'animate-spin' : ''}`} />
                <span>{isPulling ? 'Đang kéo dữ liệu...' : 'Kéo dữ liệu từ Đám mây về máy này'}</span>
              </button>

              <button
                type="button"
                onClick={handlePushCloud}
                disabled={isPushing}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CloudLightning className={`w-3.5 h-3.5 text-amber-300 ${isPushing ? 'animate-spin' : ''}`} />
                <span>{isPushing ? 'Đang đẩy lên...' : 'Đẩy toàn bộ dữ liệu máy này lên Đám mây'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySyncLink}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Link className="w-3.5 h-3.5 text-teal-300" />
                <span>{copiedLink ? '✓ Đã sao chép Link đồng bộ!' : 'Sao chép Link Đồng Bộ 1-Chạm'}</span>
              </button>
            </div>
          </div>

          {/* Form Cấu hình Máy chủ Đám mây */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-teal-700" />
                <span>Cấu Hình Máy Chủ Cơ Sở Dữ Liệu Đám Mây (Google Firebase)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Khuyên dùng Google Firebase Realtime Database: Hoàn toàn miễn phí, tốc độ cao dưới 50ms và không giới hạn thiết bị truy cập.
              </p>
            </div>

            <form onSubmit={handleSaveSyncConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Đường dẫn Cơ Sở Dữ Liệu (Firebase Database URL / REST API):
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={syncEndpoint}
                    onChange={(e) => setSyncEndpoint(e.target.value)}
                    placeholder="VD: https://buiquy-test-default-rtdb.firebaseio.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-mono text-slate-900 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Đường dẫn này sẽ được dùng chung cho tất cả các máy tính để tự động tải &amp; cập nhật dữ liệu.
                </p>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 animate-fadeIn ${
                    testResult.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{testResult.message}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <Activity className={`w-4 h-4 text-teal-600 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối (Health Check)'}</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Cấu Hình Kết Nối</span>
                </button>
              </div>
            </form>
          </div>

          {/* Hướng dẫn 3 Bước Cài Đặt Firebase Miễn Phí Vĩnh Viễn */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Hướng Dẫn 3 Bước Tạo Cơ Sở Dữ Liệu Firebase Miễn Phí (Chỉ mất 1 phút)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                <div className="font-extrabold text-amber-800">Bước 1: Tạo dự án</div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Truy cập <strong>console.firebase.google.com</strong> bằng Gmail bất kỳ, bấm <strong>Thêm dự án</strong> (ví dụ đặt tên: <code>toan-buiquy</code>).
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                <div className="font-extrabold text-amber-800">Bước 2: Tạo Realtime Database</div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Ở menu bên trái, chọn <strong>Build &gt; Realtime Database &gt; Tạo cơ sở dữ liệu</strong>. Chọn chế độ <strong>Start in test mode</strong> (Quy tắc <code>.read: true, .write: true</code>).
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-1">
                <div className="font-extrabold text-amber-800">Bước 3: Dán link vào web</div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Copy link URL hiển thị ở trên (dạng <code>https://ten-du-an-default-rtdb.firebaseio.com</code>) và dán vào ô bên trên rồi bấm <strong>Lưu cấu hình</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Phương Án Dự Phòng: Xuất / Nạp File JSON & Link Đồng Bộ */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-teal-700" />
                <span>Phương Án Chuyển Dữ Liệu Tức Thì (Không Cần Cài Đặt)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nếu chưa thiết lập Firebase, Thầy cô có thể chuyển toàn bộ Slide và Cấu hình sang máy khác trong 2 giây bằng Link hoặc File sao lưu:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Box 1: Link đồng bộ */}
              <div className="p-4 rounded-xl border border-teal-100 bg-teal-50/50 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="font-extrabold text-teal-900 flex items-center gap-1.5">
                    <Link className="w-4 h-4 text-teal-700" />
                    <span>Cách 1: Mở Link Đồng Bộ Trên Máy Khác</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Hệ thống sẽ nén toàn bộ Slide HTML, hồ sơ giáo viên vào 1 đường link duy nhất. Khi mở link này trên máy tính khác, toàn bộ slide sẽ tự động nạp vào máy đó.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySyncLink}
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? '✓ Đã sao chép link!' : 'Sao chép Link Đồng Bộ 1-Chạm'}</span>
                </button>
              </div>

              {/* Box 2: Xuất nạp file */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <span>Cách 2: Xuất / Nạp Gói Dữ Liệu Hệ Thống (.json)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Tải về 1 file sao lưu đầy đủ chứa toàn bộ Slide, Danh sách học sinh, Đề thi và Cấu hình để nạp sang bất kỳ thiết bị nào.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportFull}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất File .json</span>
                  </button>
                  <input
                    type="file"
                    accept=".json"
                    ref={fullBackupFileRef}
                    onChange={handleImportFull}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fullBackupFileRef.current?.click()}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nạp File .json</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUẢN LÝ SÁCH GIÁO KHOA (SGK) & DỮ LIỆU BÀI HỌC */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-700" />
                  <span>Quản Lý Dữ Liệu Sách Giáo Khoa &amp; Chuyển Đổi Môn Học</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thay đổi dữ liệu nguồn SGK sang môn khác (Vật lý 12, Hóa học...) hoặc tự nạp file JSON bài học
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportLessonsToJsonFile}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
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
                        loadData();
                        setNotice({ type: 'success', text: `Đã nạp thành công ${res.count} bài học từ file JSON!` });
                        setTimeout(() => setNotice(null), 5000);
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
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Nạp file SGK (.json)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2 Thẻ Preset chuyển đổi 1-Click */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Vật Lý 12 */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-blue-700/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 uppercase tracking-wider">
                    Preset Mẫu Có Sẵn
                  </span>
                  <span className="text-xl">⚡</span>
                </div>
                <h4 className="font-extrabold text-base text-white">
                  Bộ SGK Vật Lý 12 (Chuẩn GDPT 2018)
                </h4>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Thay toàn bộ dữ liệu sách Toán bằng 4 chương Vật Lý 12 mới:
                  <br />• Chương I: Vật lý nhiệt (Nội năng, Thang nhiệt độ, Nhiệt dung riêng)
                  <br />• Chương II: Khí lý tưởng (Thuyết ĐHPT, Định luật Boyle, Charles)
                  <br />• Chương III: Từ trường (Cảm ứng từ, Lực từ, Định luật Faraday)
                  <br />• Chương IV: Hạt nhân nguyên tử (Năng lượng liên kết, Phóng xạ)
                </p>
              </div>

              <button
                onClick={() => {
                  switchToPhysicsSubject();
                  loadData();
                  setNotice({ type: 'success', text: 'Đã chuyển đổi thành công toàn bộ SGK sang Môn Vật Lý 12!' });
                  setTimeout(() => setNotice(null), 5000);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Áp dụng SGK Vật Lý 12 (1-Click)</span>
              </button>
            </div>

            {/* Card Toán Học 12 */}
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-teal-700/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30 uppercase tracking-wider">
                    Preset Mẫu Gốc
                  </span>
                  <span className="text-xl">📐</span>
                </div>
                <h4 className="font-extrabold text-base text-white">
                  Bộ SGK Toán Học THPT (Chuẩn GDPT 2018)
                </h4>
                <p className="text-xs text-teal-200 leading-relaxed">
                  Dữ liệu sách Toán học gốc Kết Nối Tri Thức 10-11-12:
                  <br />• Chương I: Ứng dụng đạo hàm khảo sát hàm số
                  <br />• Chương II: Vectơ và hệ tọa độ trong không gian Oxyz
                  <br />• Chương III: Các số đặc trưng đo mức độ phân tán
                  <br />• Chương IV: Nguyên hàm &amp; Tích phân
                </p>
              </div>

              <button
                onClick={() => {
                  switchToMathSubject();
                  loadData();
                  setNotice({ type: 'success', text: 'Đã khôi phục thành công toàn bộ SGK sang Môn Toán Học THPT!' });
                  setTimeout(() => setNotice(null), 5000);
                }}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Khôi phục SGK Toán Học (1-Click)</span>
              </button>
            </div>
          </div>

          {/* Danh sách bài học đang có trong hệ thống */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="font-bold text-slate-900 text-xs">
                Danh Sách Bài Học Hiện Tại Trong Hệ Thống ({lessons.length} bài)
              </h4>
              <span className="text-[11px] text-slate-500">
                Môn: <strong>{config.subjectName}</strong>
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {lessons.map((ls, idx) => (
                <div
                  key={ls.id || idx}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <span className="font-bold text-[#0d3b3e] text-[11px] shrink-0">
                      {ls.number}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {ls.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {ls.chapter} • Tr.{ls.startPage}-{ls.endPage}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Xóa bài học "${ls.title}"?`)) {
                        deleteSingleLesson(ls.id);
                        loadData();
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Xóa bài này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NGÂN HÀNG ĐỀ & ĐÁP ÁN OMR */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-700" />
                <span>Ngân Hàng Đề Thi &amp; Đáp Án Tự Chấm OMR</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tổng cộng có <strong className="text-slate-900">{exams.length}</strong> đề thi trong hệ thống (gồm 15 đề gốc và các đề giáo viên tự bổ sung)
              </p>
            </div>

            <button
              onClick={() => setIsAddExamModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm Đề Thi Mới</span>
            </button>
          </div>

          {/* Danh sách đề thi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0d3b3e] text-white">
                      {ex.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {ex.isCustom ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Do GV Tự Thêm
                        </span>
                      ) : (
                        <span>Đề chuẩn 2026</span>
                      )}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {ex.title}
                  </h4>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Thời lượng: {ex.duration} phút</span>
                    <span>•</span>
                    <span>{ex.examPages} trang</span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                    {ex.highlights}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: #{ex.id}
                  </span>
                  {ex.isCustom && (
                    <button
                      onClick={() => handleDeleteExam(ex.id, ex.title)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa đề này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TÙY BIẾN TIÊU ĐỀ PHÂN HỆ */}
      {activeTab === 'sections' && (
        <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-700" />
              <span>Tùy Biến Tên Các Phân Hệ &amp; Menu Điều Hướng</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thích ứng ngôn từ hiển thị phù hợp với đặc thù môn học (Toán, Vật lý, Tin học...)
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên phân hệ Trợ lý AI:
              </label>
              <input
                type="text"
                value={config.aiAssistantTitle}
                onChange={(e) => setConfig({ ...config, aiAssistantTitle: e.target.value })}
                placeholder="VD: Trợ lý AI RAG Toán THPT, Trợ lý AI Vật lý..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên phân hệ Luyện đề &amp; Khảo thí:
              </label>
              <input
                type="text"
                value={config.examSectionTitle}
                onChange={(e) => setConfig({ ...config, examSectionTitle: e.target.value })}
                placeholder="VD: Luyện đề & Thi thử 2026..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên phân hệ Bài toán thực tế / STEM:
              </label>
              <input
                type="text"
                value={config.realWorldSectionTitle}
                onChange={(e) => setConfig({ ...config, realWorldSectionTitle: e.target.value })}
                placeholder="VD: Bài toán thực tế & Mô hình hóa STEM..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên phân hệ Hình học Không gian / Thí nghiệm Ảo:
              </label>
              <input
                type="text"
                value={config.geometrySectionTitle}
                onChange={(e) => setConfig({ ...config, geometrySectionTitle: e.target.value })}
                placeholder="VD: Vẽ hình học không gian 3D, Thí nghiệm Vật lý ảo 3D..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cài Đặt Tiêu Đề</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: SAO LƯU & CHUYỂN GIAO */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-teal-700" />
              <span>Sao Lưu Toàn Bộ &amp; Chuyển Giao Bản Quyền</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Xuất hoặc nạp toàn bộ cấu hình hệ thống, danh sách đề tự tạo và hồ sơ giáo viên ra file JSON
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Xuất file */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  1. Xuất File Sao Lưu Cấu Hình (.json)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tải về một file sao lưu an toàn chứa toàn bộ thiết lập tên trường, môn học, hồ sơ giáo viên và các đề thi mới đã tạo.
                </p>
              </div>

              <button
                onClick={handleBackupExport}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-400" />
                <span>Tải File Sao Lưu (.json)</span>
              </button>
            </div>

            {/* Box Nạp file */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  2. Khôi Phục Cấu Hình Từ File (.json)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chọn một file sao lưu từ máy tính để khôi phục nhanh cấu hình khi chuyển sang thiết bị mới hoặc cài đặt cho giáo viên khác.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleBackupImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Chọn File JSON Để Nạp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM ĐỀ THI MỚI KÈM ĐÁP ÁN OMR */}
      <AddExamModal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        onExamAdded={(newExam) => {
          loadData();
          setNotice({ type: 'success', text: `Đã thêm thành công: "${newExam.code} — ${newExam.title}"!` });
          setTimeout(() => setNotice(null), 4000);
        }}
      />
    </div>
  );
}
