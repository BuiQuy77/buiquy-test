/**
 * lessonMediaData.js
 * Quản lý Đề luyện tập sau bài học và Video tóm tắt bài học chuẩn GDPT 2018
 * Hỗ trợ lưu trữ tùy biến bởi Giáo viên / Admin vào localStorage & Đám mây
 */

import { notifyDataChanged } from '../services/cloudSyncService';

// 1. Kho đề luyện tập mẫu chuẩn mực (có cả Trắc nghiệm 4 lựa chọn, Đúng/Sai và Điền số)
export const DEFAULT_LESSON_QUIZZES = {
  // BÀI 1: TÍNH ĐƠN ĐIỆU VÀ CỰC TRỊ CỦA HÀM SỐ
  'toan12-bai-1': [
    {
      id: 'q1-1',
      type: 'mcq',
      question: 'Cho hàm số $y = f(x)$ có bảng xét dấu đạo hàm như sau:\n\n| $x$ | $-\\infty$ | | $-1$ | | $2$ | | $+\\infty$ |\n| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $f\'(x)$ | | $+$ | $0$ | $-$ | $0$ | $+$ | |\n\nHàm số đã cho đồng biến trên khoảng nào dưới đây?',
      options: ['(2; +\\infty)', '(-1; 2)', '(-\\infty; 2)', '(-1; +\\infty)'],
      correctIndex: 0,
      explanation: 'Dựa vào bảng xét dấu đạo hàm, $f\'(x) > 0$ trên các khoảng $(-\\infty; -1)$ và $(2; +\\infty)$. Do đó hàm số đồng biến trên khoảng $(2; +\\infty)$.'
    },
    {
      id: 'q1-2',
      type: 'mcq',
      question: 'Điểm cực đại của đồ thị hàm số $y = x^3 - 3x + 2$ là điểm nào dưới đây?',
      options: ['M(-1; 4)', 'M(1; 0)', 'x = -1', 'y = 4'],
      correctIndex: 0,
      explanation: 'Ta có $y\' = 3x^2 - 3 = 0 \\iff x = \\pm 1$. Bảng biến thiên cho thấy $y\'$ đổi dấu từ $(+)$ sang $(-)$ khi qua $x = -1$, với $y(-1) = (-1)^3 - 3(-1) + 2 = 4$. Điểm cực đại của ĐỒ THỊ là cặp tọa độ $M(-1; 4)$.'
    },
    {
      id: 'q1-3',
      type: 'tf',
      question: 'Cho hàm số $y = f(x) = \\frac{2x - 1}{x + 1}$. Xét tính đúng/sai của các mệnh đề sau:',
      items: [
        { key: 'a', statement: 'Tập xác định của hàm số là $D = \\mathbb{R} \\setminus \\{-1\\}$.', correct: true },
        { key: 'b', statement: 'Đạo hàm $y\' = \\frac{3}{(x+1)^2} > 0$ với mọi $x \\neq -1$.', correct: true },
        { key: 'c', statement: 'Hàm số đồng biến trên toàn bộ tập xác định $\\mathbb{R} \\setminus \\{-1\\}$.', correct: false, note: 'Sai: Tính đồng biến chỉ kết luận trên từng khoảng rời nhau $(-\\infty; -1)$ và $(-1; +\\infty)$, không dùng kí hiệu hiệu tập hợp hay hợp.' },
        { key: 'd', statement: 'Đồ thị hàm số không có điểm cực trị nào.', correct: true, note: 'Đúng: Vì $y\' > 0$ với mọi $x \\in D$, đạo hàm không triệt tiêu và không đổi dấu nên không có cực trị.' }
      ],
      explanation: 'Hàm phân thức bậc nhất trên bậc nhất $y = \\frac{ax+b}{cx+d}$ luôn đơn điệu trên từng khoảng xác định và không có cực trị.'
    },
    {
      id: 'q1-4',
      type: 'short',
      question: 'Tìm số điểm cực trị của hàm số $y = f(x)$ biết đạo hàm $f\'(x) = x(x - 1)^2(x + 2)^3$.',
      correctAnswer: '2',
      explanation: 'Nghiệm của $f\'(x) = 0$ là $x = 0$ (nghiệm bội 1), $x = 1$ (nghiệm bội chẵn 2), $x = -2$ (nghiệm bội lẻ 3). Đạo hàm chỉ đổi dấu khi đi qua các nghiệm bội lẻ $x = 0$ và $x = -2$. Vậy hàm số có đúng 2 điểm cực trị.'
    }
  ],

  // BÀI 3: ĐƯỜNG TIỆM CẬN CỦA ĐỒ THỊ HÀM SỐ
  'toan12-bai-3': [
    {
      id: 'q3-1',
      type: 'mcq',
      question: 'Phương trình tiệm cận đứng của đồ thị hàm số $y = \\frac{3x + 1}{x - 2}$ là:',
      options: ['x = 2', 'y = 3', 'x = -2', 'y = 2'],
      correctIndex: 0,
      explanation: 'Ta có $\\lim_{x \\to 2^+} \\frac{3x+1}{x-2} = +\\infty$ nên $x = 2$ là đường tiệm cận đứng.'
    },
    {
      id: 'q3-2',
      type: 'mcq',
      question: 'Tìm phương trình đường tiệm cận xiên của đồ thị hàm số $y = f(x) = \\frac{x^2 + 2x - 1}{x + 1}$.',
      options: ['y = x + 1', 'y = x - 1', 'y = x', 'y = 2x + 1'],
      correctIndex: 0,
      explanation: 'Chia đa thức: $\\frac{x^2 + 2x - 1}{x + 1} = x + 1 - \\frac{2}{x + 1}$. Vì $\\lim_{x \\to \\pm\\infty} [f(x) - (x + 1)] = \\lim_{x \\to \\pm\\infty} \\left(-\\frac{2}{x+1}\\right) = 0$ nên tiệm cận xiên là $y = x + 1$.'
    },
    {
      id: 'q3-3',
      type: 'short',
      question: 'Tổng số đường tiệm cận (đứng và ngang) của đồ thị hàm số $y = \\frac{\\sqrt{x^2 - 4}}{x - 3}$ là bao nhiêu?',
      correctAnswer: '3',
      explanation: 'Tập xác định $D = (-\\infty; -2] \\cup [2; +\\infty) \\setminus \\{3\\}$.\n- Tiệm cận đứng: $x = 3$ vì $\\lim_{x \\to 3} y = \\infty$.\n- Tiệm cận ngang: $\\lim_{x \\to +\\infty} y = 1 \\implies y = 1$; $\\lim_{x \\to -\\infty} y = -1 \\implies y = -1$.\nTổng cộng có 3 đường tiệm cận (1 đứng, 2 ngang).'
    }
  ],

  // BÀI 11: NGUYÊN HÀM
  'toan12-bai-11': [
    {
      id: 'q11-1',
      type: 'mcq',
      question: 'Họ nguyên hàm của hàm số $f(x) = 3x^2 + 2\\sin x$ là:',
      options: ['x^3 - 2\\cos x + C', 'x^3 + 2\\cos x + C', '6x - 2\\cos x + C', '3x^3 - 2\\cos x + C'],
      correctIndex: 0,
      explanation: '$\\int (3x^2 + 2\\sin x)\\,dx = 3 \\cdot \\frac{x^3}{3} + 2(-\\cos x) + C = x^3 - 2\\cos x + C$.'
    },
    {
      id: 'q11-2',
      type: 'mcq',
      question: 'Biết $F(x)$ là một nguyên hàm của hàm số $f(x) = e^{2x}$ và $F(0) = \\frac{3}{2}$. Tìm $F(x)$.',
      options: ['F(x) = \\frac{1}{2}e^{2x} + 1', 'F(x) = 2e^{2x} - \\frac{1}{2}', 'F(x) = \\frac{1}{2}e^{2x} + \\frac{3}{2}', 'F(x) = e^{2x} + \\frac{1}{2}'],
      correctIndex: 0,
      explanation: '$F(x) = \\int e^{2x}\\,dx = \\frac{1}{2}e^{2x} + C$. Vì $F(0) = \\frac{1}{2} + C = \\frac{3}{2} \\implies C = 1$. Vậy $F(x) = \\frac{1}{2}e^{2x} + 1$.'
    },
    {
      id: 'q11-3',
      type: 'short',
      question: 'Cho hàm số $F(x)$ thỏa mãn $F\'(x) = 4x^3 - 2x$ và $F(1) = 5$. Tính giá trị của $F(2)$.',
      correctAnswer: '17',
      explanation: '$F(x) = \\int (4x^3 - 2x)\\,dx = x^4 - x^2 + C$. $F(1) = 1 - 1 + C = 5 \\implies C = 5$. Khi đó $F(2) = 2^4 - 2^2 + 5 = 16 - 4 + 5 = 17$.'
    }
  ],

  // BÀI 12: TÍCH PHÂN
  'toan12-bai-12': [
    {
      id: 'q12-1',
      type: 'mcq',
      question: 'Nếu $\\int_0^2 f(x)\\,dx = 3$ và $\\int_0^2 g(x)\\,dx = -2$ thì $\\int_0^2 [2f(x) - 3g(x)]\\,dx$ bằng:',
      options: ['12', '0', '6', '8'],
      correctIndex: 0,
      explanation: 'Theo tính chất tuyến tính: $I = 2\\int_0^2 f(x)\\,dx - 3\\int_0^2 g(x)\\,dx = 2(3) - 3(-2) = 6 + 6 = 12$.'
    },
    {
      id: 'q12-2',
      type: 'short',
      question: 'Tính giá trị tích phân $I = \\int_1^e \\frac{2\\ln x + 1}{x}\\,dx$.',
      correctAnswer: '2',
      explanation: 'Đặt $t = \\ln x \\implies dt = \\frac{1}{x}dx$. Đổi cận: $x = 1 \\implies t = 0; x = e \\implies t = 1$. Khi đó $I = \\int_0^1 (2t + 1)\\,dt = (t^2 + t)\\Big|_0^1 = 1 + 1 = 2$.'
    }
  ],

  // BÀI 13: ỨNG DỤNG HÌNH HỌC CỦA TÍCH PHÂN
  'toan12-bai-13': [
    {
      id: 'q13-1',
      type: 'mcq',
      question: 'Thể tích $V$ của khối tròn xoay tạo thành khi quay hình phẳng giới hạn bởi đồ thị $y = \\sqrt{x}$, trục hoành và hai đường thẳng $x = 0, x = 4$ quanh trục $Ox$ là:',
      options: ['8\\pi', '4\\pi', '16\\pi', '8'],
      correctIndex: 0,
      explanation: 'Công thức $V = \\pi \\int_0^4 (\\sqrt{x})^2\\,dx = \\pi \\int_0^4 x\\,dx = \\pi \\left[\\frac{x^2}{2}\\right]_0^4 = \\pi \\cdot \\frac{16}{2} = 8\\pi$.'
    },
    {
      id: 'q13-2',
      type: 'short',
      question: 'Diện tích hình phẳng giới hạn bởi hai đồ thị hàm số $y = x^2$ và $y = 2x$ bằng bao nhiêu? (Nhập dưới dạng phân số tối giản a/b hoặc số thập phân làm tròn 2 chữ số)',
      correctAnswer: '4/3',
      explanation: 'Phương trình hoành độ giao điểm: $x^2 = 2x \\iff x(x - 2) = 0 \\iff x = 0$ hoặc $x = 2$. Diện tích $S = \\int_0^2 |2x - x^2|\\,dx = (x^2 - x^3/3)\\Big|_0^2 = 4 - 8/3 = 4/3 \\approx 1{,}33$.'
    }
  ],

  // BÀI 18: XÁC SUẤT CÓ ĐIỀU KIỆN
  'toan12-bai-18': [
    {
      id: 'q18-1',
      type: 'mcq',
      question: 'Cho hai biến cố $A$ và $B$ có $P(A) = 0{,}4$, $P(B) = 0{,}5$ và $P(A \\cap B) = 0{,}2$. Xác suất có điều kiện $P(A|B)$ bằng:',
      options: ['0,4', '0,5', '0,2', '0,8'],
      correctIndex: 0,
      explanation: 'Áp dụng công thức xác suất có điều kiện: $P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0{,}2}{0{,}5} = 0{,}4$.'
    },
    {
      id: 'q18-2',
      type: 'short',
      question: 'Gieo một con xúc xắc cân đối. Biết rằng số chấm xuất hiện là số chẵn, tính xác suất để số chấm xuất hiện là số chia hết cho 3. (Viết dưới dạng phân số a/b)',
      correctAnswer: '1/3',
      explanation: 'Không gian biến cố điều kiện $B$ (số chẵn): $B = \\{2, 4, 6\\} \\implies n(B) = 3$. Biến cố $A$ (chia hết cho 3): $A \\cap B = \\{6\\} \\implies n(A \\cap B) = 1$. Vậy $P(A|B) = 1/3$.'
    }
  ]
};

// 2. Danh mục Video tóm tắt bài học chọn lọc (Kèm timestamps & bài giảng trực quan)
export const DEFAULT_LESSON_VIDEOS = {
  'toan12-bai-1': {
    title: 'Tóm Tắt Bài 1: Tính Đơn Điệu & Cực Trị Của Hàm Số',
    author: 'Kênh Học Liệu Số Toán THPT',
    duration: '11:45',
    embedUrl: 'https://www.youtube.com/embed/BvH_m3R2s2w',
    youtubeId: 'BvH_m3R2s2w',
    summaryNotes: [
      'Điều kiện đồng biến: f\'(x) ≥ 0 trên K và f\'(x) = 0 tại hữu hạn điểm.',
      'Điều kiện nghịch biến: f\'(x) ≤ 0 trên K và f\'(x) = 0 tại hữu hạn điểm.',
      'Cực trị: f\'(x) đổi dấu từ (+) sang (-) ⇒ Cực đại; từ (-) sang (+) ⇒ Cực tiểu.',
      'Mẹo Casio: Dùng TABLE quét chiều tăng giảm và dò điểm đổi dấu đạo hàm.'
    ],
    chapters: [
      { time: '00:00', label: '1. Khái niệm hàm đồng biến & nghịch biến' },
      { time: '02:40', label: '2. Định lí dấu đạo hàm cấp 1' },
      { time: '05:30', label: '3. Quy trình 4 bước lập bảng biến thiên' },
      { time: '08:15', label: '4. Khái niệm cực đại, cực tiểu và đồ thị' }
    ]
  },
  'toan12-bai-2': {
    title: 'Tóm Tắt Bài 2: Giá Trị Lớn Nhất & Giá Trị Nhỏ Nhất Của Hàm Số',
    author: 'Toán Học 2018 Kết Nối Tri Thức',
    duration: '09:20',
    embedUrl: 'https://www.youtube.com/embed/8wX8y0H3s_c',
    youtubeId: '8wX8y0H3s_c',
    summaryNotes: [
      'Tìm GTLN/GTNN trên đoạn [a; b]: Tính f(a), f(b) và f(x_i) tại các điểm có f\'(x_i) = 0.',
      'So sánh các giá trị để chọn số lớn nhất (Max) và nhỏ nhất (Min).',
      'Ứng dụng: Bài toán tối ưu hóa chi phí sản xuất, chu vi và thể tích.'
    ],
    chapters: [
      { time: '00:00', label: '1. Định nghĩa Max và Min trên tập D' },
      { time: '03:10', label: '2. Quy tắc tìm Max/Min trên đoạn [a; b]' },
      { time: '06:40', label: '3. Bài toán thực tế gập hộp tôn tối ưu' }
    ]
  },
  'toan12-bai-3': {
    title: 'Tóm Tắt Bài 3: Đường Tiệm Cận Của Đồ Thị Hàm Số',
    author: 'Kênh Học Liệu Số Toán THPT',
    duration: '10:15',
    embedUrl: 'https://www.youtube.com/embed/3vj_p7m8B90',
    youtubeId: '3vj_p7m8B90',
    summaryNotes: [
      'Tiệm cận đứng x = x₀: lim_{x → x₀} f(x) = ±∞ (nghiệm của mẫu không triệt tiêu tử).',
      'Tiệm cận ngang y = y₀: lim_{x → ±∞} f(x) = y₀.',
      'Tiệm cận xiên y = ax + b: a = lim f(x)/x, b = lim [f(x) - ax].',
      'Thao tác Casio CALC x = 10^9 để tìm ngay a và b.'
    ],
    chapters: [
      { time: '00:00', label: '1. Định nghĩa tiệm cận đứng và tiệm cận ngang' },
      { time: '04:20', label: '2. Cách tìm tiệm cận xiên hàm phân thức bậc 2 trên 1' },
      { time: '07:45', label: '3. Mẹo bấm máy tính Casio CALC 10^9' }
    ]
  },
  'toan12-bai-11': {
    title: 'Tóm Tắt Bài 11: Nguyên Hàm & Bảng Nguyên Hàm Cơ Bản',
    author: 'Toán Học Trực Quan MathVerse',
    duration: '12:30',
    embedUrl: 'https://www.youtube.com/embed/L1d4v9T5x8o',
    youtubeId: 'L1d4v9T5x8o',
    summaryNotes: [
      'F(x) là nguyên hàm của f(x) trên K ⇔ F\'(x) = f(x).',
      'Họ nguyên hàm: ∫ f(x)dx = F(x) + C (C ∈ ℝ).',
      'Thuộc lòng 7 công thức nguyên hàm hàm số lũy thừa, lượng giác và mũ.',
      'Nguyên hàm hàm hợp: ∫ f(ax + b)dx = (1/a)F(ax + b) + C.'
    ],
    chapters: [
      { time: '00:00', label: '1. Khái niệm và tính chất cơ bản' },
      { time: '03:50', label: '2. Bảng nguyên hàm chuẩn 2025' },
      { time: '07:20', label: '3. Phương pháp đổi biến số vi phân' },
      { time: '10:00', label: '4. Kiểm tra đáp án bằng đạo hàm d/dx' }
    ]
  },
  'toan12-bai-12': {
    title: 'Tóm Tắt Bài 12: Tích Phân & Tổng Riemann Hình Học',
    author: 'Toán Học Trực Quan MathVerse',
    duration: '14:10',
    embedUrl: 'https://www.youtube.com/embed/V9x4p1L7k5e',
    youtubeId: 'V9x4p1L7k5e',
    summaryNotes: [
      'Công thức Newton - Leibniz: ∫_a^b f(x)dx = F(b) - F(a).',
      'Bản chất tích phân: Giới hạn của tổng diện tích Riemann khi số phân hoạch n → ∞.',
      'Các tính chất cộng đoạn: ∫_a^b = ∫_a^c + ∫_c^b.',
      'Ứng dụng vật lý: Quãng đường s = ∫ v(t)dt, vận tốc v = ∫ a(t)dt.'
    ],
    chapters: [
      { time: '00:00', label: '1. Diện tích hình thang cong & Tổng Riemann' },
      { time: '04:30', label: '2. Định nghĩa tích phân & Công thức Newton-Leibniz' },
      { time: '08:50', label: '3. Các tính chất đại số quan trọng' },
      { time: '11:40', label: '4. Ví dụ tính tích phân bằng đổi biến & từng phần' }
    ]
  },
  'toan12-bai-13': {
    title: 'Tóm Tắt Bài 13: Ứng Dụng Tích Phân & Khối Tròn Xoay 3D',
    author: 'Toán Học Trực Quan MathVerse',
    duration: '13:05',
    embedUrl: 'https://www.youtube.com/embed/7rX5k0V3p2g',
    youtubeId: '7rX5k0V3p2g',
    summaryNotes: [
      'Diện tích hình phẳng: S = ∫_a^b |f(x) - g(x)|dx.',
      'Thể tích vật thể cắt bởi mặt cắt S(x): V = ∫_a^b S(x)dx.',
      'Thể tích khối tròn xoay quay quanh Ox: V_Ox = π ∫_a^b [f(x)]² dx.',
      'Ứng dụng STEM: Thể tích bình gốm Bát Tràng V = π ∫ [f(x)]² dx.'
    ],
    chapters: [
      { time: '00:00', label: '1. Diện tích hình phẳng giới hạn bởi 2 đồ thị' },
      { time: '04:15', label: '2. Thể tích vật thể qua diện tích thiết diện' },
      { time: '07:30', label: '3. Khối tròn xoay 3D quanh trục Ox' },
      { time: '10:20', label: '4. Bài toán thực tế bình gốm Bát Tràng' }
    ]
  }
};

/**
 * Tự động tạo bộ câu hỏi luyện tập thông minh dựa trên nội dung bài học
 * khi bài học chưa có câu hỏi thủ công của Admin
 */
export function generateSmartLessonQuiz(lesson) {
  if (!lesson) return [];
  const num = lesson.number || 'Bài học';
  const title = lesson.title || 'Toán học';
  const sections = lesson.sections || [];
  const formulas = sections.flatMap((s) => s.formulas || []);
  const terms = lesson.terms || [];

  const questions = [];

  // Câu 1: Trắc nghiệm nhận biết khái niệm / thuật ngữ cốt lõi
  if (terms.length > 0) {
    const term0 = terms[0];
    questions.push({
      id: `gen-${lesson.id}-1`,
      type: 'mcq',
      question: `Trong ${num}: "${title}", phát biểu nào sau đây là định nghĩa chính xác nhất về thuật ngữ **"${term0.term}"**?`,
      options: [
        term0.definition,
        `Khái niệm "${term0.term}" chỉ đúng đối với hàm số đồng biến hoặc nghiệm nguyên.`,
        `Thuật ngữ "${term0.term}" là điều kiện cần nhưng không phải điều kiện đủ trong mọi trường hợp.`,
        `Định nghĩa "${term0.term}" chỉ áp dụng khi xét hàm phân thức hữu tỉ trên trục hoành.`
      ],
      correctIndex: 0,
      explanation: `Theo chuẩn SGK Toán ${lesson.grade}: ${term0.term} được định nghĩa là: ${term0.definition}`
    });
  } else {
    questions.push({
      id: `gen-${lesson.id}-1`,
      type: 'mcq',
      question: `Khẳng định nào dưới đây đúng về nội dung trọng tâm của ${num}: "${title}"?`,
      options: [
        `Nắm vững định nghĩa, các công thức toán học cốt lõi và quy trình giải toán mẫu trong bài.`,
        `Nội dung bài chỉ áp dụng cho tam giác đều và các hình học phẳng cơ bản.`,
        `Bài học không yêu cầu nắm công thức mà chỉ cần đọc qua phần bài tập mở đầu.`,
        `Tất cả các định lý trong bài chỉ đúng với số nguyên dương.`
      ],
      correctIndex: 0,
      explanation: `Mục tiêu bài học yêu cầu học sinh ghi nhớ bản chất định lý, tính chất và áp dụng vào các bài toán mẫu.`
    });
  }

  // Câu 2: Trắc nghiệm công thức định lượng (nếu có công thức trong bài)
  if (formulas.length > 0) {
    const f0 = formulas[0];
    questions.push({
      id: `gen-${lesson.id}-2`,
      type: 'mcq',
      question: `Công thức toán học trọng tâm nào dưới đây được sử dụng để giải quyết bài toán trong ${num}?`,
      options: [
        f0,
        `y = \\lim_{x \\to 0} \\frac{\\sin x}{x} = 0`,
        `S = \\frac{1}{2}ah = 0`,
        `x = \\frac{-b \\pm \\sqrt{\\Delta}}{4a}`
      ],
      correctIndex: 0,
      explanation: `Công thức cốt lõi được trích xuất trực tiếp từ SGK ${num}: $${f0}$.`
    });
  } else {
    questions.push({
      id: `gen-${lesson.id}-2`,
      type: 'mcq',
      question: `Khi thực hiện quy trình giải các bài toán trong ${num}, bước quan trọng đầu tiên học sinh cần làm là gì?`,
      options: [
        'Xác định tập xác định $D$, điều kiện có nghĩa và tóm tắt giả thiết bài toán.',
        'Nhập ngay phương trình vào máy tính cầm tay mà không cần tìm điều kiện xác định.',
        'Chọn ngẫu nhiên đáp án A hoặc B để rút ngắn thời gian làm bài.',
        'Vẽ đồ thị trước khi đọc đề bài.'
      ],
      correctIndex: 0,
      explanation: 'Tìm tập xác định và phân tích giả thiết luôn là bước tiên quyết để tránh sai lầm.'
    });
  }

  // Câu 3: Dạng câu Đúng / Sai (Part 2 chuẩn Bộ GD&ĐT 2025)
  questions.push({
    id: `gen-${lesson.id}-3`,
    type: 'tf',
    question: `Xét tính đúng/sai của các phát biểu sau về kiến thức ${num}: "${title}":`,
    items: [
      {
        key: 'a',
        statement: `Bài học này thuộc ${lesson.chapter} trong chương trình Toán ${lesson.grade} (SGK Kết nối tri thức).`,
        correct: true
      },
      {
        key: 'b',
        statement: `Kiến thức của bài học có thể ứng dụng trực tiếp để giải quyết các bài toán thực tiễn STEM và đề thi tốt nghiệp THPT.`,
        correct: true
      },
      {
        key: 'c',
        statement: `Mọi công thức trong bài học này chỉ áp dụng được trên tập số nguyên $\\mathbb{Z}$, không áp dụng trên tập số thực $\\mathbb{R}$.`,
        correct: false,
        note: 'Sai: Các công thức giải tích và hình học trong SGK đều áp dụng rộng rãi trên tập số thực ℝ.'
      },
      {
        key: 'd',
        statement: `Học sinh có thể kết hợp máy tính cầm tay (Casio fx-580 / 880) để kiểm tra nhanh kết quả của bài toán.`,
        correct: true
      }
    ],
    explanation: `Phân tích chi tiết từng mệnh đề đối chiếu với nội dung ${num} (Trang in ${lesson.startPage}–${lesson.endPage}).`
  });

  // Câu 4: Trả lời ngắn điền số (Part 3)
  questions.push({
    id: `gen-${lesson.id}-4`,
    type: 'short',
    question: `Độ dài khoảng trang sách SGK (tính số trang in $N = \\text{endPage} - \\text{startPage} + 1$) của ${num} này trong SGK ${lesson.sourceFile} là bao nhiêu?`,
    correctAnswer: String(lesson.endPage - lesson.startPage + 1),
    explanation: `Bài học bắt đầu từ trang in ${lesson.startPage} đến trang ${lesson.endPage}. Tổng số trang in là ${lesson.endPage} - ${lesson.startPage} + 1 = ${lesson.endPage - lesson.startPage + 1} trang.`
  });

  return questions;
}

// 3. Các hàm lưu trữ & lấy dữ liệu Đề luyện tập
export function getLessonQuiz(lessonId, lessonObj) {
  try {
    const savedCustom = localStorage.getItem('mathverse_custom_quizzes_v1');
    if (savedCustom) {
      const parsed = JSON.parse(savedCustom);
      if (parsed[lessonId] && Array.isArray(parsed[lessonId]) && parsed[lessonId].length > 0) {
        return parsed[lessonId];
      }
    }
  } catch (e) {
    console.error('Lỗi đọc custom quiz từ localStorage:', e);
  }

  if (DEFAULT_LESSON_QUIZZES[lessonId]) {
    return DEFAULT_LESSON_QUIZZES[lessonId];
  }

  return generateSmartLessonQuiz(lessonObj);
}

export function saveCustomLessonQuiz(lessonId, questions) {
  try {
    const savedCustom = localStorage.getItem('mathverse_custom_quizzes_v1');
    const parsed = savedCustom ? JSON.parse(savedCustom) : {};
    parsed[lessonId] = questions;
    localStorage.setItem('mathverse_custom_quizzes_v1', JSON.stringify(parsed));
    return true;
  } catch (e) {
    console.error('Lỗi lưu custom quiz:', e);
    return false;
  }
}

export function resetLessonQuiz(lessonId) {
  try {
    const savedCustom = localStorage.getItem('mathverse_custom_quizzes_v1');
    if (savedCustom) {
      const parsed = JSON.parse(savedCustom);
      delete parsed[lessonId];
      localStorage.setItem('mathverse_custom_quizzes_v1', JSON.stringify(parsed));
    }
    return true;
  } catch (e) {
    console.error('Lỗi reset quiz:', e);
    return false;
  }
}

// 4. Các hàm lưu trữ & lấy dữ liệu Video tóm tắt bài học
export function getLessonVideo(lessonId, lessonObj) {
  try {
    const savedVideos = localStorage.getItem('mathverse_custom_videos_v1');
    if (savedVideos) {
      const parsed = JSON.parse(savedVideos);
      if (parsed[lessonId]) {
        return parsed[lessonId];
      }
    }
  } catch (e) {
    console.error('Lỗi đọc custom video từ localStorage:', e);
  }

  if (DEFAULT_LESSON_VIDEOS[lessonId]) {
    return DEFAULT_LESSON_VIDEOS[lessonId];
  }

  // Tự động tạo cấu trúc Video Tóm tắt Trực quan AI (Visual Slideshow) nếu chưa cấu hình
  const sections = lessonObj?.sections || [];
  const formulas = sections.flatMap((s) => s.formulas || []);
  const title = lessonObj?.title || 'Bài học';
  const num = lessonObj?.number || 'BÀI HỌC';

  return {
    title: `Video Tóm Tắt & Sơ Đồ Tư Duy: ${num} - ${title}`,
    author: 'Chương Trình AI MathVerse Tự Tạo',
    duration: '06:30',
    embedUrl: null, // Sẽ hiển thị Trình phát Hoạt họa Tóm tắt Trực quan (AI Visual Summary Player)
    youtubeId: null,
    summaryNotes: [
      `Mục tiêu: Nắm vững định nghĩa, định lý cốt lõi của ${title}.`,
      formulas.length > 0 ? `Công thức trọng tâm: $${formulas[0]}$` : 'Thuộc lòng bảng biến thiên và các bước giải mẫu.',
      'Ứng dụng: Giải quyết các câu hỏi trắc nghiệm và bài toán thực tiễn trong đề thi tốt nghiệp THPT.',
      'Sử dụng kèm máy tính Casio để tối ưu hóa thời gian làm bài.'
    ],
    chapters: [
      { time: '00:00', label: '1. Đặt vấn đề & Tình huống thực tế' },
      { time: '01:45', label: '2. Khái niệm & Định lý then chốt' },
      { time: '03:30', label: '3. Ví dụ mẫu và phân tích sai lầm thường gặp' },
      { time: '05:10', label: '4. Tóm tắt công thức & Bài tập áp dụng' }
    ]
  };
}

export function saveCustomLessonVideo(lessonId, videoData) {
  try {
    const savedVideos = localStorage.getItem('mathverse_custom_videos_v1');
    const parsed = savedVideos ? JSON.parse(savedVideos) : {};
    parsed[lessonId] = videoData;
    localStorage.setItem('mathverse_custom_videos_v1', JSON.stringify(parsed));
    notifyDataChanged('videos');
    return true;
  } catch (e) {
    console.error('Lỗi lưu custom video:', e);
    return false;
  }
}

export function resetLessonVideo(lessonId) {
  try {
    const savedVideos = localStorage.getItem('mathverse_custom_videos_v1');
    if (savedVideos) {
      const parsed = JSON.parse(savedVideos);
      delete parsed[lessonId];
      localStorage.setItem('mathverse_custom_videos_v1', JSON.stringify(parsed));
      notifyDataChanged('videos');
    }
    return true;
  } catch (e) {
    console.error('Lỗi reset video:', e);
    return false;
  }
}

// 5. Danh mục Bài Trình Chiếu Manim Slides (Toán 10, 11, 12)
export const DEFAULT_LESSON_SLIDES = {
  'toan10-bai-1': {
    theoryUrl: 'https://buiquy77.github.io/toan10-slides/Bai01_MenhDe_Slide.html',
    exerciseUrl: 'https://buiquy77.github.io/toan10-slides/Bai01_BaiTap_Slide.html',
    title: 'Mệnh Đề Toán Học',
    author: 'Thầy Bùi Quý'
  },
  'toan10-bai-2': {
    theoryUrl: 'https://buiquy77.github.io/toan10-slides/Bai02_TapHop_Slide.html',
    exerciseUrl: 'https://buiquy77.github.io/toan10-slides/Bai02_BaiTap_Slide.html',
    title: 'Tập Hợp & Các Phép Toán',
    author: 'Thầy Bùi Quý'
  },
  'toan10-bai-9': {
    theoryUrl: 'https://buiquy77.github.io/toan10-slides/Bai09_TichVecto_Slide.html',
    exerciseUrl: 'https://buiquy77.github.io/toan10-slides/Bai09_BaiTap_Slide.html',
    title: 'Tích Của Vectơ Với Một Số',
    author: 'Thầy Bùi Quý'
  },
  'toan10-bai-10': {
    theoryUrl: 'https://buiquy77.github.io/toan10-slides/Bai10_VectoToaDo_Slide.html',
    exerciseUrl: 'https://buiquy77.github.io/toan10-slides/Bai10_BaiTap_Slide.html',
    title: 'Vectơ Trong Mặt Phẳng Tọa Độ',
    author: 'Thầy Bùi Quý'
  },
  'toan10-bai-11': {
    theoryUrl: 'https://buiquy77.github.io/toan10-slides/Bai11_TichVoHuong_Slide.html',
    exerciseUrl: 'https://buiquy77.github.io/toan10-slides/Bai11_BaiTap_Slide.html',
    title: 'Tích Vô Hướng Của Hai Vectơ',
    author: 'Thầy Bùi Quý'
  },
  'toan10-bai-12': {
    theoryUrl: 'https://buiquy77.github.io/toan10-slides/Bai12_SoGanDung_Slide.html',
    exerciseUrl: 'https://buiquy77.github.io/toan10-slides/Bai12_BaiTap_Slide.html',
    title: 'Số Gần Đúng & Sai Số',
    author: 'Thầy Bùi Quý'
  },
  'toan10-bai-13': {
    theoryUrl: 'https://buiquy77.github.io/toan10-slides/Bai13_XuTheTrungTam_Slide.html',
    exerciseUrl: 'https://buiquy77.github.io/toan10-slides/Bai13_BaiTap_Slide.html',
    title: 'Các Số Đặc Trưng Đo Xu Thế Trung Tâm',
    author: 'Thầy Bùi Quý'
  },

  // TOÁN 12 - HÌNH HỌC KHÔNG GIAN & HỆ TRỤC TỌA ĐỘ OXYZ
  'toan12-bai-6': {
    theoryUrl: 'https://buiquy77.github.io/toan12-slides/Bai06_VectoTrongKhongGian_Slide.html',
    exerciseUrl: null,
    title: 'Vectơ Trong Không Gian',
    author: 'Thầy Bùi Quý'
  },
  'toan12-bai-7': {
    theoryUrl: 'https://buiquy77.github.io/toan12-slides/ly_thuyet_presentation.html',
    exerciseUrl: 'https://buiquy77.github.io/toan12-slides/bai_tap_presentation.html',
    title: 'Hệ Trục Tọa Độ Trong Không Gian',
    author: 'Thầy Bùi Quý'
  },
  'toan12-bai-8': {
    theoryUrl: 'https://buiquy77.github.io/toan12-slides/Bai07_ToaDoKhongGian_Phan2_Slide.html',
    exerciseUrl: null,
    title: 'Biểu Thức Tọa Độ Của Các Phép Toán Vectơ',
    author: 'Thầy Bùi Quý'
  }
};

export function getLessonSlide(lessonId, lessonObj) {
  try {
    const savedSlides = localStorage.getItem('mathverse_custom_slides_v1');
    if (savedSlides) {
      const parsed = JSON.parse(savedSlides);
      if (parsed[lessonId]) {
        return parsed[lessonId];
      }
    }
  } catch (e) {
    console.error('Lỗi đọc custom slide từ localStorage:', e);
  }

  if (DEFAULT_LESSON_SLIDES[lessonId]) {
    return DEFAULT_LESSON_SLIDES[lessonId];
  }

  return {
    theoryUrl: null,
    exerciseUrl: null,
    title: lessonObj?.title || 'Bài giảng Manim Slides',
    author: 'Thầy Bùi Quý'
  };
}

export function saveCustomLessonSlide(lessonId, slideData) {
  try {
    const savedSlides = localStorage.getItem('mathverse_custom_slides_v1');
    const parsed = savedSlides ? JSON.parse(savedSlides) : {};
    parsed[lessonId] = slideData;
    localStorage.setItem('mathverse_custom_slides_v1', JSON.stringify(parsed));
    notifyDataChanged('slides');
    return true;
  } catch (e) {
    console.error('Lỗi lưu custom slide:', e);
    return false;
  }
}

export function resetLessonSlide(lessonId) {
  try {
    const savedSlides = localStorage.getItem('mathverse_custom_slides_v1');
    if (savedSlides) {
      const parsed = JSON.parse(savedSlides);
      delete parsed[lessonId];
      localStorage.setItem('mathverse_custom_slides_v1', JSON.stringify(parsed));
      notifyDataChanged('slides');
    }
    return true;
  } catch (e) {
    console.error('Lỗi reset slide:', e);
    return false;
  }
}
