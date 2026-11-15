import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAppConfig } from '../services/customizationService';
import {
  Box,
  Compass,
  TrendingUp,
  GitBranch,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  Layers,
  Calculator,
  Camera,
  FileText,
  Sliders,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  BarChart3,
  Users,
  LogIn,
  LogOut,
  Shield,
  GraduationCap,
  Settings
} from 'lucide-react';

export default function Sidebar({
  activeModule,
  onSelectModule,
  examSubTab = 'catalog',
  onSelectExamSubTab,
  calculusSubTab,
  onSelectCalculusSubTab,
  derivativeSubTab,
  onSelectDerivativeSubTab,
  onOpenDeployModal,
  onOpenCasioModal,
  onOpenAR,
  onOpenProfileModal
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const { currentUser, isGuest, isStudent, isTeacher, setIsLoginModalOpen, logout, promptLoginForFeature } = useAuth();
  const appConfig = getAppConfig();

  const examWorkspaces = [
    {
      id: 'catalog',
      title: 'Kho 15 Đề Ôn Tập 2026',
      meta: 'Bộ đề chuẩn cấu trúc Bộ GD&ĐT',
      icon: Award
    },
    {
      id: 'exam_room',
      title: 'Phòng Thi Thử 90 Phút',
      meta: 'Bấm giờ & Phiếu tô OMR tự chấm',
      icon: Clock
    },
    {
      id: 'solutions',
      title: 'Đáp Án & Lời Giải Chi Tiết',
      meta: 'Bảng đáp án nhanh & giải chi tiết',
      icon: CheckCircle2
    },
    {
      id: 'analytics',
      title: 'Thống Kê Điểm Luyện Đề',
      meta: 'Tiến độ 15 đề & tỉ lệ đúng 3 phần',
      icon: BarChart3
    }
  ];

  const primaryWorkspaces = [
    {
      id: 'curriculum',
      title: 'Danh mục SGK & OCR',
      meta: 'Toán 10, 11, 12 • Bản in & văn bản',
      icon: BookOpen
    },
    {
      id: 'ai_rag',
      title: 'Trợ lý AI RAG Toán THPT',
      meta: 'Hỏi đáp SGK, giải toán & trích dẫn',
      icon: Sparkles
    },
    {
      id: 'real_world_vdc',
      title: 'Bài toán thực tế',
      meta: '15 bài toán tối ưu & mô hình hóa',
      icon: FileText
    },
    {
      id: 'geometry_studio',
      title: 'Vẽ hình học không gian',
      meta: '10 mẫu thiết diện, góc & xuất TikZ',
      icon: Layers
    },
    {
      id: 'casio',
      title: 'Máy tính Casio 580 & 880',
      meta: '4 mô phỏng & 20 quy trình bấm phím',
      icon: Calculator,
      action: onOpenCasioModal
    },
    {
      id: 'ar',
      title: 'Mô hình 3D & WebXR',
      meta: 'Quan sát khối 3D & mã QR thiết bị',
      icon: Camera,
      action: onOpenAR
    }
  ];

  const modules = [
    {
      id: 'part1',
      num: 'I',
      title: 'Khảo sát & Đồ thị hàm số',
      chapter: 'Chương I • Tập 1',
      icon: TrendingUp,
      subTabs: [
        { id: 'all', label: '0. Tất cả mục Chương I (1 khối)' },
        { id: 'monotonicity', label: '1. Bài 1: Đơn điệu & Cực trị' },
        { id: 'optimization', label: '2. Bài 2 & 5: GTLN - GTNN & Tối ưu' },
        { id: 'asymptotes', label: '3. Bài 3: Tiệm cận đứng, ngang, xiên' },
        { id: 'grapher', label: '4. Bài 4: Khảo sát & Vẽ đồ thị' },
        { id: 'exercises', label: '5. Ôn tập cuối chương I' },
        { id: 'theory', label: '6. Bảng tổng kết Chương I' }
      ]
    },
    {
      id: 'part2',
      num: 'IV',
      title: 'Nguyên hàm & Tích phân',
      chapter: 'Chương IV • Tập 2',
      icon: Box,
      subTabs: [
        { id: 'all', label: '0. Tất cả mục Chương IV (1 khối)' },
        { id: 'theory', label: '1. Bài 11: Nguyên hàm & Bảng công thức' },
        { id: 'riemann', label: '2. Bài 12: Tích phân & Tổng Riemann' },
        { id: '3d-solid', label: '3. Bài 13: Diện tích & Khối tròn xoay 3D' },
        { id: 'stem', label: '4. Ứng dụng thực tế STEM (SGK)' },
        { id: 'exercises', label: '5. Ôn tập cuối chương IV' }
      ]
    },
    {
      id: 'part3',
      num: 'V',
      title: 'Phương pháp tọa độ Oxyz',
      chapter: 'Chương V • Tập 2',
      icon: Compass
    },
    {
      id: 'part4',
      num: 'VI',
      title: 'Xác suất có điều kiện',
      chapter: 'Chương VI • Tập 2',
      icon: GitBranch
    }
  ];

  const handleModuleClick = (modId, customAction) => {
    if (customAction) {
      customAction();
    } else {
      onSelectModule(modId);
    }
    setIsOpenMobile(false);
  };

  const handleSubTabClick = (modId, subId) => {
    if (modId === 'part1' && onSelectDerivativeSubTab) {
      onSelectDerivativeSubTab(subId);
    } else if (modId === 'part2' && onSelectCalculusSubTab) {
      onSelectCalculusSubTab(subId);
    }
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile & Split-Screen Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-50 px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            aria-label="Menu"
          >
            {isOpenMobile ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Menu</span>
          </button>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            title="Tài khoản / Phân quyền"
          >
            {isTeacher ? (
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
            ) : isStudent ? (
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="max-w-[70px] truncate">{currentUser?.name || 'Khách'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {isTeacher && (
            <>
              <button
                onClick={() => handleModuleClick('student_management')}
                className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeModule === 'student_management'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                QL Lớp
              </button>
              <button
                onClick={() => handleModuleClick('teacher_assignments')}
                className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeModule === 'teacher_assignments'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Giao bài
              </button>
              <button
                onClick={() => handleModuleClick('admin_customization')}
                className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeModule === 'admin_customization'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Tùy biến
              </button>
            </>
          )}
          <button
            onClick={() => handleModuleClick('curriculum')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeModule === 'curriculum'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            SGK
          </button>
          <button
            onClick={() => handleModuleClick('ai_rag')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeModule === 'ai_rag'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            AI RAG
          </button>
          <button
            onClick={() => handleModuleClick('exam_practice')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeModule === 'exam_practice'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Luyện đề
          </button>
          <button
            onClick={() => handleModuleClick('real_world_vdc')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeModule === 'real_world_vdc'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Thực tế
          </button>
          <button
            onClick={() => handleModuleClick('geometry_studio')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeModule === 'geometry_studio'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Hình 3D
          </button>
          <button
            onClick={() => handleSubTabClick('part1', 'all')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeModule === 'part1'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ch.I
          </button>
          <button
            onClick={() => handleSubTabClick('part2', 'all')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeModule === 'part2'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ch.IV
          </button>
        </div>
      </div>

      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="md:hidden fixed inset-0 bg-slate-900/40 z-40"
        />
      )}

      {/* Left Sidebar Rail */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="px-4 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0d3b3e] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {appConfig?.appName ? appConfig.appName.charAt(0) : 'M'}
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-slate-900 text-base tracking-[-0.02em] truncate">
                {appConfig?.appName || 'MathMate'}
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                {appConfig?.appSubtitle || 'Toán THPT 10–12 • GDPT 2018'}
              </p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-3 bg-slate-50/90 border-b border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    isTeacher ? 'bg-emerald-600' : isStudent ? 'bg-blue-600' : 'bg-slate-400'
                  }`}
                >
                  {isTeacher ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : isStudent ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : (
                    <LogIn className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.name || 'Khách trải nghiệm'}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    {isTeacher && (
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold">
                        Giáo viên
                      </span>
                    )}
                    {isStudent && (
                      <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-bold">
                        Lớp {currentUser.className}
                      </span>
                    )}
                    {isGuest && (
                      <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded font-medium">
                        Khách dùng thử
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {isTeacher && (
                  <button
                    onClick={onOpenProfileModal}
                    title="Cài đặt tên giáo viên & đổi mật khẩu"
                    className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-200/80 rounded transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-2 py-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 hover:bg-slate-200/80 rounded transition-colors cursor-pointer"
                >
                  Đổi vai
                </button>
              </div>
            </div>
            {isGuest && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-1.5 px-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg text-[11px] font-bold text-center transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Đăng nhập 1-Click (Giám khảo)</span>
              </button>
            )}
          </div>

          {/* Teacher LMS Section */}
          <div className="p-3 space-y-1 bg-emerald-50/50 border-b border-emerald-100">
            <div className="px-2.5 py-0.5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-700" />
                Dành cho Giáo viên
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 text-[9px] font-bold">
                LMS
              </span>
            </div>
            <button
              onClick={() => {
                if (isTeacher) {
                  handleModuleClick('student_management');
                } else {
                  promptLoginForFeature('Vui lòng đăng nhập với tài khoản Giáo viên để quản lý học sinh và nạp file Excel.');
                }
              }}
              className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                activeModule === 'student_management'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-800 hover:bg-emerald-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Users
                  className={`w-4 h-4 shrink-0 ${
                    activeModule === 'student_management' ? 'text-white' : 'text-emerald-700'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-snug truncate">
                    Quản lý Lớp &amp; Học sinh
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      activeModule === 'student_management' ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    Nhập Excel, tài khoản &amp; phân lớp
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 ${
                  activeModule === 'student_management' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              />
            </button>

            <button
              onClick={() => {
                if (isTeacher) {
                  handleModuleClick('teacher_assignments');
                } else {
                  promptLoginForFeature('Vui lòng đăng nhập với tài khoản Giáo viên để giao bài và xem phân tích phổ điểm.');
                }
              }}
              className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                activeModule === 'teacher_assignments'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-800 hover:bg-emerald-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <BarChart3
                  className={`w-4 h-4 shrink-0 ${
                    activeModule === 'teacher_assignments' ? 'text-white' : 'text-emerald-700'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-snug truncate">
                    Giao Đề &amp; Phân Tích Điểm
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      activeModule === 'teacher_assignments' ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    Phổ điểm 3 phần &amp; xuất Excel
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 ${
                  activeModule === 'teacher_assignments' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              />
            </button>

            <button
              onClick={() => {
                if (isTeacher) {
                  if (onOpenProfileModal) onOpenProfileModal();
                } else {
                  promptLoginForFeature('Vui lòng đăng nhập với tài khoản Giáo viên để cài đặt hồ sơ.');
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-slate-700 hover:bg-emerald-100/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sliders className="w-4 h-4 shrink-0 text-emerald-700" />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-snug truncate">
                    Hồ sơ Giáo viên &amp; Mật khẩu
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Đổi tên, đơn vị &amp; bảo mật
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            </button>

            <button
              onClick={() => {
                if (isTeacher) {
                  handleModuleClick('admin_customization');
                } else {
                  promptLoginForFeature('Vui lòng đăng nhập với tài khoản Admin để truy cập bảng tùy biến hệ thống.');
                }
              }}
              className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                activeModule === 'admin_customization'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-800 hover:bg-emerald-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Settings
                  className={`w-4 h-4 shrink-0 ${
                    activeModule === 'admin_customization' ? 'text-white' : 'text-emerald-700'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-snug truncate">
                    Tùy Biến Hệ Thống (Admin)
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      activeModule === 'admin_customization' ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    Đổi môn, thêm đề thi &amp; sao lưu
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 shrink-0 ${
                  activeModule === 'admin_customization' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              />
            </button>
          </div>

          {/* Section 1: Primary Workspaces */}
          <div className="p-3 space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400">
              Không gian làm việc
            </div>

            {primaryWorkspaces.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleModuleClick(item.id, item.action)}
                  className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0d3b3e] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-teal-300' : 'text-slate-500'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold leading-snug truncate">
                        {item.title}
                      </div>
                      <div
                        className={`text-[11px] truncate ${
                          isActive ? 'text-slate-300' : 'text-slate-400'
                        }`}
                      >
                        {item.meta}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-slate-300' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200 my-1" />

          {/* Dedicated Exam Practice Section */}
          <div className="p-3 space-y-1 bg-teal-50/40">
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0d3b3e]">
                Luyện đề &amp; Thi thử 2026
              </span>
              <span className="px-1.5 py-0.5 rounded bg-teal-600 text-white text-[9px] font-extrabold">
                15 ĐỀ
              </span>
            </div>

            {examWorkspaces.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === 'exam_practice' && examSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onSelectExamSubTab) {
                      onSelectExamSubTab(item.id);
                    } else {
                      handleModuleClick('exam_practice');
                    }
                    setIsOpenMobile(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0d3b3e] text-white shadow-sm'
                      : 'text-slate-800 hover:bg-teal-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-amber-300' : 'text-teal-700'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-snug truncate">
                        {item.title}
                      </div>
                      <div
                        className={`text-[11px] truncate ${
                          isActive ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {item.meta}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-amber-300' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200 my-1" />

          {/* Section 2: Grade 12 Interactive Chapters */}
          <div className="p-3 space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400">
              Mô phỏng chuyên đề Toán 12
            </div>

            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <div key={m.id} className="space-y-0.5">
                  <button
                    onClick={() => handleModuleClick(m.id)}
                    className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-slate-200' : 'text-slate-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">
                          Ch.{m.num}: {m.title}
                        </div>
                        <div
                          className={`text-[11px] truncate ${
                            isActive ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {m.chapter}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isActive ? 'text-slate-300 rotate-90' : 'text-slate-300'
                      }`}
                    />
                  </button>

                  {isActive && m.subTabs && (
                    <div className="pl-7 pr-1 py-1 space-y-0.5">
                      {m.subTabs.map((sub) => {
                        const isSubActive =
                          (m.id === 'part1' ? derivativeSubTab : calculusSubTab) === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubTabClick(m.id, sub.id)}
                            className={`w-full px-2.5 py-1.5 rounded-md text-left text-[11px] transition-colors cursor-pointer block truncate ${
                              isSubActive
                                ? 'bg-slate-200/80 text-slate-900 font-semibold'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>GDPT 2018 • Toán 10–12</span>
          <button
            onClick={onOpenDeployModal}
            className="text-slate-700 font-semibold hover:underline cursor-pointer"
          >
            Tài liệu kỹ thuật
          </button>
        </div>
      </aside>
    </>
  );
}
