import React, { useState, useRef, useEffect, useMemo } from 'react';
import MathView from '../MathView';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  HelpCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Layers,
  BookOpen,
  Award
} from 'lucide-react';

/* ============================================================
   CÁC HÀM SỐ MẪU KINH ĐIỂN TRONG SGK TOÁN 12 TẬP 1 (BÀI 1 TRANG 5 - 13)
   ============================================================ */
const SAMPLE_FUNCTIONS = [
  {
    id: 'sample1',
    name: 'Ví dụ 1 (SGK Trang 6): y = x³ - 3x² + 2',
    type: 'cubic',
    latex: 'y = x^3 - 3x^2 + 2',
    derivativeLatex: "y' = 3x^2 - 6x = 3x(x - 2)",
    a: 1, b: -3, c: 0, d: 2,
    domainText: 'D = ℝ',
    criticalPoints: [
      { x: 0, y: 2, type: 'Cực đại' },
      { x: 2, y: -2, type: 'Cực tiểu' }
    ],
    increasingIntervals: '(-\\infty; 0) \\text{ và } (2; +\\infty)',
    decreasingIntervals: '(0; 2)',
    desc: 'Đạo hàm có 2 nghiệm phân biệt x = 0 và x = 2. Dấu y\' dương ở hai khoảng ngoài và âm ở khoảng giữa.'
  },
  {
    id: 'sample2',
    name: 'Ví dụ 2 (SGK Trang 7): y = -x³ + 3x - 1',
    type: 'cubic',
    latex: 'y = -x^3 + 3x - 1',
    derivativeLatex: "y' = -3x^2 + 3 = -3(x^2 - 1)",
    a: -1, b: 0, c: 3, d: -1,
    domainText: 'D = ℝ',
    criticalPoints: [
      { x: -1, y: -3, type: 'Cực tiểu' },
      { x: 1, y: 1, type: 'Cực đại' }
    ],
    increasingIntervals: '(-1; 1)',
    decreasingIntervals: '(-\\infty; -1) \\text{ và } (1; +\\infty)',
    desc: 'Hệ số a < 0. Đạo hàm y\' > 0 trong khoảng (-1; 1) nên hàm số đồng biến trên (-1; 1).'
  },
  {
    id: 'sample3',
    name: 'Ví dụ 3 (SGK Trang 8): y = x³ + 3x - 2 (Luôn đồng biến)',
    type: 'cubic',
    latex: 'y = x^3 + 3x - 2',
    derivativeLatex: "y' = 3x^2 + 3 = 3(x^2 + 1) > 0, \\forall x \\in \\mathbb{R}",
    a: 1, b: 0, c: 3, d: -2,
    domainText: 'D = ℝ',
    criticalPoints: [],
    increasingIntervals: '(-\\infty; +\\infty)',
    decreasingIntervals: '\\emptyset',
    desc: 'Đạo hàm luôn dương với mọi x thực. Hàm số luôn đồng biến trên ℝ và không có cực trị.'
  },
  {
    id: 'sample4',
    name: 'Luyện tập 3 (SGK Trang 9): y = x⁴ - 2x² (Hàm trùng phương)',
    type: 'quartic',
    latex: 'y = x^4 - 2x^2',
    derivativeLatex: "y' = 4x^3 - 4x = 4x(x^2 - 1)",
    a: 1, b: -2, c: 0, d: 0,
    domainText: 'D = ℝ',
    criticalPoints: [
      { x: -1, y: -1, type: 'Cực tiểu' },
      { x: 0, y: 0, type: 'Cực đại' },
      { x: 1, y: -1, type: 'Cực tiểu' }
    ],
    increasingIntervals: '(-1; 0) \\text{ và } (1; +\\infty)',
    decreasingIntervals: '(-\\infty; -1) \\text{ và } (0; 1)',
    desc: 'Đạo hàm có 3 nghiệm phân biệt x = -1, x = 0, x = 1. Đồ thị có 2 điểm cực tiểu và 1 điểm cực đại đối xứng qua Oy.'
  },
  {
    id: 'sample5',
    name: 'Ví dụ 4 (SGK Trang 11): y = (2x - 1) / (x + 1)',
    type: 'rational',
    latex: 'y = \\frac{2x - 1}{x + 1}',
    derivativeLatex: "y' = \\frac{2(1) - (-1)(1)}{(x + 1)^2} = \\frac{3}{(x + 1)^2} > 0, \\forall x \\neq -1",
    a: 2, b: -1, c: 1, d: 1,
    domainText: 'D = ℝ \\setminus \\{-1\\}',
    criticalPoints: [],
    increasingIntervals: '(-\\infty; -1) \\text{ và } (-1; +\\infty)',
    decreasingIntervals: '\\emptyset',
    desc: 'Đạo hàm luôn dương trên các khoảng xác định. Hàm số đồng biến trên từng khoảng (-∞; -1) và (-1; +∞).'
  }
];

export default function Part2MonotonicityLab() {
  const [selectedFuncId, setSelectedFuncId] = useState('sample1');
  const [probeX, setProbeX] = useState(0.8);
  const [showTangent, setShowTangent] = useState(true);
  const [showShading, setShowShading] = useState(true);
  const [customParams, setCustomParams] = useState({ a: 1, b: -3, c: 0, d: 2 });
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Active Function Data
  const activeFunc = useMemo(() => {
    if (isCustomMode) {
      const { a, b, c, d } = customParams;
      // y = ax^3 + bx^2 + cx + d
      // y' = 3ax^2 + 2bx + c
      const delta = 4 * b * b - 12 * a * c;
      let crits = [];
      let inc = '';
      let dec = '';
      if (Math.abs(a) > 0.0001) {
        if (delta > 0) {
          const x1 = (-2 * b - Math.sqrt(delta)) / (6 * a);
          const x2 = (-2 * b + Math.sqrt(delta)) / (6 * a);
          const r1 = Math.min(x1, x2);
          const r2 = Math.max(x1, x2);
          const y_r1 = a * r1 ** 3 + b * r1 ** 2 + c * r1 + d;
          const y_r2 = a * r2 ** 3 + b * r2 ** 2 + c * r2 + d;
          if (a > 0) {
            crits = [
              { x: Number(r1.toFixed(2)), y: Number(y_r1.toFixed(2)), type: 'Cực đại' },
              { x: Number(r2.toFixed(2)), y: Number(y_r2.toFixed(2)), type: 'Cực tiểu' }
            ];
            inc = `(-\\infty; ${r1.toFixed(2)}) \\text{ và } (${r2.toFixed(2)}; +\\infty)`;
            dec = `(${r1.toFixed(2)}; ${r2.toFixed(2)})`;
          } else {
            crits = [
              { x: Number(r1.toFixed(2)), y: Number(y_r1.toFixed(2)), type: 'Cực tiểu' },
              { x: Number(r2.toFixed(2)), y: Number(y_r2.toFixed(2)), type: 'Cực đại' }
            ];
            inc = `(${r1.toFixed(2)}; ${r2.toFixed(2)})`;
            dec = `(-\\infty; ${r1.toFixed(2)}) \\text{ và } (${r2.toFixed(2)}; +\\infty)`;
          }
        } else {
          inc = a > 0 ? '(-\\infty; +\\infty)' : '\\emptyset';
          dec = a < 0 ? '(-\\infty; +\\infty)' : '\\emptyset';
        }
      }
      return {
        id: 'custom',
        name: `Hàm số tùy chỉnh: y = ${a}x³ + ${b}x² + ${c}x + ${d}`,
        type: 'cubic',
        a, b, c, d,
        latex: `y = ${a}x^3 ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x^2 ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}x ${d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`}`,
        derivativeLatex: `y' = ${3 * a}x^2 ${2 * b >= 0 ? `+ ${2 * b}` : `- ${Math.abs(2 * b)}`}x ${c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`,
        domainText: 'D = ℝ',
        criticalPoints: crits,
        increasingIntervals: inc || 'Chưa xác định',
        decreasingIntervals: dec || 'Chưa xác định',
        desc: 'Hàm số bậc ba tùy chỉnh theo các thanh trượt hệ số bên dưới.'
      };
    }
    return SAMPLE_FUNCTIONS.find(f => f.id === selectedFuncId) || SAMPLE_FUNCTIONS[0];
  }, [selectedFuncId, isCustomMode, customParams]);

  // Math calculation
  const evalY = (x) => {
    if (isCustomMode) {
      const { a, b, c, d } = customParams;
      return a * x * x * x + b * x * x + c * x + d;
    }
    if (activeFunc.id === 'sample1') return x * x * x - 3 * x * x + 2;
    if (activeFunc.id === 'sample2') return -x * x * x + 3 * x - 1;
    if (activeFunc.id === 'sample3') return x * x * x + 3 * x - 2;
    if (activeFunc.id === 'sample4') return Math.pow(x, 4) - 2 * Math.pow(x, 2);
    if (activeFunc.id === 'sample5') {
      if (Math.abs(x + 1) < 0.05) return null;
      return (2 * x - 1) / (x + 1);
    }
    return x * x * x - 3 * x * x + 2;
  };

  const evalDeriv = (x) => {
    const h = 0.0005;
    const y1 = evalY(x + h);
    const y0 = evalY(x - h);
    if (y1 === null || y0 === null) return null;
    return (y1 - y0) / (2 * h);
  };

  // Canvas visualizer
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Coordinate settings
    const xMin = -4;
    const xMax = 4;
    const yMin = -5;
    const yMax = 5;

    const toPxX = (x) => ((x - xMin) / (xMax - xMin)) * width;
    const toPxY = (y) => height - ((y - yMin) / (yMax - yMin)) * height;

    // Background Grid
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Minor Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      ctx.beginPath();
      ctx.moveTo(toPxX(x), 0);
      ctx.lineTo(toPxX(x), height);
      ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      ctx.beginPath();
      ctx.moveTo(0, toPxY(y));
      ctx.lineTo(width, toPxY(y));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    // Ox
    ctx.beginPath();
    ctx.moveTo(0, toPxY(0));
    ctx.lineTo(width, toPxY(0));
    ctx.stroke();
    // Oy
    ctx.beginPath();
    ctx.moveTo(toPxX(0), 0);
    ctx.lineTo(toPxX(0), height);
    ctx.stroke();

    // Axis ticks and numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x === 0) continue;
      ctx.fillText(x.toString(), toPxX(x) - 4, toPxY(0) + 14);
    }
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      if (y === 0) continue;
      ctx.fillText(y.toString(), toPxX(0) + 6, toPxY(y) + 3);
    }
    ctx.fillText('O', toPxX(0) - 12, toPxY(0) + 14);
    ctx.fillText('x', width - 14, toPxY(0) - 6);
    ctx.fillText('y', toPxX(0) + 8, 14);

    // 1. Shading Intervals of Increase / Decrease
    if (showShading) {
      const step = 0.05;
      for (let x = xMin; x < xMax; x += step) {
        const mid = x + step / 2;
        const d = evalDeriv(mid);
        if (d !== null && isFinite(d)) {
          ctx.fillStyle = d > 0.001 
            ? 'rgba(16, 185, 129, 0.12)' // Light Emerald for Increasing
            : d < -0.001 
            ? 'rgba(245, 158, 11, 0.12)' // Light Amber for Decreasing
            : 'rgba(255, 255, 255, 0)';
          ctx.fillRect(toPxX(x), 0, toPxX(x + step) - toPxX(x), height);
        }
      }
    }

    // 2. Draw Asymptotes if rational function (sample5: y = (2x - 1)/(x + 1))
    if (activeFunc.type === 'rational') {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.6;
      // Vertical asymptote x = -1
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(toPxX(-1), 0);
      ctx.lineTo(toPxX(-1), height);
      ctx.stroke();
      // Horizontal asymptote y = 2
      ctx.strokeStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(0, toPxY(2));
      ctx.lineTo(width, toPxY(2));
      ctx.stroke();
      ctx.restore();
    }

    // 2b. Draw Curve
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let isDrawing = false;
    const curveStep = 0.02;

    for (let x = xMin; x <= xMax; x += curveStep) {
      const y = evalY(x);
      if (y === null || isNaN(y) || Math.abs(y) > 15) {
        isDrawing = false;
        continue;
      }
      const px = toPxX(x);
      const py = toPxY(y);
      if (!isDrawing) {
        ctx.moveTo(px, py);
        isDrawing = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // 3. Mark Critical Points (Cực Đại & Cực Tiểu)
    activeFunc.criticalPoints.forEach((pt) => {
      if (pt.x >= xMin && pt.x <= xMax && pt.y >= yMin && pt.y <= yMax) {
        const px = toPxX(pt.x);
        const py = toPxY(pt.y);

        // Dashed lines to axes
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = pt.type === 'Cực đại' ? '#ef4444' : '#0284c7';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, toPxY(0));
        ctx.moveTo(px, py);
        ctx.lineTo(toPxX(0), py);
        ctx.stroke();
        ctx.setLineDash([]);

        // Circle marker
        ctx.fillStyle = pt.type === 'Cực đại' ? '#ef4444' : '#0284c7';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = pt.type === 'Cực đại' ? '#b91c1c' : '#0369a1';
        ctx.font = 'bold 11px Inter, sans-serif';
        const labelText = `${pt.type} (${pt.x}; ${pt.y})`;
        const textY = pt.type === 'Cực đại' ? py - 10 : py + 18;
        ctx.fillText(labelText, px - 35, textY);
      }
    });

    // 4. Interactive Tangent Line at probeX
    if (showTangent) {
      const curY = evalY(probeX);
      const slope = evalDeriv(probeX);

      if (curY !== null && slope !== null && Math.abs(curY) <= 10) {
        const ptX = toPxX(probeX);
        const ptY = toPxY(curY);

        const tLen = 2.0;
        const x1 = probeX - tLen;
        const y1 = curY - slope * tLen;
        const x2 = probeX + tLen;
        const y2 = curY + slope * tLen;

        ctx.strokeStyle = slope > 0.05 ? '#10b981' : slope < -0.05 ? '#f59e0b' : '#6366f1';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(toPxX(x1), toPxY(y1));
        ctx.lineTo(toPxX(x2), toPxY(y2));
        ctx.stroke();

        // Marker
        ctx.fillStyle = slope > 0.05 ? '#10b981' : slope < -0.05 ? '#f59e0b' : '#6366f1';
        ctx.beginPath();
        ctx.arc(ptX, ptY, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Badge
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px Inter, sans-serif';
        const info = `M(${probeX.toFixed(2)}; ${curY.toFixed(2)}) | k = f'(x) = ${slope.toFixed(2)}`;
        ctx.fillText(info, Math.min(width - 240, Math.max(10, ptX - 70)), Math.max(25, ptY - 14));
      }
    }
  }, [activeFunc, probeX, showTangent, showShading]);

  // Quiz state for Bài 1
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestion = {
    q: 'Cho hàm số y = f(x) có đạo hàm f\'(x) = (x - 1)²(x + 2). Khẳng định nào sau đây đúng?',
    options: [
      { id: 'A', text: 'Hàm số đạt cực đại tại x = 1.', isCorrect: false },
      { id: 'B', text: 'Hàm số đạt cực tiểu tại x = -2.', isCorrect: true },
      { id: 'C', text: 'Hàm số có 2 điểm cực trị.', isCorrect: false },
      { id: 'D', text: 'Hàm số nghịch biến trên khoảng (-2; +∞).', isCorrect: false }
    ],
    explain: 'Vì (x - 1)² ≥ 0 với mọi x, nên dấu của f\'(x) chỉ phụ thuộc vào (x + 2). Khi x qua -2, f\'(x) đổi dấu từ ÂM (-) sang DƯƠNG (+) ⇒ x = -2 là điểm Cực Tiểu. Tại x = 1, đạo hàm bằng 0 nhưng không đổi dấu (nghiệm bội chẵn) nên x = 1 không phải là cực trị. Hàm số chỉ có đúng 1 điểm cực trị.'
  };

  const handleSelectQuiz = (optId) => {
    if (quizSubmitted) return;
    setSelectedAnswer(optId);
  };

  return (
    <div className="space-y-5">
      {/* Unified Section Header inside Chapter I Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-800 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mục 1 • Bài 1 SGK Toán 12 Tập 1 (Trang 5 – 14)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-[-0.02em] mt-0.5">
            Tính Đơn Điệu Và Cực Trị Của Hàm Số
          </h3>
        </div>
        <p className="text-xs text-slate-500 max-w-md sm:text-right">
          Xét dấu đạo hàm <MathView math="f'(x)" />, xác định khoảng đồng biến/nghịch biến, điểm cực trị và lập bảng biến thiên.
        </p>
      </div>

      {/* Main 2-Column Lab: Left Controls & Theory, Right Interactive Canvas & Dynamic Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Sample Function Picker */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Chọn Bài Học Mẫu (SGK Trang 5 - 13):
              </span>
              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isCustomMode 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isCustomMode ? '✓ Tự Nhập Hệ Số' : 'Tự Nhập Hệ Số'}
              </button>
            </div>

            {!isCustomMode ? (
              <div className="space-y-2">
                {SAMPLE_FUNCTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFuncId(f.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
                      selectedFuncId === f.id
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{f.name}</span>
                      {selectedFuncId === f.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{f.latex}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block">
                  Hàm số bậc ba: <MathView math="y = ax^3 + bx^2 + cx + d" />
                </span>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>Hệ số a:</span>
                      <span className="font-mono font-bold text-emerald-700">{customParams.a}</span>
                    </div>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.5"
                      value={customParams.a}
                      onChange={(e) => setCustomParams(p => ({ ...p, a: parseFloat(e.target.value) || 1 }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>Hệ số b:</span>
                      <span className="font-mono font-bold text-emerald-700">{customParams.b}</span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={customParams.b}
                      onChange={(e) => setCustomParams(p => ({ ...p, b: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>Hệ số c:</span>
                      <span className="font-mono font-bold text-emerald-700">{customParams.c}</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.5"
                      value={customParams.c}
                      onChange={(e) => setCustomParams(p => ({ ...p, c: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>Hệ số d:</span>
                      <span className="font-mono font-bold text-emerald-700">{customParams.d}</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.5"
                      value={customParams.d}
                      onChange={(e) => setCustomParams(p => ({ ...p, d: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Probe Point & Tangent Slider */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Điểm Khảo Sát Đạo Hàm Tức Thời:
            </span>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Hoành độ điểm thử <MathView math="x_0" />:
                </span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {probeX.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={probeX}
                onChange={(e) => setProbeX(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Live derivative & Tangent slope state */}
            {(() => {
              const curY = evalY(probeX);
              const curSlope = evalDeriv(probeX);
              if (curY === null || curSlope === null) return null;
              const isInc = curSlope > 0.05;
              const isDec = curSlope < -0.05;
              const isCrit = Math.abs(curSlope) <= 0.05;

              return (
                <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  isInc 
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                    : isDec 
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950' 
                    : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1">
                      {isInc && <TrendingUp className="w-4 h-4 text-emerald-600" />}
                      {isDec && <TrendingDown className="w-4 h-4 text-amber-600" />}
                      {isCrit && <Target className="w-4 h-4 text-indigo-600" />}
                      <span>Hệ số góc tiếp tuyến <MathView math="k = f'(x_0)" />:</span>
                    </span>
                    <span className="font-mono text-sm">{curSlope.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] leading-relaxed">
                    {isInc && (
                      <span>
                        • Vì <MathView math="f'(x_0) > 0" />, tiếp tuyến <strong>dốc lên từ trái sang phải</strong>. Hàm số <strong>đồng biến</strong> tại lân cận điểm này.
                      </span>
                    )}
                    {isDec && (
                      <span>
                        • Vì <MathView math="f'(x_0) < 0" />, tiếp tuyến <strong>dốc xuống từ trái sang phải</strong>. Hàm số <strong>nghịch biến</strong> tại lân cận điểm này.
                      </span>
                    )}
                    {isCrit && (
                      <span>
                        • Vì <MathView math="f'(x_0) \approx 0" />, tiếp tuyến <strong>song song với trục hoành Ox</strong>. Đây là vị trí nghi ngờ đạt <strong>cực trị</strong>!
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showShading}
                  onChange={(e) => setShowShading(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <span>Tô màu khoảng ĐB/NB</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTangent}
                  onChange={(e) => setShowTangent(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <span>Hiện tiếp tuyến động</span>
              </label>
            </div>
          </div>

          {/* Standard Textbook Theory Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Định Lý Trọng Tâm SGK Trang 5 & 10
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <strong className="text-emerald-900 block mb-1">1. Định lý tính đơn điệu:</strong>
                Cho hàm số <MathView math="y = f(x)" /> có đạo hàm trên khoảng <MathView math="(a; b)" />:
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-slate-700">
                  <li>Nếu <MathView math="f'(x) > 0, \forall x \in (a; b)" /> thì hàm số <strong>đồng biến</strong> trên <MathView math="(a; b)" />.</li>
                  <li>Nếu <MathView math="f'(x) < 0, \forall x \in (a; b)" /> thì hàm số <strong>nghịch biến</strong> trên <MathView math="(a; b)" />.</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <strong className="text-blue-900 block mb-1">2. Dấu hiệu cực trị (Quy tắc 1):</strong>
                Nếu <MathView math="f'(x)" /> đổi dấu khi <MathView math="x" /> đi qua <MathView math="x_0" />:
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-slate-700">
                  <li>Từ <strong>Dương (+) sang Âm (-)</strong>: <MathView math="x_0" /> là điểm <strong>Cực Đại</strong> (đỉnh sóng).</li>
                  <li>Từ <strong>Âm (-) sang Dương (+)</strong>: <MathView math="x_0" /> là điểm <strong>Cực Tiểu</strong> (đáy sóng).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Canvas & Dynamic Variation Table */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. 2D Interactive Canvas */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Đồ Thị Trực Quan Hóa Khoảng Đơn Điệu & Điểm Cực Trị
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500 inline-block" />
                  Đồng biến (f' &gt; 0)
                </span>
                <span className="flex items-center gap-1 font-medium text-amber-700">
                  <span className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500 inline-block" />
                  Nghịch biến (f' &lt; 0)
                </span>
              </div>
            </div>

            <div className="w-full aspect-[4/3] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={700}
                height={520}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Function formula bar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Hàm số:</span>
                <MathView math={activeFunc.latex} className="font-bold text-slate-900" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Đạo hàm:</span>
                <MathView math={activeFunc.derivativeLatex} className="font-bold text-emerald-700" />
              </div>
            </div>
          </div>

          {/* 2. Dynamic Table of Variation (Bảng biến thiên động chuẩn SGK) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Bảng Biến Thiên Tương Tác Chuẩn SGK:
            </span>

            {/* Variation Table Component */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-center text-xs border-collapse">
                <tbody>
                  {/* Row x */}
                  <tr className="border-b border-slate-200 bg-slate-50/80 font-mono font-semibold text-slate-700">
                    <td className="w-16 p-2.5 border-r border-slate-200 bg-slate-100 font-sans font-bold text-slate-900">
                      x
                    </td>
                    <td className="p-2.5 text-slate-500">
                      <MathView math="-\infty" />
                    </td>
                    {activeFunc.type === 'rational' ? (
                      <>
                        <td className="p-2.5 text-slate-400">...</td>
                        <td className="p-2.5 text-red-700 font-bold bg-red-50/40">-1</td>
                        <td className="p-2.5 text-slate-400">...</td>
                      </>
                    ) : activeFunc.criticalPoints.length > 0 ? (
                      activeFunc.criticalPoints.map((cp, idx) => (
                        <React.Fragment key={idx}>
                          <td className="p-2.5 text-slate-400">...</td>
                          <td className="p-2.5 text-slate-900 font-bold bg-white">
                            <MathView math={cp.x.toString()} />
                          </td>
                        </React.Fragment>
                      ))
                    ) : (
                      <td className="p-2.5 text-slate-400">
                        (Không có nghiệm f'(x) = 0)
                      </td>
                    )}
                    {activeFunc.criticalPoints.length > 0 && (
                      <td className="p-2.5 text-slate-400">...</td>
                    )}
                    <td className="p-2.5 text-slate-500">
                      <MathView math="+\infty" />
                    </td>
                  </tr>

                  {/* Row f'(x) */}
                  <tr className="border-b border-slate-200 font-mono font-bold">
                    <td className="w-16 p-2.5 border-r border-slate-200 bg-slate-100 font-sans text-slate-900">
                      f'(x)
                    </td>
                    {activeFunc.type === 'rational' ? (
                      <>
                        <td className="p-2.5"></td>
                        <td className="p-2.5 text-emerald-600 bg-emerald-50/30 font-extrabold text-sm">+</td>
                        <td className="p-2.5 text-red-600 bg-red-50/50 font-black tracking-tighter">||</td>
                        <td className="p-2.5 text-emerald-600 bg-emerald-50/30 font-extrabold text-sm">+</td>
                        <td className="p-2.5"></td>
                      </>
                    ) : activeFunc.criticalPoints.length === 2 ? (
                      activeFunc.a > 0 ? (
                        <>
                          <td className="p-2.5"></td>
                          <td className="p-2.5 text-emerald-600 bg-emerald-50/30 font-extrabold text-sm">+</td>
                          <td className="p-2.5 text-slate-900">0</td>
                          <td className="p-2.5 text-amber-600 bg-amber-50/30 font-extrabold text-sm">-</td>
                          <td className="p-2.5 text-slate-900">0</td>
                          <td className="p-2.5 text-emerald-600 bg-emerald-50/30 font-extrabold text-sm">+</td>
                          <td className="p-2.5"></td>
                        </>
                      ) : (
                        <>
                          <td className="p-2.5"></td>
                          <td className="p-2.5 text-amber-600 bg-amber-50/30 font-extrabold text-sm">-</td>
                          <td className="p-2.5 text-slate-900">0</td>
                          <td className="p-2.5 text-emerald-600 bg-emerald-50/30 font-extrabold text-sm">+</td>
                          <td className="p-2.5 text-slate-900">0</td>
                          <td className="p-2.5 text-amber-600 bg-amber-50/30 font-extrabold text-sm">-</td>
                          <td className="p-2.5"></td>
                        </>
                      )
                    ) : activeFunc.criticalPoints.length === 3 ? (
                      <>
                        <td className="p-2.5"></td>
                        <td className="p-2.5 text-amber-600 bg-amber-50/30">-</td>
                        <td className="p-2.5 text-slate-900">0</td>
                        <td className="p-2.5 text-emerald-600 bg-emerald-50/30">+</td>
                        <td className="p-2.5 text-slate-900">0</td>
                        <td className="p-2.5 text-amber-600 bg-amber-50/30">-</td>
                        <td className="p-2.5 text-slate-900">0</td>
                        <td className="p-2.5 text-emerald-600 bg-emerald-50/30">+</td>
                        <td className="p-2.5"></td>
                      </>
                    ) : activeFunc.a < 0 ? (
                      <td colSpan={3} className="p-2.5 text-amber-600 bg-amber-50/30 text-sm">
                        - (Luôn âm hoặc ≤ 0 với mọi x ∈ ℝ)
                      </td>
                    ) : (
                      <td colSpan={3} className="p-2.5 text-emerald-600 bg-emerald-50/30 text-sm">
                        + (Luôn dương hoặc ≥ 0 với mọi x ∈ ℝ)
                      </td>
                    )}
                  </tr>

                  {/* Row f(x) */}
                  <tr className="font-sans">
                    <td className="w-16 p-3 border-r border-slate-200 bg-slate-100 font-bold text-slate-900">
                      f(x)
                    </td>
                    <td colSpan={9} className="p-3 bg-white text-left">
                      <div className="flex items-center justify-around text-xs font-semibold">
                        {activeFunc.type === 'rational' ? (
                          <>
                            <div className="text-center text-sky-700 font-bold">2 (TCN)</div>
                            <div className="flex items-center text-emerald-600 font-bold text-base">↗</div>
                            <div className="text-center text-slate-500">
                              <MathView math="+\infty" />
                            </div>
                            <div className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded font-mono font-black">
                              || (TCĐ x = -1)
                            </div>
                            <div className="text-center text-slate-500">
                              <MathView math="-\infty" />
                            </div>
                            <div className="flex items-center text-emerald-600 font-bold text-base">↗</div>
                            <div className="text-center text-sky-700 font-bold">2 (TCN)</div>
                          </>
                        ) : activeFunc.criticalPoints.length === 2 ? (
                          activeFunc.a > 0 ? (
                            <>
                              <div className="text-center text-slate-400">
                                <MathView math="-\infty" />
                              </div>
                              <div className="flex items-center text-emerald-600 font-bold text-base">↗</div>
                              <div className="text-center px-2.5 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200">
                                <div className="text-[10px] text-red-500 font-medium">
                                  {activeFunc.criticalPoints[0].type}
                                </div>
                                <div className="font-bold">{activeFunc.criticalPoints[0].y}</div>
                              </div>
                              <div className="flex items-center text-amber-600 font-bold text-base">↘</div>
                              <div className="text-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                                <div className="text-[10px] text-blue-500 font-medium">
                                  {activeFunc.criticalPoints[1].type}
                                </div>
                                <div className="font-bold">{activeFunc.criticalPoints[1].y}</div>
                              </div>
                              <div className="flex items-center text-emerald-600 font-bold text-base">↗</div>
                              <div className="text-center text-slate-400">
                                <MathView math="+\infty" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-center text-slate-400">
                                <MathView math="+\infty" />
                              </div>
                              <div className="flex items-center text-amber-600 font-bold text-base">↘</div>
                              <div className="text-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                                <div className="text-[10px] text-blue-500 font-medium">
                                  {activeFunc.criticalPoints[0].type}
                                </div>
                                <div className="font-bold">{activeFunc.criticalPoints[0].y}</div>
                              </div>
                              <div className="flex items-center text-emerald-600 font-bold text-base">↗</div>
                              <div className="text-center px-2.5 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200">
                                <div className="text-[10px] text-red-500 font-medium">
                                  {activeFunc.criticalPoints[1].type}
                                </div>
                                <div className="font-bold">{activeFunc.criticalPoints[1].y}</div>
                              </div>
                              <div className="flex items-center text-amber-600 font-bold text-base">↘</div>
                              <div className="text-center text-slate-400">
                                <MathView math="-\infty" />
                              </div>
                            </>
                          )
                        ) : activeFunc.criticalPoints.length === 3 ? (
                          <>
                            <div className="text-center text-slate-400">
                              <MathView math="+\infty" />
                            </div>
                            <div className="text-amber-600 font-bold text-base">↘</div>
                            <div className="text-center px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                              <div className="text-[10px]">Cực tiểu</div>
                              <div className="font-bold">{activeFunc.criticalPoints[0].y}</div>
                            </div>
                            <div className="text-emerald-600 font-bold text-base">↗</div>
                            <div className="text-center px-2 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200">
                              <div className="text-[10px]">Cực đại</div>
                              <div className="font-bold">{activeFunc.criticalPoints[1].y}</div>
                            </div>
                            <div className="text-amber-600 font-bold text-base">↘</div>
                            <div className="text-center px-2 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                              <div className="text-[10px]">Cực tiểu</div>
                              <div className="font-bold">{activeFunc.criticalPoints[2].y}</div>
                            </div>
                            <div className="text-emerald-600 font-bold text-base">↗</div>
                            <div className="text-center text-slate-400">
                              <MathView math="+\infty" />
                            </div>
                          </>
                        ) : activeFunc.a < 0 ? (
                          <>
                            <div className="text-slate-400">
                              <MathView math="+\infty" />
                            </div>
                            <div className="text-amber-600 font-bold">
                              ↘ (Nghịch biến trên toàn trục số ℝ) ↘
                            </div>
                            <div className="text-slate-400">
                              <MathView math="-\infty" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-slate-400">
                              <MathView math="-\infty" />
                            </div>
                            <div className="text-emerald-600 font-bold">
                              ↗ (Đồng biến trên toàn trục số ℝ) ↗
                            </div>
                            <div className="text-slate-400">
                              <MathView math="+\infty" />
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pedagogical Conclusion */}
            <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100 text-xs space-y-1.5 text-slate-700">
              <strong className="text-emerald-950 font-bold block">
                Kết Luận Sư Phạm (Chuẩn Trình Bày Tự Luận & Trắc Nghiệm):
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  • <strong>Đồng biến trên:</strong>{' '}
                  <MathView math={activeFunc.increasingIntervals} className="font-semibold text-emerald-700" />
                </div>
                <div>
                  • <strong>Nghịch biến trên:</strong>{' '}
                  <MathView math={activeFunc.decreasingIntervals} className="font-semibold text-amber-700" />
                </div>
                {activeFunc.criticalPoints.map((cp, i) => (
                  <div key={i} className="sm:col-span-2">
                    • <strong>{cp.type}:</strong> Điểm cực trị{' '}
                    <MathView math={`x = ${cp.x}`} /> ; Giá trị cực trị{' '}
                    <MathView math={`y = ${cp.y}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Fast Self-Test Quiz */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                Luyện Nhanh Bài 1: Dạng Bẫy Nghiệm Bội Chẵn
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-emerald-200">
                Chuẩn GDPT 2018
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {quizQuestion.q}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quizQuestion.options.map((opt) => {
                const isChosen = selectedAnswer === opt.id;
                let btnStyle = 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-200';
                if (quizSubmitted) {
                  if (opt.isCorrect) btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-bold';
                  else if (isChosen && !opt.isCorrect) btnStyle = 'bg-red-600/80 text-white border-red-400';
                } else if (isChosen) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-400 font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectQuiz(opt.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center gap-2 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {opt.id}
                    </span>
                    <span className="text-[11px]">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <div className="flex justify-end pt-1">
                <button
                  disabled={!selectedAnswer}
                  onClick={() => setQuizSubmitted(true)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedAnswer 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm' 
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Kiểm Tra Đáp Án
                </button>
              </div>
            ) : (
              <div className="mt-2 p-3 bg-white/10 rounded-xl border border-white/20 text-xs text-slate-200 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Giải Thích Chi Tiết Của Giáo Viên:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {quizQuestion.explain}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
