/**
 * Dịch vụ Quản lý Dữ liệu Sách Giáo Khoa & Bài học (Curriculum & Lessons Database)
 * Hỗ trợ chuyển đổi đa môn học (Toán học, Vật lý, Hóa học...) và tùy biến bài học
 */

import initialMathLessons from '../data/lessons_ocr.json';
import { getAppConfig, saveAppConfig } from './customizationService';

const STORAGE_KEYS = {
  CURRENT_SUBJECT: 'mathmate_curriculum_subject_v1',
  LESSONS_DATA: 'mathmate_curriculum_lessons_v1'
};

// Dữ liệu mẫu môn Vật Lý 12 (Chuẩn Chương trình GDPT 2018 mới nhất)
export const PHYSICS_12_PRESET = [
  // CHƯƠNG I: VẬT LÝ NHIỆT
  {
    id: 'vatly12-bai-1',
    grade: 12,
    volume: 1,
    sourceFile: 'SGK-VatLy12-1.pdf',
    number: 'BÀI 1',
    subject: 'Nhiệt học',
    subjectColor: 'blue',
    startPage: 5,
    endPage: 12,
    title: 'Cấu trúc của chất. Sự chuyển thể',
    subtitle: 'Mô hình động học phân tử, cấu trúc chất rắn, chất lỏng, chất khí và quá trình chuyển thể',
    chapter: 'Chương I: Vật lý nhiệt',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Nội năng', definition: 'Tổng động năng của các phân tử cấu tạo nên vật và thế năng tương tác giữa chúng.' },
      { term: 'Sự nóng chảy', definition: 'Quá trình chuyển từ thể rắn sang thể lỏng của một chất tại nhiệt độ xác định.' }
    ],
    objectives: [
      'Mô tả được cấu trúc của chất rắn, lỏng, khí theo mô hình động học phân tử.',
      'Giải thích được hiện tượng nóng chảy, đông đặc, bay hơi và ngưng tụ.'
    ]
  },
  {
    id: 'vatly12-bai-2',
    grade: 12,
    volume: 1,
    sourceFile: 'SGK-VatLy12-1.pdf',
    number: 'BÀI 2',
    subject: 'Nhiệt học',
    subjectColor: 'blue',
    startPage: 13,
    endPage: 20,
    title: 'Thang nhiệt độ & Đo nhiệt độ',
    subtitle: 'Thang nhiệt độ Celsius, Kelvin và nguyên lý hoạt động của các loại nhiệt kế',
    chapter: 'Chương I: Vật lý nhiệt',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Độ không tuyệt đối', definition: 'Nhiệt độ 0 Kelvin (-273,15 °C), tại đó động năng nhiệt của các phân tử triệt tiêu.' },
      { term: 'Nhiệt kế hồng ngoại', definition: 'Dụng cụ đo nhiệt độ dựa trên bức xạ nhiệt phát ra từ vật thể mà không cần tiếp xúc.' }
    ],
    objectives: [
      'Chuyển đổi chính xác giữa nhiệt độ Celsius (°C) và nhiệt độ tuyệt đối Kelvin (K).',
      'Hiểu nguyên lý hoạt động của nhiệt kế chất lỏng, nhiệt kế điện tử và nhiệt kế quang học.'
    ]
  },
  {
    id: 'vatly12-bai-3',
    grade: 12,
    volume: 1,
    sourceFile: 'SGK-VatLy12-1.pdf',
    number: 'BÀI 3',
    subject: 'Nhiệt học',
    subjectColor: 'blue',
    startPage: 21,
    endPage: 28,
    title: 'Nhiệt dung riêng & Nhiệt nóng chảy riêng',
    subtitle: 'Khái niệm, công thức tính nhiệt lượng Q = mcΔT, Q = λm và bài toán cân bằng nhiệt thực tế',
    chapter: 'Chương I: Vật lý nhiệt',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Nhiệt dung riêng c', definition: 'Nhiệt lượng cần truyền cho 1 kg chất để nhiệt độ của nó tăng thêm 1 K (hoặc 1 °C).' },
      { term: 'Nhiệt nóng chảy riêng λ', definition: 'Nhiệt lượng cần cung cấp cho 1 kg chất nóng chảy hoàn toàn ở nhiệt độ nóng chảy.' }
    ],
    objectives: [
      'Tính toán nhiệt lượng trao đổi trong các quá trình đun nóng và làm nguội.',
      'Thiết kế phương án thí nghiệm đo nhiệt dung riêng của nước.'
    ]
  },

  // CHƯƠNG II: KHÍ LÝ TƯỞNG
  {
    id: 'vatly12-bai-4',
    grade: 12,
    volume: 1,
    sourceFile: 'SGK-VatLy12-1.pdf',
    number: 'BÀI 4',
    subject: 'Khí lý tưởng',
    subjectColor: 'emerald',
    startPage: 33,
    endPage: 40,
    title: 'Mô hình động học phân tử chất khí',
    subtitle: 'Chuyển động Brown, tương tác giữa các phân tử khí và khái niệm khí lý tưởng',
    chapter: 'Chương II: Khí lý tưởng',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Khí lý tưởng', definition: 'Chất khí mà các phân tử được coi là chất điểm và chỉ tương tác khi va chạm đàn hồi.' },
      { term: 'Áp suất chất khí', definition: 'Lực nén do các phân tử khí va chạm tác dụng lên một đơn vị diện tích thành bình.' }
    ],
    objectives: [
      'Nêu được các giả thuyết cơ bản của thuyết động học phân tử chất khí.',
      'Giải thích nguồn gốc gây ra áp suất chất khí lên thành bình chứa.'
    ]
  },
  {
    id: 'vatly12-bai-5',
    grade: 12,
    volume: 1,
    sourceFile: 'SGK-VatLy12-1.pdf',
    number: 'BÀI 5',
    subject: 'Khí lý tưởng',
    subjectColor: 'emerald',
    startPage: 41,
    endPage: 48,
    title: 'Định luật Boyle & Quá trình đẳng nhiệt',
    subtitle: 'Mối liên hệ p.V = const, đường đẳng nhiệt trong hệ tọa độ (p, V) và ứng dụng xi lanh',
    chapter: 'Chương II: Khí lý tưởng',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Quá trình đẳng nhiệt', definition: 'Quá trình biến đổi trạng thái của một khối lượng khí xác định khi nhiệt độ không đổi.' }
    ],
    objectives: [
      'Phát biểu và vận dụng định luật Boyle giải các bài toán nén/dãn khí đẳng nhiệt.',
      'Vẽ và nhận biết đường đẳng nhiệt trên các đồ thị p-V, p-T.'
    ]
  },
  {
    id: 'vatly12-bai-6',
    grade: 12,
    volume: 1,
    sourceFile: 'SGK-VatLy12-1.pdf',
    number: 'BÀI 6',
    subject: 'Khí lý tưởng',
    subjectColor: 'emerald',
    startPage: 49,
    endPage: 56,
    title: 'Định luật Charles & Phương trình Clapeyron - Mendeleev',
    subtitle: 'Phương trình trạng thái khí lý tưởng pV = nRT = (m/M)RT và ứng dụng khí quyển',
    chapter: 'Chương II: Khí lý tưởng',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Hằng số khí lý tưởng R', definition: 'R = 8,31 J/(mol.K), hằng số phổ quát cho mọi chất khí lý tưởng.' }
    ],
    objectives: [
      'Vận dụng phương trình trạng thái khí lý tưởng tính khối lượng riêng và mật độ phân tử khí.',
      'Giải thích hiện tượng khí cầu bay lên khi được nung nóng.'
    ]
  },

  // CHƯƠNG III: TỪ TRƯỜNG
  {
    id: 'vatly12-bai-7',
    grade: 12,
    volume: 2,
    sourceFile: 'SGK-VatLy12-2.pdf',
    number: 'BÀI 7',
    subject: 'Điện từ học',
    subjectColor: 'purple',
    startPage: 60,
    endPage: 68,
    title: 'Từ trường & Cảm ứng từ B',
    subtitle: 'Đường sức từ, vectơ cảm ứng từ B, quy tắc nắm tay phải và từ trường của dòng điện',
    chapter: 'Chương III: Từ trường',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Cảm ứng từ B', definition: 'Đại lượng vectơ đặc trưng cho từ trường về mặt tác dụng lực, đơn vị là Tesla (T).' }
    ],
    objectives: [
      'Xác định chiều vectơ cảm ứng từ của dòng điện chạy trong dây dẫn thẳng và ống dây.',
      'Mô tả các đặc điểm của từ trường đều.'
    ]
  },
  {
    id: 'vatly12-bai-8',
    grade: 12,
    volume: 2,
    sourceFile: 'SGK-VatLy12-2.pdf',
    number: 'BÀI 8',
    subject: 'Điện từ học',
    subjectColor: 'purple',
    startPage: 69,
    endPage: 78,
    title: 'Lực từ & Hiện tượng cảm ứng điện từ',
    subtitle: 'Lực từ F = BIl sinα, từ thông Φ = BS cosα, định luật Faraday và quy tắc Lenz',
    chapter: 'Chương III: Từ trường',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Từ thông', definition: 'Đại lượng đo số đường sức từ xuyên qua một diện tích khung dây, đơn vị Weber (Wb).' },
      { term: 'Định luật Lenz', definition: 'Dòng điện cảm ứng xuất hiện có chiều sao cho từ trường do nó sinh ra chống lại sự biến thiên của từ thông ban đầu.' }
    ],
    objectives: [
      'Tính toán suất điện động cảm ứng trong khung dây quay trong từ trường.',
      'Nêu nguyên tắc hoạt động của máy phát điện xoay chiều và động cơ điện.'
    ]
  },

  // CHƯƠNG IV: HẠT NHÂN NGUYÊN TỬ
  {
    id: 'vatly12-bai-9',
    grade: 12,
    volume: 2,
    sourceFile: 'SGK-VatLy12-2.pdf',
    number: 'BÀI 9',
    subject: 'Vật lý hạt nhân',
    subjectColor: 'rose',
    startPage: 85,
    endPage: 94,
    title: 'Cấu tạo hạt nhân & Năng lượng liên kết',
    subtitle: 'Proton, neutron, lực hạt nhân, độ hụt khối Δm và hệ thức Einstein E = mc²',
    chapter: 'Chương IV: Hạt nhân nguyên tử',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Độ hụt khối', definition: 'Hiệu số giữa tổng khối lượng các nucleon riêng rẽ và khối lượng của hạt nhân tạo thành.' },
      { term: 'Năng lượng liên kết riêng', definition: 'Năng lượng liên kết tính trên một nucleon, đặc trưng cho mức độ bền vững của hạt nhân.' }
    ],
    objectives: [
      'Tính toán năng lượng tỏa ra hoặc thu vào trong phản ứng hạt nhân.',
      'So sánh độ bền vững của các hạt nhân khác nhau dựa vào năng lượng liên kết riêng.'
    ]
  },
  {
    id: 'vatly12-bai-10',
    grade: 12,
    volume: 2,
    sourceFile: 'SGK-VatLy12-2.pdf',
    number: 'BÀI 10',
    subject: 'Vật lý hạt nhân',
    subjectColor: 'rose',
    startPage: 95,
    endPage: 104,
    title: 'Phóng xạ & Năng lượng hạt nhân',
    subtitle: 'Tia alpha, beta, gamma, định luật phóng xạ, chu kỳ bán rã T và phản ứng phân hạch hạt nhân',
    chapter: 'Chương IV: Hạt nhân nguyên tử',
    moduleTarget: 'curriculum',
    terms: [
      { term: 'Chu kỳ bán rã T', definition: 'Thời gian để một nửa số hạt nhân phóng xạ bị phân rã biến đổi thành hạt nhân khác.' },
      { term: 'Phản ứng phân hạch', definition: 'Quá trình một hạt nhân nặng vỡ thành hai mảnh nhẹ hơn và giải phóng các neutron cùng năng lượng khổng lồ.' }
    ],
    objectives: [
      'Vận dụng định luật phóng xạ tính tuổi cổ vật bằng phương pháp đồng vị phóng xạ Carbon-14.',
      'Nêu các ứng dụng của năng lượng hạt nhân và các biện pháp an toàn phóng xạ.'
    ]
  }
];

// Khởi tạo và đọc danh sách bài học hiện tại
export function getStoredLessons() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSONS_DATA);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LESSONS_DATA, JSON.stringify(initialMathLessons));
      return initialMathLessons;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc lessons:', e);
    return initialMathLessons;
  }
}

// Lưu danh sách bài học
export function saveStoredLessons(lessons) {
  try {
    localStorage.setItem(STORAGE_KEYS.LESSONS_DATA, JSON.stringify(lessons));
  } catch (e) {
    console.error('Lỗi ghi lessons:', e);
  }
}

// Chuyển toàn bộ hệ thống sang Môn Vật Lý 12 (1-Click Switch)
export function switchToPhysicsSubject() {
  saveStoredLessons(PHYSICS_12_PRESET);

  const curConfig = getAppConfig();
  const physConfig = {
    ...curConfig,
    appName: 'PhysMate',
    appSubtitle: 'Vật Lý THPT 10–12 • GDPT 2018',
    subjectName: 'Vật lý',
    welcomeMessage: 'Hệ thống Học Liệu Số, Thí Nghiệm Ảo & Luyện Thi Vật Lý THPT GDPT 2018',
    aiAssistantTitle: 'Trợ lý AI RAG Vật Lý THPT',
    aiAssistantDesc: 'Hỏi đáp SGK Vật lý 10-12, hiện tượng vật lý, công thức & bài toán thực tế',
    examSectionTitle: 'Luyện đề & Thi thử Vật Lý 2026',
    examSectionSubtitle: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT gồm 3 phần',
    realWorldSectionTitle: 'Thí nghiệm Vật lý & Mô hình STEM',
    geometrySectionTitle: 'Mô phỏng Chuyển động & Không gian 3D'
  };
  saveAppConfig(physConfig);
  localStorage.setItem(STORAGE_KEYS.CURRENT_SUBJECT, 'physics');

  return { success: true, count: PHYSICS_12_PRESET.length, subject: 'Vật lý' };
}

// Chuyển lại Môn Toán học THPT ban đầu (1-Click Switch)
export function switchToMathSubject() {
  saveStoredLessons(initialMathLessons);

  const curConfig = getAppConfig();
  const mathConfig = {
    ...curConfig,
    appName: 'MathMate',
    appSubtitle: 'Toán THPT 10–12 • GDPT 2018',
    subjectName: 'Toán học',
    welcomeMessage: 'Hệ thống Học Liệu Số, Luyện Đề Chuẩn Bộ GD&ĐT & Trợ Lý AI RAG',
    aiAssistantTitle: 'Trợ lý AI RAG Toán THPT',
    aiAssistantDesc: 'Hỏi đáp kiến thức SGK, phương pháp giải & trích dẫn trang tài liệu',
    examSectionTitle: 'Luyện đề & Thi thử 2026',
    examSectionSubtitle: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT gồm 3 phần',
    realWorldSectionTitle: 'Bài toán thực tế & Mô hình hóa',
    geometrySectionTitle: 'Vẽ hình học không gian & 3D'
  };
  saveAppConfig(mathConfig);
  localStorage.setItem(STORAGE_KEYS.CURRENT_SUBJECT, 'math');

  return { success: true, count: initialMathLessons.length, subject: 'Toán học' };
}

// Thêm bài học mới do giáo viên tự soạn
export function addSingleCustomLesson(lessonData) {
  const current = getStoredLessons();
  const nextId = `custom-lesson-${Date.now()}`;
  const newLesson = {
    id: nextId,
    grade: Number(lessonData.grade) || 12,
    volume: Number(lessonData.volume) || 1,
    number: lessonData.number || `BÀI ${current.length + 1}`,
    subject: lessonData.subject || 'Chuyên đề',
    subjectColor: lessonData.subjectColor || 'teal',
    startPage: Number(lessonData.startPage) || 1,
    endPage: Number(lessonData.endPage) || 10,
    title: lessonData.title.trim(),
    subtitle: lessonData.subtitle || 'Nội dung bài học tự soạn',
    chapter: lessonData.chapter || 'Chuyên đề mở rộng',
    moduleTarget: 'curriculum',
    terms: lessonData.terms || [],
    objectives: lessonData.objectives || ['Nắm vững kiến thức trọng tâm bài học.']
  };

  const updated = [newLesson, ...current];
  saveStoredLessons(updated);
  return { success: true, lesson: newLesson };
}

// Sửa một bài học
export function updateSingleLesson(lessonId, updatedData) {
  const current = getStoredLessons();
  const updated = current.map((l) => (l.id === lessonId ? { ...l, ...updatedData } : l));
  saveStoredLessons(updated);
  return { success: true };
}

// Xóa một bài học
export function deleteSingleLesson(lessonId) {
  const current = getStoredLessons();
  const updated = current.filter((l) => l.id !== lessonId);
  saveStoredLessons(updated);
  return { success: true };
}

// Xuất file dữ liệu bài học (.json)
export function exportLessonsToJsonFile() {
  const lessons = getStoredLessons();
  const jsonStr = JSON.stringify(lessons, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SachGiaoKhoa_BaiHoc_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Nạp file dữ liệu bài học (.json) từ máy tính
export function importLessonsFromJsonFile(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data) && data.length > 0) {
      saveStoredLessons(data);
      return { success: true, count: data.length };
    }
    return { success: false, message: 'File JSON không đúng cấu trúc mảng bài học!' };
  } catch (e) {
    return { success: false, message: 'Lỗi đọc file JSON: Định dạng không hợp lệ.' };
  }
}
