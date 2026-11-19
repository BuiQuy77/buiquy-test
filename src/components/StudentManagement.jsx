import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getStoredStudents,
  getClassesList,
  addSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
  resetStudentsToDefault,
  importStudentsFromExcel,
  downloadSampleExcelTemplate
} from '../services/studentDatabase';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogIn,
  GraduationCap,
  Key,
  ShieldAlert,
  Sparkles,
  Pencil,
  X
} from 'lucide-react';

export default function StudentManagement() {
  const { quickLogin, isTeacher, promptLoginForFeature } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
  const fileInputRef = useRef(null);

  // Form thêm học sinh thủ công
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('123');
  const [newStudentGender, setNewStudentGender] = useState('Nam');

  // Form sửa thông tin học sinh
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editGender, setEditGender] = useState('Nam');

  // Load danh sách học sinh từ localStorage
  const reloadData = () => {
    const list = getStoredStudents();
    setStudents(list);
  };

  useEffect(() => {
    reloadData();
    // Lắng nghe sự kiện đồng bộ đám mây để cập nhật danh sách khi máy khác thay đổi
    const handleSync = () => reloadData();
    window.addEventListener('mathmate_cloud_synced', handleSync);
    return () => window.removeEventListener('mathmate_cloud_synced', handleSync);
  }, []);

  const handleOpenEditModal = (st) => {
    setEditingStudent(st);
    setEditName(st.name || '');
    setEditClass(st.class || '');
    setEditUsername(st.username || '');
    setEditPassword(st.password || '123');
    setEditGender(st.gender || 'Nam');
  };

  const handleSaveEditStudent = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editClass.trim()) {
      alert('Vui lòng nhập Họ tên và Lớp học!');
      return;
    }
    const updated = updateSingleStudent(editingStudent.id, {
      name: editName.trim(),
      class: editClass.trim().toUpperCase(),
      username: editUsername.trim() || editingStudent.username,
      password: editPassword.trim() || '123',
      gender: editGender
    });
    setStudents(updated);
    setEditingStudent(null);
    setStatusMessage({
      type: 'success',
      text: `Đã cập nhật thông tin học sinh "${editName}" thành công (đã đồng bộ lên đám mây)!`
    });
  };

  const classesList = getClassesList(students);

  // Lọc học sinh theo Lớp và Từ khóa tìm kiếm
  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClass === 'ALL' || s.class === selectedClass;
    const matchSearch =
      !searchTerm.trim() ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchClass && matchSearch;
  });

  // Xử lý nạp file Excel
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage({ type: 'info', text: 'Đang đọc và phân tích dữ liệu file Excel...' });
    try {
      const res = await importStudentsFromExcel(file);
      reloadData();
      setStatusMessage({
        type: 'success',
        text: `Đã nạp thành công ${res.addedCount} học sinh vào ${res.classesCount} lớp học (${res.classesList.join(', ')})!`
      });
      if (res.classesList.length > 0) {
        setSelectedClass(res.classesList[0]);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi nạp file Excel!' });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Xử lý xóa học sinh
  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${name}" khỏi danh sách?`)) {
      const updated = deleteSingleStudent(id);
      setStudents(updated);
      setStatusMessage({ type: 'success', text: `Đã xóa học sinh ${name}.` });
    }
  };

  // Khôi phục dữ liệu mẫu
  const handleResetDefault = () => {
    if (window.confirm('Khôi phục danh sách học sinh về 4 lớp mẫu (10A1, 10A2, 11A1, 12A1)?')) {
      const def = resetStudentsToDefault();
      setStudents(def);
      setSelectedClass('ALL');
      setStatusMessage({ type: 'success', text: 'Đã khôi phục dữ liệu 4 lớp học mẫu ban đầu!' });
    }
  };

  // Thêm học sinh thủ công
  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentClass.trim()) {
      alert('Vui lòng nhập Họ tên và Lớp học!');
      return;
    }
    const cleanUsername =
      newStudentUsername.trim() ||
      `${newStudentClass.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString().slice(-3)}`;

    const updated = addSingleStudent({
      name: newStudentName,
      class: newStudentClass.toUpperCase(),
      username: cleanUsername,
      password: newStudentPassword || '123',
      gender: newStudentGender
    });
    setStudents(updated);
    setIsAddingModalOpen(false);
    setNewStudentName('');
    setNewStudentUsername('');
    setSelectedClass(newStudentClass.toUpperCase());
    setStatusMessage({ type: 'success', text: `Đã thêm học sinh ${newStudentName} vào lớp ${newStudentClass.toUpperCase()}!` });
  };

  // Nếu là khách, hiển thị cảnh báo
  if (!isTeacher) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4 max-w-2xl mx-auto shadow-sm my-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-3xl">
          🔒
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-extrabold text-slate-900">
            Khu Vực Quản Trị Dành Cho Giáo Viên
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Bạn hiện đang ở chế độ <strong>Khách / Học sinh</strong>. Tính năng quản lý lớp học, phân quyền tài khoản và import danh sách Excel chỉ dành riêng cho tài khoản Giáo viên (Admin).
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => promptLoginForFeature('Vui lòng đăng nhập tài khoản Giáo viên để truy cập khu vực quản trị.')}
            className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập Tài Khoản Giáo Viên</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Banner & Tổng quan */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 text-2xl shadow-inner">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Quản Lý Học Sinh & Phân Lớp
                </h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                  Dành Cho Giáo Viên
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Quản trị tài khoản học sinh, nạp danh sách tự động từ Excel và giao bài tập theo lớp
              </p>
            </div>
          </div>

          {/* Các nút hành động chính */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={downloadSampleExcelTemplate}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Tải về file Excel mẫu có sẵn cấu trúc cột để nhập liệu"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Tải File Mẫu (.xlsx)</span>
            </button>

            <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-teal-500/20">
              <Upload className="w-3.5 h-3.5" />
              <span>Nạp File Excel</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setIsAddingModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Thêm Thủ Công</span>
            </button>
          </div>
        </div>

        {/* 3 Thẻ thống kê nhanh */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-base">
              🧑‍🎓
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Tổng học sinh</p>
              <p className="text-base font-black text-white">{students.length} em</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-base">
              🏫
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Số lớp đã tạo</p>
              <p className="text-base font-black text-white">{classesList.length} lớp</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-base">
              ⚡
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Lớp đang chọn</p>
              <p className="text-base font-black text-white">
                {selectedClass === 'ALL' ? 'Tất cả' : selectedClass} ({filteredStudents.length} em)
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-base">
              🔐
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Mật khẩu mặc định</p>
              <p className="text-base font-black text-white">123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo trạng thái nếu có */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[11px] font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 2. Bộ lọc Tab theo Lớp học & Thanh tìm kiếm */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tabs Lớp học */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedClass('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedClass === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>Tất cả các lớp</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {students.length}
              </span>
            </button>

            {classesList.map((cls) => {
              const count = students.filter((s) => s.class === cls).length;
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-teal-50/70 hover:bg-teal-100 text-teal-800 border border-teal-200/60'
                  }`}
                >
                  <span>Lớp {cls}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20' : 'bg-teal-200/60 text-teal-900'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ô tìm kiếm & Khôi phục mẫu */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên hoặc tài khoản..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <button
              onClick={handleResetDefault}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              title="Khôi phục lại dữ liệu 4 lớp mẫu ban đầu"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Bảng danh sách học sinh */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5 w-12 text-center">STT</th>
                <th className="py-3 px-4">Họ và Tên Học Sinh</th>
                <th className="py-3 px-3 text-center">Lớp</th>
                <th className="py-3 px-3.5">Tên Đăng Nhập</th>
                <th className="py-3 px-3.5 text-center">Mật Khẩu</th>
                <th className="py-3 px-3 text-center">Giới Tính</th>
                <th className="py-3 px-3 text-center">Trạng Thái</th>
                <th className="py-3 px-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    Không tìm thấy học sinh nào phù hợp. Hãy thử nạp file Excel hoặc chọn lớp khác!
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="py-2.5 px-3.5 text-center font-medium text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-base">{st.gender === 'Nữ' ? '👩‍🎓' : '👨‍🎓'}</span>
                      <span>{st.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md font-extrabold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                        {st.class}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-700 font-semibold">
                      {st.username}
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-500">
                      {st.password}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">
                      {st.gender}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Hoạt động
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => quickLogin('student', st.id)}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          title="Đăng nhập thử với tư cách học sinh này để xem giao diện"
                        >
                          <LogIn className="w-3 h-3 text-teal-600" />
                          <span>Vào vai</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(st)}
                          className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Sửa thông tin học sinh (đổi họ tên, lớp, mật khẩu...)"
                        >
                          <Pencil className="w-3.5 h-3.5 text-amber-600" />
                        </button>

                        <button
                          onClick={() => handleDelete(st.id, st.name)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa học sinh này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Học Sinh Mới Thủ Công */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-600" />
                <span>Thêm Học Sinh Mới</span>
              </h3>
              <button
                onClick={() => setIsAddingModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên học sinh (*):
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Nam"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp học (*):
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    placeholder="VD: 10A1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs uppercase focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới tính:
                  </label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-teal-500 bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập (Tùy chọn, để trống sẽ tự tạo):
                </label>
                <input
                  type="text"
                  value={newStudentUsername}
                  onChange={(e) => setNewStudentUsername(e.target.value)}
                  placeholder="VD: 10a1_nam"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu ban đầu:
                </label>
                <input
                  type="text"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  placeholder="123"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20"
                >
                  Thêm Học Sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sửa Thông Tin Học Sinh */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Sửa Thông Tin Thành Viên
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Đổi tên, lớp hoặc đặt lại mật khẩu cho học sinh
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên thành viên / học sinh:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nhập họ và tên mới..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp học:
                  </label>
                  <input
                    type="text"
                    required
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    placeholder="VD: 10A1, 12A1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs uppercase font-extrabold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới tính:
                  </label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="Nam">Nam (👨‍🎓)</option>
                    <option value="Nữ">Nữ (👩‍🎓)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập (Username):
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="VD: 10a1_01"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu đăng nhập:
                </label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
