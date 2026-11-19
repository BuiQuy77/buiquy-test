/**
 * Dịch vụ Quản lý Bài tập, Đề kiểm tra & Phân tích Điểm Sư phạm (Offline-First Storage)
 * Hỗ trợ giao bài theo lớp, chấm điểm OMR, thống kê phổ điểm và xuất Excel bảng điểm
 */

import { getStoredStudents } from './studentDatabase';
import { notifyDataChanged } from './cloudSyncService';

const STORAGE_KEYS = {
  ASSIGNMENTS: 'mathmate_assignments_v1',
  SUBMISSIONS: 'mathmate_submissions_v1'
};

// Dữ liệu bài giao mẫu ban đầu
export const DEFAULT_ASSIGNMENTS = [
  {
    id: 'asg_de_01_12a1',
    title: 'Kiểm tra khảo sát định kỳ 90 phút — Đề số 01 (Chuẩn cấu trúc 2026)',
    examId: 1, // Đề 1 trong 15 đề
    assignedClass: '12A1',
    teacherName: 'Thầy Nguyễn Đức Anh',
    createdAt: '2026-11-10T08:00:00.000Z',
    deadline: '2026-11-20T23:59:00.000Z',
    durationMinutes: 90,
    type: 'exam_90',
    description: 'Đề kiểm tra bám sát định dạng cấu trúc mới Bộ GD&ĐT gồm 3 phần: Trắc nghiệm 4 lựa chọn, Đúng/Sai và Trả lời ngắn.',
    status: 'active'
  },
  {
    id: 'asg_de_02_12a1',
    title: 'Luyện tập Chuyên đề Hình học Oxyz & Tích phân — Đề số 02',
    examId: 2,
    assignedClass: '12A1',
    teacherName: 'Thầy Nguyễn Đức Anh',
    createdAt: '2026-11-12T09:00:00.000Z',
    deadline: '2026-11-25T23:59:00.000Z',
    durationMinutes: 90,
    type: 'exam_90',
    description: 'Tập trung các câu vận dụng cao về khối tròn xoay và mặt cầu cắt mặt phẳng.',
    status: 'active'
  },
  {
    id: 'asg_ch1_10a1',
    title: 'Bài tập Tối ưu & Khảo sát ứng dụng thực tế — Lớp 10A1',
    examId: 1,
    assignedClass: '10A1',
    teacherName: 'Thầy Nguyễn Đức Anh',
    createdAt: '2026-11-14T07:30:00.000Z',
    deadline: '2026-11-22T21:00:00.000Z',
    durationMinutes: 45,
    type: 'practice_chapter',
    description: 'Rèn luyện kỹ năng mô hình hóa toán học và giải bài toán cực trị thực tế.',
    status: 'active'
  }
];

// Dữ liệu bài làm mẫu của học sinh lớp 12A1 cho Đề số 01 (để demo BGK xem biểu đồ ngay lập tức)
export const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub_12a1_01',
    assignmentId: 'asg_de_01_12a1',
    studentId: 'hs_12a1_01',
    studentUsername: '12a1_01',
    studentName: 'Phạm Minh Đức',
    studentClass: '12A1',
    examId: 1,
    submittedAt: '2026-11-12T14:35:00.000Z',
    durationUsedMinutes: 82,
    p1Score: 3.0, // 12/12 câu đúng
    p1Correct: 12,
    p2Score: 3.75, // 3 câu full, 1 câu 3 ý
    p3Score: 2.5,  // 5/6 câu đúng
    totalScore: 9.25,
    status: 'completed',
    wrongQuestions: ['Phần III - Câu 4']
  },
  {
    id: 'sub_12a1_02',
    assignmentId: 'asg_de_01_12a1',
    studentId: 'hs_12a1_02',
    studentUsername: '12a1_02',
    studentName: 'Nguyễn Khánh Huyền',
    studentClass: '12A1',
    examId: 1,
    submittedAt: '2026-11-12T15:20:00.000Z',
    durationUsedMinutes: 88,
    p1Score: 2.75, // 11/12
    p1Correct: 11,
    p2Score: 3.25,
    p3Score: 2.5,
    totalScore: 8.5,
    status: 'completed',
    wrongQuestions: ['Phần I - Câu 8', 'Phần II - Câu 3 (ý c)', 'Phần III - Câu 6']
  },
  {
    id: 'sub_12a1_03',
    assignmentId: 'asg_de_01_12a1',
    studentId: 'hs_12a1_03',
    studentUsername: '12a1_03',
    studentName: 'Lê Hữu Thắng',
    studentClass: '12A1',
    examId: 1,
    submittedAt: '2026-11-13T09:15:00.000Z',
    durationUsedMinutes: 76,
    p1Score: 2.5, // 10/12
    p1Correct: 10,
    p2Score: 2.5,
    p3Score: 2.0,
    totalScore: 7.0,
    status: 'completed',
    wrongQuestions: ['Phần I - Câu 3', 'Phần I - Câu 11', 'Phần II - Câu 2', 'Phần III - Câu 2', 'Phần III - Câu 5']
  },
  {
    id: 'sub_12a1_04',
    assignmentId: 'asg_de_01_12a1',
    studentId: 'hs_12a1_04',
    studentUsername: '12a1_04',
    studentName: 'Trần Diệu Linh',
    studentClass: '12A1',
    examId: 1,
    submittedAt: '2026-11-13T10:45:00.000Z',
    durationUsedMinutes: 80,
    p1Score: 2.75,
    p1Correct: 11,
    p2Score: 3.5,
    p3Score: 2.0,
    totalScore: 8.25,
    status: 'completed',
    wrongQuestions: ['Phần I - Câu 9', 'Phần II - Câu 4 (ý b)', 'Phần III - Câu 3', 'Phần III - Câu 6']
  }
  // Lưu ý: Học sinh hs_12a1_05 (Nguyễn Văn Hùng) CHƯA nộp bài để khi người dùng đăng nhập vai này có thể tự nộp bài thử nghiệm!
];

// Khởi tạo và đọc danh sách bài tập đã giao
export function getStoredAssignments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
      return DEFAULT_ASSIGNMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc assignments:', e);
    return DEFAULT_ASSIGNMENTS;
  }
}

// Lưu danh sách bài tập
export function saveAssignments(assignments) {
  try {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    notifyDataChanged('assignments');
  } catch (e) {
    console.error('Lỗi ghi assignments:', e);
  }
}

// Khởi tạo và đọc danh sách bài làm
export function getStoredSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(DEFAULT_SUBMISSIONS));
      return DEFAULT_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc submissions:', e);
    return DEFAULT_SUBMISSIONS;
  }
}

// Lưu danh sách bài làm
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    notifyDataChanged('submissions');
  } catch (e) {
    console.error('Lỗi ghi submissions:', e);
  }
}

// Tạo bài tập mới
export function createAssignment(assignmentData) {
  const current = getStoredAssignments();
  const newAssignment = {
    id: `asg_${Date.now()}`,
    title: assignmentData.title.trim(),
    examId: Number(assignmentData.examId) || 1,
    assignedClass: assignmentData.assignedClass || '12A1',
    teacherName: assignmentData.teacherName || 'Thầy Nguyễn Đức Anh',
    createdAt: new Date().toISOString(),
    deadline: assignmentData.deadline || new Date(Date.now() + 7 * 86400000).toISOString(),
    durationMinutes: Number(assignmentData.durationMinutes) || 90,
    type: assignmentData.type || 'exam_90',
    description: assignmentData.description || 'Đề kiểm tra trực tuyến có chấm điểm tự động OMR.',
    status: 'active'
  };

  const updated = [newAssignment, ...current];
  saveAssignments(updated);
  return { success: true, assignment: newAssignment };
}

// Xóa bài tập
export function deleteAssignment(assignmentId) {
  const current = getStoredAssignments();
  const updated = current.filter((a) => a.id !== assignmentId);
  saveAssignments(updated);

  // Xóa luôn các submission của bài này
  const subs = getStoredSubmissions();
  const updatedSubs = subs.filter((s) => s.assignmentId !== assignmentId);
  saveSubmissions(updatedSubs);

  return { success: true };
}

// Học sinh nộp bài thi
export function submitStudentExam({
  assignmentId,
  studentId,
  studentUsername,
  studentName,
  studentClass,
  examId,
  gradeData,
  durationUsedMinutes = 85,
  wrongQuestions = []
}) {
  const subs = getStoredSubmissions();
  // Xóa bài cũ nếu đã nộp lại
  const filtered = subs.filter(
    (s) => !(s.assignmentId === assignmentId && s.studentId === studentId)
  );

  const newSub = {
    id: `sub_${Date.now()}`,
    assignmentId,
    studentId,
    studentUsername,
    studentName,
    studentClass,
    examId,
    submittedAt: new Date().toISOString(),
    durationUsedMinutes,
    p1Score: gradeData.p1Score || 0,
    p1Correct: gradeData.p1Correct || 0,
    p2Score: gradeData.p2Score || 0,
    p3Score: gradeData.p3Score || 0,
    totalScore: gradeData.totalScore || 0,
    status: 'completed',
    wrongQuestions
  };

  filtered.push(newSub);
  saveSubmissions(filtered);
  return { success: true, submission: newSub };
}

// Lấy danh sách bài tập dành cho một lớp cụ thể
export function getAssignmentsForClass(className) {
  const all = getStoredAssignments();
  if (!className || className === 'ALL' || className === 'Tự do') {
    return all;
  }
  return all.filter((a) => a.assignedClass === className || a.assignedClass === 'ALL');
}

// Lấy bài làm của học sinh cho 1 bài tập
export function getStudentSubmissionForAssignment(assignmentId, studentId) {
  const subs = getStoredSubmissions();
  return subs.find((s) => s.assignmentId === assignmentId && s.studentId === studentId) || null;
}

// Tính toán phân tích sư phạm toàn diện cho một bài tập (Pedagogical Analytics)
export function calculateAssignmentAnalytics(assignmentId) {
  const assignments = getStoredAssignments();
  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) return null;

  const allStudents = getStoredStudents();
  // Lọc học sinh thuộc lớp được giao
  const classStudents = assignment.assignedClass === 'ALL'
    ? allStudents
    : allStudents.filter((s) => s.class === assignment.assignedClass);

  const allSubs = getStoredSubmissions();
  const assignmentSubs = allSubs.filter((s) => s.assignmentId === assignmentId);

  const totalStudents = classStudents.length;
  const submittedCount = assignmentSubs.length;
  const unsubmittedCount = Math.max(0, totalStudents - submittedCount);
  const completionRate = totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;

  // Tính điểm
  const scores = assignmentSubs.map((s) => s.totalScore);
  const avgScore = scores.length > 0
    ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
    : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const minScore = scores.length > 0 ? Math.min(...scores) : 0;

  // Phổ điểm (Score Distribution)
  const distribution = {
    excellent: 0, // >= 9.0 (Xuất sắc)
    good: 0,      // 8.0 - 8.75 (Giỏi)
    fair: 0,      // 6.5 - 7.75 (Khá)
    average: 0,   // 5.0 - 6.25 (Trung bình)
    weak: 0       // < 5.0 (Yếu / Dưới trung bình)
  };

  scores.forEach((sc) => {
    if (sc >= 9.0) distribution.excellent += 1;
    else if (sc >= 8.0) distribution.good += 1;
    else if (sc >= 6.5) distribution.fair += 1;
    else if (sc >= 5.0) distribution.average += 1;
    else distribution.weak += 1;
  });

  // Tỉ lệ hoàn thành theo 3 Phần
  let avgP1 = 0;
  let avgP2 = 0;
  let avgP3 = 0;
  if (assignmentSubs.length > 0) {
    avgP1 = Number((assignmentSubs.reduce((acc, s) => acc + (s.p1Score || 0), 0) / assignmentSubs.length).toFixed(2));
    avgP2 = Number((assignmentSubs.reduce((acc, s) => acc + (s.p2Score || 0), 0) / assignmentSubs.length).toFixed(2));
    avgP3 = Number((assignmentSubs.reduce((acc, s) => acc + (s.p3Score || 0), 0) / assignmentSubs.length).toFixed(2));
  }

  // Danh sách chi tiết cả lớp (kèm học sinh chưa nộp)
  const studentResults = classStudents.map((st) => {
    const sub = assignmentSubs.find((s) => s.studentId === st.id);
    return {
      studentId: st.id,
      name: st.name,
      username: st.username,
      class: st.class,
      gender: st.gender,
      isSubmitted: Boolean(sub),
      totalScore: sub ? sub.totalScore : null,
      p1Score: sub ? sub.p1Score : null,
      p2Score: sub ? sub.p2Score : null,
      p3Score: sub ? sub.p3Score : null,
      durationUsedMinutes: sub ? sub.durationUsedMinutes : null,
      submittedAt: sub ? sub.submittedAt : null,
      wrongQuestions: sub?.wrongQuestions || []
    };
  });

  // Xếp hạng học sinh theo điểm giảm dần
  studentResults.sort((a, b) => {
    if (a.isSubmitted && !b.isSubmitted) return -1;
    if (!a.isSubmitted && b.isSubmitted) return 1;
    return (b.totalScore || 0) - (a.totalScore || 0);
  });

  // Chẩn đoán lỗ hổng kiến thức & Khuyến nghị sư phạm
  const recommendations = [];
  if (avgP3 < 2.0) {
    recommendations.push({
      part: 'Phần III (Trả lời ngắn)',
      text: 'Học sinh còn gặp khó khăn ở các câu hỏi điền số thực tế & vận dụng cao. Giáo viên nên tăng cường luyện tập kỹ năng giải chi tiết và làm tròn số thập phân chính xác.'
    });
  }
  if (avgP2 < 2.8) {
    recommendations.push({
      part: 'Phần II (Đúng / Sai)',
      text: 'Nhiều học sinh mất điểm ở ý (c) và (d) trong các câu Đúng/Sai. Cần rèn luyện tư duy phản biện và bao quát tất cả điều kiện xác định của bài toán.'
    });
  }
  if (avgP1 >= 2.5) {
    recommendations.push({
      part: 'Phần I (Trắc nghiệm cơ bản)',
      text: 'Lớp nắm rất vững kiến thức nhận biết và thông hiểu (tỉ lệ đúng trên 85%). Đạt yêu cầu tốt chuẩn đầu ra.'
    });
  }

  return {
    assignment,
    totalStudents,
    submittedCount,
    unsubmittedCount,
    completionRate,
    avgScore,
    maxScore,
    minScore,
    distribution,
    partAverages: {
      p1: { avg: avgP1, max: 3.0, percent: Math.round((avgP1 / 3.0) * 100) },
      p2: { avg: avgP2, max: 4.0, percent: Math.round((avgP2 / 4.0) * 100) },
      p3: { avg: avgP3, max: 3.0, percent: Math.round((avgP3 / 3.0) * 100) }
    },
    studentResults,
    recommendations
  };
}

// Xuất Bảng điểm bài tập ra file Excel (.xlsx) chuẩn giáo dục
export function exportGradeSheetToExcel(assignmentId) {
  if (typeof window === 'undefined' || !window.XLSX) {
    alert('Thư viện Excel đang tải, vui lòng thử lại sau 2 giây.');
    return;
  }

  const analytics = calculateAssignmentAnalytics(assignmentId);
  if (!analytics) return;

  const { assignment, studentResults, avgScore, maxScore, minScore, completionRate } = analytics;

  // Dòng tiêu đề và dữ liệu
  const headers = [
    'STT',
    'Mã học sinh',
    'Họ và tên',
    'Lớp',
    'Trạng thái',
    'Điểm Phần I (3.0đ)',
    'Điểm Phần II (4.0đ)',
    'Điểm Phần III (3.0đ)',
    'Tổng điểm (10đ)',
    'Thời gian (Phút)',
    'Thời điểm nộp bài',
    'Xếp loại'
  ];

  const rows = studentResults.map((st, index) => {
    let rank = 'Chưa nộp';
    if (st.isSubmitted) {
      if (st.totalScore >= 9.0) rank = 'Xuất sắc';
      else if (st.totalScore >= 8.0) rank = 'Giỏi';
      else if (st.totalScore >= 6.5) rank = 'Khá';
      else if (st.totalScore >= 5.0) rank = 'Trung bình';
      else rank = 'Yếu';
    }

    return [
      index + 1,
      st.username,
      st.name,
      st.class,
      st.isSubmitted ? 'Đã nộp bài' : 'Chưa làm',
      st.isSubmitted ? st.p1Score : '',
      st.isSubmitted ? st.p2Score : '',
      st.isSubmitted ? st.p3Score : '',
      st.isSubmitted ? st.totalScore : '',
      st.isSubmitted ? st.durationUsedMinutes : '',
      st.isSubmitted ? new Date(st.submittedAt).toLocaleString('vi-VN') : '',
      rank
    ];
  });

  // Thông tin tóm tắt ở đầu sheet
  const summaryRows = [
    ['BẢNG ĐIỂM KIỂM TRA & ĐÁNH GIÁ NĂNG LỰC HỌC SINH'],
    [`Bài kiểm tra: ${assignment.title}`],
    [`Lớp áp dụng: ${assignment.assignedClass} | Giáo viên giảng dạy: ${assignment.teacherName}`],
    [`Sĩ số lớp: ${analytics.totalStudents} | Đã nộp: ${analytics.submittedCount} (${completionRate}%)`],
    [`Điểm trung bình: ${avgScore} | Cao nhất: ${maxScore} | Thấp nhất: ${minScore}`],
    [''], // Dòng trống ngăn cách
    headers,
    ...rows
  ];

  const wb = window.XLSX.utils.book_new();
  const ws = window.XLSX.utils.aoa_to_sheet(summaryRows);

  // Đặt độ rộng các cột cho đẹp mắt
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã HS
    { wch: 25 }, // Họ tên
    { wch: 10 }, // Lớp
    { wch: 14 }, // Trạng thái
    { wch: 18 }, // Điểm P1
    { wch: 18 }, // Điểm P2
    { wch: 18 }, // Điểm P3
    { wch: 16 }, // Tổng điểm
    { wch: 16 }, // Thời gian
    { wch: 22 }, // Thời điểm nộp
    { wch: 14 }  // Xếp loại
  ];

  window.XLSX.utils.book_append_sheet(wb, ws, `Bang_Diem_${assignment.assignedClass}`);

  const fileName = `Bang_Diem_${assignment.assignedClass}_${assignment.title.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 30)}.xlsx`;
  window.XLSX.writeFile(wb, fileName);
}

// Khôi phục dữ liệu bài tập và bài làm về mặc định ban đầu
export function resetAssignmentsToDefault() {
  saveAssignments(DEFAULT_ASSIGNMENTS);
  saveSubmissions(DEFAULT_SUBMISSIONS);
  return { success: true };
}
