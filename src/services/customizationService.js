/**
 * Dịch vụ Tùy biến Hệ thống Toàn diện (System Customization Service)
 * Dành cho Admin / Giáo viên: Đổi tên môn học, tùy biến giao diện, thêm đề thi,
 * quản lý ngân hàng đáp án OMR và sao lưu/phục hồi toàn bộ cấu hình.
 */

import defaultExams from '../data/bo_de_2026.json';
import { getStoredTeacher, saveTeacher } from './studentDatabase';

const STORAGE_KEYS = {
  APP_CONFIG: 'mathmate_system_config_v1',
  CUSTOM_EXAMS: 'mathmate_custom_exams_v1'
};

// Cấu hình mặc định của hệ thống
export const DEFAULT_APP_CONFIG = {
  appName: 'MathMate',
  appSubtitle: 'Toán THPT 10–12 • GDPT 2018',
  subjectName: 'Toán học',
  gradeLevels: '10–12',
  schoolName: 'Trường THPT Chuyên',
  brandColor: 'teal', // 'teal' | 'indigo' | 'emerald' | 'amber' | 'blue'
  welcomeMessage: 'Hệ thống Học Liệu Số, Luyện Đề Chuẩn Bộ GD&ĐT & Trợ Lý AI RAG',
  aiAssistantTitle: 'Trợ lý AI RAG Toán THPT',
  aiAssistantDesc: 'Hỏi đáp kiến thức SGK, phương pháp giải & trích dẫn trang tài liệu',
  examSectionTitle: 'Luyện đề & Thi thử 2026',
  examSectionSubtitle: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT gồm 3 phần',
  realWorldSectionTitle: 'Bài toán thực tế & Mô hình hóa',
  geometrySectionTitle: 'Vẽ hình học không gian & 3D'
};

// Đọc cấu hình hệ thống
export function getAppConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(DEFAULT_APP_CONFIG));
      return DEFAULT_APP_CONFIG;
    }
    return { ...DEFAULT_APP_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Lỗi đọc cấu hình hệ thống:', e);
    return DEFAULT_APP_CONFIG;
  }
}

// Lưu cấu hình hệ thống
export function saveAppConfig(newConfig) {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_CONFIG, JSON.stringify(newConfig));
  } catch (e) {
    console.error('Lỗi lưu cấu hình hệ thống:', e);
  }
}

// Đọc danh sách đề thi bổ sung do giáo viên tự tạo
export function getCustomExams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Lưu danh sách đề thi bổ sung
export function saveCustomExams(exams) {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(exams));
  } catch (e) {
    console.error('Lỗi lưu custom exams:', e);
  }
}

// Lấy toàn bộ đề thi (Đề mặc định + Đề bổ sung của giáo viên)
export function getAllExams() {
  const customList = getCustomExams();
  return [...defaultExams, ...customList];
}

// Thêm một đề thi mới vào hệ thống
export function addCustomExam(examData) {
  const customList = getCustomExams();
  const nextId = defaultExams.length + customList.length + 1;
  const teacher = getStoredTeacher();

  const newExam = {
    id: nextId,
    code: examData.code ? examData.code.trim().toUpperCase() : `ĐỀ SỐ ${nextId < 10 ? '0' + nextId : nextId}`,
    title: examData.title.trim(),
    author: teacher?.name || 'Giáo viên phụ trách',
    duration: Number(examData.duration) || 90,
    examPages: Number(examData.examPages) || 5,
    solutionPages: Number(examData.solutionPages) || 10,
    examPdf: examData.examPdf.trim() || '/bo_de/de_1.pdf',
    solutionPdf: examData.solutionPdf.trim() || '/bo_de/giai_1.pdf',
    tags: examData.tags && Array.isArray(examData.tags) ? examData.tags : ['Đề thi mới', 'Khảo sát định kỳ'],
    highlights: examData.highlights || 'Đề kiểm tra tùy biến do giáo viên biên soạn.',
    isCustom: true,
    answers: {
      part1: examData.answers?.part1 || Array(12).fill('A'),
      part2: examData.answers?.part2 || [
        { a: true, b: false, c: true, d: false },
        { a: true, b: true, c: false, d: true },
        { a: false, b: true, c: true, d: false },
        { a: true, b: false, c: false, d: true }
      ],
      part3: examData.answers?.part3 || ['1', '2', '3', '4', '5', '6']
    }
  };

  const updated = [...customList, newExam];
  saveCustomExams(updated);
  return { success: true, exam: newExam };
}

// Xóa một đề thi tự tạo
export function deleteCustomExam(examId) {
  const customList = getCustomExams();
  const updated = customList.filter((e) => e.id !== examId);
  saveCustomExams(updated);
  return { success: true };
}

// Xuất toàn bộ cấu hình hệ thống ra file JSON
export function exportSystemBackupFile() {
  const backupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    config: getAppConfig(),
    teacher: getStoredTeacher(),
    customExams: getCustomExams()
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MathMate_Backup_Config_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Nạp lại cấu hình từ file JSON
export function importSystemBackupFile(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.config) {
      saveAppConfig(data.config);
    }
    if (data.teacher) {
      saveTeacher(data.teacher);
    }
    if (data.customExams && Array.isArray(data.customExams)) {
      saveCustomExams(data.customExams);
    }
    return { success: true, message: 'Đã khôi phục cấu hình hệ thống thành công!' };
  } catch (e) {
    return { success: false, message: 'File cấu hình không hợp lệ hoặc bị lỗi định dạng!' };
  }
}

// Khôi phục tất cả về mặc định ban đầu
export function resetAllSystemCustomization() {
  localStorage.removeItem(STORAGE_KEYS.APP_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_EXAMS);
  return { success: true };
}
