/**
 * tnthptExamKnowledge.js
 * Tổng hợp toàn bộ 28 chuyên đề trọng tâm ôn thi Tốt Nghiệp THPT Quốc Gia
 * theo Chương trình Giáo dục Phổ thông 2018 (SGK Kết Nối Tri Thức 10 - 11 - 12)
 */

export const TNTHPT_TOPIC_CATEGORIES = [
  { id: 'all', label: 'Tất cả chuyên đề' },
  { id: 'calculus', label: '1. Hàm số & Đạo hàm' },
  { id: 'integral', label: '2. Nguyên hàm & Tích phân' },
  { id: 'oxyz', label: '3. Tọa độ không gian Oxyz' },
  { id: 'prob_stat', label: '4. Xác suất & Thống kê' },
  { id: 'exp_log', label: '5. Mũ & Lôgarit' },
  { id: 'spatial', label: '6. Hình học không gian' },
  { id: 'trig_seq', label: '7. Lượng giác & Dãy số' },
  { id: 'algebra_oxy', label: '8. Đại số & Tọa độ Oxy' }
];

export const TNTHPT_KNOWLEDGE_CHUNKS = [
  /* ==================== 1. KHẢO SÁT HÀM SỐ & ỨNG DỤNG ĐẠO HÀM (LỚP 12) ==================== */
  {
    id: 'kb-ch1-monotonicity-extrema',
    topicCategory: 'calculus',
    grade: 12,
    volume: 1,
    chapter: 'Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
    lessonNumber: 'BÀI 1',
    title: 'Tính đơn điệu (đồng biến, nghịch biến) và cực trị của hàm số',
    pageOcr: 'Trang 5–13 SGK Tập 1',
    sourceFile: 'SGK-Toan12-1.pdf',
    moduleTarget: 'part1',
    subTab: 'monotonicity',
    keywords: [
      'đơn điệu',
      'đồng biến',
      'nghịch biến',
      'cực trị',
      'cực đại',
      'cực tiểu',
      'điểm cực trị',
      'xét tính đơn điệu'
    ],
    formulas: [
      "f'(x) \\ge 0 \\; \\forall x \\in K \\implies f(x) \\text{ đồng biến}; \\quad f'(x) \\le 0 \\; \\forall x \\in K \\implies f(x) \\text{ nghịch biến}"
    ],
    answerTemplate: `### Bài 1: Tính đơn điệu & Cực trị của hàm số (Toán 12 Tập 1, Trang 5–13)
- **Định lí tính đơn điệu (Trang 6):** Nếu $f'(x) \\ge 0$ (hoặc $\\le 0$) $\\forall x \\in K$ và $f'(x) = 0$ chỉ tại hữu hạn điểm thì $f(x)$ **đồng biến** (hoặc **nghịch biến**) trên $K$.
- **Quy tắc cực trị (Trang 9):**
  - $f'(x)$ đổi dấu từ **$(+) \\to (-)$** khi qua $x_0 \\implies x_0$ là điểm **cực đại** ($y_{CĐ} = f(x_0)$).
  - $f'(x)$ đổi dấu từ **$(-) \\to (+)$** khi qua $x_0 \\implies x_0$ là điểm **cực tiểu** ($y_{CT} = f(x_0)$).
- **Mẹo thi TN THPT:** Chú ý phân biệt "điểm cực trị của hàm số" ($x_0$), "giá trị cực trị" ($f(x_0)$) và "điểm cực trị của đồ thị" ($M(x_0; f(x_0))$).`
  },
  {
    id: 'kb-ch1-min-max-optimization',
    topicCategory: 'calculus',
    grade: 12,
    volume: 1,
    chapter: 'Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
    lessonNumber: 'BÀI 2 & BÀI 5',
    title: 'Giá trị lớn nhất (GTLN), giá trị nhỏ nhất (GTNN) và bài toán tối ưu hóa thực tế',
    pageOcr: 'Trang 14–19 & 33–38 SGK Tập 1',
    sourceFile: 'SGK-Toan12-1.pdf',
    moduleTarget: 'part1',
    subTab: 'optimization',
    keywords: [
      'giá trị lớn nhất',
      'giá trị nhỏ nhất',
      'gtln',
      'gtnn',
      'max min',
      'tối ưu hóa',
      'bài toán tối ưu',
      'gập hộp tôn',
      'chi phí nhỏ nhất'
    ],
    formulas: [
      "\\max_{[a;b]} f(x) = \\max\\{f(a), f(b), f(x_i)\\}, \\quad \\min_{[a;b]} f(x) = \\min\\{f(a), f(b), f(x_i)\\}",
      "V(x) = x(a - 2x)(b - 2x) \\implies V'(x) = 0"
    ],
    answerTemplate: `### Bài 2 & 5: GTLN - GTNN & Tối ưu hóa thực tế (Trang 14–19 & 33–38 SGK Tập 1)
- **Quy trình tìm Max/Min trên đoạn $[a; b]$ (Trang 16):**
  1. Tìm các nghiệm $x_i \\in (a; b)$ mà tại đó $f'(x_i) = 0$ hoặc không xác định.
  2. Tính giá trị $f(a), f(b), f(x_i)$.
  3. Giá trị lớn nhất trong các số đó là $\\max$, nhỏ nhất là $\\min$.
- **Bài toán gập hộp thể tích cực đại (Bài 5):** Cắt 4 góc hình vuông cạnh $x$ từ tấm kim loại $a \\times b$:
  $$V(x) = x(a - 2x)(b - 2x) \\quad \\left(0 < x < \\frac{\\min(a, b)}{2}\\right) \\implies V'(x) = 0 \\implies x_{\\max}$$
- **Mẹo Casio:** Dùng Table [MENU] [8], nhập hàm số trên khoảng với $\\text{Step} = (b - a)/29$ để đọc Max/Min.`
  },
  {
    id: 'kb-ch1-asymptotes',
    topicCategory: 'calculus',
    grade: 12,
    volume: 1,
    chapter: 'Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
    lessonNumber: 'BÀI 3',
    title: 'Đường tiệm cận đứng, tiệm cận ngang và tiệm cận xiên của đồ thị hàm số',
    pageOcr: 'Trang 20–25 SGK Tập 1',
    sourceFile: 'SGK-Toan12-1.pdf',
    moduleTarget: 'part1',
    subTab: 'asymptotes',
    keywords: [
      'tiệm cận',
      'tiệm cận đứng',
      'tiệm cận ngang',
      'tiệm cận xiên',
      'đường tiệm cận',
      'đồ thị hàm phân thức'
    ],
    formulas: [
      "\\text{TCN: } \\lim_{x \\to \\pm\\infty} f(x) = y_0 \\implies y = y_0; \\quad \\text{TCĐ: } \\lim_{x \\to x_0^\\pm} f(x) = \\pm\\infty \\implies x = x_0",
      "\\text{TCX: } y = ax + b \\iff a = \\lim_{x \\to \\pm\\infty} \\frac{f(x)}{x}, \\; b = \\lim_{x \\to \\pm\\infty} [f(x) - ax]"
    ],
    answerTemplate: `### Bài 3: Đường tiệm cận của đồ thị hàm số (SGK Toán 12 Tập 1, Trang 20–25)
- **Tiệm cận ngang ($y = y_0$):** $\\lim_{x \\to +\\infty} f(x) = y_0$ hoặc $\\lim_{x \\to -\\infty} f(x) = y_0$.
- **Tiệm cận đứng ($x = x_0$):** $\\lim_{x \\to x_0^+} f(x) = \\pm\\infty$ hoặc $\\lim_{x \\to x_0^-} f(x) = \\pm\\infty$ (nghiệm mẫu không triệt tiêu tử).
- **Tiệm cận xiên ($y = ax + b$ với $a \\neq 0$):** $\\lim_{x \\to \\pm\\infty} [f(x) - (ax + b)] = 0$.
  - Với hàm $y = \\frac{P(x)}{Q(x)}$ có bậc tử lớn hơn bậc mẫu 1 bậc: Chia đa thức $f(x) = (ax + b) + \\frac{R(x)}{Q(x)} \\implies y = ax + b$ là TCX.
- **Mẹo Casio:** CALC $x = 10^9$ để tìm $y_{TCN}$ hoặc kiểm tra $f(X)/X$ ra hệ số $a$.`
  },
  {
    id: 'kb-ch1-graph-survey',
    topicCategory: 'calculus',
    grade: 12,
    volume: 1,
    chapter: 'Chương I: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
    lessonNumber: 'BÀI 4',
    title: 'Khảo sát sự biến thiên và nhận dạng đồ thị hàm số bậc 3, phân thức hữu tỉ',
    pageOcr: 'Trang 26–32 SGK Tập 1',
    sourceFile: 'SGK-Toan12-1.pdf',
    moduleTarget: 'part1',
    subTab: 'survey',
    keywords: [
      'khảo sát hàm số',
      'vẽ đồ thị',
      'đồ thị bậc 3',
      'hàm phân thức bậc 1 trên 1',
      'hàm phân thức bậc 2 trên 1',
      'tâm đối xứng',
      'trục đối xứng'
    ],
    formulas: [
      "y = ax^3 + bx^2 + cx + d \\; (a \\neq 0) \\implies x_I = -\\frac{b}{3a} \\text{ là tâm đối xứng}",
      "y = \\frac{ax+b}{cx+d} \\implies I\\left(-\\frac{d}{c}; \\frac{a}{c}\\right) \\text{ là giao 2 tiệm cận, cũng là tâm đối xứng}"
    ],
    answerTemplate: `### Bài 4: Khảo sát & Nhận dạng đồ thị hàm số (SGK Toán 12 Tập 1, Trang 26–32)
- **Hàm bậc ba $y = ax^3 + bx^2 + cx + d$ ($a \\neq 0$):**
  - Nhánh vô cùng đi lên từ trái sang phải $\\implies a > 0$; đi xuống $\\implies a < 0$.
  - Điểm uốn / tâm đối xứng $I(x_I; y_I)$ có $x_I = -\\frac{b}{3a}$ (nghiệm của $y'' = 0$).
- **Hàm phân thức $y = \\frac{ax+b}{cx+d}$ ($c \\neq 0, ad - bc \\neq 0$):**
  - Đạo hàm $y' = \\frac{ad - bc}{(cx+d)^2}$; nếu $ad - bc > 0$ hàm số luôn đồng biến; nếu $< 0$ luôn nghịch biến.
  - Tâm đối xứng là giao điểm 2 tiệm cận $I(-d/c; a/c)$.`
  },

  /* ==================== 2. NGUYÊN HÀM & TÍCH PHÂN (LỚP 12) ==================== */
  {
    id: 'kb-def-antiderivative',
    topicCategory: 'integral',
    grade: 12,
    volume: 2,
    chapter: 'Chương IV: Nguyên hàm và tích phân',
    lessonNumber: 'BÀI 11',
    title: 'Nguyên hàm là gì? Định nghĩa, tính chất và bảng nguyên hàm cơ bản',
    pageOcr: 'Trang 4–11 SGK Tập 2',
    sourceFile: 'SGK-Toan12-2.pdf',
    moduleTarget: 'part2',
    subTab: 'b11_antiderivative',
    keywords: [
      'nguyên hàm',
      'họ nguyên hàm',
      'bảng nguyên hàm',
      'tìm nguyên hàm',
      'nguyên hàm từng phần',
      'đổi biến số nguyên hàm'
    ],
    formulas: [
      "F'(x) = f(x) \\iff \\int f(x)\\,dx = F(x) + C",
      "\\int x^\\alpha\\,dx = \\frac{x^{\\alpha+1}}{\\alpha+1} + C \\; (\\alpha \\neq -1), \\quad \\int \\frac{1}{x}\\,dx = \\ln|x| + C, \\quad \\int e^x\\,dx = e^x + C",
      "\\int u\\,dv = uv - \\int v\\,du"
    ],
    answerTemplate: `### Bài 11: Nguyên hàm (SGK Toán 12 Tập 2, Trang 4–11)
- **Định nghĩa (Trang 4):** $F(x)$ là nguyên hàm của $f(x)$ trên $K$ nếu $F'(x) = f(x)$ $\\forall x \\in K$.
- **Họ nguyên hàm:** $\\int f(x)\\,dx = F(x) + C \\quad (C \\in \\mathbb{R})$.
- **Bảng nguyên hàm bắt buộc nhớ:**
  $$\\int x^\\alpha\\,dx = \\frac{x^{\\alpha+1}}{\\alpha+1} + C, \\; \\int \\frac{1}{x}\\,dx = \\ln|x| + C, \\; \\int e^{ax+b}\\,dx = \\frac{1}{a}e^{ax+b} + C, \\; \\int \\cos x\\,dx = \\sin x + C$$
- **Nguyên hàm từng phần:** $\\int u\\,dv = uv - \\int v\\,du$ (Thứ tự ưu tiên đặt $u$: "Nhất lô, nhì đa, tam lượng, tứ mũ").`
  },
  {
    id: 'kb-def-definite-integral',
    topicCategory: 'integral',
    grade: 12,
    volume: 2,
    chapter: 'Chương IV: Nguyên hàm và tích phân',
    lessonNumber: 'BÀI 12',
    title: 'Tích phân xác định, công thức Newton-Leibniz và ý nghĩa tổng Riemann',
    pageOcr: 'Trang 12–18 SGK Tập 2',
    sourceFile: 'SGK-Toan12-2.pdf',
    moduleTarget: 'part2',
    subTab: 'b12_riemann',
    keywords: [
      'tích phân',
      'tích phân xác định',
      'newton-leibniz',
      'newton leibniz',
      'tổng riemann',
      'tính chất tích phân'
    ],
    formulas: [
      "\\int_a^b f(x)\\,dx = F(b) - F(a) = F(x)\\Big|_a^b",
      "\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx"
    ],
    answerTemplate: `### Bài 12: Tích phân & Công thức Newton-Leibniz (Trang 12–18 SGK Tập 2)
- **Công thức Newton-Leibniz (Trang 14):** Cho $f(x)$ liên tục trên $[a; b]$ có một nguyên hàm $F(x)$:
  $$\\int_a^b f(x)\\,dx = F(b) - F(a) = F(x)\\Big|_a^b$$
- **Tính chất quan trọng:**
  - Tuyến tính: $\\int_a^b [k f(x) \\pm m g(x)]\\,dx = k\\int_a^b f(x)\\,dx \\pm m\\int_a^b g(x)\\,dx$.
  - Nối cận: $\\int_a^b f(x)\\,dx = \\int_a^c f(x)\\,dx + \\int_c^b f(x)\\,dx$.
  - Đổi biến số: Đặt $x = u(t)$ hoặc $t = u(x)$ (bắt buộc phải đổi cận tương ứng).`
  },
  {
    id: 'kb-def-area-volume-3d',
    topicCategory: 'integral',
    grade: 12,
    volume: 2,
    chapter: 'Chương IV: Nguyên hàm và tích phân',
    lessonNumber: 'BÀI 13',
    title: 'Ứng dụng hình học của tích phân: Diện tích hình phẳng & Thể tích khối tròn xoay Ox',
    pageOcr: 'Trang 19–26 SGK Tập 2',
    sourceFile: 'SGK-Toan12-2.pdf',
    moduleTarget: 'part2',
    subTab: 'b13_solid3d',
    keywords: [
      'diện tích hình phẳng',
      'thể tích khối tròn xoay',
      'khối tròn xoay',
      'thiết diện',
      'ứng dụng tích phân'
    ],
    formulas: [
      "S = \\int_a^b |f(x) - g(x)|\\,dx",
      "V = \\int_a^b S(x)\\,dx, \\qquad V_{Ox} = \\pi \\int_a^b [f(x)]^2\\,dx"
    ],
    answerTemplate: `### Bài 13: Ứng dụng hình học của tích phân (Trang 19–26 SGK Tập 2)
- **Diện tích hình phẳng giới hạn bởi $y = f(x), y = g(x)$ và $x = a, x = b$ (Trang 19):**
  $$S = \\int_a^b |f(x) - g(x)|\\,dx$$
- **Thể tích vật thể có diện tích thiết diện $S(x)$ vuông góc trục $Ox$ (Trang 22):** $V = \\int_a^b S(x)\\,dx$.
- **Thể tích khối tròn xoay khi quay quanh trục hoành $Ox$ (Trang 23):**
  $$V_{Ox} = \\pi \\int_a^b [f(x)]^2\\,dx$$
  (Nếu giới hạn bởi hai đường $f(x), g(x)$ cùng phía $Ox$: $V = \\pi \\int_a^b |[f(x)]^2 - [g(x)]^2|\\,dx$).`
  },
  {
    id: 'kb-ch4-stem-battrang-lorenz',
    topicCategory: 'integral',
    grade: 12,
    volume: 2,
    chapter: 'Chương IV: Ứng dụng thực tế tích phân (STEM)',
    lessonNumber: 'BÀI 13 • STEM',
    title: 'Bài toán thực tế Bình gốm Bát Tràng (Bài 4.35), Đường cong Lorenz & Poiseuille',
    pageOcr: 'Trang 18, 25, 28 SGK Tập 2',
    sourceFile: 'SGK-Toan12-2.pdf',
    moduleTarget: 'part2',
    subTab: 'b14_stem',
    keywords: [
      'bình gốm bát tràng',
      'đường cong lorenz',
      'hệ số gini',
      'poiseuille',
      'dòng máu',
      'bài toán stem'
    ],
    formulas: [
      "V_{\\text{gốm}} = \\pi\\int_0^{30} \\left(\\frac{1}{175}x^2 + \\frac{3}{35}x + 2\\right)^2 dx \\approx 3668{,}4\\text{ cm}^3",
      "G = 2\\int_0^1 [x - L(x)]\\,dx"
    ],
    answerTemplate: `### Các bài toán thực tế STEM Tích phân (SGK Toán 12 Tập 2)
- **Bình gốm Bát Tràng (Bài 4.35 Trang 28):** Đường sinh ngoài $y = \\frac{1}{175}x^2 + \\frac{3}{35}x + 2$ ($0 \\le x \\le 30\\text{ cm}$):
  $$V = \\pi \\int_0^{30} [f(x)]^2\\,dx \\approx 3668{,}4\\text{ cm}^3$$
- **Hệ số bất bình đẳng Gini & Đường cong Lorenz $L(x)$ (Bài 4.16 Trang 25):**
  $$G = 2 \\int_0^1 [x - L(x)]\\,dx \\quad (0 \\le G \\le 1;\\; G=0 \\text{ là bình đẳng tuyệt đối})$$
- **Định luật Poiseuille lưu lượng máu chảy trong động mạch bán kính $R$ (Bài 4.13 Trang 18):**
  $v(r) = k(R^2 - r^2) \\implies Q = \\int_0^R 2\\pi r v(r)\\,dr = \\frac{\\pi k R^4}{2}$.`
  },

  /* ==================== 3. TỌA ĐỘ TRONG KHÔNG GIAN OXYZ (LỚP 12) ==================== */
  {
    id: 'kb-ch2-vectors-3d',
    topicCategory: 'oxyz',
    grade: 12,
    volume: 1,
    chapter: 'Chương II: Vectơ và hệ tọa độ trong không gian',
    lessonNumber: 'BÀI 6 & BÀI 7',
    title: 'Vectơ trong không gian, hệ trục Oxyz và tích có hướng của hai vectơ',
    pageOcr: 'Trang 45–68 SGK Tập 1',
    sourceFile: 'SGK-Toan12-1.pdf',
    moduleTarget: 'part3',
    subTab: null,
    keywords: [
      'vectơ trong không gian',
      'tọa độ vectơ',
      'tích vô hướng',
      'tích có hướng',
      'độ dài vectơ',
      'góc giữa hai vectơ',
      'cân bằng lực'
    ],
    formulas: [
      "\\vec{u} = (x; y; z) \\implies |\\vec{u}| = \\sqrt{x^2 + y^2 + z^2}",
      "\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2, \\qquad \\cos(\\vec{u}, \\vec{v}) = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}| \\cdot |\\vec{v}|}",
      "[\\vec{u}, \\vec{v}] = (y_1 z_2 - z_1 y_2;\\; z_1 x_2 - x_1 z_2;\\; x_1 y_2 - y_1 x_2)"
    ],
    answerTemplate: `### Chương II: Vectơ trong không gian Oxyz (Trang 45–68 SGK Tập 1)
- **Tọa độ điểm & Vectơ:** Điểm $M(x; y; z) \\iff \\vec{OM} = x\\vec{i} + y\\vec{j} + z\\vec{k}$.
- **Tích vô hướng & Góc:**
  $$\\vec{u} \\cdot \\vec{v} = x_1 x_2 + y_1 y_2 + z_1 z_2, \\qquad \\cos(\\vec{u}, \\vec{v}) = \\frac{x_1 x_2 + y_1 y_2 + z_1 z_2}{\\sqrt{x_1^2+y_1^2+z_1^2} \\cdot \\sqrt{x_2^2+y_2^2+z_2^2}}$$
- **Tích có hướng $[\\vec{u}, \\vec{v}]$ (Vectơ vuông góc với cả $\\vec{u}$ và $\\vec{v}$):**
  - Dùng tìm VTPT của mặt phẳng đi qua 3 điểm: $\\vec{n} = [\\vec{AB}, \\vec{AC}]$.
  - Diện tích tam giác: $S_{ABC} = \\frac{1}{2}|[\\vec{AB}, \\vec{AC}]|$.
  - Thể tích tứ diện: $V_{ABCD} = \\frac{1}{6}|[\\vec{AB}, \\vec{AC}] \\cdot \\vec{AD}|$.`
  },
  {
    id: 'kb-ch5-oxyz',
    topicCategory: 'oxyz',
    grade: 12,
    volume: 2,
    chapter: 'Chương V: Phương pháp tọa độ trong không gian Oxyz',
    lessonNumber: 'BÀI 14 – BÀI 17',
    title: 'Phương trình mặt phẳng, đường thẳng, mặt cầu và khoảng cách, góc trong Oxyz',
    pageOcr: 'Trang 29–63 SGK Tập 2',
    sourceFile: 'SGK-Toan12-2.pdf',
    moduleTarget: 'part3',
    subTab: null,
    keywords: [
      'phương trình mặt phẳng',
      'phương trình đường thẳng',
      'phương trình mặt cầu',
      'khoảng cách từ điểm đến mặt phẳng',
      'góc giữa đường thẳng và mặt phẳng',
      'thiết diện mặt cầu'
    ],
    formulas: [
      "(P): A(x - x_0) + B(y - y_0) + C(z - z_0) = 0 \\implies Ax + By + Cz + D = 0",
      "d(M_0, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}",
      "(S): (x - a)^2 + (y - b)^2 + (z - c)^2 = R^2 \\iff x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0 \\; (R = \\sqrt{a^2+b^2+c^2-d})",
      "r = \\sqrt{R^2 - d^2} \\; (d = d(I, (P)) < R)"
    ],
    answerTemplate: `### Chương V: Phương pháp tọa độ trong không gian Oxyz (Trang 29–63 SGK Tập 2)
- **Mặt phẳng $(P)$ qua $M_0$ có VTPT $\\vec{n}=(A;B;C)$ (Bài 14):**
  $$A(x - x_0) + B(y - y_0) + C(z - z_0) = 0, \\qquad d(M_0, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$
- **Đường thẳng $d$ qua $M_0$ có VTCP $\\vec{u}=(a;b;c)$ (Bài 15):** $\\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}$.
  - Góc giữa đường thẳng và mặt phẳng: $\\sin(d, (P)) = \\frac{|\\vec{u}_d \\cdot \\vec{n}_P|}{|\\vec{u}_d| \\cdot |\\vec{n}_P|}$.
- **Mặt cầu $(S)$ tâm $I(a;b;c)$, bán kính $R$ (Bài 16):**
  $$(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$$
  - Cắt mặt phẳng $(P)$ theo đường tròn giao tuyến bán kính $r = \\sqrt{R^2 - d^2}$ ($d = d(I, (P))$).`
  },

  /* ==================== 4. XÁC SUẤT & THỐNG KÊ (LỚP 10 - 11 - 12) ==================== */
  {
    id: 'kb-ch6-prob',
    topicCategory: 'prob_stat',
    grade: 12,
    volume: 2,
    chapter: 'Chương VI: Xác suất có điều kiện',
    lessonNumber: 'BÀI 18 – BÀI 19',
    title: 'Xác suất có điều kiện, Công thức xác suất toàn phần và Công thức Bayes',
    pageOcr: 'Trang 65–82 SGK Tập 2',
    sourceFile: 'SGK-Toan12-2.pdf',
    moduleTarget: 'part4',
    subTab: null,
    keywords: [
      'xác suất có điều kiện',
      'công thức nhân xác suất',
      'xác suất toàn phần',
      'công thức bayes',
      'sơ đồ hình cây',
      'xét nghiệm y tế'
    ],
    formulas: [
      "P(A|B) = \\frac{P(A \\cap B)}{P(B)} \\; (P(B) > 0) \\implies P(AB) = P(B) \\cdot P(A|B) = P(A) \\cdot P(B|A)",
      "P(B) = P(A)P(B|A) + P(\\overline{A})P(B|\\overline{A})",
      "P(A|B) = \\frac{P(A)P(B|A)}{P(A)P(B|A) + P(\\overline{A})P(B|\\overline{A})}"
    ],
    answerTemplate: `### Chương VI: Xác suất có điều kiện & Công thức Bayes (Trang 65–82 SGK Tập 2)
- **Xác suất có điều kiện $P(A|B)$ (Bài 18):** Xác suất để $A$ xảy ra khi biết $B$ đã xảy ra:
  $$P(A|B) = \\frac{P(AB)}{P(B)} \\implies P(AB) = P(B) \\cdot P(A|B) = P(A) \\cdot P(B|A)$$
- **Công thức xác suất toàn phần (Bài 19):** Với hệ đầy đủ biến cố $\\{A, \\overline{A}\\}$:
  $$P(B) = P(A)P(B|A) + P(\\overline{A})P(B|\\overline{A})$$
- **Công thức Bayes:**
  $$P(A|B) = \\frac{P(A)P(B|A)}{P(B)} = \\frac{P(A)P(B|A)}{P(A)P(B|A) + P(\\overline{A})P(B|\\overline{A})}$$
  (Thường giải nhanh và trực quan bằng Sơ đồ hình cây).`
  },
  {
    id: 'kb-ch3-stat-dispersion-g12',
    topicCategory: 'prob_stat',
    grade: 12,
    volume: 1,
    chapter: 'Chương III: Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm',
    lessonNumber: 'BÀI 8 – BÀI 10',
    title: 'Khoảng biến thiên, khoảng tứ phân vị, phương sai và độ lệch chuẩn mẫu ghép nhóm',
    pageOcr: 'Trang 69–92 SGK Tập 1',
    sourceFile: 'SGK-Toan12-1.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'mẫu số liệu ghép nhóm',
      'đo mức độ phân tán',
      'khoảng biến thiên',
      'khoảng tứ phân vị',
      'phương sai',
      'độ lệch chuẩn',
      'thống kê lớp 12'
    ],
    formulas: [
      "R = x_{\\max} - x_{\\min}, \\qquad \\Delta_Q = Q_3 - Q_1",
      "s^2 = \\frac{1}{n} \\sum_{i=1}^k m_i (c_i - \\bar{x})^2, \\qquad s = \\sqrt{s^2}"
    ],
    answerTemplate: `### Chương III: Đo mức độ phân tán mẫu ghép nhóm (Toán 12 Tập 1, Trang 69–92)
- **Khoảng biến thiên ($R$):** $R = a_k - a_0$ (hiệu giữa đầu mút trên của nhóm cuối và đầu mút dưới của nhóm đầu).
- **Khoảng tứ phân vị ($\\Delta_Q$):** $\\Delta_Q = Q_3 - Q_1$ (đo độ phân tán của 50% số liệu chính giữa, không bị ảnh hưởng bởi giá trị ngoại lai).
- **Phương sai ($s^2$) & Độ lệch chuẩn ($s = \\sqrt{s^2}$):**
  $$s^2 = \\frac{1}{n}\\sum_{i=1}^k m_i (c_i - \\bar{x})^2 = \\frac{1}{n}\\sum_{i=1}^k m_i c_i^2 - (\\bar{x})^2$$
  - Giá trị $c_i = \\frac{a_{i-1} + a_i}{2}$ là giá trị đại diện của nhóm $[a_{i-1}; a_i)$.
  - $s$ càng nhỏ thì số liệu càng đồng đều, độ ổn định càng cao.`
  },
  {
    id: 'kb-g11-stat-central-tendency',
    topicCategory: 'prob_stat',
    grade: 11,
    volume: 1,
    chapter: 'Chương III: Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm',
    lessonNumber: 'BÀI 8 – BÀI 9',
    title: 'Số trung bình, trung vị, tứ phân vị và mốt của mẫu số liệu ghép nhóm',
    pageOcr: 'Trang 65–80 SGK Toán 11 Tập 1',
    sourceFile: 'SGK-Toan11-1.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'số trung bình',
      'trung vị ghép nhóm',
      'tứ phân vị ghép nhóm',
      'mốt ghép nhóm',
      'xu thế trung tâm',
      'thống kê lớp 11'
    ],
    formulas: [
      "\\bar{x} = \\frac{m_1 c_1 + m_2 c_2 + \\dots + m_k c_k}{n}",
      "M_e = a_{p-1} + \\frac{\\frac{n}{2} - C}{m_p}(a_p - a_{p-1}), \\qquad M_o = a_{j-1} + \\frac{m_j - m_{j-1}}{(m_j - m_{j-1}) + (m_j - m_{j+1})}(a_j - a_{j-1})"
    ],
    answerTemplate: `### Chương III: Đo xu thế trung tâm mẫu ghép nhóm (Toán 11 Tập 1)
- **Số trung bình ($\\bar{x}$):** $\\bar{x} = \\frac{1}{n}\\sum m_i c_i$ (với $c_i$ là điểm giữa nhóm).
- **Trung vị ($M_e$):** Xác định nhóm chứa trung vị (tần số tích lũy $\\ge n/2$):
  $$M_e = a_{p-1} + \\frac{n/2 - C}{m_p}(a_p - a_{p-1})$$
- **Tứ phân vị $Q_1, Q_3$:** Công thức tương tự trung vị với vị trí $n/4$ và $3n/4$.
- **Mốt ($M_o$):** Nhóm có tần số lớn nhất đại diện cho giá trị xuất hiện nhiều nhất.`
  },

  /* ==================== 5. HÀM SỐ MŨ & HÀM SỐ LÔGARIT (LỚP 11) ==================== */
  {
    id: 'kb-g11-exp-logarithm',
    topicCategory: 'exp_log',
    grade: 11,
    volume: 2,
    chapter: 'Chương VI: Hàm số mũ và hàm số lôgarit',
    lessonNumber: 'BÀI 18 – BÀI 21',
    title: 'Tính chất lũy thừa, lôgarit và phương trình, bất phương trình mũ - logarit',
    pageOcr: 'Trang 5–32 SGK Toán 11 Tập 2',
    sourceFile: 'SGK-toan11-2.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'hàm số mũ',
      'hàm số logarit',
      'lôgarit',
      'phương trình mũ',
      'phương trình logarit',
      'bất phương trình mũ',
      'bất phương trình logarit',
      'đổi cơ số',
      'carbon 14'
    ],
    formulas: [
      "\\log_a(xy) = \\log_a x + \\log_a y, \\quad \\log_a\\left(\\frac{x}{y}\\right) = \\log_a x - \\log_a y, \\quad \\log_a(x^\\alpha) = \\alpha\\log_a x",
      "\\log_a b = \\frac{\\log_c b}{\\log_c a}, \\qquad a^{\\log_a b} = b",
      "a^x = b \\iff x = \\log_a b \\; (b > 0), \\qquad \\log_a x = b \\iff x = a^b"
    ],
    answerTemplate: `### Chương VI: Hàm số Mũ & Lôgarit (Toán 11 Tập 2, Trang 5–32)
- **Điều kiện xác định:** Lôgarit $\\log_a x$ có nghĩa khi cơ số $0 < a \\neq 1$ và biểu thức dưới dấu logarit $x > 0$.
- **Quy tắc tính toán cốt lõi:**
  $$\\log_a(xy) = \\log_a x + \\log_a y, \\quad \\log_a(x/y) = \\log_a x - \\log_a y, \\quad \\log_a(b) = \\frac{\\ln b}{\\ln a}$$
- **Giải phương trình cơ bản:**
  - $a^x = b \\iff x = \\log_a b$ (với $b > 0$; $b \\le 0 \\implies$ vô nghiệm).
  - $\\log_a x = b \\iff x = a^b$.
- **Bất phương trình:**
  - Nếu $a > 1$: Giữ nguyên chiều bất đẳng thức ($a^f > a^g \\iff f > g$).
  - Nếu $0 < a < 1$: **Đảo chiều** bất đẳng thức ($a^f > a^g \\iff f < g$).`
  },

  /* ==================== 6. HÌNH HỌC KHÔNG GIAN CỔ ĐIỂN (LỚP 11) ==================== */
  {
    id: 'kb-g11-spatial-geometry',
    topicCategory: 'spatial',
    grade: 11,
    volume: 1,
    chapter: 'Chương IV & Chương VII: Quan hệ song song và quan hệ vuông góc trong không gian',
    lessonNumber: 'BÀI 10 – BÀI 14 & BÀI 22 – BÀI 26',
    title: 'Góc giữa đường và mặt, góc nhị diện, khoảng cách và khối đa diện trong không gian',
    pageOcr: 'Trang 85–125 SGK Tập 1 & Trang 33–70 SGK Tập 2',
    sourceFile: 'SGK-Toan11-1.pdf',
    moduleTarget: 'geometry_studio',
    subTab: null,
    keywords: [
      'quan hệ vuông góc',
      'đường thẳng vuông góc mặt phẳng',
      'hai mặt phẳng vuông góc',
      'góc giữa đường thẳng và mặt phẳng',
      'góc nhị diện',
      'khoảng cách từ điểm đến mặt phẳng',
      'khoảng cách hai đường chéo nhau',
      'thể tích khối chóp lăng trụ'
    ],
    formulas: [
      "d \\perp a, \\; d \\perp b \\; (a, b \\subset (P), a \\cap b = O) \\implies d \\perp (P)",
      "\\varphi = (d, (P)) = (d, d') \\; (d' \\text{ là hình chiếu vuông góc của } d \\text{ trên } (P))",
      "V_{\\text{chóp}} = \\frac{1}{3}Bh, \\qquad V_{\\text{lăng trụ}} = Bh"
    ],
    answerTemplate: `### Hình học không gian lớp 11 (Song song, Vuông góc, Góc & Khoảng cách)
- **Chứng minh $d \\perp (P)$:** Đường thẳng $d$ vuông góc với 2 đường thẳng cắt nhau nằm trong $(P)$.
- **Góc giữa đường thẳng $d$ và $(P)$:** Là góc giữa $d$ và hình chiếu vuông góc $d'$ của nó trên $(P)$: $\\sin\\varphi = \\frac{h}{\\text{độ dài cạnh bên}}$.
- **Góc phẳng nhị diện (góc giữa 2 mặt phẳng):** Dựng $a \\subset (P) \\perp c$ và $b \\subset (Q) \\perp c$ tại cùng 1 điểm trên giao tuyến $c$: $\\overline{((P), (Q))} = \\widehat{(a, b)}$.
- **Khoảng cách từ điểm đến mặt phẳng:** Dùng tam giác vuông $1/h^2 = 1/a^2 + 1/b^2 + 1/c^2$ hoặc đổi về điểm chân đường cao.`
  },

  /* ==================== 7. LƯỢNG GIÁC, DÃY SỐ & ĐẠO HÀM (LỚP 11) ==================== */
  {
    id: 'kb-g11-trigonometry',
    topicCategory: 'trig_seq',
    grade: 11,
    volume: 1,
    chapter: 'Chương I: Hàm số lượng giác và phương trình lượng giác',
    lessonNumber: 'BÀI 1 – BÀI 4',
    title: 'Công thức lượng giác, hàm số lượng giác và phương trình lượng giác cơ bản',
    pageOcr: 'Trang 5–34 SGK Toán 11 Tập 1',
    sourceFile: 'SGK-Toan11-1.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'lượng giác',
      'công thức lượng giác',
      'hàm số lượng giác',
      'phương trình lượng giác',
      'công thức nhân đôi',
      'công thức cộng'
    ],
    formulas: [
      "\\sin^2 x + \\cos^2 x = 1, \\quad \\sin 2x = 2\\sin x\\cos x, \\quad \\cos 2x = \\cos^2 x - \\sin^2 x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x",
      "\\sin x = \\sin \\alpha \\iff x = \\alpha + k2\\pi \\;\\text{hoặc}\\; x = \\pi - \\alpha + k2\\pi, \\quad \\cos x = \\cos \\alpha \\iff x = \\pm \\alpha + k2\\pi"
    ],
    answerTemplate: `### Chương I: Hàm số & Phương trình lượng giác (Toán 11 Tập 1, Trang 5–34)
- **Công thức biến đổi cốt lõi:**
  - Cộng: $\\sin(a \\pm b) = \\sin a\\cos b \\pm \\cos a\\sin b$; $\\cos(a \\pm b) = \\cos a\\cos b \\mp \\sin a\\sin b$.
  - Nhân đôi: $\\sin 2a = 2\\sin a\\cos a$; $\\cos 2a = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a$.
- **Nghiệm phương trình cơ bản:**
  - $\\sin x = m$ (với $|m| \\le 1$): $x = \\arcsin m + k2\\pi$ hoặc $x = \\pi - \\arcsin m + k2\\pi$ ($k \\in \\mathbb{Z}$).
  - $\\cos x = m$ (với $|m| \\le 1$): $x = \\pm \\arccos m + k2\\pi$ ($k \\in \\mathbb{Z}$).`
  },
  {
    id: 'kb-g11-sequences-progressions',
    topicCategory: 'trig_seq',
    grade: 11,
    volume: 1,
    chapter: 'Chương II: Dãy số. Cấp số cộng và cấp số nhân',
    lessonNumber: 'BÀI 5 – BÀI 7',
    title: 'Dãy số, công thức số hạng tổng quát và tổng n số hạng cấp số cộng, cấp số nhân',
    pageOcr: 'Trang 35–64 SGK Toán 11 Tập 1',
    sourceFile: 'SGK-Toan11-1.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'dãy số',
      'cấp số cộng',
      'cấp số nhân',
      'công sai',
      'công bội',
      'tổng cấp số cộng',
      'tổng cấp số nhân',
      'bài toán lãi kép'
    ],
    formulas: [
      "\\text{CSC: } u_n = u_1 + (n - 1)d, \\qquad S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n - 1)d]}{2}",
      "\\text{CSN: } u_n = u_1 \\cdot q^{n - 1}, \\qquad S_n = \\frac{u_1(1 - q^n)}{1 - q} \\; (q \\neq 1)"
    ],
    answerTemplate: `### Chương II: Cấp số cộng & Cấp số nhân (Toán 11 Tập 1, Trang 35–64)
- **Cấp số cộng (công sai $d$):**
  - Số hạng tổng quát: $u_n = u_1 + (n - 1)d$.
  - Tính chất ba số liên tiếp: $u_k = \\frac{u_{k-1} + u_{k+1}}{2}$.
  - Tổng $n$ số hạng đầu: $S_n = \\frac{n(u_1 + u_n)}{2} = n u_1 + \\frac{n(n - 1)}{2}d$.
- **Cấp số nhân (công bội $q$):**
  - Số hạng tổng quát: $u_n = u_1 \\cdot q^{n - 1}$.
  - Tổng $n$ số hạng đầu: $S_n = u_1 \\frac{1 - q^n}{1 - q}$ ($q \\neq 1$).`
  },
  {
    id: 'kb-g11-derivatives-tangent',
    topicCategory: 'calculus',
    grade: 11,
    volume: 2,
    chapter: 'Chương VII: Đạo hàm',
    lessonNumber: 'BÀI 27 – BÀI 30',
    title: 'Quy tắc tính đạo hàm, ý nghĩa hình học và phương trình tiếp tuyến của đồ thị',
    pageOcr: 'Trang 71–105 SGK Toán 11 Tập 2',
    sourceFile: 'SGK-toan11-2.pdf',
    moduleTarget: 'part1',
    subTab: null,
    keywords: [
      'đạo hàm',
      'quy tắc đạo hàm',
      'phương trình tiếp tuyến',
      'tiếp tuyến của đồ thị',
      'hệ số góc tiếp tuyến',
      'vận tốc tức thời'
    ],
    formulas: [
      "k = f'(x_0), \\qquad y = f'(x_0)(x - x_0) + y_0",
      "(u \\pm v)' = u' \\pm v', \\quad (uv)' = u'v + uv', \\quad \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}, \\quad [f(u)]' = f'(u) \\cdot u'"
    ],
    answerTemplate: `### Chương VII: Đạo hàm & Phương trình tiếp tuyến (Toán 11 Tập 2)
- **Đạo hàm tại điểm $x_0$:** $f'(x_0) = \\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0}$ chính là **hệ số góc $k$** của tiếp tuyến với đồ thị tại điểm $M(x_0; f(x_0))$.
- **Phương trình tiếp tuyến tại $M(x_0; y_0)$:**
  $$y = f'(x_0)(x - x_0) + y_0$$
- **Ý nghĩa vật lý:** Vận tốc tức thời $v(t) = s'(t)$, gia tốc tức thời $a(t) = v'(t) = s''(t)$.`
  },

  /* ==================== 8. ĐẠI SỐ TỔ HỢP, BẤT PHƯƠNG TRÌNH & OXY (LỚP 10) ==================== */
  {
    id: 'kb-g10-linear-programming',
    topicCategory: 'algebra_oxy',
    grade: 10,
    volume: 1,
    chapter: 'Chương II: Bất phương trình và hệ bất phương trình bậc nhất hai ẩn',
    lessonNumber: 'BÀI 3 – BÀI 4',
    title: 'Miền nghiệm của hệ bất phương trình và bài toán quy hoạch tuyến tính tối ưu thực tế',
    pageOcr: 'Trang 21–38 SGK Toán 10 Tập 1',
    sourceFile: 'SGK-Toan10-1.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'bất phương trình bậc nhất hai ẩn',
      'hệ bất phương trình',
      'miền nghiệm',
      'quy hoạch tuyến tính',
      'tối ưu hóa lợi nhuận xưởng'
    ],
    formulas: [
      "F(x; y) = ax + by \\implies F_{\\max}, F_{\\min} \\text{ luôn đạt tại một trong các đỉnh của đa giác miền nghiệm}"
    ],
    answerTemplate: `### Chương II: Quy hoạch tuyến tính & Hệ BPT bậc nhất 2 ẩn (Toán 10 Tập 1)
- **Định lí miền nghiệm đa giác:** Giá trị lớn nhất và nhỏ nhất của biểu thức mục tiêu $F(x; y) = ax + by$ trên miền đa giác lồi $S$ **luôn đạt tại một trong các đỉnh** của đa giác đó.
- **Quy trình giải bài toán thực tế:**
  1. Đặt ẩn $x, y$ (kèm điều kiện $x, y \\ge 0$).
  2. Thiết lập hệ bất phương trình ràng buộc tài nguyên / nguyên liệu.
  3. Vẽ miền nghiệm trên mặt phẳng tọa độ $Oxy$ và tìm tọa độ các đỉnh $A, B, C, D$.
  4. Tính $F$ tại từng đỉnh để kết luận phương án tối ưu mang lại lợi nhuận cao nhất.`
  },
  {
    id: 'kb-g10-triangle-trig',
    topicCategory: 'algebra_oxy',
    grade: 10,
    volume: 1,
    chapter: 'Chương IV: Hệ thức lượng trong tam giác',
    lessonNumber: 'BÀI 9 – BÀI 10',
    title: 'Định lí côsin, định lí sin, các công thức tính diện tích tam giác và giải tam giác',
    pageOcr: 'Trang 65–84 SGK Toán 10 Tập 1',
    sourceFile: 'SGK-Toan10-1.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'hệ thức lượng tam giác',
      'định lí cosin',
      'định lí sin',
      'công thức heron',
      'diện tích tam giác',
      'bán kính đường tròn ngoại tiếp nội tiếp'
    ],
    formulas: [
      "a^2 = b^2 + c^2 - 2bc\\cos A, \\qquad \\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R",
      "S = \\frac{1}{2}ab\\sin C = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}"
    ],
    answerTemplate: `### Chương IV: Hệ thức lượng trong tam giác (Toán 10 Tập 1, Trang 65–84)
- **Định lí côsin:** $a^2 = b^2 + c^2 - 2bc\\cos A \\implies \\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$.
- **Định lí sin:** $\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$ ($R$ là bán kính đường tròn ngoại tiếp).
- **Hệ thống 5 công thức tính diện tích tam giác:**
  $$S = \\frac{1}{2}ah_a = \\frac{1}{2}ab\\sin C = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}$$
  (với $p = \\frac{a+b+c}{2}$ là nửa chu vi; $r$ là bán kính đường tròn nội tiếp).`
  },
  {
    id: 'kb-g10-combinatorics',
    topicCategory: 'algebra_oxy',
    grade: 10,
    volume: 2,
    chapter: 'Chương V: Đại số tổ hợp',
    lessonNumber: 'BÀI 11 – BÀI 13',
    title: 'Quy tắc cộng, quy tắc nhân, hoán vị, chỉnh hợp, tổ hợp và nhị thức Newton',
    pageOcr: 'Trang 5–34 SGK Toán 10 Tập 2',
    sourceFile: 'SGK-Toan10-2.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'quy tắc cộng',
      'quy tắc nhân',
      'hoán vị',
      'chỉnh hợp',
      'tổ hợp',
      'nhị thức newton',
      'đại số tổ hợp'
    ],
    formulas: [
      "P_n = n!, \\qquad A_n^k = \\frac{n!}{(n - k)!}, \\qquad C_n^k = \\frac{n!}{k!(n - k)!}",
      "(a + b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4, \\qquad (a + b)^5 = a^5 + 5a^4b + 10a^3b^2 + 10a^2b^3 + 5ab^4 + b^5"
    ],
    answerTemplate: `### Chương V: Đại số tổ hợp & Nhị thức Newton (Toán 10 Tập 2)
- **Quy tắc cộng (các phương án rời nhau):** $N = n_1 + n_2 + \\dots$
- **Quy tắc nhân (các công đoạn liên tiếp):** $N = n_1 \\cdot n_2 \\cdot \\dots$
- **Phân biệt Chỉnh hợp & Tổ hợp:**
  - **Tổ hợp $C_n^k$:** Chọn $k$ phần tử từ $n$ phần tử, **KHÔNG phân biệt thứ tự** (ví dụ: chọn 3 học sinh đi thi).
  - **Chỉnh hợp $A_n^k$:** Chọn $k$ phần tử từ $n$ phần tử, **CÓ phân biệt thứ tự** (ví dụ: chọn Bí thư, Lớp trưởng, Lớp phó).
- **Khai triển nhị thức Newton bậc 4 và 5:** Hệ số tam giác Pascal $(1, 4, 6, 4, 1)$ và $(1, 5, 10, 10, 5, 1)$.`
  },
  {
    id: 'kb-g10-conics-oxy',
    topicCategory: 'algebra_oxy',
    grade: 10,
    volume: 2,
    chapter: 'Chương IX: Phương pháp tọa độ trong mặt phẳng Oxy',
    lessonNumber: 'BÀI 23 – BÀI 25',
    title: 'Phương trình đường tròn và ba đường Conic (Elip, Hypebol, Parabol) trong Oxy',
    pageOcr: 'Trang 75–102 SGK Toán 10 Tập 2',
    sourceFile: 'SGK-Toan10-2.pdf',
    moduleTarget: 'curriculum',
    subTab: null,
    keywords: [
      'đường tròn oxy',
      'ba đường conic',
      'elip',
      'hypebol',
      'parabol',
      'tiêu cự',
      'tiêu điểm',
      'phương trình chính tắc'
    ],
    formulas: [
      "\\text{Đường tròn: } (x - a)^2 + (y - b)^2 = R^2",
      "\\text{Elip: } \\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\; (b^2 = a^2 - c^2), \\qquad \\text{Parabol: } y^2 = 2px \\; (p > 0)"
    ],
    answerTemplate: `### Chương IX: Đường tròn & Ba đường Conic trong Oxy (Toán 10 Tập 2)
- **Đường tròn:** $(x - a)^2 + (y - b)^2 = R^2$ (tâm $I(a; b)$, bán kính $R$).
- **Phương trình chính tắc Elip:**
  $$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\quad (a > b > 0, \\; b^2 = a^2 - c^2)$$
  - Trục lớn $2a$, trục nhỏ $2b$, tiêu cự $2c$ với 2 tiêu điểm $F_1(-c; 0), F_2(c; 0)$.
- **Phương trình chính tắc Parabol:** $y^2 = 2px$ ($p > 0$ là tham số tiêu; tiêu điểm $F(p/2; 0)$).`
  }
];

export const TNTHPT_SUGGESTED_QUESTIONS = [
  {
    label: 'Chuyên đề 1 • Tiệm cận đồ thị hàm số',
    query: 'Nêu quy trình tìm tiệm cận đứng, tiệm cận ngang và tiệm cận xiên của đồ thị hàm phân thức trong Chương I Toán 12?'
  },
  {
    label: 'Chuyên đề 1 • GTLN - GTNN & Tối ưu hộp tôn',
    query: 'Nêu quy tắc tìm GTLN, GTNN trên đoạn [a; b] và giải bài toán gập hộp tôn thể tích cực đại?'
  },
  {
    label: 'Chuyên đề 2 • Bảng nguyên hàm & Newton-Leibniz',
    query: 'Tổng hợp bảng nguyên hàm cơ bản, công thức Newton-Leibniz và thể tích khối tròn xoay Chương IV Toán 12?'
  },
  {
    label: 'Chuyên đề 2 • Bài toán Bát Tràng & Lorenz',
    query: 'Giải bài toán thể tích bình gốm Bát Tràng (Bài 4.35) và hệ số bất bình đẳng Gini từ đường cong Lorenz (Bài 4.16)?'
  },
  {
    label: 'Chuyên đề 3 • Tọa độ Oxyz & Khoảng cách',
    query: 'Tóm tắt công thức phương trình mặt phẳng, đường thẳng, mặt cầu và công thức tính góc, khoảng cách trong Oxyz?'
  },
  {
    label: 'Chuyên đề 4 • Xác suất Bayes & Cây xác suất',
    query: 'Trình bày công thức xác suất có điều kiện, xác suất toàn phần và công thức Bayes trong Chương VI Toán 12?'
  },
  {
    label: 'Chuyên đề 4 • Thống kê đo mức độ phân tán',
    query: 'Công thức tính khoảng biến thiên, khoảng tứ phân vị, phương sai và độ lệch chuẩn cho mẫu số liệu ghép nhóm Lớp 12?'
  },
  {
    label: 'Chuyên đề 5 • Hàm số Mũ & Lôgarit Lớp 11',
    query: 'Tóm tắt các công thức biến đổi logarit, đổi cơ số và cách giải phương trình, bất phương trình mũ - logarit?'
  },
  {
    label: 'Chuyên đề 6 • Hình học không gian Lớp 11',
    query: 'Nêu phương pháp chứng minh đường thẳng vuông góc mặt phẳng, xác định góc giữa đường thẳng và mặt phẳng, góc nhị diện?'
  },
  {
    label: 'Chuyên đề 7 • Cấp số cộng & Cấp số nhân',
    query: 'Công thức số hạng tổng quát và tính tổng n số hạng đầu của cấp số cộng và cấp số nhân Lớp 11?'
  },
  {
    label: 'Chuyên đề 8 • Quy hoạch tuyến tính Lớp 10',
    query: 'Trình bày phương pháp giải bài toán quy hoạch tuyến tính tìm lợi nhuận lớn nhất bằng miền nghiệm đa giác Lớp 10?'
  },
  {
    label: 'Chuyên đề 8 • Hệ thức lượng tam giác Lớp 10',
    query: 'Tổng hợp định lí côsin, định lí sin và các công thức tính diện tích tam giác trong Chương IV Toán 10?'
  }
];
