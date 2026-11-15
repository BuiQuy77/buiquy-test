/**
 * Dịch vụ Quản lý Cơ sở Dữ liệu Học sinh & Phân lớp (Offline-First Storage)
 * Hỗ trợ Import/Export Excel (.xlsx) thông qua thư viện SheetJS (window.XLSX)
 */

const STORAGE_KEYS = {
  STUDENTS: 'mathmate_students_db_v1',
  TEACHER: 'mathmate_teacher_profile_v1',
  CURRENT_USER: 'mathmate_current_user_v1'
};

// Dữ liệu mẫu ban đầu để demo và chấm thi nhanh không cần chuẩn bị file
export const DEFAULT_TEACHER = {
  id: 'gv_admin',
  username: 'admin',
  password: '123',
  name: 'Thầy Nguyễn Đức Anh',
  role: 'teacher',
  subject: 'Toán học THPT',
  school: 'Trường THPT Chuyên',
  avatar: '👨‍🏫'
};

export const DEFAULT_STUDENTS = [
  // Lớp 10A1
  { id: 'hs_10a1_01', username: '10a1_01', password: '123', name: 'Trần Quang Anh', class: '10A1', gender: 'Nam', status: 'active', role: 'student' },
  { id: 'hs_10a1_02', username: '10a1_02', password: '123', name: 'Lê Thị Mai', class: '10A1', gender: 'Nữ', status: 'active', role: 'student' },
  { id: 'hs_10a1_03', username: '10a1_03', password: '123', name: 'Vũ Đức Thịnh', class: '10A1', gender: 'Nam', status: 'active', role: 'student' },
  { id: 'hs_10a1_04', username: '10a1_04', password: '123', name: 'Hoàng Bảo Ngọc', class: '10A1', gender: 'Nữ', status: 'active', role: 'student' },
  { id: 'hs_10a1_05', username: '10a1_05', password: '123', name: 'Đặng Tuấn Kiệt', class: '10A1', gender: 'Nam', status: 'active', role: 'student' },

  // Lớp 10A2
  { id: 'hs_10a2_01', username: '10a2_01', password: '123', name: 'Nguyễn Hoàng Nam', class: '10A2', gender: 'Nam', status: 'active', role: 'student' },
  { id: 'hs_10a2_02', username: '10a2_02', password: '123', name: 'Bùi Phương Linh', class: '10A2', gender: 'Nữ', status: 'active', role: 'student' },
  { id: 'hs_10a2_03', username: '10a2_03', password: '123', name: 'Đỗ Minh Quân', class: '10A2', gender: 'Nam', status: 'active', role: 'student' },
  { id: 'hs_10a2_04', username: '10a2_04', password: '123', name: 'Phạm Thùy Dung', class: '10A2', gender: 'Nữ', status: 'active', role: 'student' },

  // Lớp 11A1
  { id: 'hs_11a1_01', username: '11a1_01', password: '123', name: 'Trịnh Quốc Bảo', class: '11A1', gender: 'Nam', status: 'active', role: 'student' },
  { id: 'hs_11a1_02', username: '11a1_02', password: '123', name: 'Nguyễn Hà My', class: '11A1', gender: 'Nữ', status: 'active', role: 'student' },
  { id: 'hs_11a1_03', username: '11a1_03', password: '123', name: 'Trương Công Vinh', class: '11A1', gender: 'Nam', status: 'active', role: 'student' },
  { id: 'hs_11a1_04', username: '11a1_04', password: '123', name: 'Đinh Thảo Vy', class: '11A1', gender: 'Nữ', status: 'active', role: 'student' },

  // Lớp 12A1 (Ôn thi TN THPT 2026)
  { id: 'hs_12a1_01', username: '12a1_01', password: '123', name: 'Phạm Minh Đức', class: '12A1', gender: 'Nam', status: 'active', role: 'student' },
  { id: 'hs_12a1_02', username: '12a1_02', password: '123', name: 'Nguyễn Khánh Huyền', class: '12A1', gender: 'Nữ', status: 'active', role: 'student' },
  { id: 'hs_12a1_03', username: '12a1_03', password: '123', name: 'Lê Hữu Thắng', class: '12A1', gender: 'Nam', status: 'active', role: 'student' },
  { id: 'hs_12a1_04', username: '12a1_04', password: '123', name: 'Trần Diệu Linh', class: '12A1', gender: 'Nữ', status: 'active', role: 'student' },
  { id: 'hs_12a1_05', username: '12a1_05', password: '123', name: 'Nguyễn Văn Hùng', class: '12A1', gender: 'Nam', status: 'active', role: 'student' },
];

export const GUEST_USER = {
  id: 'guest_user',
  username: 'guest',
  name: 'Khách vãng lai (Dùng thử)',
  role: 'guest',
  class: 'Tự do',
  avatar: '👤'
};

// Khởi tạo DB nếu chưa có
export function getStoredStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc database học sinh:', e);
    return DEFAULT_STUDENTS;
  }
}

export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Lỗi ghi database học sinh:', e);
  }
}

export function getStoredTeacher() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(DEFAULT_TEACHER));
      return DEFAULT_TEACHER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_TEACHER;
  }
}

export function saveTeacher(teacher) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHER, JSON.stringify(teacher));
  } catch (e) {
    console.error('Lỗi ghi thông tin giáo viên:', e);
  }
}

// Lấy danh sách tên các lớp học (unique & sắp xếp)
export function getClassesList(students = null) {
  const list = students || getStoredStudents();
  const classesSet = new Set(list.map((s) => (s.class || 'Chưa xếp lớp').trim()));
  return Array.from(classesSet).sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));
}

// Thêm một học sinh mới
export function addSingleStudent(studentData) {
  const current = getStoredStudents();
  const newStudent = {
    id: `hs_${Date.now()}`,
    username: studentData.username.trim(),
    password: studentData.password || '123',
    name: studentData.name.trim(),
    class: studentData.class.trim(),
    gender: studentData.gender || 'Nam',
    status: 'active',
    role: 'student'
  };
  const updated = [newStudent, ...current];
  saveStudents(updated);
  return updated;
}

// Xóa học sinh
export function deleteSingleStudent(studentId) {
  const current = getStoredStudents();
  const updated = current.filter((s) => s.id !== studentId);
  saveStudents(updated);
  return updated;
}

// Khôi phục dữ liệu mẫu
export function resetStudentsToDefault() {
  saveStudents(DEFAULT_STUDENTS);
  return DEFAULT_STUDENTS;
}

/**
 * Đọc file Excel (.xlsx / .xls) do giáo viên tải lên
 * Nhận dạng các cột thông minh (Họ và tên, Lớp, Tên đăng nhập, Mật khẩu...)
 */
export async function importStudentsFromExcel(file) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.XLSX) {
      reject(new Error('Thư viện xử lý Excel (SheetJS) chưa được tải. Vui lòng tải lại trang!'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = window.XLSX.read(data, { type: 'array' });
        
        // Lấy sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Chuyển sang mảng JSON
        const rawRows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!rawRows || rawRows.length < 2) {
          reject(new Error('File Excel rỗng hoặc không có dữ liệu hàng!'));
          return;
        }

        // Tìm hàng tiêu đề (header row)
        let headerRowIndex = -1;
        let colMap = { name: -1, class: -1, username: -1, password: -1, gender: -1 };

        for (let i = 0; i < Math.min(10, rawRows.length); i++) {
          const row = (rawRows[i] || []).map((c) => String(c || '').toLowerCase().trim());
          const nameIdx = row.findIndex((c) => c.includes('họ') || c.includes('tên') || c.includes('name'));
          const classIdx = row.findIndex((c) => c.includes('lớp') || c.includes('class'));
          
          if (nameIdx !== -1 && classIdx !== -1) {
            headerRowIndex = i;
            colMap.name = nameIdx;
            colMap.class = classIdx;
            colMap.username = row.findIndex((c) => c.includes('tài khoản') || c.includes('đăng nhập') || c.includes('mã') || c.includes('user'));
            colMap.password = row.findIndex((c) => c.includes('mật khẩu') || c.includes('pass'));
            colMap.gender = row.findIndex((c) => c.includes('giới tính') || c.includes('phái'));
            break;
          }
        }

        if (headerRowIndex === -1) {
          reject(new Error('Không tìm thấy cột "Họ và tên" và "Lớp" trong file Excel. Vui lòng sử dụng file mẫu chuẩn!'));
          return;
        }

        const newStudents = [];
        const existing = getStoredStudents();
        const existingUsernames = new Set(existing.map((s) => s.username));

        for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
          const row = rawRows[r];
          if (!row || row.length === 0) continue;

          const fullName = String(row[colMap.name] || '').trim();
          const className = String(row[colMap.class] || '').trim().toUpperCase();
          if (!fullName || !className) continue;

          // Tạo username tự động nếu file không có cột username
          let username = colMap.username !== -1 ? String(row[colMap.username] || '').trim() : '';
          if (!username) {
            const cleanClass = className.toLowerCase().replace(/[^a-z0-9]/g, '');
            const countInClass = newStudents.filter((s) => s.class === className).length + 1;
            username = `${cleanClass}_${String(countInClass).padStart(2, '0')}`;
          }

          // Tránh trùng username
          let finalUsername = username;
          let counter = 1;
          while (existingUsernames.has(finalUsername)) {
            finalUsername = `${username}_${counter}`;
            counter++;
          }
          existingUsernames.add(finalUsername);

          const password = colMap.password !== -1 && row[colMap.password] ? String(row[colMap.password]).trim() : '123';
          const gender = colMap.gender !== -1 && row[colMap.gender] ? String(row[colMap.gender]).trim() : 'Nam';

          newStudents.push({
            id: `hs_import_${Date.now()}_${r}`,
            username: finalUsername,
            password: password,
            name: fullName,
            class: className,
            gender: gender,
            status: 'active',
            role: 'student'
          });
        }

        if (newStudents.length === 0) {
          reject(new Error('Không tìm thấy học sinh hợp lệ nào từ file Excel!'));
          return;
        }

        // Ghép với danh sách hiện tại
        const combined = [...newStudents, ...existing];
        saveStudents(combined);
        resolve({
          addedCount: newStudents.length,
          classesCount: getClassesList(newStudents).length,
          classesList: getClassesList(newStudents),
          allStudents: combined
        });
      } catch (err) {
        reject(new Error(`Lỗi phân tích file Excel: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Lỗi khi đọc file trên máy tính!'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Tải về file Excel mẫu chuẩn (.xlsx) có sẵn hướng dẫn và dữ liệu mẫu
 */
export function downloadSampleExcelTemplate() {
  if (typeof window === 'undefined' || !window.XLSX) {
    alert('Thư viện Excel đang tải, vui lòng thử lại sau 2 giây.');
    return;
  }

  const sampleData = [
    ['STT', 'Họ và Tên Học Sinh', 'Lớp', 'Tên Đăng Nhập (Tùy chọn)', 'Mật Khẩu Khởi Tạo', 'Giới Tính', 'Ghi Chú'],
    [1, 'Nguyễn Văn An', '10A1', '10a1_01', '123', 'Nam', 'Học sinh lớp 10'],
    [2, 'Trần Thị Bích', '10A1', '10a1_02', '123', 'Nữ', ''],
    [3, 'Lê Hoàng Cường', '10A1', '10a1_03', '123', 'Nam', ''],
    [4, 'Phạm Ngọc Duyên', '10A2', '10a2_01', '123', 'Nữ', 'Học sinh lớp 10'],
    [5, 'Vũ Thành Đạt', '10A2', '10a2_02', '123', 'Nam', ''],
    [6, 'Đỗ Quỳnh Giang', '11A1', '11a1_01', '123', 'Nữ', 'Học sinh lớp 11'],
    [7, 'Bùi Quốc Hùng', '11A1', '11a1_02', '123', 'Nam', ''],
    [8, 'Đặng Mai Lan', '12A1', '12a1_01', '123', 'Nữ', 'Ôn thi TN THPT 2026'],
    [9, 'Hoàng Minh Quân', '12A1', '12a1_02', '123', 'Nam', 'Ôn thi TN THPT 2026'],
    [10, 'Trương Thùy Trang', '12A1', '12a1_03', '123', 'Nữ', 'Ôn thi TN THPT 2026'],
  ];

  const ws = window.XLSX.utils.aoa_to_sheet(sampleData);

  // Chỉnh độ rộng các cột cho đẹp mắt
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 24 }, // Họ và tên
    { wch: 10 }, // Lớp
    { wch: 22 }, // Tên đăng nhập
    { wch: 18 }, // Mật khẩu
    { wch: 10 }, // Giới tính
    { wch: 25 }, // Ghi chú
  ];

  const wb = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(wb, ws, 'Danh_Sach_Hoc_Sinh');
  window.XLSX.writeFile(wb, 'Mau_Danh_Sach_Hoc_Sinh_MathMate.xlsx');
}
