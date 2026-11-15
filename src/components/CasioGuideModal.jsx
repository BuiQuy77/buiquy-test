import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calculator,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Box,
  Compass,
  GitBranch,
  Keyboard,
  Zap,
  Search,
  Layers,
  Copy,
  Check,
  BarChart3,
  BookOpen
} from 'lucide-react';
import MathDisplay from './MathView';

const CASIO_DATA = {
  part1: {
    title: 'Chương I: Đạo Hàm & Khảo Sát Hàm Số (Toán 12)',
    badge: 'Chương I • Tập 1',
    solverKey: 'calculus',
    icon: TrendingUp,
    color: 'blue',
    tips: [
      {
        id: 'p1-minmax',
        title: '1. Quét Bảng Giá Trị (TABLE) Tìm GTLN (Max) - GTNN (Min) & Tương Giao',
        problem: 'Tìm GTLN, GTNN của hàm số $f(x) = x + \\frac{4}{x}$ trên đoạn $[1; 3]$ hoặc đếm số nghiệm phương trình $f(x) = m$.',
        formula: '\\max_{[1;3]} f(x), \\quad \\min_{[1;3]} f(x), \\quad \\text{Step} = \\frac{\\text{End} - \\text{Start}}{29}',
        fx580: [
          'Nhấn [MENU] [8] để vào phương thức Bảng giá trị (Table).',
          'Mẹo tắt g(x) để quét được 45 dòng: Nhấn [SHIFT] [MENU] (SETUP) → [▾] [▾] → [1: Bảng] → [1: f(x)].',
          'Nhập hàm số: f(x) = X + 4/X rồi nhấn [=].',
          'Nhập Bắt đầu (Start) = 1 [=], Kết thúc (End) = 3 [=], Bước nhảy (Step) = (3 - 1) ÷ 29 [=].',
          'Dò cột f(x): Giá trị lớn nhất là Max ≈ 5 (tại x = 1), nhỏ nhất là Min = 4 (tại x = 2).'
        ],
        fx880: [
          'Nhấn [HOME] → di chuyển chọn [Bảng giá trị (Table)] → nhấn [OK].',
          'Nhấn [TOOLS] → chọn [Xác định f(x)/g(x)] → chọn [Xác định f(x)] → nhập X + 4/X → [EXE].',
          'Nhấn [TOOLS] → chọn [Phạm vi bảng]: Start = 1, End = 3, Step = (3 - 1) ÷ 29 → chọn [Chấp nhận].',
          'Quan sát cột f(x) để đọc cực đại, cực tiểu, GTLN = 5, GTNN = 4 và số lần đổi chiều biến thiên.'
        ],
        proTip: 'Với hàm lượng giác (sin, cos, tan), BẮT BUỘC chuyển máy về đơn vị Radian (chữ R trên màn hình) trước khi quét Table!'
      },
      {
        id: 'p1-derivative',
        title: '2. Tính Nhanh Đạo Hàm Tại Điểm & Viết Phương Trình Tiếp Tuyến',
        problem: 'Tính hệ số góc tiếp tuyến $k = f\'(x_0)$ của đồ thị $y = \\frac{2x+1}{x-1}$ tại điểm có hoành độ $x_0 = 2$ và viết PTTT.',
        formula: 'k = \\left.\\frac{d}{dx}f(x)\\right|_{x=x_0}, \\quad y = k(x - x_0) + y_0',
        fx580: [
          'Nhấn [MENU] [1] về màn hình Tính toán thông thường.',
          'Nhấn [SHIFT] [∫dx] (phím d/dx màu vàng) để gọi phép tính đạo hàm tại 1 điểm.',
          'Nhập biểu thức hàm số (2X + 1)/(X - 1) vào trong ngoặc, bấm [▸] sang ô x = nhập 2 rồi nhấn [=].',
          'Máy xuất ngay hệ số góc k = -3. Nhấn [STO] [A] để lưu hệ số góc vào biến A.',
          'Tính tung độ tiếp điểm: Nhập (2X+1)/(X-1) → nhấn [CALC] → nhập X = 2 [=] được y₀ = 5 → PTTT: y = -3(x - 2) + 5 = -3x + 11.'
        ],
        fx880: [
          'Nhấn [HOME] → chọn [Tính toán (Calculate)] → nhấn [OK].',
          'Nhấn [CATALOG] → chọn [Giải tích (Func Analysis)] → chọn [Đạo hàm (d/dx)].',
          'Nhập hàm số (2x + 1)/(x - 1) và giá trị x = 2 → nhấn [EXE] thu được k = -3.',
          'Dùng phím [VARIABLE] để lưu biến k vào A nếu cần tính tiếp khoảng cách từ tâm đối xứng đến tiếp tuyến.'
        ],
        proTip: 'Muốn kiểm tra công thức đạo hàm f\'(x) ở 4 đáp án A, B, C, D: Tính d/dx(f(x))|x=1.37 rồi trừ đi giá trị đáp án tại x = 1.37 (dùng phím CALC). Đáp án nào ra 0 (hoặc 10⁻¹²) là đúng!'
      },
      {
        id: 'p1-asymptote',
        title: '3. Tìm Nhanh Tiệm Cận Đứng, Tiệm Cận Ngang & Tiệm Cận Xiên Bằng CALC',
        problem: 'Tìm phương trình tiệm cận xiên $y = ax + b$ của đồ thị hàm phân thức bậc hai trên bậc nhất $y = f(x) = \\frac{2x^2 - 3x + 5}{x - 2}$.',
        formula: 'a = \\lim_{x \\to +\\infty} \\frac{f(x)}{x}, \\quad b = \\lim_{x \\to +\\infty} [f(x) - ax]',
        fx580: [
          'Bước 1 (Tìm hệ số góc a): Nhập biểu thức f(x)/X = (2X² - 3X + 5) / (X(X - 2)).',
          'Nhấn [CALC] → nhập X = 10^9 (bấm 1 [x10^x] 9) → nhấn [=]. Máy hiện 2.000000001 → Suy ra a = 2.',
          'Bước 2 (Tìm tung độ gốc b): Sửa biểu thức trên màn hình thành f(x) - 2X = (2X² - 3X + 5)/(X - 2) - 2X.',
          'Nhấn [CALC] → nhập X = 10^9 [=]. Máy hiện 1.000000005 → Suy ra b = 1. Vậy TCX là y = 2x + 1!',
          'Với hàm bậc 2 chia bậc 1, chỉ cần bấm CALC f(x) - aX tại X = 10^6 là chuẩn xác 100%.'
        ],
        fx880: [
          'Trong [Tính toán (Calculate)], định nghĩa hàm f(x) = (2x² - 3x + 5)/(x - 2) qua [TOOLS] → [Xác định f(x)/g(x)].',
          'Gọi f(10^9) ÷ 10^9 [EXE] → đọc hệ số a = 2.',
          'Bấm f(10^9) - 2 × 10^9 [EXE] → đọc hệ số b = 1 → kết luận ngay tiệm cận xiên y = 2x + 1.',
          'Kiểm tra Tiệm cận đứng tại nghiệm mẫu x = 2: Bấm f(2 + 10^-9) [EXE], nếu ra ±∞ (10^9) thì x = 2 là TCĐ.'
        ],
        proTip: 'Với hàm chứa căn bậc hai √(ax² + bx + c), giới hạn tại +∞ (CALC X = 10^9) và -∞ (CALC X = -10^9) sẽ cho 2 đường tiệm cận xiên/ngang khác nhau!'
      },
      {
        id: 'p1-extrema-solve',
        title: '4. Tìm Cực Trị Hàm Bậc Ba & Giải Bài Toán Tối Ưu Thực Tế Bằng SHIFT SOLVE',
        problem: 'Tìm tọa độ 2 điểm cực trị của hàm số $y = x^3 - 3x^2 - 9x + 2$ hoặc giải phương trình đạo hàm $f\'(x) = 0$ của bài toán tối ưu thực tế.',
        formula: 'y\' = 3ax^2 + 2bx + c = 0 \\implies (x_{CĐ}, y_{CĐ}), \\; (x_{CT}, y_{CT})',
        fx580: [
          'Cách 1 (Hàm bậc 3 chuẩn): Nhấn [MENU] [9] → chọn [2: Phương trình đa thức] → chọn bậc [3].',
          'Nhập hệ số a = 1, b = -3, c = -9, d = 2 rồi nhấn [=] liên tiếp để bỏ qua các nghiệm.',
          'Sau khi qua nghiệm x₃, nhấn [=] tiếp máy sẽ báo thẳng: Cực đại (Local Max) tại x = -1, y = 7 và Cực tiểu (Local Min) tại x = 3, y = -25!',
          'Cách 2 (Bài toán thực tế phức tạp): Nhập trực tiếp d/dx(f(X))|_{x=X} = 0 → nhấn [SHIFT] [CALC] (SOLVE) → nhập giá trị dự đoán X = 2 [=] để máy tự tìm điểm cực trị!'
        ],
        fx880: [
          'Nhấn [HOME] → chọn [Phương trình (Equation)] → [Phương trình đa thức] → chọn bậc [ax³ + bx² + cx + d = 0].',
          'Nhập hệ số 1, -3, -9, 2 rồi nhấn [EXE] qua các nghiệm để đọc trực tiếp tọa độ Cực đại (-1; 7) và Cực tiểu (3; -25).',
          'Với bài toán tối ưu thực tế: Vào [HOME] → [Phương trình] → [Bộ giải (Solver)], nhập d/dx(f(x))|_{x=x} = 0 để giải nghiệm cực trị chính xác.'
        ],
        proTip: 'Tính năng báo thẳng tọa độ (x_CĐ; y_CĐ), (x_CT; y_CT) của hàm bậc 3 và đỉnh Parabol bậc 2 nằm sẵn ngay trong MENU 9 (Phương trình đa thức)!'
      }
    ]
  },
  part2: {
    title: 'Chương IV: Nguyên Hàm & Tích Phân Ứng Dụng (Toán 12)',
    badge: 'Chương IV • Tập 2',
    solverKey: 'calculus',
    icon: Box,
    color: 'amber',
    tips: [
      {
        id: 'p2-integral-ab',
        title: '1. Khử Tích Phân Ẩn Số a, b, c Bằng Biến Nhớ STO + Quét TABLE',
        problem: 'Cho $\\int_{0}^{1} \\frac{x+2}{x+1}\\,dx = a + b\\ln 2$ với $a, b \\in \\mathbb{Z}$. Tính tổng $S = a + b$.',
        formula: 'A = \\int_{0}^{1} f(x)\\,dx = a + b\\ln 2 \\implies b = \\frac{A - x}{\\ln 2} \\quad (x = a \\in \\mathbb{Z})',
        fx580: [
          'Bước 1: Nhấn [MENU] [1], bấm phím tích phân [∫dx], nhập hàm (X + 2)/(X + 1) cận từ 0 đến 1 rồi nhấn [=].',
          'Bước 2: Nhấn [STO] [A] (phím (-)) để lưu kết quả tích phân vừa tính vào ô nhớ A.',
          'Bước 3: Rút ẩn b theo a: Vì A = a + b.ln(2) nên b = (A - a) / ln(2). Coi a là X, b là f(X).',
          'Bước 4: Nhấn [MENU] [8] vào Table, nhập f(x) = (A - X) / ln(2) với Start = -5, End = 5, Step = 1.',
          'Dò bảng tìm dòng có cả X và f(X) đều nguyên: Tại X = 1 thì f(X) = 1 → Suy ra a = 1, b = 1 → S = 2!'
        ],
        fx880: [
          'Tại [Tính toán], bấm [CATALOG] → [Giải tích] → [Tích phân (∫)], nhập hàm và cận 0 → 1, nhấn [EXE].',
          'Nhấn phím [VARIABLE] → chọn biến [A] → chọn [Lưu (Store)] để gán kết quả vào A.',
          'Chuyển sang [HOME] → [Bảng giá trị], đặt f(x) = (A - x) / ln(2), phạm vi Start = -5, End = 5, Step = 1.',
          'Đọc cặp số nguyên (x; f(x)) = (1; 1) → a = 1, b = 1.'
        ],
        proTip: 'Nếu tích phân có dạng A = a·ln(2) + b·ln(3), rút b = (A - X·ln(2)) / ln(3) rồi quét Table tìm dòng f(X) nguyên hoặc phân số đẹp!'
      },
      {
        id: 'p2-area-volume',
        title: '2. Tính Diện Tích Hình Phẳng (Phím Abs) & Thể Tích Khối Tròn Xoay 3D',
        problem: 'Tính diện tích hình phẳng giới hạn bởi $y = x^2 - 2x$ và $y = x$ trên $[0; 4]$, và thể tích khối tròn xoay khi quay $y = \\sqrt{x^2+1}$ quanh $Ox$ từ $0$ đến $2$.',
        formula: 'S = \\int_{a}^{b} |f(x) - g(x)|\\,dx, \\qquad V = \\pi \\int_{a}^{b} [f(x)]^2\\,dx',
        fx580: [
          'Tính Diện tích S (không cần xét dấu hay chia khoảng nghiệm): Nhấn [∫dx] → nhấn [SHIFT] [(] (phím Abs để tạo dấu trị tuyệt đối | |).',
          'Nhập biểu thức trong trị tuyệt đối: |(X² - 2X) - X|, cận dưới = 0, cận trên = 4 → nhấn [=] (đợi 2–3 giây máy tính tích phân tại điểm gãy x = 3).',
          'Tính Thể tích V: Nhớ đừng bấm chữ π vào trong tích phân để máy hiện kết quả dạng phân số đẹp! Chỉ bấm ∫(X² + 1)dx cận 0 đến 2 [=] được 14/3 → Kết quả là 14π/3!'
        ],
        fx880: [
          'Trong [Tính toán], gọi tích phân từ [CATALOG] → [Giải tích] → [Tích phân].',
          'Gọi trị tuyệt đối: [CATALOG] → [Phép tính số (Numeric Calc)] → [Giá trị tuyệt đối (Abs)], nhập |(x² - 2x) - x| cận 0 → 4 [EXE].',
          'Với thể tích khối tròn xoay V = π∫[f(x)]²dx: Tính riêng I = ∫[f(x)]²dx để nhận phân số tối giản 14/3 rồi gắn thêm π.'
        ],
        proTip: 'Mẹo Vàng: Khi tính thể tích V = π∫[f(x)]²dx, TUYỆT ĐỐI KHÔNG bấm số π vào phép tính tích phân trên máy, vì số vô tỉ π sẽ làm mất định dạng phân số tối giản a/b!'
      },
      {
        id: 'p2-antiderivative-check',
        title: '3. Thử Ngược Đáp Án Nguyên Hàm Bằng Phép Đạo Hàm d/dx',
        problem: 'Tìm họ nguyên hàm $F(x) = \\int x e^{2x}\\,dx$ trong 4 phương án trắc nghiệm.',
        formula: 'F(x) = \\int f(x)\\,dx \\iff \\left.\\frac{d}{dx}[F(x)]\\right|_{x=x_0} - f(x_0) = 0',
        fx580: [
          'Chọn 1 giá trị x₀ bất kỳ thuộc tập xác định (nên chọn số thập phân lẻ như x₀ = 1.25 để tránh trùng hợp đặc biệt).',
          'Tính giá trị hàm dưới dấu tích phân f(1.25): Nhập X·e^(2X) → nhấn [CALC] X = 1.25 [=] → nhấn [STO] [A].',
          'Kiểm tra từng đáp án F(x) bằng cách bấm: [SHIFT] [∫dx] (gọi d/dx) → nhập biểu thức đáp án F(X) tại x = 1.25 rồi trừ đi A.',
          'Đáp án nào cho kết quả bằng 0 (hoặc cỡ 10⁻¹¹ ÷ 10⁻¹²) là nguyên hàm chính xác!'
        ],
        fx880: [
          'Gán biến x = 1.25 trực tiếp tại màn hình Tính toán (hoặc qua phím [VARIABLE]).',
          'Tính f(1.25) và lưu vào biến A.',
          'Dùng [CATALOG] → [Giải tích] → [Đạo hàm (d/dx)] cho từng phương án F(x) tại x = 1.25 trừ đi A để tìm đáp án bằng 0.'
        ],
        proTip: 'Với nguyên hàm hàm lượng giác, nhớ để máy ở chế độ Radian (R) trước khi bấm d/dx!'
      },
      {
        id: 'p2-motion-stem',
        title: '4. Bài Toán Thực Tế Vận Tốc v(t) - Quãng Đường s(t) (Đúng/Sai 4 Mệnh Đề)',
        problem: 'Một vật chuyển động với vận tốc $v(t) = 12 - 3t^2$ (m/s). Kiểm tra nhanh 4 mệnh đề: gia tốc tại $t=2$, thời điểm vật dừng lại, độ dịch chuyển và tổng quãng đường từ $t=0$ đến $t=3$.',
        formula: 'a(t) = v\'(t), \\quad \\Delta s = \\int_{t_1}^{t_2} v(t)\\,dt, \\quad S_{\\text{quãng đường}} = \\int_{t_1}^{t_2} |v(t)|\\,dt',
        fx580: [
          'Mệnh đề a (Gia tốc tại t = 2): Bấm [SHIFT] [∫dx] (d/dx) của (12 - 3X²) tại x = 2 [=] → a(2) = -12 m/s².',
          'Mệnh đề b (Thời điểm dừng v(t) = 0): Giải nhanh 12 - 3X² = 0 được t = 2 (s).',
          'Mệnh đề c (Độ dịch chuyển từ 0 đến 3s): Bấm [∫dx] của (12 - 3X²) cận 0 → 3 [=] được Δs = 9 (m).',
          'Mệnh đề d (Tổng quãng đường vật đi được từ 0 đến 3s): Bấm [∫dx] của [SHIFT] [(] (Abs) |12 - 3X²| cận 0 → 3 [=] được S = 23 (m)!'
        ],
        fx880: [
          'Định nghĩa hàm f(x) = 12 - 3x² trong [TOOLS] → [Xác định f(x)/g(x)].',
          'Tính gia tốc: d/dx(f(x))|_{x=2} = -12. Tính độ dịch chuyển: ∫_0^3 f(x)dx = 9.',
          'Tính tổng quãng đường thực tế (kể cả khi vật đổi chiều): ∫_0^3 Abs(f(x))dx = 23.'
        ],
        proTip: 'Phân biệt cực kỳ quan trọng trong đề 2025: "Độ dịch chuyển" không có trị tuyệt đối ∫v(t)dt, còn "Quãng đường đi được" khi vận tốc đổi dấu BẮT BUỘC có trị tuyệt đối ∫|v(t)|dt!'
      }
    ]
  },
  part3: {
    title: 'Chương II & V: Vectơ & Tọa Độ Không Gian Oxyz (Toán 12)',
    badge: 'Chương II & V • Tập 1 & 2',
    solverKey: 'vector',
    icon: Compass,
    color: 'teal',
    tips: [
      {
        id: 'p3-cross',
        title: '1. Tích Có Hướng [u, v], Diện Tích Tam Giác & Thể Tích Tứ Diện (MENU 5)',
        problem: 'Cho $\\vec{u} = (1; -2; 3)$, $\\vec{v} = (2; 1; -1)$, $\\vec{w} = (0; 3; 2)$. Tính tích có hướng $[\\vec{u}, \\vec{v}]$, diện tích tam giác và thể tích tứ diện.',
        formula: '[\\vec{u}, \\vec{v}], \\quad S_{\\triangle ABC} = \\frac{1}{2}|[\\overrightarrow{AB}, \\overrightarrow{AC}]|, \\quad V_{ABCD} = \\frac{1}{6}|[\\overrightarrow{AB}, \\overrightarrow{AC}] \\cdot \\overrightarrow{AD}|',
        fx580: [
          'Bước 1: Nhấn [MENU] [5] để vào phương thức Vectơ → chọn [1: VctA] → chọn kích thước [3].',
          'Bước 2: Nhập tọa độ VctA: 1 [=] -2 [=] 3 [=]. Nhấn [OPTN] → [1: Tạo vectơ] → [2: VctB] → kích thước [3] → nhập 2 [=] 1 [=] -1 [=]. Tương tự tạo VctC = (0; 3; 2).',
          'Bước 3 (Tính tích có hướng): Nhấn [AC] ra màn hình Vector → nhấn [OPTN] [3: VctA] [×] [OPTN] [4: VctB] [=] → xuất ngay [-1; 7; 5]!',
          'Bước 4 (Tính diện tích tam giác): Nhấn 0.5 × [SHIFT] [(] (Abs) (VctA × VctB) [=] → ra độ dài tích có hướng chia 2.',
          'Bước 5 (Tính thể tích tứ diện): Nhấn [OPTN] [▾] [1: Tích vô hướng (Dot)] để bấm: Abs((VctA × VctB) · VctC) ÷ 6 [=].'
        ],
        fx880: [
          'Nhấn [HOME] → chọn [Vectơ (Vector)] → nhấn [TOOLS] → chọn [VctA] → [3 chiều] → nhập (1; -2; 3). Làm tương tự cho VctB và VctC.',
          'Tính tích có hướng: Nhấn [CATALOG] → [Vectơ] → [VctA] × [VctB] [EXE] → kết quả [-1; 7; 5].',
          'Gọi tích vô hướng từ [CATALOG] → [Vectơ] → [Tích vô hướng (・)] và độ dài vectơ bằng hàm Abs.'
        ],
        proTip: 'Trong phương thức Vector, phép nhân thông thường [×] giữa 2 vectơ chính là Tích có hướng [u, v]! Còn Tích vô hướng phải gọi dấu chấm [·] (Dot Product) trong OPTN ▾ 1.'
      },
      {
        id: 'p3-skew-distance',
        title: '2. Tính Nhanh Khoảng Cách Giữa 2 Đường Thẳng Chéo Nhau & Điểm Đến Đường Thẳng',
        problem: 'Tính khoảng cách giữa hai đường thẳng chéo nhau $\\Delta_1$ (qua $M_1$, VTCP $\\vec{u}_1$) và $\\Delta_2$ (qua $M_2$, VTCP $\\vec{u}_2$), hoặc khoảng cách từ điểm $M$ đến đường thẳng $\\Delta$.',
        formula: 'd(\\Delta_1, \\Delta_2) = \\frac{|[\\vec{u}_1, \\vec{u}_2] \\cdot \\overrightarrow{M_1M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}, \\qquad d(M, \\Delta) = \\frac{|[\\overrightarrow{AM}, \\vec{u}_{\\Delta}]|}{|\\vec{u}_{\\Delta}|}',
        fx580: [
          'Nhập VctA = u₁ (VTCP của Δ₁), VctB = u₂ (VTCP của Δ₂), VctC = M₁M₂ = (x₂ - x₁; y₂ - y₁; z₂ - z₁).',
          'Nhấn [AC] → tính tích có hướng VctA × VctB [=] → nhấn [STO] [D] để lưu tích có hướng vào VctD!',
          'Tính khoảng cách 2 đường chéo nhau trong 1 dòng lệnh: Nhấn [SHIFT] [(] (Abs) (VctD · VctC) ÷ [SHIFT] [(] (Abs) (VctD) [=]!',
          'Với khoảng cách từ điểm M đến đường thẳng Δ (qua A, VTCP u): Nhập VctA = AM, VctB = u rồi bấm Abs(VctA × VctB) ÷ Abs(VctB) [=].'
        ],
        fx880: [
          'Khai báo VctA = u₁, VctB = u₂, VctC = M₁M₂ trong mục [TOOLS].',
          'Tính VctA × VctB rồi lưu vào VctAns (hoặc VctD).',
          'Nhập biểu thức: Abs(VctAns ・ VctC) ÷ Abs(VctAns) [EXE] để ra kết quả chính xác.'
        ],
        proTip: 'Nhấn [STO] [D] khi đang ở màn hình kết quả Vector sẽ tự động lưu vectơ kết quả vào VctD — giúp bạn không phải chép tay tọa độ trung gian ra nháp!'
      },
      {
        id: 'p3-sphere-4vars',
        title: '3. Giải Hệ Phương Trình 4 Ẩn Tìm Mặt Cầu Đi Qua 4 Điểm A, B, C, D',
        problem: 'Viết phương trình mặt cầu $(S): x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0$ đi qua 4 điểm $A(1;0;0), B(0;2;0), C(0;0;4), O(0;0;0)$.',
        formula: '(2x_i)a + (2y_i)b + (2z_i)c - d = x_i^2 + y_i^2 + z_i^2 \\quad (i = 1,2,3,4)',
        fx580: [
          'Chuyển phương trình mặt cầu về hệ tuyến tính 4 ẩn (a, b, c, d): (2x₀)a + (2y₀)b + (2z₀)c + (-1)d = x₀² + y₀² + z₀².',
          'Nhấn [MENU] [9] → chọn [1: Hệ phương trình] → chọn số ẩn là [4].',
          'Dòng 1 (Điểm A(1;0;0)): Nhập 2 [=] 0 [=] 0 [=] -1 [=] (1²+0²+0²) [=].',
          'Dòng 2 (Điểm B(0;2;0)): Nhập 0 [=] 4 [=] 0 [=] -1 [=] 4 [=]. Dòng 3 (Điểm C(0;0;4)): 0 [=] 0 [=] 8 [=] -1 [=] 16 [=]. Dòng 4 (O): 0 [=] 0 [=] 0 [=] -1 [=] 0 [=].',
          'Nhấn [=] đọc ngay tọa độ tâm I(x; y; z) = (1/2; 1; 2) và t = d = 0 → Bán kính R = √(a² + b² + c² - d) = √21 / 2!'
        ],
        fx880: [
          'Nhấn [HOME] → chọn [Phương trình (Equation)] → chọn [Hệ phương trình] → chọn [4 ẩn].',
          'Nhập hệ số 4 phương trình tương ứng 4 điểm (cột thứ 4 luôn nhập -1, cột vế phải nhập x² + y² + z²).',
          'Nhấn [EXE] đọc nghiệm x = a, y = b, z = c, t = d.'
        ],
        proTip: 'Tại cột vế phải của hệ phương trình, bạn có thể gõ trực tiếp phép tính 3² + (-2)² + 5² [=], máy sẽ tự cộng thành 38 mà không cần tính nhẩm!'
      },
      {
        id: 'p3-angle-oxyz',
        title: '4. Tính Nhanh Góc Giữa Đường Thẳng & Mặt Phẳng Bằng Hàm Angle Trong Vector',
        problem: 'Tính góc giữa hai đường thẳng $\\Delta_1, \\Delta_2$, hoặc góc $\\varphi$ giữa đường thẳng $d$ (VTCP $\\vec{u}$) và mặt phẳng $(P)$ (VTPT $\\vec{n}$).',
        formula: '\\cos(\\Delta_1, \\Delta_2) = |\\cos(\\vec{u}_1, \\vec{u}_2)|, \\qquad \\sin(d, (P)) = |\\cos(\\vec{u}, \\vec{n})|',
        fx580: [
          'Đảm bảo máy đang ở chế độ Độ (chữ D trên màn hình): [SHIFT] [MENU] → [2: Đơn vị góc] → [1: Độ].',
          'Vào [MENU] [5] (Vector), nhập VctA = u và VctB = n.',
          'Nhấn [AC] → nhấn [OPTN] → bấm mũi tên xuống [▾] → chọn [2: Góc (Angle)].',
          'Nhập: Angle( [OPTN] [3: VctA] [SHIFT] [)] (dấu phẩy ,) [OPTN] [4: VctB] ) [=] → Máy trả về góc α giữa 2 vectơ u và n!',
          'Quy đổi về góc hình học (luôn ≤ 90°): Nếu tính góc 2 đường thẳng/2 mặt phẳng và α > 90° thì lấy 180° - α. Nếu tính góc giữa Đường thẳng & Mặt phẳng thì lấy |90° - α|!'
        ],
        fx880: [
          'Trong ứng dụng [Vectơ], khai báo VctA và VctB.',
          'Nhấn [CATALOG] → chọn [Vectơ] → chọn [Góc (Angle)].',
          'Nhập Angle(VctA, VctB) [EXE] để lấy góc giữa 2 vectơ rồi suy ra ngay góc giữa đường thẳng và mặt phẳng.'
        ],
        proTip: 'Hàm Angle(VctA, VctB) tính thẳng góc giữa 2 vectơ trong 3 giây mà không cần bấm công thức phân số chia căn bậc hai dễ nhầm dấu!'
      }
    ]
  },
  part4: {
    title: 'Chương III & VI: Thống Kê Ghép Nhóm & Xác Suất Bayes (Toán 12)',
    badge: 'Chương III & VI • Đề Thi 2025',
    solverKey: 'stats',
    icon: GitBranch,
    color: 'purple',
    tips: [
      {
        id: 'p4-grouped-stats',
        title: '1. Thống Kê Mẫu Số Liệu Ghép Nhóm: Tính x̄, Phương Sai s², Độ Lệch Chuẩn s Trong 10 Giây (MENU 6)',
        problem: 'Cho bảng tần số ghép nhóm với các nhóm $[a_i; a_{i+1})$ và tần số $n_i$. Tính nhanh số trung bình $\\bar{x}$, phương sai $s^2$ và độ lệch chuẩn $s$ không lo bấm nhầm!',
        formula: 'c_i = \\frac{a_i + a_{i+1}}{2}, \\quad \\bar{x} = \\frac{1}{n}\\sum n_i c_i, \\quad s^2 = \\frac{1}{n}\\sum n_i(c_i - \\bar{x})^2, \\quad s = \\sqrt{s^2}',
        fx580: [
          'Bước 1 (Bật cột Tần số - chỉ cần làm 1 lần): Nhấn [SHIFT] [MENU] (SETUP) → bấm [▾] → chọn [3: Thống kê] → chọn [1: Bật (On)].',
          'Bước 2: Nhấn [MENU] [6] (Thống kê) → chọn [1: 1-Biến (1-Variable)]. Màn hình hiện 2 cột: Cột X và cột Freq (Tần số).',
          'Bước 3: Tại cột X, nhập giá trị đại diện của từng nhóm c_i = (đầu mút trái + phải)/2 (có thể gõ trực tiếp phép tính (10+20)/2 [=]). Tại cột Freq, nhập tần số n_i tương ứng.',
          'Bước 4: Nhấn [AC] → nhấn [OPTN] → chọn [2: Tính 1-biến (1-Variable Calc)].',
          'Bước 5 (Đọc kết quả theo chuẩn SGK Toán 12 Việt Nam): Đọc ngay dòng x̄ (Số trung bình), dòng σ²x chính là Phương sai mẫu ghép nhóm s², và dòng σx chính là Độ lệch chuẩn s!'
        ],
        fx880: [
          'Nhấn [HOME] → chọn [Thống kê (Statistics)] → chọn [1-Biến (1-Variable)].',
          'Nếu chưa có cột Freq: Nhấn [TOOLS] → chọn [Tần số (Frequency)] → chọn [Bật (On)].',
          'Nhập cột x là giá trị đại diện c_i = (a_i + a_{i+1})/2 và cột Freq là tần số n_i.',
          'Nhấn [EXE] → chọn [Kết quả 1-Biến (1-Var Results)]: Đọc x̄, σ²x (phương sai s² theo công thức chia n của SGK 12) và σx (độ lệch chuẩn s).'
        ],
        proTip: 'LƯU Ý SỐNG CÒN: Trong SGK Toán 12 chương trình GDPT 2018, phương sai mẫu số liệu ghép nhóm chia cho n (không chia cho n-1), nên trên máy Casio ta đọc dòng σ²x và σx (chứ không đọc s²x)!'
      },
      {
        id: 'p4-quartiles',
        title: '2. Tính Nhanh Tứ Phân Vị Q₁, Q₃ & Khoảng Tứ Phân Vị ΔQ Mẫu Ghép Nhóm',
        problem: 'Tìm tứ phân vị thứ nhất $Q_1$, tứ phân vị thứ ba $Q_3$ và khoảng tứ phân vị $\\Delta_Q = Q_3 - Q_1$ của mẫu số liệu ghép nhóm.',
        formula: 'Q_k = u_m + \\frac{\\frac{k \\cdot n}{4} - C_{m-1}}{n_m} \\cdot (u_{m+1} - u_m) \\quad (k \\in \\{1, 2, 3\\}), \\qquad \\Delta_Q = Q_3 - Q_1',
        fx580: [
          'Bước 1: Cộng tổng tần số n (hoặc xem n trong MENU 6). Tính vị trí: Tứ phân vị Q₁ nằm ở vị trí n/4; Q₃ nằm ở vị trí 3n/4.',
          'Bước 2: Cộng dồn tần số từ trái sang phải để xác định nhóm [u_m; u_{m+1}) đầu tiên có tần số tích lũy ≥ kn/4.',
          'Bước 3: Bấm công thức trên màn hình MENU 1: u_m + ((k·n/4 - C) / n_m) × h (với C là tổng tần số các nhóm đứng TRƯỚC nhóm chứa Q_k, n_m là tần số nhóm chứa Q_k, h = u_{m+1} - u_m là độ dài nhóm).',
          'Bước 4: Lưu Q₁ vào [STO] [A], Q₃ vào [STO] [B] rồi bấm B - A [=] để ra chính xác ΔQ dưới dạng phân số tối giản!'
        ],
        fx880: [
          'Tại màn hình [Tính toán], tính vị trí n/4 và 3n/4 để xác định nhóm chứa Q₁ và Q₃.',
          'Nhập công thức nội suy Q_k = u_m + ((k·n/4 - C)/n_m) × (u_{m+1} - u_m), lưu vào biến A và B qua phím [VARIABLE].',
          'Tính B - A [EXE] và dùng phím [FORMAT] nếu đề yêu cầu làm tròn đến hàng phần trăm.'
        ],
        proTip: 'Đừng nhầm Q₁, Q₃ hiển thị sẵn trong MENU 6 (đó là tứ phân vị của số liệu rời rạc). Với mẫu số liệu ghép nhóm, phải dùng công thức nội suy đầu mút nhóm u_m!'
      },
      {
        id: 'p4-bayes',
        title: '3. Công Thức Xác Suất Toàn Phần & Bayes: Lưu Biến STO A, B, M Giải Câu Đúng/Sai 4 Ý',
        problem: 'Cho $P(A) = 0{,}04$; $P(B|A) = 0{,}95$; $P(B|\\overline{A}) = 0{,}02$. Kiểm tra nhanh 4 mệnh đề Đúng/Sai: $P(\\overline{A}), P(B), P(A|B), P(\\overline{A}|B)$.',
        formula: 'P(B) = P(A)P(B|A) + P(\\overline{A})P(B|\\overline{A}), \\qquad P(A|B) = \\frac{P(A)P(B|A)}{P(B)}',
        fx580: [
          'Thay vì bấm lại từ đầu ở mỗi ý a, b, c, d, hãy lưu 2 nhánh của sơ đồ hình cây vào biến nhớ A và B:',
          'Nhánh 1 (A và B cùng xảy ra): Nhập 0.04 × 0.95 [=] → nhấn [STO] [A] (A = 19/500 = 0.038).',
          'Nhánh 2 (Ā và B xảy ra): Nhập (1 - 0.04) × 0.02 [=] → nhấn [STO] [B] (B = 12/625 = 0.0192).',
          'Tính xác suất toàn phần P(B): Bấm A + B [=] → nhấn [STO] [M] (M = 143/2500 = 0.0572).',
          'Tính xác suất Bayes P(A|B): Bấm A ÷ M [=] → hiện ngay phân số tối giản 95/143 (≈ 0.6643)! Tính P(Ā|B): Bấm B ÷ M [=] → 48/143!'
        ],
        fx880: [
          'Trong [Tính toán], gán nhánh 1: 0.04 × 0.95 → lưu vào biến A qua [VARIABLE].',
          'Gán nhánh 2: (1 - 0.04) × 0.02 → lưu vào biến B. Gán tổng M = A + B.',
          'Tính P(A|B) = A ÷ M [EXE] → nhận phân số tối giản 95/143 hoặc nhấn [FORMAT] → [Số thập phân] để làm tròn.'
        ],
        proTip: 'Với bài toán 3 nhánh (Nhà máy I, II, III), chỉ cần lưu 3 nhánh vào STO A, STO B, STO C rồi tổng P(B) = A + B + C lưu vào STO M!'
      },
      {
        id: 'p4-comb-sigma',
        title: '4. Tổ Hợp nCr, Chỉnh Hợp nPr & Tính Tổng Xác Suất Nhị Thức Bằng Phím Sigma Σ',
        problem: 'Gieo một xúc xắc cân đối 10 lần. Tính xác suất để mặt 6 chấm xuất hiện từ 3 đến 6 lần: $P = \\sum_{k=3}^{6} C_{10}^{k} \\left(\\frac{1}{6}\\right)^k \\left(\\frac{5}{6}\\right)^{10-k}$.',
        formula: 'C_n^k \\text{ (SHIFT ÷)}, \\quad A_n^k \\text{ (SHIFT ×)}, \\quad P = \\sum_{x=a}^{b} C_n^x p^x (1-p)^{n-x}',
        fx580: [
          'Thay vì bấm rời 4 trường hợp k = 3, 4, 5, 6 rồi cộng lại, hãy dùng phím Tổng Sigma Σ:',
          'Nhấn [SHIFT] [x] (phím x màu hồng có ký hiệu ∑ màu vàng phía trên) để gọi tổng Sigma.',
          'Nhập biểu thức bên trong Sigma: 10 [SHIFT] [÷] (C) X × (1/6)^X × (5/6)^(10 - X).',
          'Di chuyển con trỏ xuống dưới nhập x = 3, lên trên nhập 6 rồi nhấn [=] → Máy tự động cộng tổng 4 trường hợp trong 1 giây!'
        ],
        fx880: [
          'Nhấn [CATALOG] → chọn [Giải tích (Func Analysis)] → chọn [Tổng (∑)].',
          'Để gọi C_n^k: Nhấn [CATALOG] → chọn [Xác suất (Probability)] → chọn [Tổ hợp (C)].',
          'Nhập biểu thức 10 C x × (1/6)^x × (5/6)^(10-x) với cận từ x = 3 đến 6 → nhấn [EXE].'
        ],
        proTip: 'Phím Tổng Sigma ∑ cực kỳ lợi hại cho mọi bài toán xác suất có từ 3 trường hợp trở lên ("ít nhất 3 lần", "nhiều nhất 7 lần")!'
      }
    ]
  },
  grade10_11: {
    title: 'Chuyên Đề Cốt Lõi Toán 10 & 11 (Lượng Giác, Dãy Số, Giới Hạn, Mũ - Lôgarit)',
    badge: 'Toán 10 & 11 • Nền Tảng',
    solverKey: 'calculus',
    icon: Layers,
    color: 'indigo',
    tips: [
      {
        id: 'g11-limit',
        title: '1. Tính Nhanh Giới Hạn Dãy Số lim u_n & Giới Hạn Hàm Số lim f(x) Bằng CALC',
        problem: 'Tính giới hạn dạng vô định $\\lim_{x \\to 2} \\frac{\\sqrt{2x+5} - 3}{x - 2}$ hoặc $\\lim_{x \\to +\\infty} \\left(\\sqrt{x^2 + 3x + 1} - x\\right)$.',
        formula: '\\lim_{x \\to x_0} f(x) \\approx f(x_0 + 10^{-7}), \\qquad \\lim_{x \\to +\\infty} f(x) \\approx f(10^7)',
        fx580: [
          'Nhập biểu thức hàm số (√(2X + 5) - 3) / (X - 2) vào màn hình MENU 1.',
          'Trường hợp 1 (Khi x → x₀ = 2): Nhấn [CALC] → nhập 2 + 10^-7 (bấm 2 + 1 [x10^x] -7) → nhấn [=]. Máy hiện 0.3333333 → nhấn [S⇔D] hoặc đoán ngay 1/3!',
          'Trường hợp 2 (Khi x → +∞): Nhập √(X² + 3X + 1) - X → nhấn [CALC] → nhập X = 10^7 [=] → máy hiện 1.5 = 3/2!',
          'Trường hợp 3 (Khi x → -∞): Nhấn [CALC] → nhập X = -10^7 [=].'
        ],
        fx880: [
          'Định nghĩa hàm f(x) trong ứng dụng [Tính toán].',
          'Với x → x₀: Bấm f(x₀ + 10^-7) [EXE]. Với x → +∞: Bấm f(10^7) [EXE].',
          'Nếu kết quả ra một số cực lớn (như 10^7 hoặc 10^14) thì giới hạn là +∞.'
        ],
        proTip: 'Không nên nhập 10^-12 hay 10^15 vào các biểu thức chứa căn bậc hai vì vượt quá độ chính xác 15 chữ số của máy tính sẽ gây tràn số (hiện bằng 0 sai). Mức vàng chuẩn nhất là 10^-7 và 10^7!'
      },
      {
        id: 'g11-sequence',
        title: '2. Cấp Số Cộng (CSC), Cấp Số Nhân (CSN) & Tính Tổng Dãy Số Bằng Phím Sigma Σ',
        problem: 'Tính tổng $S = \\sum_{k=1}^{20} (3k - 1)$ hoặc tổng lùi vô hạn $S = 1 + \\frac{1}{3} + \\frac{1}{3^2} + \\dots + \\frac{1}{3^n} + \\dots$',
        formula: 'S_n = \\sum_{x=1}^{n} u_x, \\qquad S_{\\infty} = \\frac{u_1}{1 - q} \\approx \\sum_{x=1}^{100} u_x',
        fx580: [
          'Nhấn [SHIFT] [x] để gọi ký hiệu Tổng Sigma ∑.',
          'Nhập số hạng tổng quát u_X vào ngoặc, cận dưới X = 1, cận trên = 20 rồi nhấn [=].',
          'Với tổng cấp số nhân lùi vô hạn (x → ∞): Vì 1/3^100 đã xấp xỉ 0 tuyệt đối, chỉ cần bấm ∑ từ X = 0 đến 80 của (1/3)^X [=] → máy trả ngay phân số 3/2!'
        ],
        fx880: [
          'Vào [CATALOG] → [Giải tích] → [Tổng (∑)], nhập biểu thức số hạng tổng quát và cận từ 1 đến n [EXE].'
        ],
        proTip: 'Khi đề bài cho tổng S_n có chứa tham số n (ví dụ chọn công thức đúng theo n), hãy chọn n = 5, bấm tổng ∑ từ 1 đến 5 rồi thay n = 5 vào 4 đáp án A, B, C, D để đối chiếu!'
      },
      {
        id: 'g11-log-exp',
        title: '3. Giải Phương Trình & Bất Phương Trình Mũ - Lôgarit Bằng SHIFT SOLVE + TABLE',
        problem: 'Tìm tổng các nghiệm của phương trình $\\log_2(x^2 - 3x + 2) + \\log_{0.5}(x - 1) = 1$ hoặc giải bất phương trình lôgarit.',
        formula: 'f(x) - g(x) = 0 \\xrightarrow{\\text{SOLVE } x_1} \\frac{f(x) - g(x)}{x - x_1} = 0 \\xrightarrow{\\text{SOLVE } x_2}',
        fx580: [
          'Bước 1: Chuyển hết vế phải sang vế trái: log₂(X² - 3X + 2) + log₀.₅(X - 1) - 1.',
          'Bước 2: Nhấn [SHIFT] [CALC] (SOLVE) → nhập X = 2.5 [=] → máy tìm ra nghiệm thứ nhất x₁ = 5 → nhấn [STO] [A].',
          'Bước 3 (Kỹ thuật chia nhân tử tìm nghiệm thứ 2): Sửa biểu thức thành (Biểu thức cũ) / (X - A) rồi nhấn [SHIFT] [CALC] (SOLVE) tiếp!',
          'Nếu máy báo "Can\'t Solve" tức là phương trình chỉ có duy nhất 1 nghiệm x₁ = 5!'
        ],
        fx880: [
          'Dùng [HOME] → [Phương trình] → [Bộ giải (Solver)] để tìm nghiệm x₁.',
          'Hoặc vào [Bảng giá trị (Table)] quét hàm f(x) = VT - VP để vừa nhìn thấy điều kiện xác định (dòng báo ERROR là ngoài TXĐ), vừa thấy khoảng đổi dấu của bất phương trình!'
        ],
        proTip: 'Với bất phương trình Mũ - Lôgarit trắc nghiệm, dùng phím [CALC] thử các giá trị biên (như x = 0, x = 2.1, x = 5) để loại trừ đáp án trong 10 giây!'
      },
      {
        id: 'g11-trig',
        title: '4. Rút Gọn Đẳng Thức Lượng Giác & Kiểm Tra Họ Nghiệm Phương Trình Lượng Giác',
        problem: 'Rút gọn biểu thức $P = \\frac{\\sin 2x + 2\\sin x}{1 + \\cos x}$ hoặc kiểm tra họ nghiệm $x = \\frac{\\pi}{6} + k\\frac{2\\pi}{3}$.',
        formula: 'P(x_0) - Đáp\\_án(x_0) = 0 \\quad (\\text{Radian mode})',
        fx580: [
          'Bước 1: Chuyển máy sang chế độ Radian: [SHIFT] [MENU] → [2: Đơn vị góc] → [2: Radian].',
          'Bước 2 (Bài toán rút gọn): Gán X = 1.15 (số lẻ tránh góc đặc biệt), tính giá trị biểu thức đề bài lưu vào [STO] [A].',
          'Bước 3: Lấy A trừ đi từng đáp án (tại X = 1.15), đáp án nào bằng 0 là chính xác.',
          'Bước 4 (Kiểm tra họ nghiệm a + k·b): Nhập vế trái trừ vế phải của phương trình, nhấn [CALC] thử tại k = 0 (X = a) và k = 1 (X = a + b). Nếu cả hai đều cho kết quả = 0 thì nhận họ nghiệm đó!'
        ],
        fx880: [
          'Đặt đơn vị góc là Radian trong [SETTINGS] → [Cài đặt phép tính] → [Đơn vị góc] → [Radian].',
          'Sử dụng hàm f(x) để thử nhanh các giá trị x = a + k·b tại k = 0, 1, 2.'
        ],
        proTip: 'Khi thử họ nghiệm lượng giác có chu kỳ k·π/2 và k·π, nhớ thử cả k = 0 và k = 1 để phân biệt họ nghiệm gộp thiếu hay thừa!'
      }
    ]
  }
};

const KEY_COMPARISON_TABLE = [
  {
    action: '1. Chuyển đơn vị góc sang Radian (R)',
    purpose: 'Lượng giác, Đạo hàm, Tích phân hàm lượng giác',
    fx580: '[SHIFT] [MENU] → [2: Đơn vị góc] → [2: Radian]',
    fx880: '[SETTINGS] → [Cài đặt phép tính] → [Đơn vị góc] → [Radian]'
  },
  {
    action: '2. Bật cột Tần số (Freq) trong Thống kê',
    purpose: 'Thống kê mẫu số liệu ghép nhóm Chương III',
    fx580: '[SHIFT] [MENU] → [▾] → [3: Thống kê] → [1: Bật]',
    fx880: 'Trong Thống kê → nhấn [TOOLS] → [Tần số] → [Bật]'
  },
  {
    action: '3. Lưu kết quả vào biến nhớ A, B, C, D...',
    purpose: 'Tích phân ẩn a,b; Xác suất Bayes; Hệ số góc',
    fx580: 'Nhấn [STO] rồi nhấn phím biến ([(-)] là A, [°\'\'] là B...)',
    fx880: 'Nhấn phím [VARIABLE] → chọn biến [A] → chọn [Lưu (Store)]'
  },
  {
    action: '4. Chuyển đổi Phân số ⇔ Số thập phân',
    purpose: 'Đổi kết quả sang phân số tối giản hoặc làm tròn',
    fx580: 'Nhấn phím [S⇔D] (hoặc [SHIFT] [S⇔D] ra hỗn số)',
    fx880: 'Nhấn phím [FORMAT] → chọn [Tiêu chuẩn] hoặc [Số thập phân]'
  },
  {
    action: '5. Gọi giá trị tuyệt đối |x| (Abs)',
    purpose: 'Diện tích hình phẳng ∫|f(x)-g(x)|dx, Độ dài vectơ',
    fx580: 'Nhấn [SHIFT] [(] (phím Abs màu vàng)',
    fx880: '[CATALOG] → [Phép tính số (Numeric Calc)] → [Giá trị tuyệt đối (Abs)]'
  },
  {
    action: '6. Đạo hàm tại 1 điểm d/dx(f(x))|x=x₀',
    purpose: 'Hệ số góc tiếp tuyến, thử nguyên hàm, cực trị',
    fx580: 'Nhấn [SHIFT] [∫dx] (phím d/dx màu vàng)',
    fx880: '[CATALOG] → [Giải tích (Func Analysis)] → [Đạo hàm (d/dx)]'
  },
  {
    action: '7. Tích phân xác định ∫_a^b f(x)dx',
    purpose: 'Tích phân, diện tích hình phẳng, thể tích tròn xoay',
    fx580: 'Nhấn trực tiếp phím [∫dx] dưới phím ALPHA',
    fx880: '[CATALOG] → [Giải tích (Func Analysis)] → [Tích phân (∫)]'
  },
  {
    action: '8. Tổng Sigma ∑(f(x), x, a, b)',
    purpose: 'Tổng cấp số cộng/nhân, chuỗi xác suất nhị thức',
    fx580: 'Nhấn [SHIFT] [x] (phím biến X)',
    fx880: '[CATALOG] → [Giải tích (Func Analysis)] → [Tổng (∑)]'
  },
  {
    action: '9. Thay giá trị x bất kỳ vào biểu thức (CALC)',
    purpose: 'Tìm tiệm cận xiên (x=10^9), giới hạn, thử nghiệm',
    fx580: 'Nhập biểu thức chứa X → nhấn trực tiếp phím [CALC]',
    fx880: 'Định nghĩa hàm f(x) qua [TOOLS] rồi gõ f(giá_trị) [EXE]'
  },
  {
    action: '10. Giải phương trình bất kỳ (SOLVE)',
    purpose: 'Giải phương trình mũ, lôgarit, đạo hàm thực tế',
    fx580: 'Nhập phương trình → nhấn [SHIFT] [CALC] (SOLVE)',
    fx880: '[HOME] → [Phương trình (Equation)] → [Bộ giải (Solver)]'
  },
  {
    action: '11. Tổ hợp C_n^k (nCr) & Chỉnh hợp A_n^k (nPr)',
    purpose: 'Bài toán đếm và xác suất cổ điển / có điều kiện',
    fx580: 'Tổ hợp: [SHIFT] [÷] (nCr) • Chỉnh hợp: [SHIFT] [×] (nPr)',
    fx880: '[CATALOG] → [Xác suất (Probability)] → [Tổ hợp (C)] / [Chỉnh hợp (P)]'
  },
  {
    action: '12. Tích có hướng [u, v] & Tích vô hướng u·v',
    purpose: 'Hình học không gian Oxyz (Chương II & V)',
    fx580: '[MENU] [5]: Tích có hướng bấm [×]; Vô hướng: [OPTN] [▾] [1: Tích vô hướng]',
    fx880: '[HOME] → [Vectơ]: Tích có hướng bấm [×]; Vô hướng: [CATALOG] → [Vectơ] → [・]'
  },
  {
    action: '13. Góc giữa 2 vectơ Angle(u, v)',
    purpose: 'Tính góc giữa đường thẳng và mặt phẳng trong Oxyz',
    fx580: 'Trong [MENU] [5] → [OPTN] → [▾] → [2: Góc (Angle)]',
    fx880: 'Trong [Vectơ] → [CATALOG] → [Vectơ] → [Góc (Angle)]'
  },
  {
    action: '14. Tắt hàm g(x) trong Table để tăng dòng quét',
    purpose: 'Tăng từ 30 dòng lên 45 dòng khi tìm Max - Min',
    fx580: '[SHIFT] [MENU] → [▾] [▾] → [1: Bảng] → [1: f(x)]',
    fx880: 'Trong [Bảng giá trị] chỉ nhập hàm f(x), để trống g(x)'
  }
];

export default function CasioGuideModal({ initialPart = 'part1' }) {
  const [activeTab, setActiveTab] = useState(initialPart && CASIO_DATA[initialPart] ? initialPart : 'part1');
  const [selectedModel, setSelectedModel] = useState('both'); // 'both' | 'fx580' | 'fx880'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Interactive Lab sub-tab state (shown directly inside the unified page!)
  const [solverTab, setSolverTab] = useState('stats'); // 'stats' | 'vector' | 'bayes' | 'calculus'

  // 1. Grouped Statistics Solver State (Chương III Toán 12)
  const [statsGroups, setStatsGroups] = useState([
    { left: 40, right: 45, freq: 4 },
    { left: 45, right: 50, freq: 11 },
    { left: 50, right: 55, freq: 15 },
    { left: 55, right: 60, freq: 7 },
    { left: 60, right: 65, freq: 3 }
  ]);

  // 2. Oxyz Vector Solver State (Chương II & V Toán 12)
  const [vecU, setVecU] = useState({ x: 1, y: -2, z: 3 });
  const [vecV, setVecV] = useState({ x: 2, y: 1, z: -1 });
  const [vecW, setVecW] = useState({ x: 0, y: 3, z: 2 });

  // 3. Conditional Probability & Bayes Solver State (Chương VI Toán 12)
  const [probPA, setProbPA] = useState(0.04);
  const [probPBA, setProbPBA] = useState(0.95);
  const [probPBNotA, setProbPBNotA] = useState(0.02);

  // 4. Derivative & Oblique Asymptote Solver State (Chương I Toán 12)
  const [calcMode, setCalcMode] = useState('oblique'); // 'oblique' | 'cubic'
  const [ratCoeff, setRatCoeff] = useState({ a: 2, b: -3, c: 5, m: 1, n: -2 });
  const [cubicCoeff, setCubicCoeff] = useState({ a: 1, b: -3, c: -9, d: 2 });

  useEffect(() => {
    if (initialPart && CASIO_DATA[initialPart]) {
      setActiveTab(initialPart);
      if (CASIO_DATA[initialPart].solverKey) {
        setSolverTab(CASIO_DATA[initialPart].solverKey);
      }
    }
  }, [initialPart]);

  // Synchronize interactive solver tab when switching chapter tabs
  const handleSelectChapterTab = (tabId) => {
    setActiveTab(tabId);
    if (CASIO_DATA[tabId]?.solverKey) {
      setSolverTab(CASIO_DATA[tabId].solverKey);
    }
  };

  // Computed Statistics Results (SGK Toán 12 GDPT 2018 standard)
  const statsResult = useMemo(() => {
    const valid = statsGroups.filter(
      (g) => !isNaN(g.left) && !isNaN(g.right) && !isNaN(g.freq) && Number(g.freq) >= 0 && Number(g.right) > Number(g.left)
    );
    if (valid.length === 0) return null;

    let n = 0;
    let sumCF = 0;
    const processed = valid.map((g) => {
      const l = Number(g.left);
      const r = Number(g.right);
      const f = Number(g.freq);
      const c = (l + r) / 2;
      n += f;
      sumCF += c * f;
      return { left: l, right: r, freq: f, rep: c, cumFreq: n };
    });

    if (n === 0) return null;
    const mean = sumCF / n;
    let sumSqDiff = 0;
    processed.forEach((p) => {
      sumSqDiff += p.freq * Math.pow(p.rep - mean, 2);
    });
    const variance = sumSqDiff / n;
    const stdDev = Math.sqrt(variance);
    const rangeR = processed[processed.length - 1].right - processed[0].left;

    const calcQuartile = (k) => {
      const target = (k * n) / 4;
      let prevCum = 0;
      for (let i = 0; i < processed.length; i++) {
        const g = processed[i];
        if (g.cumFreq >= target) {
          const h = g.right - g.left;
          const val = g.left + ((target - prevCum) / (g.freq || 1)) * h;
          return {
            value: val,
            groupLabel: `[${g.left}; ${g.right})`,
            um: g.left,
            nm: g.freq,
            prevC: prevCum,
            h
          };
        }
        prevCum = g.cumFreq;
      }
      return { value: 0, groupLabel: '', um: 0, nm: 1, prevC: 0, h: 1 };
    };

    const q1 = calcQuartile(1);
    const q2 = calcQuartile(2);
    const q3 = calcQuartile(3);
    const iqr = q3.value - q1.value;

    return { n, mean, variance, stdDev, rangeR, q1, q2, q3, iqr, processed };
  }, [statsGroups]);

  // Computed Vector Results
  const vectorResult = useMemo(() => {
    const ux = Number(vecU.x) || 0, uy = Number(vecU.y) || 0, uz = Number(vecU.z) || 0;
    const vx = Number(vecV.x) || 0, vy = Number(vecV.y) || 0, vz = Number(vecV.z) || 0;
    const wx = Number(vecW.x) || 0, wy = Number(vecW.y) || 0, wz = Number(vecW.z) || 0;

    const crossX = uy * vz - uz * vy;
    const crossY = uz * vx - ux * vz;
    const crossZ = ux * vy - uy * vx;

    const dotUV = ux * vx + uy * vy + uz * vz;
    const normU = Math.sqrt(ux * ux + uy * uy + uz * uz);
    const normV = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const normCross = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);

    let angleDeg = 0;
    if (normU > 0 && normV > 0) {
      const cosVal = Math.max(-1, Math.min(1, dotUV / (normU * normV)));
      angleDeg = (Math.acos(cosVal) * 180) / Math.PI;
    }

    const scalarTriple = crossX * wx + crossY * wy + crossZ * wz;
    const areaTriangle = 0.5 * normCross;
    const volTetrahedron = Math.abs(scalarTriple) / 6;
    const skewDistance = normCross > 0 ? Math.abs(scalarTriple) / normCross : 0;

    return {
      cross: { x: crossX, y: crossY, z: crossZ },
      dotUV,
      normU,
      normV,
      normCross,
      angleDeg,
      scalarTriple,
      areaTriangle,
      volTetrahedron,
      skewDistance
    };
  }, [vecU, vecV, vecW]);

  // Computed Bayes Results
  const bayesResult = useMemo(() => {
    const pA = Math.max(0, Math.min(1, Number(probPA) || 0));
    const pBA = Math.max(0, Math.min(1, Number(probPBA) || 0));
    const pBNotA = Math.max(0, Math.min(1, Number(probPBNotA) || 0));
    const pNotA = 1 - pA;
    const branch1 = pA * pBA;
    const branch2 = pNotA * pBNotA;
    const pB = branch1 + branch2;
    const pAB = pB > 0 ? branch1 / pB : 0;
    const pNotAB = pB > 0 ? branch2 / pB : 0;

    return { pA, pNotA, pBA, pBNotA, branch1, branch2, pB, pAB, pNotAB };
  }, [probPA, probPBA, probPBNotA]);

  // Computed Calculus Results
  const calculusResult = useMemo(() => {
    if (calcMode === 'oblique') {
      const a = Number(ratCoeff.a) || 0;
      const b = Number(ratCoeff.b) || 0;
      const c = Number(ratCoeff.c) || 0;
      const m = Number(ratCoeff.m) || 1;
      const n = Number(ratCoeff.n) || 0;
      if (m === 0) return null;
      const alpha = a / m;
      const beta = (b * m - a * n) / (m * m);
      const vertAsym = -n / m;
      const remainder = c - beta * n;
      const symY = alpha * vertAsym + beta;
      return {
        type: 'oblique',
        alpha,
        beta,
        vertAsym,
        remainder,
        symCenter: { x: vertAsym, y: symY }
      };
    } else {
      const a = Number(cubicCoeff.a) || 1;
      const b = Number(cubicCoeff.b) || 0;
      const c = Number(cubicCoeff.c) || 0;
      const d = Number(cubicCoeff.d) || 0;
      if (a === 0) return null;
      const deltaPrime = b * b - 3 * a * c;
      const xU = -b / (3 * a);
      const yU = a * Math.pow(xU, 3) + b * Math.pow(xU, 2) + c * xU + d;
      let extrema = [];
      if (deltaPrime > 0) {
        const x1 = (-b - Math.sqrt(deltaPrime)) / (3 * a);
        const x2 = (-b + Math.sqrt(deltaPrime)) / (3 * a);
        const y1 = a * Math.pow(x1, 3) + b * Math.pow(x1, 2) + c * x1 + d;
        const y2 = a * Math.pow(x2, 3) + b * Math.pow(x2, 2) + c * x2 + d;
        extrema = [
          { x: x1, y: y1, label: a > 0 ? 'Cực đại' : 'Cực tiểu' },
          { x: x2, y: y2, label: a > 0 ? 'Cực tiểu' : 'Cực đại' }
        ];
      }
      const slopeLine = (2 / 3) * (c - (b * b) / (3 * a));
      const interceptLine = d - (b * c) / (9 * a);
      return {
        type: 'cubic',
        deltaPrime,
        inflection: { x: xU, y: yU },
        extrema,
        slopeLine,
        interceptLine
      };
    }
  }, [calcMode, ratCoeff, cubicCoeff]);

  const filteredTips = useMemo(() => {
    if (!CASIO_DATA[activeTab]) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CASIO_DATA[activeTab].tips;
    const allTips = [];
    Object.entries(CASIO_DATA).forEach(([, section]) => {
      section.tips.forEach((tip) => {
        const haystack = `${tip.title} ${tip.problem} ${tip.proTip} ${tip.fx580.join(' ')} ${tip.fx880.join(' ')}`.toLowerCase();
        if (haystack.includes(q)) {
          allTips.push({ ...tip, sectionBadge: section.badge });
        }
      });
    });
    return allTips;
  }, [activeTab, searchQuery]);

  const filteredKeyTable = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return KEY_COMPARISON_TABLE;
    return KEY_COMPARISON_TABLE.filter((row) =>
      `${row.action} ${row.purpose} ${row.fx580} ${row.fx880}`.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCopySequence = (id, steps) => {
    navigator.clipboard.writeText(steps.join('\n'));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const currentSection = CASIO_DATA[activeTab];

  return (
    <div className="space-y-6">
      {/* Top Page Banner (Inline Tab View - No Popup Window) */}
      <div className="bg-white border border-sky-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
              <Calculator className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Cẩm Nang & Phòng Thực Hành Casio fx-580VNX & fx-880BTG
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  20 Kỹ Thuật Thực Chiến + 4 Máy Tính Tự Động
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sky-200/90 mt-1">
                Tích hợp trực tiếp Cẩm nang bấm máy từng bước và Phòng thực hành tính toán tự động trên cùng 1 trang làm việc
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh: tiệm cận, s², Bayes, tích phân..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-300 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean Wrapped Navigation Bar (No Horizontal Scrollbar) */}
        <div className="px-5 py-3.5 bg-sky-50/90 border-b border-sky-100 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'part1', label: 'Ch.I: Đạo Hàm & Khảo Sát', icon: TrendingUp },
              { id: 'part2', label: 'Ch.IV: Nguyên Hàm - Tích Phân', icon: Box },
              { id: 'part3', label: 'Ch.II & V: Vectơ & Oxyz', icon: Compass },
              { id: 'part4', label: 'Ch.III & VI: Thống Kê & Bayes', icon: GitBranch },
              { id: 'grade10_11', label: 'Toán 10 & 11', icon: Layers },
              { id: 'compare', label: 'Bảng Đổi Phím 580 ⇄ 880', icon: Keyboard }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectChapterTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 border border-slate-200/90'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Calculator Model Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 self-start xl:self-auto shrink-0">
            <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5 text-blue-600" />
              Dòng máy:
            </span>
            <button
              onClick={() => setSelectedModel('both')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedModel === 'both'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Song song (580 & 880)
            </button>
            <button
              onClick={() => setSelectedModel('fx580')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedModel === 'fx580'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              fx-580VNX
            </button>
            <button
              onClick={() => setSelectedModel('fx880')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedModel === 'fx880'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              fx-880BTG
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: UNIFIED INTERACTIVE PRACTICE LAB (PHÒNG THỰC HÀNH CASIO TRỰC TIẾP TRÊN CÙNG 1 TAB) */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50/40 border-b border-amber-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider">
                Phòng Thực Hành Trực Tiếp
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                Máy Tính Thực Hành Casio & Tự Động Sinh Chuỗi Phím Bấm
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Nhập số liệu bài toán để đối chiếu kết quả ngay lập tức và xem hướng dẫn chuỗi phím bấm tương ứng trên máy thật.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'stats', label: '1. Thống Kê Ghép Nhóm (MENU 6)' },
              { id: 'vector', label: '2. Vectơ & Oxyz (MENU 5)' },
              { id: 'bayes', label: '3. Xác Suất Bayes (STO A, B)' },
              { id: 'calculus', label: '4. Cực Trị & Tiệm Cận Xiên' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSolverTab(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  solverTab === st.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/60'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {/* SOLVER 1: GROUPED STATISTICS (CHƯƠNG III LỚP 12) */}
          {solverTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      Chương III • Bài 9 & Bài 10 (SGK 12 Tập 1)
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                      Bảng Tần Số Mẫu Số Liệu Ghép Nhóm [aᵢ; aᵢ₊₁)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setStatsGroups([
                          ...statsGroups,
                          {
                            left: statsGroups.length > 0 ? statsGroups[statsGroups.length - 1].right : 0,
                            right: statsGroups.length > 0 ? Number(statsGroups[statsGroups.length - 1].right) + 5 : 5,
                            freq: 5
                          }
                        ])
                      }
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 cursor-pointer"
                    >
                      + Thêm nhóm
                    </button>
                    {statsGroups.length > 2 && (
                      <button
                        onClick={() => setStatsGroups(statsGroups.slice(0, -1))}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 cursor-pointer"
                      >
                        - Xóa cuối
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold">
                        <th className="p-2 border border-slate-200 text-center">Nhóm</th>
                        <th className="p-2 border border-slate-200 text-center">Đầu trái aᵢ</th>
                        <th className="p-2 border border-slate-200 text-center">Đầu phải aᵢ₊₁</th>
                        <th className="p-2 border border-slate-200 text-center bg-blue-50 text-blue-800">
                          Đại diện cᵢ (Cột X)
                        </th>
                        <th className="p-2 border border-slate-200 text-center bg-amber-50 text-amber-900">
                          Tần số nᵢ (Freq)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsGroups.map((g, idx) => {
                        const rep = (Number(g.left) + Number(g.right)) / 2;
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 border border-slate-200 text-center font-bold text-slate-600">
                              #{idx + 1}
                            </td>
                            <td className="p-1.5 border border-slate-200">
                              <input
                                type="number"
                                value={g.left}
                                onChange={(e) => {
                                  const next = [...statsGroups];
                                  next[idx].left = e.target.value;
                                  setStatsGroups(next);
                                }}
                                className="w-full text-center font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1 focus:outline-none focus:border-blue-500"
                              />
                            </td>
                            <td className="p-1.5 border border-slate-200">
                              <input
                                type="number"
                                value={g.right}
                                onChange={(e) => {
                                  const next = [...statsGroups];
                                  next[idx].right = e.target.value;
                                  setStatsGroups(next);
                                }}
                                className="w-full text-center font-semibold bg-slate-50 border border-slate-200 rounded-lg py-1 focus:outline-none focus:border-blue-500"
                              />
                            </td>
                            <td className="p-2 border border-slate-200 text-center font-extrabold text-blue-700 bg-blue-50/40">
                              {isNaN(rep) ? '-' : rep}
                            </td>
                            <td className="p-1.5 border border-slate-200 bg-amber-50/30">
                              <input
                                type="number"
                                min="0"
                                value={g.freq}
                                onChange={(e) => {
                                  const next = [...statsGroups];
                                  next[idx].freq = e.target.value;
                                  setStatsGroups(next);
                                }}
                                className="w-full text-center font-bold text-amber-900 bg-white border border-amber-300 rounded-lg py-1 focus:outline-none focus:border-amber-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {statsResult && (
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 text-xs space-y-1.5">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Keyboard className="w-4 h-4" />
                      Chuỗi phím bấm MENU 6 cho bảng số liệu trên:
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      1. Bật cột Freq: <code className="px-1.5 py-0.5 rounded bg-white/10 text-amber-200">[SHIFT] [MENU] [▾] [3] [1]</code> (580VNX) hoặc <code className="px-1.5 py-0.5 rounded bg-white/10 text-amber-200">[TOOLS] → Tần số: Bật</code> (880BTG).
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      2. Nhập cột <strong>X</strong>:{' '}
                      <code className="text-sky-300 font-bold">
                        {statsResult.processed.map((p) => `${p.rep} [=]`).join(' ')}
                      </code>
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      3. Sang cột <strong>Freq</strong>:{' '}
                      <code className="text-amber-300 font-bold">
                        {statsResult.processed.map((p) => `${p.freq} [=]`).join(' ')}
                      </code>
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      4. Nhấn <code className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300">[AC] → [OPTN] → [2: Tính 1-biến]</code> để đọc kết quả!
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-6 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Kết Quả Thống Kê Mẫu Số Liệu Ghép Nhóm (Chuẩn SGK Toán 12)
                </h4>

                {statsResult ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <div className="text-[11px] font-bold text-slate-500">Cỡ mẫu (n)</div>
                        <div className="text-lg font-black text-slate-900 mt-0.5">{statsResult.n}</div>
                        <div className="text-[10px] text-slate-500">Khoảng biến thiên R = {statsResult.rangeR}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="text-[11px] font-bold text-blue-700">Số trung bình (x̄)</div>
                        <div className="text-lg font-black text-blue-900 mt-0.5">
                          {statsResult.mean.toFixed(4)}
                        </div>
                        <div className="text-[10px] text-blue-600">Dòng x̄ trên Casio</div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="text-[11px] font-bold text-emerald-700">Phương sai (s² = σ²x)</div>
                        <div className="text-lg font-black text-emerald-900 mt-0.5">
                          {statsResult.variance.toFixed(4)}
                        </div>
                        <div className="text-[10px] text-emerald-600">Đọc dòng σ²x trên Casio</div>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="text-[11px] font-bold text-amber-800">Độ lệch chuẩn (s = σx)</div>
                        <div className="text-lg font-black text-amber-900 mt-0.5">
                          {statsResult.stdDev.toFixed(4)}
                        </div>
                        <div className="text-[10px] text-amber-700">Đọc dòng σx trên Casio</div>
                      </div>
                      <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                        <div className="text-[11px] font-bold text-purple-700">Tứ phân vị Q₁ & Q₃</div>
                        <div className="text-xs font-extrabold text-purple-900 mt-1">
                          Q₁ ≈ {statsResult.q1.value.toFixed(3)}
                        </div>
                        <div className="text-xs font-extrabold text-purple-900">
                          Q₃ ≈ {statsResult.q3.value.toFixed(3)}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                        <div className="text-[11px] font-bold text-indigo-700">Khoảng tứ phân vị ΔQ</div>
                        <div className="text-lg font-black text-indigo-900 mt-0.5">
                          {statsResult.iqr.toFixed(4)}
                        </div>
                        <div className="text-[10px] text-indigo-600">ΔQ = Q₃ - Q₁ (Q₂ ≈ {statsResult.q2.value.toFixed(2)})</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-sky-200 text-xs space-y-2">
                      <div className="font-bold text-sky-900">
                        Chi tiết công thức nội suy Tứ phân vị Q₁, Q₃ (Bài 9 SGK 12):
                      </div>
                      <div className="text-slate-700">
                        • <strong>Tìm Q₁</strong> (vị trí n/4 = {(statsResult.n / 4).toFixed(2)} → nhóm <strong>{statsResult.q1.groupLabel}</strong>):
                        <div className="mt-1 bg-sky-50/50 px-3 py-1.5 rounded-lg border border-sky-100 overflow-x-auto">
                          <MathDisplay
                            math={`Q_1 = ${statsResult.q1.um} + \\frac{${statsResult.n / 4} - ${statsResult.q1.prevC}}{${statsResult.q1.nm}} \\cdot ${statsResult.q1.h} \\approx ${statsResult.q1.value.toFixed(4)}`}
                          />
                        </div>
                      </div>
                      <div className="text-slate-700">
                        • <strong>Tìm Q₃</strong> (vị trí 3n/4 = {((3 * statsResult.n) / 4).toFixed(2)} → nhóm <strong>{statsResult.q3.groupLabel}</strong>):
                        <div className="mt-1 bg-sky-50/50 px-3 py-1.5 rounded-lg border border-sky-100 overflow-x-auto">
                          <MathDisplay
                            math={`Q_3 = ${statsResult.q3.um} + \\frac{${(3 * statsResult.n) / 4} - ${statsResult.q3.prevC}}{${statsResult.q3.nm}} \\cdot ${statsResult.q3.h} \\approx ${statsResult.q3.value.toFixed(4)}`}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-500 p-4">Vui lòng nhập tần số hợp lệ.</div>
                )}
              </div>
            </div>
          )}

          {/* SOLVER 2: OXYZ VECTOR & CROSS PRODUCT (CHƯƠNG II & V LỚP 12) */}
          {solverTab === 'vector' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    Chương II & V • MENU 5 Vector
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    Nhập Tọa Độ 3 Vectơ Không Gian Oxyz
                  </h4>
                </div>

                {[
                  { label: 'VctA = u (hoặc vectơ AB)', state: vecU, setter: setVecU },
                  { label: 'VctB = v (hoặc vectơ AC)', state: vecV, setter: setVecV },
                  { label: 'VctC = w (hoặc vectơ AD / M₁M₂)', state: vecW, setter: setVecW }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="text-xs font-extrabold text-slate-800">{item.label}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['x', 'y', 'z'].map((coord) => (
                        <div key={coord}>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">
                            Tọa độ {coord}
                          </label>
                          <input
                            type="number"
                            value={item.state[coord]}
                            onChange={(e) =>
                              item.setter({ ...item.state, [coord]: e.target.value })
                            }
                            className="w-full mt-0.5 text-center text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Kết Quả Tính Toán Vectơ & Chuỗi Phím Casio Tương Ứng
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                    <div className="text-xs font-bold text-teal-800">
                      1. Tích có hướng [u, v] = VctA × VctB
                    </div>
                    <div className="text-base font-black text-teal-950 mt-1">
                      ({vectorResult.cross.x}; {vectorResult.cross.y}; {vectorResult.cross.z})
                    </div>
                    <div className="text-[11px] text-teal-700 mt-1">
                      Độ dài |[u, v]| = √{vectorResult.cross.x ** 2 + vectorResult.cross.y ** 2 + vectorResult.cross.z ** 2} ≈ {vectorResult.normCross.toFixed(4)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-xs font-bold text-blue-800">
                      2. Tích vô hướng u · v & Góc (u, v)
                    </div>
                    <div className="text-base font-black text-blue-950 mt-1">
                      u · v = {vectorResult.dotUV} | Góc ≈ {vectorResult.angleDeg.toFixed(2)}°
                    </div>
                    <div className="text-[11px] text-blue-700 mt-1">
                      |u| ≈ {vectorResult.normU.toFixed(3)}, |v| ≈ {vectorResult.normV.toFixed(3)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-xs font-bold text-amber-900">
                      3. Diện tích ΔABC & Thể tích tứ diện ABCD
                    </div>
                    <div className="text-xs font-extrabold text-amber-950 mt-1">
                      • S_ΔABC = (1/2)|[u, v]| ≈ {vectorResult.areaTriangle.toFixed(4)} (đvdt)
                    </div>
                    <div className="text-xs font-extrabold text-amber-950 mt-0.5">
                      • V_ABCD = (1/6)|[u, v] · w| = |{vectorResult.scalarTriple}|/6 ≈ {vectorResult.volTetrahedron.toFixed(4)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="text-xs font-bold text-purple-900">
                      4. Khoảng cách 2 đường chéo nhau d(Δ₁, Δ₂)
                    </div>
                    <div className="text-base font-black text-purple-950 mt-1">
                      d = {vectorResult.skewDistance.toFixed(4)}
                    </div>
                    <div className="text-[11px] text-purple-700 mt-1">
                      Công thức: |[u, v] · w| ÷ |[u, v]| = |{vectorResult.scalarTriple}| ÷ {vectorResult.normCross.toFixed(3)}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 text-xs space-y-1.5">
                  <div className="font-bold text-amber-300">
                    Thao tác phím nhanh trên fx-580VNX & fx-880BTG:
                  </div>
                  <p className="text-slate-300">
                    • Tính tích có hướng & lưu vào VctD:{' '}
                    <code className="text-sky-300 font-bold">[OPTN] [3: VctA] [×] [OPTN] [4: VctB] [=] [STO] [D]</code>
                  </p>
                  <p className="text-slate-300">
                    • Tính khoảng cách 2 đường chéo nhau:{' '}
                    <code className="text-emerald-300 font-bold">
                      [SHIFT] [(] (Abs) (VctD · VctC) [)] [÷] [SHIFT] [(] (Abs) (VctD) [)] [=]
                    </code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SOLVER 3: CONDITIONAL PROBABILITY & BAYES (CHƯƠNG VI LỚP 12) */}
          {solverTab === 'bayes' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Chương VI • Bài 18 & 19 (Xác Suất Toàn Phần & Bayes)
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    Nhập Dữ Kiện Sơ Đồ Hình Cây (0 ≤ P ≤ 1)
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Xác suất tiên nghiệm P(A):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={probPA}
                      onChange={(e) => setProbPA(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Xác suất có điều kiện nhánh 1: P(B|A):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={probPBA}
                      onChange={(e) => setProbPBA(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Xác suất có điều kiện nhánh 2: P(B|Ā):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={probPBNotA}
                      onChange={(e) => setProbPBNotA(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Kết Quả 4 Mệnh Đề Đúng/Sai & Quy Trình Gán Biến STO A, B, M
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-slate-600">Nhánh 1 (Lưu STO A): P(AB) = P(A)·P(B|A)</div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      A = {bayesResult.branch1.toFixed(6)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      P(Ā) = 1 - P(A) = {bayesResult.pNotA.toFixed(4)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-slate-600">Nhánh 2 (Lưu STO B): P(ĀB) = P(Ā)·P(B|Ā)</div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      B = {bayesResult.branch2.toFixed(6)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      P(B̄|A) = {(1 - bayesResult.pBA).toFixed(4)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="font-bold text-blue-800">Xác suất toàn phần (Lưu STO M = A + B):</div>
                    <div className="text-lg font-black text-blue-950 mt-1">
                      P(B) = {bayesResult.pB.toFixed(6)} ({(bayesResult.pB * 100).toFixed(2)}%)
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="font-bold text-amber-900">Công thức Bayes P(A|B) = A ÷ M:</div>
                    <div className="text-lg font-black text-amber-950 mt-1">
                      P(A|B) ≈ {bayesResult.pAB.toFixed(6)} ({(bayesResult.pAB * 100).toFixed(2)}%)
                    </div>
                    <div className="text-[11px] text-amber-800 mt-0.5">
                      P(Ā|B) = B ÷ M ≈ {bayesResult.pNotAB.toFixed(6)}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 text-xs space-y-1.5">
                  <div className="font-bold text-amber-300">Chuỗi phím bấm chuẩn trên Casio:</div>
                  <p>• Bước 1: <code className="text-sky-300">{bayesResult.pA} × {bayesResult.pBA} [=] [STO] [A]</code></p>
                  <p>• Bước 2: <code className="text-sky-300">(1 - {bayesResult.pA}) × {bayesResult.pBNotA} [=] [STO] [B]</code></p>
                  <p>• Bước 3: <code className="text-emerald-300">[ALPHA] [A] + [ALPHA] [B] [=] [STO] [M]</code> (ra P(B))</p>
                  <p>• Bước 4: <code className="text-amber-300">[ALPHA] [A] ÷ [ALPHA] [M] [=]</code> (nhấn [S⇔D] để lấy phân số tối giản cho P(A|B))</p>
                </div>
              </div>
            </div>
          )}

          {/* SOLVER 4: OBLIQUE ASYMPTOTE & CUBIC EXTREMA (CHƯƠNG I LỚP 12) */}
          {solverTab === 'calculus' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Chương I • Khảo Sát Hàm Số
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCalcMode('oblique')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        calcMode === 'oblique' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Tiệm cận xiên
                    </button>
                    <button
                      onClick={() => setCalcMode('cubic')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        calcMode === 'cubic' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Cực trị bậc 3
                    </button>
                  </div>
                </div>

                {calcMode === 'oblique' ? (
                  <div className="space-y-3 text-xs">
                    <div className="font-bold text-slate-800">
                      Hàm phân thức bậc 2 / bậc 1: y = (ax² + bx + c) / (mx + n)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['a', 'b', 'c'].map((k) => (
                        <div key={k}>
                          <label className="text-[10px] font-bold text-slate-500">Hệ số tử {k}</label>
                          <input
                            type="number"
                            value={ratCoeff[k]}
                            onChange={(e) => setRatCoeff({ ...ratCoeff, [k]: e.target.value })}
                            className="w-full mt-0.5 text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['m', 'n'].map((k) => (
                        <div key={k}>
                          <label className="text-[10px] font-bold text-slate-500">Hệ số mẫu {k}</label>
                          <input
                            type="number"
                            value={ratCoeff[k]}
                            onChange={(e) => setRatCoeff({ ...ratCoeff, [k]: e.target.value })}
                            className="w-full mt-0.5 text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="font-bold text-slate-800">
                      Hàm số bậc ba: y = ax³ + bx² + cx + d
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['a', 'b', 'c', 'd'].map((k) => (
                        <div key={k}>
                          <label className="text-[10px] font-bold text-slate-500">Hệ số {k}</label>
                          <input
                            type="number"
                            value={cubicCoeff[k]}
                            onChange={(e) => setCubicCoeff({ ...cubicCoeff, [k]: e.target.value })}
                            className="w-full mt-0.5 text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-4">
                {calculusResult?.type === 'oblique' && (
                  <>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Kết Quả Tiệm Cận Đứng, Tiệm Cận Xiên & Tâm Đối Xứng
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="font-bold text-blue-700">Tiệm cận đứng (TCĐ)</div>
                        <div className="text-base font-black text-blue-950 mt-1">
                          x = {calculusResult.vertAsym.toFixed(3)}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="font-bold text-amber-800">Tiệm cận xiên (TCX)</div>
                        <div className="text-base font-black text-amber-950 mt-1">
                          y = {calculusResult.alpha.toFixed(2)}x {calculusResult.beta >= 0 ? `+ ${calculusResult.beta.toFixed(2)}` : `- ${Math.abs(calculusResult.beta).toFixed(2)}`}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                        <div className="font-bold text-purple-800">Tâm đối xứng I</div>
                        <div className="text-base font-black text-purple-950 mt-1">
                          I({calculusResult.symCenter.x.toFixed(2)}; {calculusResult.symCenter.y.toFixed(2)})
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 text-xs space-y-1.5">
                      <div className="font-bold text-amber-300">Cách bấm CALC tìm Tiệm cận xiên y = ax + b:</div>
                      <p>• Tìm a: Nhập <code className="text-sky-300">f(X)/X</code> → nhấn <code className="text-amber-300">[CALC] X = 10^9 [=]</code> → ra a = {calculusResult.alpha.toFixed(3)}</p>
                      <p>• Tìm b: Nhập <code className="text-sky-300">f(X) - ({calculusResult.alpha})X</code> → nhấn <code className="text-amber-300">[CALC] X = 10^9 [=]</code> → ra b = {calculusResult.beta.toFixed(3)}</p>
                    </div>
                  </>
                )}

                {calculusResult?.type === 'cubic' && (
                  <>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Kết Quả Cực Trị, Tâm Đối Xứng & Đường Thẳng Qua 2 Điểm Cực Trị
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="font-bold text-blue-800">Tâm đối xứng (Điểm uốn U)</div>
                        <div className="text-base font-black text-blue-950 mt-1">
                          U({calculusResult.inflection.x.toFixed(3)}; {calculusResult.inflection.y.toFixed(3)})
                        </div>
                        <div className="text-[11px] text-blue-700 mt-0.5">
                          Δ' của y' = {calculusResult.deltaPrime.toFixed(3)}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="font-bold text-emerald-800">Đường thẳng qua 2 cực trị</div>
                        <div className="text-base font-black text-emerald-950 mt-1">
                          y = {calculusResult.slopeLine.toFixed(3)}x {calculusResult.interceptLine >= 0 ? `+ ${calculusResult.interceptLine.toFixed(3)}` : `- ${Math.abs(calculusResult.interceptLine).toFixed(3)}`}
                        </div>
                      </div>
                    </div>

                    {calculusResult.extrema.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {calculusResult.extrema.map((ex, i) => (
                          <div key={i} className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                            <div className="font-bold text-amber-800">{ex.label}</div>
                            <div className="text-sm font-black text-amber-950 mt-0.5">
                              x = {ex.x.toFixed(4)} → y = {ex.y.toFixed(4)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                        Δ' ≤ 0: Hàm số đơn điệu trên ℝ, không có cực trị.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: PARALLEL KEY COMPARISON TABLE OR STEP-BY-STEP CHAPTER GUIDE */}
      {activeTab === 'compare' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 bg-gradient-to-r from-slate-50 to-sky-50 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">
              Bảng Đối Chiếu 14 Thao Tác Phím Khác Biệt Lớn Nhất: Casio fx-580VNX ⇄ Casio fx-880BTG
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Giúp học sinh chuyển đổi tức thì giữa bàn phím truyền thống SHIFT/OPTN (fx-580VNX) và hệ điều hành HOME/CATALOG/TOOLS (fx-880BTG).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-left">
                  <th className="p-3.5 font-extrabold w-1/4">Thao tác / Chức năng</th>
                  <th className="p-3.5 font-extrabold w-1/5">Ứng dụng trong Đề thi</th>
                  <th className="p-3.5 font-extrabold bg-blue-900/80 w-1/4">Casio fx-580VNX</th>
                  <th className="p-3.5 font-extrabold bg-amber-900/80 w-1/4">Casio fx-880BTG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredKeyTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-sky-50/50 transition-colors">
                    <td className="p-3.5 font-extrabold text-slate-900">{row.action}</td>
                    <td className="p-3.5 text-slate-600 font-medium">{row.purpose}</td>
                    <td className="p-3.5 bg-blue-50/30 font-semibold text-blue-950">{row.fx580}</td>
                    <td className="p-3.5 bg-amber-50/30 font-semibold text-amber-950">{row.fx880}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        currentSection && (
          <div className="space-y-5">
            {/* Chapter Guide Header */}
            <div className="p-5 rounded-2xl bg-white border border-sky-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  {searchQuery ? `Kết quả tìm kiếm (${filteredTips.length} kỹ thuật)` : currentSection.badge}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>{searchQuery ? `Từ khóa: "${searchQuery}"` : `Cẩm Nang Chi Tiết — ${currentSection.title}`}</span>
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Hiển thị {filteredTips.length} quy trình bấm máy chuẩn THPT 2025
              </div>
            </div>

            {/* Tips List */}
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-blue-300 transition-all"
              >
                <div className="p-5 bg-gradient-to-r from-slate-50 via-white to-sky-50/40 border-b border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{tip.title}</span>
                    </h4>
                    {tip.sectionBadge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tip.sectionBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    <strong className="text-slate-800">Bài toán mẫu:</strong>{' '}
                    <MathDisplay math={tip.problem} inline />
                  </div>
                  <div className="mt-3 px-4 py-2.5 rounded-xl bg-blue-50/70 border border-blue-100 inline-block max-w-full overflow-x-auto">
                    <MathDisplay math={tip.formula} />
                  </div>
                </div>

                <div
                  className={`p-5 grid gap-4 ${
                    selectedModel === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {(selectedModel === 'both' || selectedModel === 'fx580') && (
                    <div className="rounded-2xl bg-blue-50/40 border border-blue-200/80 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200/60">
                          <span className="font-extrabold text-xs sm:text-sm text-blue-900 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                            Thao tác trên CASIO fx-580VNX
                          </span>
                          <button
                            onClick={() => handleCopySequence(`${tip.id}-580`, tip.fx580)}
                            className="px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedId === `${tip.id}-580` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>
                        <ol className="space-y-2">
                          {tip.fx580.map((step, sIdx) => (
                            <li
                              key={sIdx}
                              className="text-xs text-slate-700 leading-relaxed flex items-start gap-2"
                            >
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span className="font-medium">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {(selectedModel === 'both' || selectedModel === 'fx880') && (
                    <div className="rounded-2xl bg-amber-50/40 border border-amber-200/80 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/60">
                          <span className="font-extrabold text-xs sm:text-sm text-amber-900 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            Thao tác trên CASIO fx-880BTG
                          </span>
                          <button
                            onClick={() => handleCopySequence(`${tip.id}-880`, tip.fx880)}
                            className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedId === `${tip.id}-880` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>
                        <ol className="space-y-2">
                          {tip.fx880.map((step, sIdx) => (
                            <li
                              key={sIdx}
                              className="text-xs text-slate-700 leading-relaxed flex items-start gap-2"
                            >
                              <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span className="font-medium">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-5 py-3 bg-emerald-50/70 border-t border-emerald-100 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                    <strong className="font-extrabold">Mẹo thực chiến phòng thi:</strong> {tip.proTip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
