import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredTeacher, DEFAULT_TEACHER } from '../services/studentDatabase';
import {
  X,
  UserCheck,
  Lock,
  School,
  BookOpen,
  CheckCircle2,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function TeacherProfileModal({ isOpen, onClose }) {
  const { updateTeacherProfile } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [school, setSchool] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const teacher = getStoredTeacher();
      setName(teacher.name || '');
      setUsername(teacher.username || 'admin');
      setPassword(teacher.password || '123');
      setSubject(teacher.subject || 'Toán học THPT');
      setSchool(teacher.school || 'Trường THPT Chuyên');
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập họ và tên giáo viên!');
      return;
    }
    if (!username.trim()) {
      alert('Vui lòng nhập tên đăng nhập admin!');
      return;
    }

    const updated = {
      id: 'gv_admin',
      name: name.trim(),
      username: username.trim(),
      password: password.trim() || '123',
      subject: subject.trim(),
      school: school.trim(),
      role: 'teacher',
      avatar: '👨‍🏫'
    };

    updateTeacherProfile(updated);
    setSuccessMsg('Đã cập nhật hồ sơ Giáo viên & Mật khẩu thành công!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleResetToDefault = () => {
    if (window.confirm(`Khôi phục lại thông tin giáo viên về mặc định (${DEFAULT_TEACHER.name})?`)) {
      setName(DEFAULT_TEACHER.name);
      setUsername(DEFAULT_TEACHER.username);
      setPassword(DEFAULT_TEACHER.password);
      setSubject(DEFAULT_TEACHER.subject);
      setSchool(DEFAULT_TEACHER.school);
      updateTeacherProfile(DEFAULT_TEACHER);
      setSuccessMsg('Đã khôi phục thông tin giáo viên về mặc định!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xl">
              👨‍🏫
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Cài Đặt Hồ Sơ Giáo Viên / Admin
              </h3>
              <p className="text-xs text-teal-200">
                Tùy biến tên hiển thị, đơn vị công tác &amp; mật khẩu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Họ và tên Giáo viên / Chủ sở hữu web:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Thầy Nguyễn Đức Anh hoặc Thầy/Cô..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-teal-600 font-semibold text-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              * Tên này sẽ xuất hiện trên menu, phiếu giao bài tập và thông báo gửi đến học sinh.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Môn giảng dạy:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="VD: Toán học THPT, Vật lý..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 font-medium text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Trường / Đơn vị:
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="VD: THPT Chuyên..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-900 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-700" />
              <span>Tài Khoản Đăng Nhập Quản Trị Viên (Admin)</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Tên đăng nhập (Username):
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  Mật khẩu mới (Password):
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-teal-600 font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc định</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-sm cursor-pointer"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
