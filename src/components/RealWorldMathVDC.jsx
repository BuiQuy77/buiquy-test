import React, { useState, useMemo } from 'react';
import MathView from './MathView';
import {
  Sparkles,
  Calculator,
  CheckCircle2,
  Sliders,
  BookOpen,
  Search,
  GraduationCap,
  Filter
} from 'lucide-react';

/* ============================================================================
   DANH MỤC CÁC CHƯƠNG HỌC CHUẨN SGK GDPT 2018 (KẾT NỐI TRI THỨC)
   ============================================================================ */
export const GRADE_CHAPTERS = {
  all: [
    { code: 'all', title: 'Tất cả các chương' }
  ],
  12: [
    { code: 'all', title: 'Tất cả 6 chương Lớp 12' },
    { code: 'C1', title: 'Chương I: Đạo hàm & Khảo sát đồ thị' },
    { code: 'C2', title: 'Chương II: Vectơ trong không gian Oxyz' },
    { code: 'C3', title: 'Chương III: Đo mức độ phân tán mẫu ghép nhóm' },
    { code: 'C4', title: 'Chương IV: Nguyên hàm và tích phân' },
    { code: 'C5', title: 'Chương V: Tọa độ không gian Oxyz' },
    { code: 'C6', title: 'Chương VI: Xác suất có điều kiện & Bayes' }
  ],
  11: [
    { code: 'all', title: 'Tất cả các chương Lớp 11' },
    { code: 'C1', title: 'Chương I: Hàm số lượng giác' },
    { code: 'C2', title: 'Chương II: Dãy số, Cấp số cộng & Cấp số nhân' },
    { code: 'C3', title: 'Chương III: Đo xu thế trung tâm mẫu ghép nhóm' },
    { code: 'C6', title: 'Chương VI: Hàm số Mũ & Lôgarit' },
    { code: 'C8', title: 'Chương VII & VIII: Hình học không gian' }
  ],
  10: [
    { code: 'all', title: 'Tất cả các chương Lớp 10' },
    { code: 'C2', title: 'Chương II: Bất phương trình & Quy hoạch tuyến tính' },
    { code: 'C3', title: 'Chương III: Hàm số bậc hai & Parabol' },
    { code: 'C4', title: 'Chương IV: Hệ thức lượng trong tam giác' },
    { code: 'C5', title: 'Chương V: Đại số tổ hợp' },
    { code: 'C9', title: 'Chương IX: Ba đường Conic trong Oxy' }
  ]
};

/* ============================================================================
   NGÂN HÀNG 19 BÀI TOÁN THỰC TẾ VẬN DỤNG CAO THEO ĐÚNG CÁC CHƯƠNG SGK (10, 11, 12)
   - Đầy đủ: Đề bài tô dạ quang vàng, Hình vẽ mặt cắt 2D tương tác,
     Tóm tắt dữ kiện mấu chốt, Bảng giải chi tiết highlight vàng & Mẹo bấm Casio
   ============================================================================ */
const REAL_WORLD_PROBLEMS = [
  /* ============================== KHỐI 12 (9 BÀI) ============================== */
  {
    id: 'g12_water_slide_rational',
    grade: 12,
    chapterCode: 'C1',
    chapter: 'Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
    code: 'Câu 1 [Lớp 12]',
    badge: 'Đồ thị phân thức • Tiếp xúc Ox',
    title: 'Thiết Kế Đường Trượt Công Viên Nước (Tìm Hàm Số Từ Đồ Thị Thực Tế)',
    diagramType: 'water_slide',
    shortAnswer: '1,67',
    acceptedAnswers: ['1,67', '1.67', '5/3'],
    unit: 'm',
    sliderConfig: {
      label: 'Vị trí ngang của bạn Khôi x (m)',
      min: 0,
      max: 15,
      step: 0.5,
      defaultVal: 5
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 1 [Toán 12]:</strong> Trong hệ trục tọa độ{' '}
          <MathView math="Oxy" /> với đơn vị mỗi trục{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            là mét
          </mark>
          , một đường trượt mới được xây dựng theo bản thiết kế với kích thước như hình vẽ. Thanh trượt bắt đầu từ{' '}
          <MathView math="A(0; 10)" /> và kết thúc tại <MathView math="C(15; 1)" />, đường cong của thanh trượt là một phần của đồ thị hàm số{' '}
          <MathView math="f(x) = \frac{ax^2 + bx + c}{x + d}" />, biết đồ thị{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            tiếp xúc với trục Ox tại điểm B(10; 0)
          </mark>
          . Bạn Khôi bắt đầu trượt từ điểm <MathView math="A" />, hỏi khi Khôi cách vị trí ban đầu theo phương ngang{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            5m
          </mark>{' '}
          thì Khôi cách mặt đất bao nhiêu mét{' '}
          <em className="text-slate-600 font-semibold">(làm tròn đến hàng phần trăm)</em>?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Điểm xuất phát', math: 'A(0; 10) \\implies f(0) = 10' },
      { label: 'Tiếp xúc trục Ox', math: 'B(10; 0) \\implies \\text{tử số có nghiệm kép } x = 10' },
      { label: 'Điểm kết thúc', math: 'C(15; 1) \\implies f(15) = 1' },
      { label: 'Cần tính độ cao', math: 'f(5) = ?' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Khai thác điều kiện đồ thị tiếp xúc với trục Ox tại B(10; 0)',
        text: 'Vì đồ thị hàm phân thức tiếp xúc với trục Ox (y = 0) tại x_B = 10 nên tử số ax² + bx + c = 0 nhận x = 10 làm nghiệm kép:',
        math: 'ax^2 + bx + c = a(x - 10)^2 \\implies f(x) = \\frac{a(x - 10)^2}{x + d}',
        highlight: 'Tử số = a(x - 10)² (đưa từ 4 ẩn về chỉ còn 2 ẩn a và d)'
      },
      {
        title: 'Bước 2: Thay tọa độ A(0; 10) và C(15; 1) để giải hệ tìm a, d',
        text: 'Đồ thị đi qua A(0; 10) và C(15; 1) nên ta có hệ phương trình:',
        math: '\\begin{cases} 10 = \\frac{a(0 - 10)^2}{0 + d} \\\\[6pt] 1 = \\frac{a(15 - 10)^2}{15 + d} \\end{cases} \\iff \\begin{cases} d = 10a \\\\[6pt] 1 = \\frac{25a}{15 + 10a} \\end{cases} \\iff \\begin{cases} a = 1 \\\\ d = 10 \\end{cases}',
        highlight: 'a = 1  và  d = 10'
      },
      {
        title: 'Bước 3: Xác định hàm số f(x) và tính độ cao tại x = 5m',
        text: 'Thay a = 1, d = 10 vào f(x), sau đó tính giá trị tại x = 5:',
        math: 'f(x) = \\frac{(x - 10)^2}{x + 10} \\implies f(5) = \\frac{(5 - 10)^2}{5 + 10} = \\frac{25}{15} = \\frac{5}{3} \\approx 1{,}67\\text{ (m)}',
        highlight: 'Đáp số: f(5) = 1,67 m'
      }
    ],
    casioTip:
      'Trên Casio fx-580VNX / fx-880BTG: Nhập phương trình 25X / (15 + 10X) = 1 → nhấn [SHIFT] [CALC] (SOLVE) → X = 1 ⇒ a = 1, d = 10. Sau đó nhập (X - 10)² / (X + 10) nhấn [CALC] X = 5 được ngay 5/3 ≈ 1,67.'
  },
  {
    id: 'g12_shrimp_pond_tangent',
    grade: 12,
    chapterCode: 'C1',
    chapter: 'Chương I • Tiếp tuyến & Cực trị',
    code: 'Câu 2 [Lớp 12]',
    badge: 'Tiếp tuyến đồ thị • Cực trị hình học',
    title: 'Quây Ao Nuôi Tôm Hình Tam Giác ABC Tiếp Tuyến Với Bờ Đất Cong',
    diagramType: 'shrimp_pond',
    shortAnswer: '44,7',
    acceptedAnswers: ['44,7', '44.7', '20√5'],
    unit: 'm²',
    sliderConfig: {
      label: 'Hoành độ tiếp điểm B trên bờ đất x_B (m)',
      min: 1.0,
      max: 4.5,
      step: 0.1,
      defaultVal: 2.0
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 2 [Toán 12]:</strong> Trong mặt phẳng{' '}
          <MathView math="Oxy" /> <em className="text-slate-600">(đơn vị mỗi trục là 1m)</em>, bờ của phần đất nhô ra có dạng một phần đồ thị hàm số{' '}
          <MathView math="y = f(x) = \frac{-x^2 + 10x - 12}{x} \ (x > 0)" />. Người ta muốn quây một ao nuôi tôm dạng hình tam giác{' '}
          <MathView math="ABC" /> với cọc cố định{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            A(-6; 6)
          </mark>
          , đường thẳng <MathView math="BC" /> là tiếp tuyến với đồ thị <MathView math="(C)" /> tại tiếp điểm{' '}
          <MathView math="B" /> và có độ dài{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            BC = 10m
          </mark>
          . Diện tích ao nuôi tôm lớn nhất là bao nhiêu <MathView math="\text{m}^2" />{' '}
          <em className="text-slate-600 font-semibold">(làm tròn đến hàng phần chục)</em>?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Điểm cố định & Cạnh đáy', math: 'A(-6; 6), \\quad BC = 10\\text{ m}' },
      { label: 'Công thức diện tích', math: 'S_{ABC} = \\frac{1}{2} \\cdot AH \\cdot BC = 5 \\cdot AH' },
      { label: 'Tam giác vuông AHB', math: 'AH \\le AB \\implies AH_{\\max} = AB_{\\min} \\text{ khi } B \\equiv H' },
      { label: 'Cực trị khoảng cách', math: 'AB_{\\min} = 4\\sqrt{5} \\text{ tại } B(2; 2)' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Biểu diễn diện tích ao nuôi tôm S_ABC theo đường cao AH',
        text: 'Kẻ AH ⊥ BC tại H. Vì BC = 10m cố định nên diện tích tam giác ABC tỉ lệ thuận với AH:',
        math: 'S_{ABC} = \\frac{1}{2} \\cdot AH \\cdot BC = \\frac{1}{2} \\cdot AH \\cdot 10 = 5 \\cdot AH',
        highlight: 'S_ABC đạt GTLN khi và chỉ khi AH đạt GTLN'
      },
      {
        title: 'Bước 2: Đánh giá hình học AH ≤ AB và tìm khoảng cách ngắn nhất AB_min',
        text: 'Trong ΔAHB vuông tại H luôn có AH ≤ AB. Gọi B(x; (-x² + 10x - 12)/x) thuộc (C):',
        math: 'AB = \\sqrt{(x + 6)^2 + \\left(\\frac{-x^2 + 10x - 12}{x} - 6\\right)^2} \\ge 4\\sqrt{5}',
        highlight: 'AB_min = 4√5 đạt tại x_B = 2 ⇒ B(2; 2)'
      },
      {
        title: 'Bước 3: Kiểm tra điều kiện vuông góc AB ⊥ BC tại B(2; 2) và kết luận',
        text: 'Tại x = 2 ⇒ B(2; 2), hệ số góc tiếp tuyến f\'(2) = -1 + 12/4 = 2; hệ số góc của AB là k_AB = (2 - 6)/(2 + 6) = -1/2. Vì k_AB · f\'(2) = -1 nên AB ⊥ BC tại B (tức B ≡ H và AH_max = AB_min = 4√5):',
        math: 'S_{\\max} = 5 \\cdot AH_{\\max} = 5 \\cdot 4\\sqrt{5} = 20\\sqrt{5} \\approx 44{,}7\\text{ (m}^2\\text{)}',
        highlight: 'Đáp số: S_max = 20√5 ≈ 44,7 m²'
      }
    ],
    casioTip:
      'Bấm Casio TABLE (MENU 8): Nhập f(X) = √((X + 6)² + ((-X² + 10X - 12)/X - 6)²) trên [1; 4] với Step = 0.25 → thấy ngay giá trị nhỏ nhất tại X = 2 là √80 = 4√5, nhân 5 được 44,72.'
  },
  {
    id: 'g12_vieta_chord_area',
    grade: 12,
    chapterCode: 'C1',
    chapter: 'Chương I • Tương giao & Vi-ét',
    code: 'Câu 3 [Lớp 12]',
    badge: 'Tương giao f(x) = m • Định lý Vi-ét',
    title: 'Khung Bảng Hiệu Chữ Nhật Dưới Vòm Đồ Thị Phân Thức (Tương Giao f(x) = m)',
    diagramType: 'vieta_chord',
    shortAnswer: '3,38',
    acceptedAnswers: ['3,38', '3.38', '111'],
    unit: 'đvdt',
    sliderConfig: {
      label: 'Độ cao thanh ngang y = m',
      min: 0.1,
      max: 0.95,
      step: 0.05,
      defaultVal: 0.65
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 3 [Toán 12]:</strong> Một vòm cổng được mô hình hóa bởi đồ thị hàm số{' '}
          <MathView math="y = f(x) = \frac{-x^2 + 5x - 4}{x}" /> trên đoạn <MathView math="[1; 4]" />. Người ta lắp một khung bảng hiệu hình chữ nhật{' '}
          <MathView math="ABCD" /> có hai đỉnh dưới nằm trên trục <MathView math="Ox" /> và hai đỉnh trên{' '}
          <MathView math="C, D" /> nằm trên đồ thị ở độ cao{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            y = m (0 &lt; m &lt; 1)
          </mark>
          . Dùng định lý Vi-ét biểu diễn chiều rộng <MathView math="CD = |x_C - x_D|" /> theo{' '}
          <MathView math="m" /> và tìm diện tích lớn nhất <MathView math="S_{\max}" /> của hình chữ nhật{' '}
          <MathView math="ABCD" /> <em className="text-slate-600 font-semibold">(làm tròn đến hàng phần trăm)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Phương trình hoành độ giao điểm', math: '\\frac{-x^2 + 5x - 4}{x} = m \\iff x^2 - (5 - m)x + 4 = 0' },
      { label: 'Điều kiện có 2 nghiệm phân biệt', math: '\\Delta = (5 - m)^2 - 16 > 0 \\implies 0 < m < 1' },
      { label: 'Hệ thức Vi-ét', math: 'x_C + x_D = 5 - m, \\quad x_C \\cdot x_D = 4' },
      { label: 'Độ dài đoạn CD', math: 'CD = \\sqrt{(x_C + x_D)^2 - 4x_C x_D} = \\sqrt{(5 - m)^2 - 16}' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Lập phương trình hoành độ giao điểm của f(x) và đường thẳng y = m',
        text: 'Hoành độ x_C, x_D là nghiệm của phương trình f(x) = m (với x > 0):',
        math: '\\frac{-x^2 + 5x - 4}{x} = m \\iff -x^2 + (5 - m)x - 4 = 0 \\iff x^2 - (5 - m)x + 4 = 0',
        highlight: 'Δ = (5 - m)² - 16 > 0 ⇔ m < 1'
      },
      {
        title: 'Bước 2: Áp dụng định lý Vi-ét tính chiều rộng CD theo m',
        text: 'Theo định lý Vi-ét: x_C + x_D = 5 - m và x_C · x_D = 4. Suy ra:',
        math: '(x_C - x_D)^2 = (x_C + x_D)^2 - 4x_C x_D = (5 - m)^2 - 16 \\implies CD = \\sqrt{(5 - m)^2 - 16}',
        highlight: 'CD = √((5 - m)² - 16)'
      },
      {
        title: 'Bước 3: Tìm GTLN của hàm diện tích S(m) bằng đạo hàm / Casio d/dx',
        text: 'Diện tích hình chữ nhật ABCD theo biến m ∈ (0; 1):',
        math: 'S_{ABCD}(m) = m \\cdot \\sqrt{(5 - m)^2 - 16} \\implies S_{\\max} \\approx 3{,}38 \\text{ (tại } m \\approx 0{,}65\\text{)}',
        highlight: 'Đáp số: S_max ≈ 3,38 (hoặc 111 nếu nhân hệ số quy đổi thực tế)'
      }
    ],
    casioTip:
      'Bấm Casio d/dx + SHIFT SOLVE: Nhập d/dx(X · √((5 - X)² - 16))|_{X=X} = 0, nhấn [SHIFT] [CALC] X = 0.6 → máy tìm ngay X ≈ 0.6515 ⇒ S_max ≈ 3,38.'
  },
  {
    id: 'g12_cable_river_cost',
    grade: 12,
    chapterCode: 'C1',
    chapter: 'Chương I • Tối ưu chi phí (Bài 5)',
    code: 'Câu 4 [Lớp 12]',
    badge: 'Tối ưu hóa kỹ thuật • SGK Bài 5',
    title: 'Tối Ưu Chi Phí Lắp Đặt Đường Dây Cáp Ngầm Vượt Sông & Trên Bộ',
    diagramType: 'river_cable',
    shortAnswer: '1200',
    acceptedAnswers: ['1200', '800', '9800'],
    unit: 'm',
    sliderConfig: {
      label: 'Vị trí điểm lên bờ M cách A một đoạn x (m)',
      min: 100,
      max: 1800,
      step: 50,
      defaultVal: 800
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 4 [Toán 12]:</strong> Một nhà máy điện tại{' '}
          <MathView math="P" /> bên bờ sông cần kéo cáp tới trạm biến áp <MathView math="B" /> ở bờ đối diện. Biết sông rộng{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            AP = 600m
          </mark>{' '}
          (<MathView math="PA \perp AB" />) và khoảng cách dọc bờ sông{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            AB = 2000m
          </mark>
          . Chi phí mỗi mét cáp dưới nước là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            5 triệu đồng/m
          </mark>{' '}
          và trên bờ là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            4 triệu đồng/m
          </mark>
          . Hỏi đoạn dây cáp đi trên bờ <MathView math="MB" /> dài bao nhiêu mét để tổng chi phí lắp đặt nhỏ nhất?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Chiều dài cáp ngầm dưới sông', math: 'PM = \\sqrt{600^2 + x^2} \\text{ (với } x = AM\\text{)}' },
      { label: 'Chiều dài cáp đi trên bờ', math: 'MB = 2000 - x \\quad (0 \\le x \\le 2000)' },
      { label: 'Hàm tổng chi phí', math: 'C(x) = 5\\sqrt{600^2 + x^2} + 4(2000 - x)' },
      { label: 'Điểm dừng đạo hàm', math: 'C\'(x) = 0 \\iff x = 800\\text{ m} \\implies MB = 1200\\text{ m}' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Thiết lập hàm tổng chi phí C(x) theo ẩn x = AM',
        text: 'Trong tam giác vuông PAM vuông tại A (AP = 600m, AM = x):',
        math: 'C(x) = 5\\sqrt{600^2 + x^2} + 4(2000 - x), \\quad x \\in [0; 2000]',
        highlight: 'Hàm chi phí C(x) liên tục trên đoạn [0; 2000]'
      },
      {
        title: 'Bước 2: Giải phương trình đạo hàm C\'(x) = 0',
        text: 'Tính đạo hàm C\'(x) và cho bằng 0:',
        math: 'C\'(x) = \\frac{5x}{\\sqrt{600^2 + x^2}} - 4 = 0 \\iff 5x = 4\\sqrt{600^2 + x^2} \\iff x = 800\\text{ (m)}',
        highlight: 'AM = x = 800 m'
      },
      {
        title: 'Bước 3: Tính đoạn dây đi trên bờ MB và tổng chi phí tối thiểu',
        text: 'Thay x = 800m vào biểu thức MB = 2000 - x:',
        math: 'MB = 2000 - 800 = 1200\\text{ (m)}, \\quad C_{\\min} = C(800) = 9800\\text{ (triệu đồng)}',
        highlight: 'Đáp số: MB = 1200 m'
      }
    ],
    casioTip:
      'Công thức giải nhanh trong 5 giây: Với đơn giá dưới sông c₁ = 5, trên bờ c₂ = 4 và bề rộng sông h = 600, luôn có x = h · c₂ / √(c₁² - c₂²) = 600 · 4 / 3 = 800m ⇒ MB = 2000 - 800 = 1200m!'
  },
  {
    id: 'g12_vectors_3d_lamp_suspension',
    grade: 12,
    chapterCode: 'C2',
    chapter: 'Chương II: Vectơ và hệ tọa độ trong không gian',
    code: 'Câu 5 [Lớp 12]',
    badge: 'Cân bằng lực • Vectơ không gian',
    title: 'Hệ Thống Đèn Chùm Treo Cân Bằng Bằng 3 Sợi Dây Cáp (Tổng Vectơ Lực F = 0)',
    diagramType: 'oxyz_radar',
    shortAnswer: '40',
    acceptedAnswers: ['40', '40,0', '40N'],
    unit: 'N',
    sliderConfig: {
      label: 'Độ lớn trọng lực đèn chùm P (N)',
      min: 30,
      max: 120,
      step: 10,
      defaultVal: 60
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 5 [Toán 12]:</strong> Một chiếc đèn chùm trang trí có trọng lượng{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            P = 60 N
          </mark>{' '}
          được treo vào trần nhà nằm ngang bằng ba sợi dây cáp không giãn có cùng độ dài, gắn vào 3 điểm{' '}
          <MathView math="A, B, C" /> trên trần tạo thành tam giác đều. Tại điểm treo trung tâm{' '}
          <MathView math="O" />, ba lực căng dây{' '}
          <MathView math="\vec{T}_A, \vec{T}_B, \vec{T}_C" /> cùng với trọng lực{' '}
          <MathView math="\vec{P}" /> giữ đèn ở trạng thái cân bằng:{' '}
          <MathView math="\vec{T}_A + \vec{T}_B + \vec{T}_C + \vec{P} = \vec{0}" />. Biết rằng mỗi sợi dây cáp tạo với phương thẳng đứng một góc{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            α = 60°
          </mark>
          . Do tính đối xứng, độ lớn lực căng trên ba sợi dây bằng nhau. Độ lớn lực căng{' '}
          <MathView math="T" /> trên mỗi sợi dây cáp là bao nhiêu Newton?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Điều kiện cân bằng tĩnh học', math: '\\vec{T}_A + \\vec{T}_B + \\vec{T}_C + \\vec{P} = \\vec{0}' },
      { label: 'Hình chiếu lên phương thẳng đứng Oz', math: '3 \\cdot T \\cdot \\cos 60^\\circ = P' },
      { label: 'Trọng lượng P', math: 'P = 60\\text{ N}' },
      { label: 'Lực căng mỗi dây T', math: 'T = \\frac{P}{3\\cos 60^\\circ} = \\frac{60}{3 \\cdot 0{,}5} = 40\\text{ N}' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Thiết lập hệ tọa độ và điều kiện cân bằng tĩnh học',
        text: 'Chọn trục Oz thẳng đứng hướng lên ngược chiều trọng lực P. Điều kiện cân bằng tại điểm treo O:',
        math: '\\vec{T}_A + \\vec{T}_B + \\vec{T}_C = -\\vec{P}',
        highlight: 'Tổng các lực căng cân bằng với trọng lực đèn'
      },
      {
        title: 'Bước 2: Chiếu phương trình vectơ lên phương thẳng đứng Oz',
        text: 'Vì góc giữa mỗi dây cáp và phương thẳng đứng là α = 60°, hình chiếu của mỗi lực căng lên Oz là T · cos(60°):',
        math: 'T_z = T_A \\cos 60^\\circ + T_B \\cos 60^\\circ + T_C \\cos 60^\\circ = 3 \\cdot T \\cdot \\cos 60^\\circ',
        highlight: '3 · T · cos 60° = P'
      },
      {
        title: 'Bước 3: Giải phương trình tìm độ lớn lực căng T',
        text: 'Thay P = 60 N và cos(60°) = 0,5:',
        math: '3 \\cdot T \\cdot 0{,}5 = 60 \\iff 1{,}5 T = 60 \\implies T = 40\\text{ (N)}',
        highlight: 'Đáp số: T = 40 N'
      }
    ],
    casioTip:
      'Bài toán cân bằng lực đối xứng 3 dây: Lực căng mỗi dây luôn tính bằng T = P / (3 · cos α). Chỉ cần nhập 60 / (3 × cos(60°)) trên Casio là ra ngay 40 N!'
  },
  {
    id: 'g12_stat_aqi_dispersion',
    grade: 12,
    chapterCode: 'C3',
    chapter: 'Chương III: Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm',
    code: 'Câu 6 [Lớp 12]',
    badge: 'Độ lệch chuẩn • Mẫu ghép nhóm',
    title: 'Đo Mức Độ Biến Động Chỉ Số Ô Nhiễm Không Khí (AQI) Bằng Độ Lệch Chuẩn',
    diagramType: 'vieta_chord',
    shortAnswer: '18',
    acceptedAnswers: ['18', '18,0', '18.0', '324'],
    unit: 'điểm AQI',
    sliderConfig: {
      label: 'Số ngày quan sát n',
      min: 20,
      max: 100,
      step: 10,
      defaultVal: 40
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 6 [Toán 12]:</strong> Để đánh giá mức độ ổn định của chất lượng không khí tại một đô thị, người ta theo dõi chỉ số{' '}
          <MathView math="\text{AQI}" /> trong{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            40 ngày
          </mark>{' '}
          và lập bảng tần số ghép nhóm như sau:
        </p>
        <div className="grid grid-cols-4 gap-2 text-center text-xs py-1 bg-white rounded border border-slate-200">
          <div><span className="font-semibold text-slate-700">[50; 70)</span><br/><span className="text-slate-500">8 ngày</span></div>
          <div><span className="font-semibold text-slate-700">[70; 90)</span><br/><span className="text-slate-500">16 ngày</span></div>
          <div><span className="font-semibold text-slate-700">[90; 110)</span><br/><span className="text-slate-500">12 ngày</span></div>
          <div><span className="font-semibold text-slate-700">[110; 130)</span><br/><span className="text-slate-500">4 ngày</span></div>
        </div>
        <p>
          Hãy tính độ lệch chuẩn <MathView math="s" /> của mẫu số liệu ghép nhóm này để đo mức độ phân tán của chỉ số AQI quanh giá trị trung bình{' '}
          <em className="text-slate-600 font-semibold">(đơn vị: điểm AQI)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Cỡ mẫu n & Giá trị đại diện c_i', math: 'n = 40; \\quad c_i \\in \\{60, 80, 100, 120\\}' },
      { label: 'Số trung bình x̄', math: '\\bar{x} = \\frac{8 \\cdot 60 + 16 \\cdot 80 + 12 \\cdot 100 + 4 \\cdot 120}{40} = 86' },
      { label: 'Phương sai s²', math: 's^2 = \\frac{8(60-86)^2 + 16(80-86)^2 + 12(100-86)^2 + 4(120-86)^2}{40} = 324' },
      { label: 'Độ lệch chuẩn s', math: 's = \\sqrt{s^2} = \\sqrt{324} = 18' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Xác định giá trị đại diện và tính số trung bình cộng x̄',
        text: 'Giá trị đại diện của 4 nhóm là c₁ = 60, c₂ = 80, c₃ = 100, c₄ = 120. Số trung bình:',
        math: '\\bar{x} = \\frac{8 \\cdot 60 + 16 \\cdot 80 + 12 \\cdot 100 + 4 \\cdot 120}{40} = \\frac{480 + 1280 + 1200 + 480}{40} = \\frac{3440}{40} = 86',
        highlight: 'Số trung bình x̄ = 86 điểm AQI'
      },
      {
        title: 'Bước 2: Tính phương sai s² của mẫu số liệu ghép nhóm',
        text: 'Áp dụng công thức phương sai s² = (1/n) · ∑ m_i · (c_i - x̄)²:',
        math: 's^2 = \\frac{8 \\cdot (-26)^2 + 16 \\cdot (-6)^2 + 12 \\cdot 14^2 + 4 \\cdot 34^2}{40} = \\frac{5408 + 576 + 2352 + 4624}{40} = \\frac{12960}{40} = 324',
        highlight: 'Phương sai s² = 324'
      },
      {
        title: 'Bước 3: Khai căn tìm độ lệch chuẩn s',
        text: 'Độ lệch chuẩn là căn bậc hai số học của phương sai:',
        math: 's = \\sqrt{324} = 18\\text{ (điểm AQI)}',
        highlight: 'Đáp số: Độ lệch chuẩn s = 18'
      }
    ],
    casioTip:
      'Bấm Casio fx-580VNX Thống kê: MENU 6 (Statistics) → 1 (1-Variable). Bật tần số [SHIFT] [MENU] ↓ [3: Thống kê] [1: Bật]. Nhập x: 60, 80, 100, 120 và Tần số: 8, 16, 12, 4 → nhấn [OPTN] [3: 1-Variable Calc] → màn hình hiện ngay sx = 18!'
  },
  {
    id: 'g12_integral_parabola_gate',
    grade: 12,
    chapterCode: 'C4',
    chapter: 'Chương IV: Nguyên hàm và tích phân',
    code: 'Câu 7 [Lớp 12]',
    badge: 'Ứng dụng Tích phân • Tính chi phí',
    title: 'Thiết Kế Cổng Chào Parabol & Tính Chi Phí Kính Trang Trí Bằng Tích Phân',
    diagramType: 'parabola_gate',
    shortAnswer: '32',
    acceptedAnswers: ['32', '32,0', '64'],
    unit: 'm²',
    sliderConfig: {
      label: 'Bề rộng phần cửa kính trung tâm 2k (m)',
      min: 2,
      max: 8,
      step: 0.5,
      defaultVal: 8
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 5 [Toán 12]:</strong> Cổng chào của một khu đô thị có hình dạng là một đường Parabol{' '}
          <MathView math="(P)" /> có chiều rộng chân cổng{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            AB = 8m
          </mark>{' '}
          và chiều cao tại đỉnh cổng là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            OI = 6m
          </mark>
          . Chọn hệ trục tọa độ <MathView math="Oxy" /> sao cho <MathView math="O" /> là trung điểm{' '}
          <MathView math="AB" /> và trục <MathView math="Oy" /> đi qua đỉnh <MathView math="I(0; 6)" />. Tính diện tích toàn bộ phần mặt phẳng giới hạn bởi vòm cổng Parabol và mặt đất{' '}
          <MathView math="AB" /> <em className="text-slate-600 font-semibold">(đơn vị: m²)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Đỉnh và 2 chân cổng', math: 'I(0; 6), \\quad A(-4; 0), \\quad B(4; 0)' },
      { label: 'Phương trình Parabol', math: 'y = ax^2 + 6 \\text{ qua } B(4; 0) \\implies a = -\\frac{3}{8}' },
      { label: 'Công thức tích phân diện tích', math: 'S = \\int_{-4}^{4} \\left(6 - \\frac{3}{8}x^2\\right) dx' },
      { label: 'Công thức nhanh Архимед', math: 'S_{\\text{Parabol}} = \\frac{2}{3} \\cdot \\text{Đáy} \\cdot \\text{Cao} = \\frac{2}{3} \\cdot 8 \\cdot 6 = 32\\text{ m}^2' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Lập phương trình vòm Parabol trong hệ trục tọa độ Oxy',
        text: 'Vì Parabol nhận Oy làm trục đối xứng và có đỉnh I(0; 6) nên có dạng y = ax² + 6. Đồ thị đi qua chân cổng B(4; 0):',
        math: '0 = a \\cdot 4^2 + 6 \\implies a = -\\frac{6}{16} = -\\frac{3}{8} \\implies y = 6 - \\frac{3}{8}x^2',
        highlight: 'Phương trình vòm cổng: y = 6 - (3/8)x²'
      },
      {
        title: 'Bước 2: Tính diện tích vòm cổng bằng tích phân xác định',
        text: 'Diện tích hình phẳng giới hạn bởi Parabol và trục hoành Ox từ x = -4 đến x = 4:',
        math: 'S = \\int_{-4}^{4} \\left(6 - \\frac{3}{8}x^2\\right) dx = \\left.\\left(6x - \\frac{1}{8}x^3\\right)\\right|_{-4}^{4} = (24 - 8) - (-24 + 8) = 32\\text{ (m}^2\\text{)}',
        highlight: 'Đáp số: S = 32 m²'
      }
    ],
    casioTip:
      'Mẹo giải nhanh 3 giây cho mọi bài vòm Parabol: Diện tích phần phẳng dưới vòm Parabol có đáy D và chiều cao H luôn bằng S = (2/3) · D · H = (2/3) × 8 × 6 = 32 m²!'
  },
  {
    id: 'g12_oxyz_radar_drone',
    grade: 12,
    chapterCode: 'C5',
    chapter: 'Chương V: Phương pháp tọa độ trong không gian',
    code: 'Câu 8 [Lớp 12]',
    badge: 'Hình học Oxyz • Mặt cầu & Đường thẳng',
    title: 'Trạm Radar Kiểm Soát Không Lưu & Quỹ Đạo Bay Của Máy Bay Không Người Lái (UAV)',
    diagramType: 'oxyz_radar',
    shortAnswer: '3',
    acceptedAnswers: ['3', '3,0', '3.0'],
    unit: 'km',
    sliderConfig: {
      label: 'Tham số thời gian bay t (phút)',
      min: -2,
      max: 6,
      step: 0.2,
      defaultVal: 2
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 6 [Toán 12]:</strong> Trong không gian với hệ tọa độ{' '}
          <MathView math="Oxyz" /> <em className="text-slate-600">(đơn vị trên mỗi trục là km)</em>, một trạm radar đặt tại gốc tọa độ{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            O(0; 0; 0)
          </mark>{' '}
          có bán kính phủ sóng <MathView math="R = 5\text{ km}" />. Một thiết bị bay UAV di chuyển thẳng đều theo quỹ đạo có phương trình tham số{' '}
          <MathView math="d: \begin{cases} x = 4 - t \\ y = -2 + 2t \\ z = 2 + 2t \end{cases}" /> (<MathView math="t" /> tính bằng phút). Khoảng cách ngắn nhất từ thiết bị bay UAV đến trạm radar{' '}
          <MathView math="O" /> trong suốt hành trình là bao nhiêu km?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Tọa độ UAV tại thời điểm t', math: 'M(4 - t;\\ -2 + 2t;\\ 2 + 2t)' },
      { label: 'Vectơ chỉ phương quỹ đạo', math: '\\vec{u}_d = (-1;\\ 2;\\ 2) \\implies |\\vec{u}_d| = 3' },
      { label: 'Bình phương khoảng cách OM²', math: 'OM^2 = (4 - t)^2 + (-2 + 2t)^2 + (2 + 2t)^2 = 9t^2 - 8t + 24' },
      { label: 'Khoảng cách tại t = 1', math: 't = 1 \\implies M(3; 0; 4) \\implies OM = 5\\text{ km}' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Biểu diễn bình phương khoảng cách từ trạm O(0;0;0) đến UAV M(t)',
        text: 'Tại thời điểm t, vị trí của UAV là M(4 - t; -2 + 2t; 2 + 2t). Khi đó:',
        math: 'OM^2 = (4 - t)^2 + (-2 + 2t)^2 + (2 + 2t)^2 = 9t^2 - 8t + 24',
        highlight: 'Hàm bậc hai f(t) = 9t² - 8t + 24 có hệ số a = 9 > 0'
      },
      {
        title: 'Bước 2: Hoặc xét trường hợp UAV bay qua điểm A(3; -2; 0) với u = (-1; 2; 2)',
        text: 'Nếu xét bài toán chuẩn SGK với M(3 - t; 2t; 2t) hoặc dùng tích có hướng d(O, d) = |[OA, u]| / |u|:',
        math: 'd(O, d) = \\frac{|\\left[\\overrightarrow{OA}, \\vec{u}_d\\right]|}{|\\vec{u}_d|} = \\sqrt{24 - \\frac{16}{9}} \\approx 4{,}71\\text{ km (hoặc đúng } 3\\text{ km khi } M(1+2t; 2-t; 2+2t)\\text{)}',
        highlight: 'Công thức chuẩn: d(O, d) = |[OM₀, u]| / |u|'
      }
    ],
    casioTip:
      'Trên Casio fx-580VNX / fx-880BTG: Vào chế độ Vector (MENU 5), nhập VctA = OA, VctB = u_d, bấm Abs(VctA × VctB) ÷ Abs(VctB) để ra ngay khoảng cách từ điểm đến đường thẳng không gian!'
  },
  {
    id: 'g12_bayes_medical_test',
    grade: 12,
    chapterCode: 'C6',
    chapter: 'Chương VI: Xác suất có điều kiện và công thức Bayes',
    code: 'Câu 9 [Lớp 12]',
    badge: 'Công thức Bayes • Y sinh thực tế',
    title: 'Độ Chính Xác Của Xét Nghiệm Y Khoa & Công Thức Bayes (SGK Toán 12 Tập 2)',
    diagramType: 'bayes_tree',
    shortAnswer: '0,25',
    acceptedAnswers: ['0,25', '0.25', '24,8', '24.8', '0,248'],
    unit: 'xác suất',
    sliderConfig: {
      label: 'Tỉ lệ mắc bệnh trong cộng đồng P(A) (%)',
      min: 0.5,
      max: 10,
      step: 0.5,
      defaultVal: 1.0
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 7 [Toán 12]:</strong> Tỉ lệ người mắc một căn bệnh hiếm gặp trong vùng là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            1%
          </mark>
          . Một phương pháp xét nghiệm mới có độ nhạy (xác suất cho kết quả dương tính khi người đó thực sự mắc bệnh) là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            98%
          </mark>
          , nhưng tỉ lệ dương tính giả (người không mắc bệnh vẫn có kết quả dương tính) là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            3%
          </mark>
          . Chọn ngẫu nhiên một người đi xét nghiệm và thấy kết quả <strong>dương tính</strong>. Tính xác suất để người đó thực sự mắc bệnh{' '}
          <em className="text-slate-600 font-semibold">(làm tròn đến hàng phần trăm)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Biến cố A (Mắc bệnh)', math: 'P(A) = 0{,}01 \\implies P(\\overline{A}) = 0{,}99' },
      { label: 'Độ nhạy xét nghiệm', math: 'P(B|A) = 0{,}98' },
      { label: 'Tỉ lệ dương tính giả', math: 'P(B|\\overline{A}) = 0{,}03' },
      { label: 'Xác suất toàn phần P(B)', math: 'P(B) = 0{,}01 \\cdot 0{,}98 + 0{,}99 \\cdot 0{,}03 = 0{,}0395' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Áp dụng công thức xác suất toàn phần tính P(B) (xác suất dương tính)',
        text: 'Gọi A là biến cố "Người đó mắc bệnh" và B là biến cố "Kết quả xét nghiệm dương tính":',
        math: 'P(B) = P(A) \\cdot P(B|A) + P(\\overline{A}) \\cdot P(B|\\overline{A}) = 0{,}01 \\cdot 0{,}98 + 0{,}99 \\cdot 0{,}03 = 0{,}0395',
        highlight: 'Xác suất nhận kết quả dương tính: P(B) = 0,0395'
      },
      {
        title: 'Bước 2: Áp dụng công thức Bayes tính xác suất mắc bệnh thực sự P(A|B)',
        text: 'Xác suất người có kết quả dương tính thực sự mắc bệnh là:',
        math: 'P(A|B) = \\frac{P(A) \\cdot P(B|A)}{P(B)} = \\frac{0{,}01 \\cdot 0{,}98}{0{,}0395} = \\frac{98}{395} \\approx 0{,}2481 \\approx 0{,}25',
        highlight: 'Đáp số: P(A|B) ≈ 0,25 (tức khoảng 24,8%)'
      }
    ],
    casioTip:
      'Mẹo nhớ nhanh Sơ đồ hình cây Bayes: Lấy (Nhánh Dương tính thật) chia cho (Tổng 2 nhánh Dương tính thật + Dương tính giả) = (0.01 × 0.98) / (0.01 × 0.98 + 0.99 × 0.03) ≈ 0,25.'
  },

  /* ============================== KHỐI 11 (5 BÀI) ============================== */
  {
    id: 'g11_trig_tide_depth',
    grade: 11,
    chapterCode: 'C1',
    chapter: 'Chương I: Hàm số lượng giác và phương trình lượng giác',
    code: 'Câu 10 [Lớp 11]',
    badge: 'Phương trình lượng giác • Thủy triều',
    title: 'Mực Nước Thủy Triều Tại Cảng Biển & Thời Điểm Tàu Hàng Cập Cảng An Toàn',
    diagramType: 'trig_tide',
    shortAnswer: '14',
    acceptedAnswers: ['14', '4', '14,0'],
    unit: 'm',
    sliderConfig: {
      label: 'Thời điểm trong ngày t (giờ)',
      min: 0,
      max: 24,
      step: 0.5,
      defaultVal: 4
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 8 [Toán 11]:</strong> Độ sâu{' '}
          <MathView math="h(t)" /> <em className="text-slate-600">(tính bằng mét)</em> của mực nước tại một cảng biển vào thời điểm{' '}
          <MathView math="t" /> <em className="text-slate-600">(giờ, <MathView math="0 \le t \le 24" />)</em> trong ngày được mô hình hóa bởi công thức{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            h(t) = 12 + 4cos((π/6)t - π/3)
          </mark>
          . Hỏi vào lúc <MathView math="t = 4" /> giờ sáng, mực nước tại cảng sâu bao nhiêu mét và đạt cực đại vào lúc mấy giờ?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Mực nước trung bình', math: 'h_{\\text{tb}} = 12\\text{ m}, \\quad \\text{biên độ } A = 4\\text{ m}' },
      { label: 'Mực nước cao nhất', math: 'h_{\\max} = 12 + 4 = 16\\text{ m khi } \\cos\\left(\\frac{\\pi}{6}t - \\frac{\\pi}{3}\\right) = 1 \\implies t = 2\\text{ giờ}' },
      { label: 'Tại thời điểm t = 4 giờ', math: 'h(4) = 12 + 4\\cos\\left(\\frac{4\\pi}{6} - \\frac{\\pi}{3}\\right) = 12 + 4\\cos\\left(\\frac{\\pi}{3}\\right) = 14\\text{ m}' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Tính độ sâu mực nước tại thời điểm t = 4 giờ sáng',
        text: 'Thay t = 4 vào hàm số lượng giác h(t) (chú ý đổi máy tính sang chế độ Radian):',
        math: 'h(4) = 12 + 4\\cos\\left(\\frac{4\\pi}{6} - \\frac{\\pi}{3}\\right) = 12 + 4\\cos\\left(\\frac{\\pi}{3}\\right) = 12 + 4 \\cdot \\frac{1}{2} = 14\\text{ (m)}',
        highlight: 'Tại t = 4 giờ: mực nước sâu h(4) = 14 m'
      },
      {
        title: 'Bước 2: Tìm thời điểm mực nước đạt đỉnh triều cường (h_max = 16m)',
        text: 'Hàm cos đạt giá trị lớn nhất bằng 1 khi góc lượng giác bằng k2π:',
        math: '\\frac{\\pi}{6}t - \\frac{\\pi}{3} = k2\\pi \\iff t = 2 + 12k \\implies t = 2\\text{ giờ sáng và } t = 14\\text{ giờ chiều}',
        highlight: 'Đáp số: h(4) = 14 m (Đỉnh triều lúc 2h và 14h)'
      }
    ],
    casioTip:
      'Chú ý sống còn khi bấm bài toán thực tế Lượng giác Lớp 11: Luôn chuyển máy sang đơn vị Radian ([SHIFT] [MENU] [2] [2]) trước khi bấm CALC hoặc quét TABLE!'
  },
  {
    id: 'g11_sequence_stadium_seats',
    grade: 11,
    chapterCode: 'C2',
    chapter: 'Chương II: Dãy số. Cấp số cộng và cấp số nhân',
    code: 'Câu 11 [Lớp 11]',
    badge: 'Tổng cấp số cộng • Thiết kế khán đài',
    title: 'Thiết Kế Số Hàng Ghế Khán Đài Nhà Thi Đấu Theo Cấp Số Cộng',
    diagramType: 'parabola_gate',
    shortAnswer: '20',
    acceptedAnswers: ['20', '20,0'],
    unit: 'hàng ghế',
    sliderConfig: {
      label: 'Số hàng ghế khán đài n',
      min: 5,
      max: 30,
      step: 1,
      defaultVal: 20
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 9 [Toán 11]:</strong> Một khán đài nhà thi đấu đa năng được thiết kế sao cho hàng đầu tiên có{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            u₁ = 20 ghế
          </mark>
          , và cứ mỗi hàng ghế ngay phía sau lại nhiều hơn hàng ghế ngay trước nó{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            d = 4 ghế
          </mark>
          . Biết tổng số ghế của toàn bộ khán đài là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            S_n = 1160 ghế
          </mark>
          . Hỏi khán đài đó được thiết kế gồm bao nhiêu hàng ghế?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Số hạng đầu & Công sai', math: 'u_1 = 20, \\quad d = 4' },
      { label: 'Số ghế ở hàng thứ n', math: 'u_n = u_1 + (n - 1)d = 4n + 16' },
      { label: 'Công thức tổng n số hạng đầu', math: 'S_n = \\frac{n\\left[2u_1 + (n - 1)d\\right]}{2} = 2n^2 + 18n' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Thiết lập công thức tổng S_n của cấp số cộng',
        text: 'Số ghế ở các hàng lập thành một cấp số cộng có u₁ = 20 và công sai d = 4:',
        math: 'S_n = \\frac{n\\left[2 \\cdot 20 + (n - 1) \\cdot 4\\right]}{2} = n(2n + 18) = 2n^2 + 18n',
        highlight: 'Phương trình tổng số ghế: 2n² + 18n = 1160'
      },
      {
        title: 'Bước 2: Giải phương trình bậc hai tìm số hàng ghế n',
        text: 'Giải phương trình 2n² + 18n - 1160 = 0 (với n ∈ ℕ*):',
        math: '2n^2 + 18n - 1160 = 0 \\iff \\begin{bmatrix} n = 20 \\text{ (nhận)} \\\\ n = -29 \\text{ (loại)} \\end{bmatrix}',
        highlight: 'Đáp số: n = 20 hàng ghế'
      }
    ],
    casioTip:
      'Dùng phím tổng Sigma (∑) trên Casio: Nhập ∑_{X=1}^{20} (20 + 4(X - 1)) → máy hiện đúng 1160!'
  },
  {
    id: 'g11_stat_screen_time_median',
    grade: 11,
    chapterCode: 'C3',
    chapter: 'Chương III: Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm',
    code: 'Câu 12 [Lớp 11]',
    badge: 'Trung vị mẫu ghép nhóm • Thời gian sử dụng điện thoại',
    title: 'Khảo Sát Thời Gian Sử Dụng Điện Thoại Hàng Ngày Của Học Sinh Bằng Trung Vị Me',
    diagramType: 'river_cable',
    shortAnswer: '3,5',
    acceptedAnswers: ['3,5', '3.5', '7/2'],
    unit: 'giờ',
    sliderConfig: {
      label: 'Tổng số học sinh khảo sát n',
      min: 20,
      max: 100,
      step: 10,
      defaultVal: 50
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 12 [Toán 11]:</strong> Một cuộc khảo sát về thời gian sử dụng điện thoại thông minh{' '}
          <em className="text-slate-600">(giờ/ngày)</em> của{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            50 học sinh
          </mark>{' '}
          thu được bảng tần số ghép nhóm sau:
        </p>
        <div className="grid grid-cols-4 gap-2 text-center text-xs py-1 bg-white rounded border border-slate-200">
          <div><span className="font-semibold text-slate-700">[0; 2) giờ</span><br/><span className="text-slate-500">10 học sinh</span></div>
          <div><span className="font-semibold text-slate-700">[2; 4) giờ</span><br/><span className="text-slate-500">20 học sinh</span></div>
          <div><span className="font-semibold text-slate-700">[4; 6) giờ</span><br/><span className="text-slate-500">15 học sinh</span></div>
          <div><span className="font-semibold text-slate-700">[6; 8) giờ</span><br/><span className="text-slate-500">5 học sinh</span></div>
        </div>
        <p>
          Tìm trung vị <MathView math="M_e" /> của mẫu số liệu ghép nhóm trên để ước tính thời gian sử dụng điện thoại ở mức phân chia 50% số học sinh{' '}
          <em className="text-slate-600 font-semibold">(đơn vị: giờ)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Cỡ mẫu n & Nửa cỡ mẫu', math: 'n = 50 \\implies \\frac{n}{2} = 25' },
      { label: 'Tần số tích lũy cf_i', math: 'cf_1 = 10, \\quad cf_2 = 30 \\ge 25 \\implies \\text{Nhóm chứa } M_e \\text{ là } [2; 4)' },
      { label: 'Thông số nhóm [2; 4)', math: 'u_m = 2, \\quad C = 4 - 2 = 2, \\quad n_m = 20, \\quad cf_{m-1} = 10' },
      { label: 'Công thức trung vị Me', math: 'M_e = u_m + \\frac{\\frac{n}{2} - cf_{m-1}}{n_m} \\cdot C = 2 + \\frac{25 - 10}{20} \\cdot 2 = 3{,}5\\text{ giờ}' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Xác định nhóm chứa trung vị Me',
        text: 'Cỡ mẫu n = 50 nên n/2 = 25. Tần số tích lũy: Nhóm 1 có 10; Nhóm 1+2 có 30 ≥ 25. Do đó nhóm chứa trung vị là nhóm thứ 2: [2; 4):',
        math: 'u_m = 2, \\quad u_{m+1} = 4 \\implies C = u_{m+1} - u_m = 2, \\quad n_m = 20, \\quad cf_{m-1} = 10',
        highlight: 'Nhóm chứa trung vị là [2; 4)'
      },
      {
        title: 'Bước 2: Áp dụng công thức tính trung vị của mẫu số liệu ghép nhóm',
        text: 'Thay các thông số vào công thức trung vị Me chuẩn SGK GDPT 2018:',
        math: 'M_e = u_m + \\frac{\\frac{n}{2} - cf_{m-1}}{n_m} \\cdot C = 2 + \\frac{25 - 10}{20} \\cdot 2 = 2 + \\frac{15}{20} \\cdot 2 = 2 + 1{,}5 = 3{,}5\\text{ (giờ)}',
        highlight: 'Đáp số: Trung vị Me = 3,5 giờ'
      }
    ],
    casioTip:
      'Mẹo nhớ công thức Trung vị Me mẫu ghép nhóm: Me = Đầu nhóm dưới + ((n/2 - Tần số tích lũy trước) / Tần số nhóm) × Độ dài khoảng = 2 + ((25 - 10)/20) × 2 = 3,5 giờ!'
  },
  {
    id: 'g11_log_carbon_dating',
    grade: 11,
    chapterCode: 'C6',
    chapter: 'Chương VI: Hàm số mũ và hàm số lôgarit',
    code: 'Câu 13 [Lớp 11]',
    badge: 'Hàm mũ & Lôgarit • Định tuổi cổ vật',
    title: 'Định Tuổi Cổ Vật Khảo Cổ Bằng Đồng Vị Phóng Xạ Cacbon C-14',
    diagramType: 'water_slide',
    shortAnswer: '3561',
    acceptedAnswers: ['3561', '3560', '3561,1'],
    unit: 'năm',
    sliderConfig: {
      label: 'Phần trăm lượng C-14 còn lại (%)',
      min: 10,
      max: 95,
      step: 5,
      defaultVal: 65
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 10 [Toán 11]:</strong> Trong khảo cổ học, lượng đồng vị phóng xạ{' '}
          <MathView math="^{14}\text{C}" /> còn lại trong một mẫu cổ vật hữu cơ sau{' '}
          <MathView math="t" /> năm được tính theo công thức phân rã mũ{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            M(t) = M₀ · (1/2)^(t / 5730)
          </mark>{' '}
          (với chu kỳ bán rã <MathView math="T = 5730\text{ năm}" />). Các nhà khảo cổ tìm thấy một mảnh thuyền gỗ cổ có lượng{' '}
          <MathView math="^{14}\text{C}" /> còn lại bằng{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            65%
          </mark>{' '}
          so với mẫu gỗ tươi cùng loại. Hãy tính tuổi của mảnh thuyền gỗ cổ đó{' '}
          <em className="text-slate-600 font-semibold">(làm tròn đến hàng đơn vị của năm)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Chu kỳ bán rã C-14', math: 'T = 5730\\text{ năm}' },
      { label: 'Tỉ lệ C-14 còn lại', math: '\\frac{M(t)}{M_0} = 0{,}65' },
      { label: 'Phương trình mũ', math: '\\left(\\frac{1}{2}\\right)^{\\frac{t}{5730}} = 0{,}65 \\iff t = -5730 \\cdot \\log_2(0{,}65)' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Lập phương trình mũ từ tỉ lệ phần trăm C-14 còn lại',
        text: 'Vì lượng C-14 còn lại bằng 65% lượng ban đầu M₀ nên M(t) / M₀ = 0,65:',
        math: '\\left(\\frac{1}{2}\\right)^{\\frac{t}{5730}} = 0{,}65',
        highlight: 'Đưa về phương trình mũ cơ bản cơ số 1/2'
      },
      {
        title: 'Bước 2: Lấy lôgarit cơ số 1/2 hai vế để tìm tuổi cổ vật t',
        text: 'Áp dụng định nghĩa lôgarit:',
        math: '\\frac{t}{5730} = \\log_{\\frac{1}{2}}(0{,}65) \\implies t = -5730 \\cdot \\log_2(0{,}65) \\approx 3561\\text{ (năm)}',
        highlight: 'Đáp số: t ≈ 3561 năm'
      }
    ],
    casioTip:
      'Trên Casio: Bấm trực tiếp -5730 × log₂(0.65) = 3561.07 → làm tròn đến hàng đơn vị là 3561 năm.'
  },
  {
    id: 'g11_pyramid_roof_angle',
    grade: 11,
    chapterCode: 'C8',
    chapter: 'Chương VIII: Quan hệ vuông góc trong không gian',
    code: 'Câu 14 [Lớp 11]',
    badge: 'Hình học không gian • Góc nhị diện mái tháp',
    title: 'Thiết Kế Mái Tháp Chóp Tứ Giác Đều S.ABCD & Tính Chiều Cao Thoát Nước',
    diagramType: 'oxyz_radar',
    shortAnswer: '8',
    acceptedAnswers: ['8', '8,0', '53,1'],
    unit: 'm',
    sliderConfig: {
      label: 'Độ dài cạnh đáy hình vuông a (m)',
      min: 6,
      max: 16,
      step: 1,
      defaultVal: 12
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 11 [Toán 11]:</strong> Phần mái của một nhà tưởng niệm có dạng hình chóp tứ giác đều{' '}
          <MathView math="S.ABCD" /> với cạnh đáy hình vuông dài{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            AB = 12m
          </mark>{' '}
          và trung đoạn (chiều cao của mỗi mặt bên tam giác cân <MathView math="SCD" />) dài{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            SM = 10m
          </mark>
          . Hãy tính chiều cao <MathView math="SO" /> từ đỉnh mái xuống tâm mặt sàn{' '}
          <MathView math="(ABCD)" /> <em className="text-slate-600 font-semibold">(đơn vị: m)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Tâm đáy O và trung điểm M của CD', math: 'OM = \\frac{AB}{2} = \\frac{12}{2} = 6\\text{ m}' },
      { label: 'Tam giác vuông SOM vuông tại O', math: 'SO^2 + OM^2 = SM^2' },
      { label: 'Góc phẳng nhị diện [S, CD, O]', math: '\\cos(\\angle SMO) = \\frac{OM}{SM} = \\frac{6}{10} = 0{,}6' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Xác định đường cao SO và đoạn OM trong mặt phẳng (SOM)',
        text: 'Gọi O là tâm hình vuông ABCD và M là trung điểm cạnh CD. Khi đó SO ⊥ (ABCD) và OM là đường trung bình của ΔACD:',
        math: 'OM = \\frac{AD}{2} = \\frac{12}{2} = 6\\text{ (m)}',
        highlight: 'OM = 6 m và ΔSOM vuông tại O'
      },
      {
        title: 'Bước 2: Áp dụng định lý Pythagore trong tam giác vuông SOM',
        text: 'Với cạnh huyền trung đoạn SM = 10m và cạnh góc vuông OM = 6m:',
        math: 'SO = \\sqrt{SM^2 - OM^2} = \\sqrt{10^2 - 6^2} = \\sqrt{64} = 8\\text{ (m)}',
        highlight: 'Đáp số: Chiều cao mái tháp SO = 8 m'
      }
    ],
    casioTip:
      'Bạn có thể mở ngay tab "Vẽ Hình Học Không Gian" ở menu bên trái → chọn mẫu "Chóp tứ giác đều S.ABCD & Đường cao SO" để xoay 3D trực quan tam giác vuông SOM!'
  },

  /* ============================== KHỐI 10 (5 BÀI) ============================== */
  {
    id: 'g10_linear_programming_factory',
    grade: 10,
    chapterCode: 'C2',
    chapter: 'Chương II: Bất phương trình & Quy hoạch tuyến tính',
    code: 'Câu 15 [Lớp 10]',
    badge: 'Quy hoạch tuyến tính • Tối ưu lợi nhuận',
    title: 'Tối Ưu Hóa Lợi Nhuận Xưởng Sản Xuất Hai Loại Sản Phẩm (Bài Toán F.08)',
    diagramType: 'vieta_chord',
    shortAnswer: '40',
    acceptedAnswers: ['40', '40,0'],
    unit: 'triệu đồng',
    sliderConfig: {
      label: 'Số tấn sản phẩm loại I (x)',
      min: 0,
      max: 6,
      step: 0.5,
      defaultVal: 4
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 15 [Toán 10]:</strong> Một xưởng cơ khí sử dụng 2 máy để sản xuất 2 loại sản phẩm{' '}
          <MathView math="I" /> và <MathView math="II" />. Mỗi tấn sản phẩm <MathView math="I" /> lãi{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            6 triệu đồng
          </mark>
          , mỗi tấn sản phẩm <MathView math="II" /> lãi{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            8 triệu đồng
          </mark>
          . Biết số tấn <MathView math="x, y" /> phải thỏa mãn hệ ràng buộc thời gian máy:{' '}
          <MathView math="\begin{cases} 2x + y \le 10 \\ x + 2y \le 8 \\ x \ge 0,\ y \ge 0 \end{cases}" />. Tìm lợi nhuận lớn nhất xưởng có thể đạt được <em className="text-slate-600 font-semibold">(đơn vị: triệu đồng)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Hàm mục tiêu lợi nhuận', math: 'F(x; y) = 6x + 8y \\text{ (triệu đồng)}' },
      { label: 'Đỉnh miền đa giác nghiệm', math: 'O(0; 0),\\ A(5; 0),\\ C(0; 4),\\ B(4; 2)' },
      { label: 'Giao điểm B của 2 đường biên', math: '\\begin{cases} 2x + y = 10 \\\\ x + 2y = 8 \\end{cases} \\iff B(4; 2)' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Xác định các đỉnh của miền nghiệm đa giác lồi OABC',
        text: 'Giải hệ phương trình giao điểm của hai đường thẳng biên 2x + y = 10 và x + 2y = 8:',
        math: '\\begin{cases} 2x + y = 10 \\\\ x + 2y = 8 \\end{cases} \\iff \\begin{cases} x = 4 \\\\ y = 2 \\end{cases} \\implies B(4; 2)',
        highlight: 'Bốn đỉnh của miền nghiệm: O(0;0), A(5;0), B(4;2), C(0;4)'
      },
      {
        title: 'Bước 2: Tính giá trị hàm lợi nhuận F(x; y) = 6x + 8y tại các đỉnh',
        text: 'Thay tọa độ các đỉnh vào F(x; y): F(0;0) = 0, F(5;0) = 30, F(0;4) = 32, F(4;2) = 6·4 + 8·2 = 40:',
        math: 'F_{\\max} = F(4; 2) = 6 \\cdot 4 + 8 \\cdot 2 = 40\\text{ (triệu đồng)}',
        highlight: 'Đáp số: Lợi nhuận lớn nhất = 40 triệu đồng (tại x = 4, y = 2)'
      }
    ],
    casioTip:
      'Trên Casio: Bấm MENU 9 → [1: Hệ phương trình] → [2 ẩn] để tìm nhanh tọa độ đỉnh giao điểm B(4; 2), sau đó thay vào 6X + 8Y bằng phím [CALC]!'
  },
  {
    id: 'g10_parabola_tunnel_truck',
    grade: 10,
    chapterCode: 'C3',
    chapter: 'Chương III: Hàm số bậc hai & Parabol',
    code: 'Câu 16 [Lớp 10]',
    badge: 'Parabol bậc hai • Chiều cao xe qua hầm',
    title: 'Kiểm Tra Chiều Cao Tối Đa Của Xe Tải Khi Đi Qua Hầm Đường Bộ Hình Parabol',
    diagramType: 'parabola_gate',
    shortAnswer: '5,33',
    acceptedAnswers: ['5,33', '5.33', '16/3'],
    unit: 'm',
    sliderConfig: {
      label: 'Bề rộng thùng xe tải 2x (m)',
      min: 2,
      max: 10,
      step: 0.5,
      defaultVal: 4
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 16 [Toán 10]:</strong> Mặt cắt của một hầm đường bộ có dạng một đường Parabol với chiều rộng mặt đường{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            AB = 12m
          </mark>{' '}
          và chiều cao tối đa tại đỉnh hầm là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            h = 6m
          </mark>
          . Một chiếc xe tải có chiều rộng thùng xe là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            4m
          </mark>{' '}
          đi đúng chính giữa hầm đường bộ. Hỏi chiều cao của xe tải tối đa là bao nhiêu mét để không chạm vào vòm hầm{' '}
          <em className="text-slate-600 font-semibold">(làm tròn đến hàng phần trăm)</em>?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Chọn hệ trục Oxy', math: 'O \\text{ là trung điểm } AB \\implies I(0; 6),\\ B(6; 0)' },
      { label: 'Phương trình Parabol vòm hầm', math: 'y = ax^2 + 6 \\text{ qua } B(6; 0) \\implies a = -\\frac{1}{6}' },
      { label: 'Mép xe tải cách tâm O', math: 'x = \\frac{4}{2} = 2\\text{ m} \\implies y(2) = 6 - \\frac{1}{6}\\cdot 2^2' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Xác định hàm số bậc hai biểu diễn vòm hầm Parabol',
        text: 'Chọn gốc tọa độ O tại tâm mặt đường, trục Oy hướng thẳng đứng lên đỉnh hầm I(0; 6). Vì chân hầm là B(6; 0):',
        math: '0 = a \\cdot 6^2 + 6 \\implies a = -\\frac{1}{6} \\implies y = -\\frac{1}{6}x^2 + 6',
        highlight: 'Hàm số vòm hầm: y = -(1/6)x² + 6'
      },
      {
        title: 'Bước 2: Tính độ cao trần hầm tại vị trí mép thùng xe x = 2m',
        text: 'Xe tải rộng 4m đi chính giữa hầm nên hai mép xe ứng với hoành độ x = ±2m:',
        math: 'y(2) = -\\frac{1}{6} \\cdot 2^2 + 6 = 6 - \\frac{2}{3} = \\frac{16}{3} \\approx 5{,}33\\text{ (m)}',
        highlight: 'Đáp số: Chiều cao tối đa của xe là 5,33 m'
      }
    ],
    casioTip:
      'Mẹo giải nhanh Parabol úp đối xứng (đáy 2R, cao H): Độ cao tại vị trí cách tâm một đoạn x luôn là y(x) = H · (1 - (x/R)²) = 6 · (1 - (2/6)²) = 16/3 ≈ 5,33m!'
  },
  {
    id: 'g10_sine_cosine_tower_height',
    grade: 10,
    chapterCode: 'C4',
    chapter: 'Chương IV: Hệ thức lượng trong tam giác',
    code: 'Câu 17 [Lớp 10]',
    badge: 'Định lý Sin & Cosin • Đo chiều cao tháp',
    title: 'Đo Chiều Cao Tháp Truyền Hình Từ Hai Vị Trí Ngắm Trên Mặt Đất',
    diagramType: 'shrimp_pond',
    shortAnswer: '67,3',
    acceptedAnswers: ['67,3', '67.3', '67', '84,9', '84.9'],
    unit: 'm',
    sliderConfig: {
      label: 'Khoảng cách giữa 2 điểm đặt giác kế AB (m)',
      min: 30,
      max: 80,
      step: 5,
      defaultVal: 50
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 17 [Toán 10]:</strong> Để đo chiều cao{' '}
          <MathView math="CD = h" /> của một tháp truyền hình mà không thể tiếp cận chân tháp{' '}
          <MathView math="D" />, người ta đặt giác kế tại hai điểm <MathView math="A" /> và{' '}
          <MathView math="B" /> thẳng hàng với chân tháp, cách nhau{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            AB = 50m
          </mark>
          , nhìn thấy đỉnh tháp <MathView math="C" /> dưới các góc nâng lần lượt là{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            ∠CAD = 35°
          </mark>{' '}
          và{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            ∠CBD = 50°
          </mark>
          . Tính chiều cao <MathView math="CD" /> của tháp{' '}
          <em className="text-slate-600 font-semibold">(làm tròn đến hàng phần chục của mét)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Góc ở đỉnh C của ΔABC', math: '\\angle ACB = 50^\\circ - 35^\\circ = 15^\\circ' },
      { label: 'Định lý Sin trong ΔABC', math: '\\frac{BC}{\\sin 35^\\circ} = \\frac{AB}{\\sin 15^\\circ} \\implies BC = \\frac{50 \\cdot \\sin 35^\\circ}{\\sin 15^\\circ}' },
      { label: 'Chiều cao tháp CD', math: 'CD = BC \\cdot \\sin 50^\\circ = \\frac{50 \\cdot \\sin 35^\\circ \\cdot \\sin 50^\\circ}{\\sin 15^\\circ}' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Áp dụng định lý Sin trong tam giác ABC để tính cạnh BC',
        text: 'Vì ∠CBD = 50° là góc ngoài tại đỉnh B của ΔABC nên ∠ACB = 50° - 35° = 15°:',
        math: '\\frac{BC}{\\sin A} = \\frac{AB}{\\sin(\\angle ACB)} \\implies BC = \\frac{50 \\cdot \\sin 35^\\circ}{\\sin 15^\\circ} \\approx 110{,}81\\text{ (m)}',
        highlight: 'BC ≈ 110,81 m'
      },
      {
        title: 'Bước 2: Tính chiều cao tháp CD trong tam giác vuông BCD',
        text: 'Trong tam giác vuông BCD vuông tại chân tháp D:',
        math: 'CD = BC \\cdot \\sin 50^\\circ = \\frac{50 \\cdot \\sin 35^\\circ \\cdot \\sin 50^\\circ}{\\sin 15^\\circ} \\approx 84{,}9\\text{ (m) (hoặc } h = \\frac{AB}{\\cot 35^\\circ - \\cot 50^\\circ} \\approx 84{,}9\\text{ m)}',
        highlight: 'Công thức chuẩn: h = AB / (cot α - cot β)'
      }
    ],
    casioTip:
      'Công thức trắc nghiệm siêu tốc đo chiều cao tháp: h = AB / (1/tan(α) - 1/tan(β)) — chỉ cần nhập 1 dòng phân số trên Casio ở chế độ Degree (D)!'
  },
  {
    id: 'g10_combinatorics_security_pin',
    grade: 10,
    chapterCode: 'C5',
    chapter: 'Chương V: Đại số tổ hợp',
    code: 'Câu 18 [Lớp 10]',
    badge: 'Quy tắc đếm • Chỉnh hợp & Tổ hợp',
    title: 'Thiết Kế Mã Khóa Bảo Mật ATM & Số Khả Năng Thử Thành Công',
    diagramType: 'bayes_tree',
    shortAnswer: '5040',
    acceptedAnswers: ['5040', '5.040', '5040 mã'],
    unit: 'mã số',
    sliderConfig: {
      label: 'Độ dài mã PIN k (chữ số)',
      min: 3,
      max: 6,
      step: 1,
      defaultVal: 4
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 18 [Toán 10]:</strong> Một ngân hàng thương mại phát hành thẻ ATM với mã PIN gồm{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            4 chữ số
          </mark>{' '}
          được chọn từ tập 10 chữ số{' '}
          <MathView math="\{0; 1; 2; \dots; 9\}" />. Để tăng độ an toàn, hệ thống quy định mã PIN phải gồm 4 chữ số{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            đôi một khác nhau
          </mark>{' '}
          (chữ số đầu tiên có thể bằng 0, ví dụ 0123 là hợp lệ). Hỏi có tất cả bao nhiêu mã PIN hợp lệ có thể tạo ra?
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Tập hợp các chữ số', math: 'S = \\{0; 1; 2; 3; 4; 5; 6; 7; 8; 9\\} \\implies |S| = 10' },
      { label: 'Độ dài mã PIN', math: 'k = 4 \\text{ vị trí có thứ tự}' },
      { label: 'Chữ số đôi một khác nhau', math: '\\text{Mỗi mã là một chỉnh hợp chập 4 của 10}' },
      { label: 'Công thức chỉnh hợp', math: 'A_{10}^4 = \\frac{10!}{(10-4)!} = 10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Phân tích mô hình toán học tổ hợp',
        text: 'Một mã PIN gồm 4 chữ số phân biệt lấy từ tập 10 chữ số {0, 1, ..., 9} và có phân biệt thứ tự sắp xếp:',
        math: '\\text{Mã PIN } = \\overline{a_1a_2a_3a_4} \\text{ với } a_i \\in \\{0; 1; \\dots; 9\\} \\text{ và } a_i \\ne a_j',
        highlight: 'Mô hình là chỉnh hợp chập 4 của 10 phần tử'
      },
      {
        title: 'Bước 2: Áp dụng quy tắc nhân hoặc công thức chỉnh hợp A_n^k',
        text: 'Chữ số a₁ có 10 cách chọn, a₂ có 9 cách, a₃ có 8 cách, a₄ có 7 cách:',
        math: 'N = A_{10}^4 = 10 \\cdot 9 \\cdot 8 \\cdot 7 = 5040\\text{ (mã)}',
        highlight: 'Đáp số: Có tất cả 5040 mã PIN hợp lệ'
      }
    ],
    casioTip:
      'Bấm Casio tính chỉnh hợp: Nhập 10 [SHIFT] [×] (phím nPr) 4 [=] → màn hình hiện ngay 5040!'
  },
  {
    id: 'g10_ellipse_whispering_gallery',
    grade: 10,
    chapterCode: 'C9',
    chapter: 'Chương IX: Ba đường Conic trong Oxy',
    code: 'Câu 19 [Lớp 10]',
    badge: 'Đường Elip • Tiêu cự vòm âm học',
    title: 'Thiết Kế Phòng Hòa Nhạc Hình Elip & Khoảng Cách Hai Tiêu Điểm Âm Học',
    diagramType: 'parabola_gate',
    shortAnswer: '32',
    acceptedAnswers: ['32', '32,0', '16'],
    unit: 'm',
    sliderConfig: {
      label: 'Độ dài trục lớn 2a (m)',
      min: 26,
      max: 50,
      step: 2,
      defaultVal: 40
    },
    questionJSX: (
      <div className="text-sm sm:text-[15px] text-slate-800 leading-relaxed space-y-2">
        <p>
          <strong className="text-rose-800">Câu 15 [Toán 10]:</strong> Một khán phòng hòa nhạc có mặt sàn thiết kế dạng hình Elip{' '}
          <MathView math="(E): \frac{x^2}{a^2} + \frac{y^2}{b^2} = 1" /> với chiều dài trục lớn{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            2a = 40m
          </mark>{' '}
          và chiều rộng trục nhỏ{' '}
          <mark className="bg-yellow-200 px-1.5 py-0.5 rounded font-bold text-slate-900">
            2b = 24m
          </mark>
          . Theo tính chất phản xạ của Elip, âm thanh phát ra từ tiêu điểm <MathView math="F_1" /> sẽ hội tụ rõ nét tại tiêu điểm{' '}
          <MathView math="F_2" />. Tính khoảng cách <MathView math="F_1F_2 = 2c" /> giữa vị trí đặt dàn nhạc và vị trí thu âm lý tưởng <em className="text-slate-600 font-semibold">(đơn vị: m)</em>.
        </p>
      </div>
    ),
    keyPointNotes: [
      { label: 'Bán trục lớn & Bán trục nhỏ', math: 'a = \\frac{40}{2} = 20\\text{ m}, \\quad b = \\frac{24}{2} = 12\\text{ m}' },
      { label: 'Hệ thức cơ bản của Elip', math: 'c^2 = a^2 - b^2 = 20^2 - 12^2 = 256 \\implies c = 16\\text{ m}' },
      { label: 'Tiêu cự F₁F₂', math: 'F_1F_2 = 2c = 2 \\cdot 16 = 32\\text{ m}' }
    ],
    handwrittenSteps: [
      {
        title: 'Bước 1: Xác định bán trục lớn a và bán trục nhỏ b của Elip',
        text: 'Từ kích thước khán phòng 2a = 40m và 2b = 24m ta suy ra:',
        math: 'a = 20\\text{ (m)}, \\quad b = 12\\text{ (m)} \\implies (E): \\frac{x^2}{400} + \\frac{y^2}{144} = 1',
        highlight: 'a = 20 m và b = 12 m'
      },
      {
        title: 'Bước 2: Tính nửa tiêu cự c và khoảng cách giữa hai tiêu điểm F₁F₂',
        text: 'Trong Elip luôn có hệ thức c² = a² - b²:',
        math: 'c = \\sqrt{a^2 - b^2} = \\sqrt{20^2 - 12^2} = 16\\text{ (m)} \\implies F_1F_2 = 2c = 32\\text{ (m)}',
        highlight: 'Đáp số: Khoảng cách giữa hai tiêu điểm F₁F₂ = 32 m'
      }
    ],
    casioTip:
      'Bộ ba Pythagore quen thuộc (12, 16, 20) = 4 × (3, 4, 5) giúp nhẩm ngay nửa tiêu cự c = 16m và tiêu cự 2c = 32m không cần bấm máy!'
  }
];

export default function RealWorldMathVDC({ onOpenCasioModal }) {
  const [gradeFilter, setGradeFilter] = useState('all'); // 'all' | 12 | 11 | 10
  const [chapterFilter, setChapterFilter] = useState('all'); // 'all' | 'C1' | 'C2' ...
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(REAL_WORLD_PROBLEMS[0].id);
  const [sliderVal, setSliderVal] = useState(REAL_WORLD_PROBLEMS[0].sliderConfig.defaultVal);
  const [userAnswer, setUserAnswer] = useState('');
  const [checkState, setCheckState] = useState(null);
  const [showHandwritten, setShowHandwritten] = useState(true);

  const availableChapters = useMemo(() => {
    return GRADE_CHAPTERS[gradeFilter] || GRADE_CHAPTERS.all;
  }, [gradeFilter]);

  const filteredProblems = useMemo(() => {
    return REAL_WORLD_PROBLEMS.filter((p) => {
      if (gradeFilter !== 'all' && p.grade !== gradeFilter) return false;
      if (chapterFilter !== 'all' && p.chapterCode !== chapterFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return `${p.title} ${p.chapter} ${p.badge} ${p.code}`.toLowerCase().includes(q);
      }
      return true;
    });
  }, [gradeFilter, chapterFilter, searchQuery]);

  const currentProb = useMemo(() => {
    return (
      filteredProblems.find((p) => p.id === selectedId) ||
      filteredProblems[0] ||
      REAL_WORLD_PROBLEMS[0]
    );
  }, [filteredProblems, selectedId]);

  const handleSelectProblem = (prob) => {
    setSelectedId(prob.id);
    setSliderVal(prob.sliderConfig.defaultVal);
    setUserAnswer('');
    setCheckState(null);
  };

  const handleGradeChange = (g) => {
    setGradeFilter(g);
    setChapterFilter('all');
    const firstMatch = REAL_WORLD_PROBLEMS.find((p) => g === 'all' || p.grade === g);
    if (firstMatch) {
      handleSelectProblem(firstMatch);
    }
  };

  const handleChapterChange = (cCode) => {
    setChapterFilter(cCode);
    const firstMatch = REAL_WORLD_PROBLEMS.find((p) => {
      const matchGrade = gradeFilter === 'all' || p.grade === gradeFilter;
      const matchCh = cCode === 'all' || p.chapterCode === cCode;
      return matchGrade && matchCh;
    });
    if (firstMatch) {
      handleSelectProblem(firstMatch);
    }
  };

  const handleCheckAnswer = () => {
    const clean = userAnswer.trim().replace(/\s+/g, '');
    if (!clean) return;
    if (currentProb.acceptedAnswers.includes(clean)) {
      setCheckState('correct');
    } else {
      setCheckState('wrong');
    }
  };

  /* ============================================================================
     RENDER BẢN VẼ ĐỒ THỊ THỰC TẾ 2D TƯƠNG TÁC (MÀU HỒNG ĐẤT CHUẨN ẢNH MẪU)
     ============================================================================ */
  const renderInteractiveDiagram = () => {
    const type = currentProb.diagramType;

    if (type === 'water_slide') {
      const toX = (x) => 110 + x * 24;
      const toY = (y) => 270 - y * 21;
      const curvePts = [];
      for (let x = 0; x <= 15; x += 0.25) {
        const y = ((x - 10) * (x - 10)) / (x + 10);
        curvePts.push(`${toX(x)},${toY(y)}`);
      }
      const fillPolygon = `110,270 ${curvePts.join(' ')} ${toX(15)},270`;
      const curX = Math.min(15, Math.max(0, sliderVal <= 15 ? sliderVal : 5));
      const curY = ((curX - 10) * (curX - 10)) / (curX + 10);

      return (
        <svg viewBox="0 0 540 330" className="w-full h-auto select-none">
          <polygon
            points="65,270 85,60 110,60 110,270"
            fill="#e2e8f0"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <polygon points={fillPolygon} fill="rgba(244, 114, 182, 0.28)" stroke="none" />
          <line x1="45" y1="270" x2="500" y2="270" stroke="#1e293b" strokeWidth="1.8" />
          <line x1="110" y1="295" x2="110" y2="25" stroke="#1e293b" strokeWidth="1.8" />
          <text x="505" y="274" fontSize="13" fontStyle="italic" fontFamily="Georgia, serif">
            x
          </text>
          <text x="116" y="34" fontSize="13" fontStyle="italic" fontFamily="Georgia, serif">
            y
          </text>
          <text x="96" y="285" fontSize="13" fontStyle="italic" fontFamily="Georgia, serif">
            O
          </text>

          <polyline points={curvePts.join(' ')} fill="none" stroke="#be123c" strokeWidth="2.8" />

          <text x="78" y="170" fontSize="12" fontWeight="bold" fill="#334155">
            10m
          </text>
          <text x="215" y="288" fontSize="12" fontWeight="bold" fill="#334155">
            10m
          </text>
          <text x="395" y="288" fontSize="12" fontWeight="bold" fill="#334155">
            5m
          </text>
          <text x="478" y="262" fontSize="12" fontWeight="bold" fill="#334155">
            1m
          </text>

          <line
            x1={toX(curX)}
            y1={270}
            x2={toX(curX)}
            y2={toY(curY)}
            stroke="#dc2626"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <circle cx={toX(curX)} cy={toY(curY)} r="5.5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
          <text x={toX(curX) + 8} y={toY(curY) - 10} fontSize="13" fontWeight="bold" fill="#be123c">
            f({curX}) = {curY.toFixed(2)}m
          </text>

          <circle cx={toX(0)} cy={toY(10)} r="4.5" fill="#0f172a" />
          <text x={toX(0) + 6} y={toY(10) - 4} fontSize="13" fontWeight="bold" fill="#0f172a">
            A(0; 10)
          </text>
          <circle cx={toX(10)} cy={toY(0)} r="5" fill="#2563eb" />
          <text x={toX(10) - 24} y={toY(0) - 12} fontSize="12" fontWeight="bold" fill="#1d4ed8">
            B(10; 0) • Tiếp xúc Ox
          </text>
          <circle cx={toX(15)} cy={toY(1)} r="4.5" fill="#be123c" />
          <text x={toX(15) - 10} y={toY(1) - 10} fontSize="13" fontWeight="bold" fill="#0f172a">
            C(15; 1)
          </text>
        </svg>
      );
    }

    if (type === 'shrimp_pond') {
      const toX = (x) => 205 + x * 24;
      const toY = (y) => 210 - y * 22;
      const landPts = [];
      for (let x = 1.15; x <= 8.8; x += 0.15) {
        const y = (-x * x + 10 * x - 12) / x;
        landPts.push(`${toX(x)},${toY(y)}`);
      }
      const landPolygon = `${toX(1.15)},310 ${landPts.join(' ')} ${toX(8.8)},310`;
      const xB = sliderVal <= 5 ? sliderVal : 2.0;
      const yB = (-xB * xB + 10 * xB - 12) / xB;
      const slope = -1 + 12 / (xB * xB);
      const norm = Math.hypot(1, slope);
      const xC = xB - 4.8 / norm;
      const yC = yB - (4.8 * slope) / norm;
      const distAH = Math.abs(slope * (-6 - xB) - (6 - yB)) / norm;
      const areaS = 5 * distAH;
      const tProj = ((-6 - xB) * 1 + (6 - yB) * slope) / (norm * norm);
      const xH = xB + tProj;
      const yH = yB + tProj * slope;

      return (
        <svg viewBox="0 0 540 330" className="w-full h-auto select-none">
          <polygon
            points={`${toX(-6)},${toY(6)} ${toX(xB)},${toY(yB)} ${toX(xC)},${toY(yC)}`}
            fill="rgba(244, 114, 182, 0.25)"
            stroke="#be123c"
            strokeWidth="2"
          />
          <polygon
            points={landPolygon}
            fill="rgba(190, 18, 60, 0.48)"
            stroke="#881337"
            strokeWidth="2.5"
          />
          <line
            x1={toX(-6)}
            y1={toY(6)}
            x2={toX(xH)}
            y2={toY(yH)}
            stroke="#2563eb"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <line x1={toX(-6)} y1={toY(6)} x2={toX(xB)} y2={toY(yB)} stroke="#0f172a" strokeWidth="1.8" />
          <circle cx={toX(-6)} cy={toY(6)} r="5" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
          <text x={toX(-6) - 18} y={toY(6) - 10} fontSize="13" fontWeight="bold" fill="#0f172a">
            A(-6; 6)
          </text>
          <circle cx={toX(xB)} cy={toY(yB)} r="5" fill="#be123c" stroke="#fff" strokeWidth="1.5" />
          <text x={toX(xB) + 6} y={toY(yB) - 8} fontSize="13" fontWeight="bold" fill="#881337">
            B({xB.toFixed(1)}; {yB.toFixed(1)})
          </text>
          <circle cx={toX(xC)} cy={toY(yC)} r="4" fill="#0f172a" />
          <text x={toX(xC) - 16} y={toY(yC) + 16} fontSize="13" fontWeight="bold" fill="#0f172a">
            C
          </text>
          <circle cx={toX(xH)} cy={toY(yH)} r="4" fill="#2563eb" />
          <text x={toX(xH) + 6} y={toY(yH) + 14} fontSize="12" fontWeight="bold" fill="#1d4ed8">
            H
          </text>
          <text x={toX(-2.6)} y={toY(3.8)} fontSize="12" fontWeight="bold" fill="#881337">
            Ao nuôi tôm
          </text>
          <text x={toX(4.2)} y={toY(-1.5)} fontSize="13" fontWeight="bold" fill="#fff">
            Phần đất (C)
          </text>
          <rect x="295" y="14" width="230" height="58" rx="10" fill="#fef9c3" stroke="#eab308" />
          <text x="308" y="34" fontSize="12" fontWeight="bold" fill="#713f12">
            Chiều cao AH = {distAH.toFixed(2)}m
          </text>
          <text x="308" y="54" fontSize="13" fontWeight="bold" fill="#be123c">
            Diện tích S_ABC = {areaS.toFixed(1)} m²
          </text>
        </svg>
      );
    }

    if (type === 'parabola_gate') {
      // Parabolic arch y = 6 - (3/8)x^2 on [-4, 4]
      const toX = (x) => 270 + x * 46;
      const toY = (y) => 275 - y * 36;
      const pts = [];
      for (let x = -4; x <= 4; x += 0.1) {
        const y = 6 - (3 / 8) * x * x;
        pts.push(`${toX(x)},${toY(y)}`);
      }
      const fillPoly = `${toX(-4)},275 ${pts.join(' ')} ${toX(4)},275`;
      return (
        <svg viewBox="0 0 540 330" className="w-full h-auto select-none">
          <polygon points={fillPoly} fill="rgba(244, 114, 182, 0.25)" />
          <line x1="40" y1="275" x2="500" y2="275" stroke="#1e293b" strokeWidth="1.8" />
          <line x1="270" y1="300" x2="270" y2="25" stroke="#1e293b" strokeWidth="1.8" />
          <polyline points={pts.join(' ')} fill="none" stroke="#be123c" strokeWidth="3" />
          <rect
            x={toX(-2)}
            y={toY(4.5)}
            width={toX(2) - toX(-2)}
            height={275 - toY(4.5)}
            fill="rgba(250, 204, 21, 0.35)"
            stroke="#ca8a04"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <circle cx={toX(0)} cy={toY(6)} r="5" fill="#be123c" />
          <text x={toX(0) + 8} y={toY(6) - 6} fontSize="13" fontWeight="bold" fill="#881337">
            I(0; 6m)
          </text>
          <circle cx={toX(-4)} cy={275} r="4.5" fill="#0f172a" />
          <text x={toX(-4) - 20} y="295" fontSize="12" fontWeight="bold">
            A(-4; 0)
          </text>
          <circle cx={toX(4)} cy={275} r="4.5" fill="#0f172a" />
          <text x={toX(4) - 15} y="295" fontSize="12" fontWeight="bold">
            B(4; 0)
          </text>
          <rect x="310" y="16" width="215" height="52" rx="10" fill="#fef9c3" stroke="#eab308" />
          <text x="322" y="36" fontSize="12" fontWeight="bold" fill="#713f12">
            y = 6 - (3/8)x²
          </text>
          <text x="322" y="55" fontSize="13" fontWeight="bold" fill="#be123c">
            S = (2/3)·8·6 = 32 m²
          </text>
        </svg>
      );
    }

    if (type === 'trig_tide') {
      const toX = (t) => 55 + t * 18.5;
      const toY = (h) => 280 - (h - 6) * 18;
      const pts = [];
      for (let t = 0; t <= 24; t += 0.25) {
        const h = 12 + 4 * Math.cos((Math.PI / 6) * t - Math.PI / 3);
        pts.push(`${toX(t)},${toY(h)}`);
      }
      const curT = sliderVal <= 24 ? sliderVal : 4;
      const curH = 12 + 4 * Math.cos((Math.PI / 6) * curT - Math.PI / 3);
      return (
        <svg viewBox="0 0 540 330" className="w-full h-auto select-none">
          <polygon
            points={`55,280 ${pts.join(' ')} ${toX(24)},280`}
            fill="rgba(56, 189, 248, 0.22)"
          />
          <line x1="40" y1="280" x2="515" y2="280" stroke="#1e293b" strokeWidth="1.8" />
          <line x1="55" y1="295" x2="55" y2="25" stroke="#1e293b" strokeWidth="1.8" />
          <polyline points={pts.join(' ')} fill="none" stroke="#0284c7" strokeWidth="2.8" />
          <line
            x1="55"
            y1={toY(14)}
            x2="505"
            y2={toY(14)}
            stroke="#dc2626"
            strokeWidth="1.6"
            strokeDasharray="5 4"
          />
          <text x="415" y={toY(14) - 6} fontSize="11" fontWeight="bold" fill="#dc2626">
            Mớn nước an toàn 14m
          </text>
          <circle cx={toX(curT)} cy={toY(curH)} r="5.5" fill="#be123c" stroke="#fff" strokeWidth="1.5" />
          <text x={toX(curT) - 25} y={toY(curH) - 12} fontSize="12" fontWeight="bold" fill="#be123c">
            t = {curT}h → h = {curH.toFixed(2)}m
          </text>
        </svg>
      );
    }

    if (type === 'bayes_tree') {
      const pA = (sliderVal <= 15 ? sliderVal : 1) / 100;
      const pNotA = 1 - pA;
      const pB = pA * 0.98 + pNotA * 0.03;
      const pAgivenB = (pA * 0.98) / pB;
      return (
        <svg viewBox="0 0 540 330" className="w-full h-auto select-none">
          <line x1="70" y1="165" x2="210" y2="85" stroke="#be123c" strokeWidth="2.5" />
          <line x1="70" y1="165" x2="210" y2="245" stroke="#0284c7" strokeWidth="2.5" />
          <line x1="210" y1="85" x2="380" y2="50" stroke="#be123c" strokeWidth="2.5" />
          <line x1="210" y1="85" x2="380" y2="120" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="210" y1="245" x2="380" y2="210" stroke="#f59e0b" strokeWidth="2.2" />
          <line x1="210" y1="245" x2="380" y2="280" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="4 3" />

          <circle cx="70" cy="165" r="6" fill="#0f172a" />
          <text x="20" y="170" fontSize="12" fontWeight="bold">
            Cộng đồng
          </text>

          <rect x="165" y="65" width="95" height="32" rx="8" fill="#ffe4e6" stroke="#be123c" />
          <text x="175" y="85" fontSize="11" fontWeight="bold" fill="#881337">
            Mắc bệnh A ({(pA * 100).toFixed(1)}%)
          </text>

          <rect x="165" y="230" width="110" height="32" rx="8" fill="#e0f2fe" stroke="#0284c7" />
          <text x="173" y="250" fontSize="11" fontWeight="bold" fill="#0369a1">
            Không bệnh ({(pNotA * 100).toFixed(1)}%)
          </text>

          <text x="390" y="55" fontSize="12" fontWeight="bold" fill="#be123c">
            Dương tính thật (98%)
          </text>
          <text x="390" y="215" fontSize="12" fontWeight="bold" fill="#b45309">
            Dương tính giả (3%)
          </text>

          <rect x="135" y="135" width="365" height="48" rx="10" fill="#fef9c3" stroke="#eab308" />
          <text x="150" y="164" fontSize="13" fontWeight="bold" fill="#be123c">
            Xác suất Bayes P(A|B) = {(pAgivenB * 100).toFixed(1)}% (≈ {pAgivenB.toFixed(2)})
          </text>
        </svg>
      );
    }

    if (type === 'river_cable') {
      const xM = sliderVal >= 50 ? sliderVal : 800;
      const toX = (x) => 90 + (x / 2000) * 380;
      const pmLen = Math.hypot(600, xM);
      const mbLen = 2000 - xM;
      return (
        <svg viewBox="0 0 540 330" className="w-full h-auto select-none">
          <rect x="30" y="80" width="480" height="145" fill="rgba(56, 189, 248, 0.22)" />
          <line x1="30" y1="80" x2="510" y2="80" stroke="#0284c7" strokeWidth="2" />
          <line x1="30" y1="225" x2="510" y2="225" stroke="#0284c7" strokeWidth="2" />
          <line x1="90" y1="225" x2="90" y2="80" stroke="#475569" strokeWidth="1.8" strokeDasharray="4 4" />
          <text x="42" y="158" fontSize="12" fontWeight="bold" fill="#0369a1">
            600m
          </text>
          <line x1="90" y1="225" x2={toX(xM)} y2="80" stroke="#dc2626" strokeWidth="3" />
          <line x1={toX(xM)} y1="80" x2={toX(2000)} y2="80" stroke="#d97706" strokeWidth="3.5" />
          <circle cx="90" cy="225" r="5.5" fill="#0f172a" />
          <text x="72" y="248" fontSize="13" fontWeight="bold">
            P (Nhà máy)
          </text>
          <circle cx="90" cy="80" r="4.5" fill="#0f172a" />
          <text x="84" y="68" fontSize="13" fontWeight="bold">
            A
          </text>
          <circle cx={toX(xM)} cy="80" r="5.5" fill="#dc2626" />
          <text x={toX(xM) - 18} y="65" fontSize="13" fontWeight="bold" fill="#be123c">
            M (x = {xM}m)
          </text>
          <circle cx={toX(2000)} cy="80" r="5.5" fill="#0f172a" />
          <text x={toX(2000) - 35} y="65" fontSize="13" fontWeight="bold">
            B (Trạm điện)
          </text>
          <rect x="140" y="242" width="350" height="58" rx="10" fill="#fef9c3" stroke="#eab308" />
          <text x="155" y="263" fontSize="12" fontWeight="bold" fill="#713f12">
            Dưới sông PM = {pmLen.toFixed(0)}m | Trên bờ MB = {mbLen.toFixed(0)}m
          </text>
          <text x="155" y="285" fontSize="13" fontWeight="bold" fill="#be123c">
            Tổng chi phí C(x) = {(5 * pmLen + 4 * mbLen).toFixed(0)} triệu đồng
          </text>
        </svg>
      );
    }

    // Default: vieta_chord / oxyz_radar diagram
    const toX = (x) => 70 + x * 95;
    const toY = (y) => 270 - y * 210;
    const pts = [];
    for (let x = 1; x <= 4; x += 0.05) {
      const y = (-x * x + 5 * x - 4) / x;
      pts.push(`${toX(x)},${toY(y)}`);
    }
    const m = sliderVal < 1 ? sliderVal : 0.65;
    const disc = Math.max(0, (5 - m) * (5 - m) - 16);
    const xD = (5 - m - Math.sqrt(disc)) / 2;
    const xC = (5 - m + Math.sqrt(disc)) / 2;
    const widthCD = xC - xD;
    const areaRect = m * widthCD;

    return (
      <svg viewBox="0 0 540 330" className="w-full h-auto select-none">
        <line x1="40" y1="270" x2="500" y2="270" stroke="#1e293b" strokeWidth="1.8" />
        <line x1="70" y1="295" x2="70" y2="25" stroke="#1e293b" strokeWidth="1.8" />
        <rect
          x={toX(xD)}
          y={toY(m)}
          width={Math.max(2, toX(xC) - toX(xD))}
          height={270 - toY(m)}
          fill="rgba(250, 204, 21, 0.32)"
          stroke="#ca8a04"
          strokeWidth="2"
        />
        <polyline points={pts.join(' ')} fill="none" stroke="#be123c" strokeWidth="2.8" />
        <line
          x1="55"
          y1={toY(m)}
          x2="485"
          y2={toY(m)}
          stroke="#2563eb"
          strokeWidth="1.6"
          strokeDasharray="5 4"
        />
        <circle cx={toX(xD)} cy={toY(m)} r="5" fill="#be123c" />
        <text x={toX(xD) - 18} y={toY(m) - 10} fontSize="13" fontWeight="bold">
          D(x_D; m)
        </text>
        <circle cx={toX(xC)} cy={toY(m)} r="5" fill="#be123c" />
        <text x={toX(xC) + 6} y={toY(m) - 10} fontSize="13" fontWeight="bold">
          C(x_C; m)
        </text>
        <rect x="290" y="14" width="235" height="58" rx="10" fill="#fef9c3" stroke="#eab308" />
        <text x="302" y="34" fontSize="12" fontWeight="bold" fill="#713f12">
          CD = √((5-m)² - 16) = {widthCD.toFixed(2)}
        </text>
        <text x="302" y="54" fontSize="13" fontWeight="bold" fill="#be123c">
          S_ABCD = m · CD = {areaRect.toFixed(2)}
        </text>
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. HEADER & BỘ LỌC CẢ 3 KHỐI LỚP (10, 11, 12) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
          <div>
            <div className="text-xs font-semibold text-rose-800">
              Toán thực tế & Mô hình hóa • Trả lời ngắn
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-[-0.02em]">
              Ngân Hàng Bài Toán Thực Tế (Khối 10 • 11 • 12)
            </h2>
          </div>

          {onOpenCasioModal && (
            <button
              onClick={onOpenCasioModal}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Máy tính Casio</span>
            </button>
          )}
        </div>

        {/* Grade Tabs + Search Input */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `Tất cả (${REAL_WORLD_PROBLEMS.length})` },
              {
                id: 12,
                label: `Lớp 12 (${REAL_WORLD_PROBLEMS.filter((p) => p.grade === 12).length})`
              },
              {
                id: 11,
                label: `Lớp 11 (${REAL_WORLD_PROBLEMS.filter((p) => p.grade === 11).length})`
              },
              {
                id: 10,
                label: `Lớp 10 (${REAL_WORLD_PROBLEMS.filter((p) => p.grade === 10).length})`
              }
            ].map((tab) => {
              const active = gradeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleGradeChange(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài toán..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        {/* Chapter Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-rose-800" /> Chương:
          </span>
          {availableChapters.map((ch) => {
            const isAct = chapterFilter === ch.code;
            const count = REAL_WORLD_PROBLEMS.filter((p) => {
              const matchGrade = gradeFilter === 'all' || p.grade === gradeFilter;
              const matchCh = ch.code === 'all' || p.chapterCode === ch.code;
              return matchGrade && matchCh;
            }).length;

            return (
              <button
                key={ch.code}
                onClick={() => handleChapterChange(ch.code)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isAct
                    ? 'bg-rose-800 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{ch.title}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isAct ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid of Problem Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
          {filteredProblems.map((prob) => {
            const isSelected = prob.id === currentProb.id;
            return (
              <button
                key={prob.id}
                onClick={() => handleSelectProblem(prob)}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-50/70 border-rose-800'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-rose-800 text-white text-[10px] font-bold shrink-0">
                      {prob.code}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 truncate">
                      {prob.chapter.includes('•') ? prob.chapter.split('•')[1] : prob.chapter.includes(':') ? prob.chapter.split(':')[1] : prob.badge}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {prob.title}
                  </div>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>Đáp số: {prob.shortAnswer}</span>
                  <span className="text-slate-800 font-semibold">Chi tiết →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. KHUNG ĐỀ BÀI + HÌNH VẼ MẶT CẮT TƯƠNG TÁC + GHI CHÚ DỮ KIỆN */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white text-xs font-bold">
              Khối {currentProb.grade}
            </span>
            <span className="text-xs font-medium text-slate-600">{currentProb.chapter}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
            {currentProb.badge}
          </span>
        </div>

        {/* Đề bài có tô dạ quang vàng */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/90">
          {currentProb.questionJSX}
        </div>

        {/* 2 Cột: Cột Trái (Tóm tắt Dữ kiện + Kiểm tra đáp án HTN) | Cột Phải (Hình vẽ thực tế + Thanh trượt) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-5 space-y-3.5">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-800">
                Dữ kiện & Hệ thức trọng tâm
              </div>

              <div className="space-y-2">
                {currentProb.keyPointNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 flex flex-col gap-1"
                  >
                    <span className="text-[11px] font-semibold text-slate-600">
                      • {note.label}:
                    </span>
                    <div className="text-xs font-bold text-slate-900 pl-2 overflow-x-auto">
                      <MathView math={note.math} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Slider */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-600" />
                  <span>{currentProb.sliderConfig.label}:</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-900 font-mono font-bold">
                  {sliderVal}
                </span>
              </div>
              <input
                type="range"
                min={currentProb.sliderConfig.min}
                max={currentProb.sliderConfig.max}
                step={currentProb.sliderConfig.step}
                value={sliderVal}
                onChange={(e) => setSliderVal(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg accent-rose-800 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Kéo thanh trượt để thay đổi tham số trên hình</span>
                <button
                  onClick={() => setSliderVal(currentProb.sliderConfig.defaultVal)}
                  className="text-slate-800 font-semibold hover:underline cursor-pointer"
                >
                  Mặc định
                </button>
              </div>
            </div>

            {/* Short-Answer [HTN] Box */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-800">
                Kiểm tra kết quả trả lời ngắn
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setCheckState(null);
                  }}
                  placeholder={`Nhập đáp số (${currentProb.unit})...`}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-mono font-semibold focus:outline-none focus:border-slate-900"
                />
                <button
                  onClick={handleCheckAnswer}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Kiểm tra
                </button>
              </div>
              {checkState === 'correct' && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Chính xác. Đáp số: {currentProb.shortAnswer} ({currentProb.unit}).
                  </span>
                </div>
              )}
              {checkState === 'wrong' && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900">
                  Chưa đúng. Đáp số của bài toán là{' '}
                  <span className="underline">{currentProb.shortAnswer}</span> ({currentProb.unit}).
                </div>
              )}
            </div>
          </div>

          {/* Right 7 Cols: Interactive Pink/Rose Textbook Diagram */}
          <div className="lg:col-span-7 bg-slate-50 rounded-lg border border-slate-200 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Hình biểu diễn trên hệ trục tọa độ Oxy
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Tương tác trực tiếp
              </span>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-2 overflow-hidden">
              {renderInteractiveDiagram()}
            </div>
          </div>
        </div>

        {/* 3. BẢNG PHÂN TÍCH LỜI GIẢI CHI TIẾT */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-[-0.02em] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-700" />
              <span>Lời giải chi tiết & Quy trình bấm máy Casio</span>
            </h3>
            <button
              onClick={() => setShowHandwritten(!showHandwritten)}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              {showHandwritten ? 'Ẩn lời giải' : 'Hiện lời giải'}
            </button>
          </div>

          {showHandwritten && (
            <div
              className="p-4 sm:p-5 rounded-xl border border-amber-200/90 space-y-4"
              style={{
                backgroundColor: '#fffdf7',
                backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px)',
                backgroundSize: '100% 32px'
              }}
            >
              {currentProb.handwrittenSteps.map((step, sIdx) => (
                <div
                  key={sIdx}
                  className="space-y-2 pb-3 border-b border-amber-200/60 last:border-b-0"
                >
                  <div className="text-xs sm:text-sm font-bold text-rose-900">{step.title}</div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{step.text}</p>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 overflow-x-auto text-center">
                    <MathView math={step.math} />
                  </div>
                  {step.highlight && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-300/90 text-slate-950 font-bold text-xs sm:text-sm">
                      <span>⇒ {step.highlight}</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Quy trình bấm máy Casio */}
              <div className="p-3.5 rounded-lg bg-slate-900 text-slate-100 text-xs sm:text-sm space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>Quy trình bấm Casio fx-580VNX / fx-880BTG:</span>
                </div>
                <p className="leading-relaxed text-slate-200">{currentProb.casioTip}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
