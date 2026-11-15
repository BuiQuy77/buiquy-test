import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredTeacher } from '../services/studentDatabase';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Info,
  LogIn,
  KeyRound,
  ArrowRight
} from 'lucide-react';

export default function LoginModal() {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    quickLogin,
    loginNotice,
    setLoginNotice
  } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'form'
  const currentTeacher = getStoredTeacher();

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setErrorMsg('');
    setLoginNotice('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập!');
      return;
    }
    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Modal */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-2xl shadow-inner">
              🔐
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Cổng Đăng Nhập Học Tập</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Phân quyền LMS
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Hệ thống Quản lý Học tập & Luyện thi Tốt nghiệp THPT
              </p>
            </div>
          </div>

          {/* Thông báo nếu bị chặn tính năng khách */}
          {loginNotice && (
            <div className="mt-3.5 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-300 mt-0.5" />
              <span>{loginNotice}</span>
            </div>
          )}

          {/* Chuyển Tab */}
          <div className="grid grid-cols-2 gap-1.5 mt-4 p-1 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-bold">
            <button
              onClick={() => { setActiveTab('quick'); setErrorMsg(''); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'quick'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đăng nhập 1-Click (Dành cho Giám Khảo)</span>
            </button>
            <button
              onClick={() => { setActiveTab('form'); setErrorMsg(''); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Nhập Tài Khoản</span>
            </button>
          </div>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6 space-y-4">
          {/* TAB 1: ĐĂNG NHẬP NHANH CHO GIÁM KHẢO */}
          {activeTab === 'quick' && (
            <div className="space-y-3">
              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100 text-xs text-teal-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Chọn nhanh 1 trong các vai trò bên dưới để kiểm thử ngay lập tức mà không cần gõ mật khẩu:
                </span>
              </div>

              {/* Vai trò Giáo viên */}
              <div
                onClick={() => quickLogin('teacher')}
                className="group p-3.5 rounded-2xl border-2 border-purple-200 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                    👨‍🏫
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {currentTeacher?.name || 'Thầy Nguyễn Đức Anh'}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                        Giáo viên (Admin)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Toàn quyền: Quản lý học sinh, import Excel lớp học, giao bài tập
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Vai trò Học sinh Lớp 10A1 */}
              <div
                onClick={() => quickLogin('student', 'hs_10a1_01')}
                className="group p-3.5 rounded-2xl border-2 border-blue-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                    👨‍🎓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Trần Quang Anh
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        Học sinh Lớp 10A1
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Mở khóa toàn bộ học liệu, nhận bài tập được giáo viên giao riêng cho 10A1
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Vai trò Học sinh Lớp 12A1 (Ôn thi tốt nghiệp) */}
              <div
                onClick={() => quickLogin('student', 'hs_12a1_01')}
                className="group p-3.5 rounded-2xl border-2 border-teal-200 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">
                    🧑‍🎓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Phạm Minh Đức
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-700">
                        Học sinh Lớp 12A1
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Tài khoản khối 12: Làm bài thi thử 90 phút, chấm OMR, xem lời giải
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-teal-500 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Khách dùng thử */}
              <div
                onClick={() => quickLogin('guest')}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between text-xs text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <span>Tiếp tục trải nghiệm ở chế độ Khách (Giới hạn tính năng)</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Chọn</span>
              </div>
            </div>
          )}

          {/* TAB 2: NHẬP TÀI KHOẢN & MẬT KHẨU */}
          {activeTab === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tên đăng nhập / Mã học sinh:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="VD: admin hoặc 10a1_01, 12a1_01"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 text-xs font-medium bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mật khẩu:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu (mặc định là 123)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 text-xs font-medium bg-slate-50 focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  * Mật khẩu mặc định cho tất cả tài khoản học sinh là: <strong>123</strong>
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-teal-400" />
                  <span>Đăng Nhập</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
