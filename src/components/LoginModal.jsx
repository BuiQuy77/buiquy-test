import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Lock,
  User,
  Info,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

export default function LoginModal() {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    currentUser,
    isGuest,
    login,
    logout,
    loginNotice,
    setLoginNotice
  } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setErrorMsg('');
    if (setLoginNotice) setLoginNotice('');
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
      setErrorMsg(res.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
    } else {
      setUsername('');
      setPassword('');
      setIsLoginModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Modal */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 text-xl shadow-inner shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Đăng Nhập Hệ Thống</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Cổng xác thực dành cho Giáo viên &amp; Học sinh
              </p>
            </div>
          </div>

          {/* Thông báo yêu cầu đăng nhập nếu có */}
          {loginNotice && (
            <div className="mt-3.5 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2 animate-fadeIn">
              <Info className="w-4 h-4 shrink-0 text-amber-300 mt-0.5" />
              <span className="leading-relaxed">{loginNotice}</span>
            </div>
          )}
        </div>

        {/* Form Đăng Nhập Chính */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fadeIn">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tên đăng nhập / Mã học sinh:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập hoặc mã tài khoản..."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-700 text-xs font-medium bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-700 text-xs font-medium bg-slate-50 focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập</span>
            </button>
          </form>

          {/* Trạng thái hiện tại & Đổi về vai Khách */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!isGuest && currentUser ? (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500">Đang đăng nhập:</div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsLoginModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer transition-colors"
                >
                  Tiếp tục trải nghiệm với vai trò Khách viếng thăm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
