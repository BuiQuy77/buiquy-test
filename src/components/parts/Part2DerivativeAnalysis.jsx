import React, { useState, useRef, useEffect } from 'react';
import MathView from '../MathView';
import Part2ExerciseBank from './Part2ExerciseBank';
import Part2MonotonicityLab from './Part2MonotonicityLab';
import Part2OptimizationLab from './Part2OptimizationLab';
import { 
  TrendingUp, 
  Sliders, 
  HelpCircle, 
  Layers, 
  Maximize2, 
  Target, 
  Sparkles,
  ArrowUpRight,
  Calculator,
  Compass,
  CheckCircle2,
  Box,
  DollarSign,
  FileCheck,
  BookOpen
} from 'lucide-react';

/* ============================================================
   DANH SÁCH 3 DẠNG HÀM SỐ KINH ĐIỂN THEO SGK GDPT 2018 (CHƯƠNG I)
   ============================================================ */
const FUNCTION_TYPES = [
  {
    id: 'cubic',
    name: '1. Hàm số bậc ba: y = ax³ + bx² + cx + d',
    desc: 'Hàm số bậc ba chuẩn có tâm đối xứng là điểm uốn U. Có 2 điểm cực trị khi Δ\' > 0 hoặc không có cực trị khi Δ\' ≤ 0.',
    defaultParams: { a: 1, b: -3, c: 0, d: 2 },
    inputs: [
      { key: 'a', label: 'Hệ số a (≠ 0)', min: -2, max: 2, step: 0.5 },
      { key: 'b', label: 'Hệ số b', min: -5, max: 5, step: 0.5 },
      { key: 'c', label: 'Hệ số c', min: -6, max: 6, step: 0.5 },
      { key: 'd', label: 'Hệ số d', min: -5, max: 5, step: 0.5 },
    ]
  },
  {
    id: 'rational1',
    name: '2. Hàm phân thức bậc nhất / bậc nhất: y = (ax + b) / (cx + d)',
    desc: 'Đồ thị là đường hypebol có 1 tiệm cận đứng x = -d/c và 1 tiệm cận ngang y = a/c. Giao điểm 2 tiệm cận là tâm đối xứng I.',
    defaultParams: { a: 2, b: 1, c: 1, d: -1 },
    inputs: [
      { key: 'a', label: 'Hệ số a', min: -4, max: 4, step: 0.5 },
      { key: 'b', label: 'Hệ số b', min: -5, max: 5, step: 0.5 },
      { key: 'c', label: 'Hệ số c (≠ 0)', min: 1, max: 3, step: 0.5 },
      { key: 'd', label: 'Hệ số d', min: -4, max: 4, step: 0.5 },
    ]
  },
  {
    id: 'rational2',
    name: '3. Hàm phân thức bậc hai / bậc nhất: y = (ax² + bx + c) / (px + q)',
    desc: 'Điểm mới trọng tâm GDPT 2018: Đồ thị có 1 tiệm cận đứng và 1 tiệm cận xiên y = αx + β. Giao điểm 2 tiệm cận là tâm đối xứng.',
    defaultParams: { a: 1, b: -2, c: 2, p: 1, q: -1 },
    inputs: [
      { key: 'a', label: 'Hệ số a', min: -2, max: 2, step: 0.5 },
      { key: 'b', label: 'Hệ số b', min: -4, max: 4, step: 0.5 },
      { key: 'c', label: 'Hệ số c', min: -4, max: 4, step: 0.5 },
      { key: 'p', label: 'Hệ số p (≠ 0)', min: 1, max: 2, step: 0.5 },
      { key: 'q', label: 'Hệ số q', min: -3, max: 3, step: 0.5 },
    ]
  }
];

const normalizeSubTab = (tab) => {
  if (tab === 'asymptote') return 'asymptotes';
  if (tab === 'graph-lab') return 'grapher';
  return tab || 'all';
};

export default function Part2DerivativeAnalysis({ onOpenCasioModal, activeSubTab, onSelectSubTab }) {
  const [activeTab, setActiveTab] = useState(normalizeSubTab(activeSubTab)); // 'monotonicity' | 'optimization' | 'asymptotes' | 'grapher' | 'exercises' | 'theory'
  const [asymPreset, setAsymPreset] = useState('slant'); // 'slant' | 'rational1' | 'cost'
  const [asymX, setAsymX] = useState(4.5);

  useEffect(() => {
    if (activeSubTab) {
      setActiveTab(normalizeSubTab(activeSubTab));
    }
  }, [activeSubTab]);

  const handleTabChange = (tabId) => {
    const norm = normalizeSubTab(tabId);
    setActiveTab(norm);
    if (onSelectSubTab) {
      onSelectSubTab(norm);
    }
  };
  
  // Grapher state
  const [funcType, setFuncType] = useState('cubic');
  const [params, setParams] = useState({ a: 1, b: -3, c: 0, d: 2, p: 1, q: -1 });
  const [showTangent, setShowTangent] = useState(true);
  const [probeX, setProbeX] = useState(1);
  const canvasRef = useRef(null);

  // Update params when changing function type
  const handleSelectType = (typeId) => {
    setFuncType(typeId);
    const found = FUNCTION_TYPES.find(f => f.id === typeId);
    if (found) {
      setParams(prev => ({ ...prev, ...found.defaultParams }));
      setProbeX(1);
    }
  };

  const handleParamChange = (k, val) => {
    setParams(prev => ({ ...prev, [k]: parseFloat(val) }));
  };

  // Math evaluations for current function
  const evaluateF = (x) => {
    if (funcType === 'cubic') {
      const { a, b, c, d } = params;
      return a * x * x * x + b * x * x + c * x + d;
    }
    if (funcType === 'rational1') {
      const { a, b, c, d } = params;
      const denom = c * x + d;
      if (Math.abs(denom) < 0.0001) return null;
      return (a * x + b) / denom;
    }
    if (funcType === 'rational2') {
      const { a, b, c, p, q } = params;
      const denom = p * x + q;
      if (Math.abs(denom) < 0.0001) return null;
      return (a * x * x + b * x + c) / denom;
    }
    return 0;
  };

  const evaluateDerivative = (x) => {
    const h = 0.001;
    const f1 = evaluateF(x + h);
    const f0 = evaluateF(x - h);
    if (f1 === null || f0 === null) return null;
    return (f1 - f0) / (2 * h);
  };

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== 'grapher') return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Coordinate settings
    const xRange = [-6, 6];
    const yRange = [-7, 7];
    const toPxX = (x) => ((x - xRange[0]) / (xRange[1] - xRange[0])) * width;
    const toPxY = (y) => height - ((y - yRange[0]) / (yRange[1] - yRange[0])) * height;

    // 1. Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
      ctx.beginPath();
      ctx.moveTo(toPxX(x), 0);
      ctx.lineTo(toPxX(x), height);
      ctx.stroke();
    }
    for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
      ctx.beginPath();
      ctx.moveTo(0, toPxY(y));
      ctx.lineTo(width, toPxY(y));
      ctx.stroke();
    }

    // 2. Main Axes (Ox & Oy)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.8;
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

    // Axis Arrowheads
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('x', width - 15, toPxY(0) - 8);
    ctx.fillText('y', toPxX(0) + 8, 14);
    ctx.fillText('O', toPxX(0) - 14, toPxY(0) + 16);

    // Number marks
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    for (let x = -5; x <= 5; x++) {
      if (x !== 0) ctx.fillText(x.toString(), toPxX(x) - 4, toPxY(0) + 14);
    }
    for (let y = -6; y <= 6; y++) {
      if (y !== 0) ctx.fillText(y.toString(), toPxX(0) + 5, toPxY(y) + 3);
    }

    // 3. Asymptotes (Đường tiệm cận)
    if (funcType === 'rational1') {
      const { a, c, d } = params;
      const vertX = -d / (c || 1);
      const horizY = a / (c || 1);

      // Tiệm cận đứng (đỏ)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(toPxX(vertX), 0);
      ctx.lineTo(toPxX(vertX), height);
      ctx.stroke();

      // Tiệm cận ngang (xanh dương)
      ctx.strokeStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(0, toPxY(horizY));
      ctx.lineTo(width, toPxY(horizY));
      ctx.stroke();
      ctx.setLineDash([]);

      // Tâm đối xứng I
      ctx.fillStyle = '#9333ea';
      ctx.beginPath();
      ctx.arc(toPxX(vertX), toPxY(horizY), 5.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText(`I(${vertX.toFixed(1)}; ${horizY.toFixed(1)})`, toPxX(vertX) + 8, toPxY(horizY) - 8);
    }

    if (funcType === 'rational2') {
      const { a, b, p, q } = params;
      const vertX = -q / (p || 1);
      // Asymptote slant: y = αx + β
      // (ax² + bx + c) / (px + q) = (a/p)x + (b - a*q/p)/p
      const alpha = a / (p || 1);
      const beta = (b - (a * q) / (p || 1)) / (p || 1);

      // Tiệm cận đứng
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(toPxX(vertX), 0);
      ctx.lineTo(toPxX(vertX), height);
      ctx.stroke();

      // Tiệm cận xiên (tím)
      ctx.strokeStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(toPxX(xRange[0]), toPxY(alpha * xRange[0] + beta));
      ctx.lineTo(toPxX(xRange[1]), toPxY(alpha * xRange[1] + beta));
      ctx.stroke();
      ctx.setLineDash([]);

      // Tâm đối xứng I (giao điểm TC đứng và TC xiên)
      const centerI_Y = alpha * vertX + beta;
      ctx.fillStyle = '#9333ea';
      ctx.beginPath();
      ctx.arc(toPxX(vertX), toPxY(centerI_Y), 5.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText(`I(${vertX.toFixed(1)}; ${centerI_Y.toFixed(1)})`, toPxX(vertX) + 8, toPxY(centerI_Y) - 8);
    }

    // 4. Điểm uốn tâm đối xứng cho hàm bậc 3
    if (funcType === 'cubic') {
      const { a, b } = params;
      if (a !== 0) {
        const uX = -b / (3 * a);
        const uY = evaluateF(uX);
        if (uY !== null) {
          ctx.fillStyle = '#9333ea';
          ctx.beginPath();
          ctx.arc(toPxX(uX), toPxY(uY), 5.5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText(`Tâm đối xứng U(${uX.toFixed(1)}; ${uY.toFixed(1)})`, toPxX(uX) + 8, toPxY(uY) - 8);
        }
      }
    }

    // 5. Curve Plot
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    const steps = 600;
    const dx = (xRange[1] - xRange[0]) / steps;
    let isDrawing = false;

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = xRange[0] + i * dx;
      const y = evaluateF(x);

      // Check discontinuity
      if (y === null || isNaN(y) || Math.abs(y) > 30) {
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

    // 6. Interactive Probe & Tangent Line (Tiếp tuyến tại điểm x₀)
    if (showTangent) {
      const curY = evaluateF(probeX);
      const slope = evaluateDerivative(probeX);

      if (curY !== null && slope !== null && Math.abs(curY) <= 12) {
        const ptX = toPxX(probeX);
        const ptY = toPxY(curY);

        // Tangent line segment
        const tLen = 2.5;
        const x1 = probeX - tLen;
        const y1 = curY - slope * tLen;
        const x2 = probeX + tLen;
        const y2 = curY + slope * tLen;

        ctx.strokeStyle = slope >= 0 ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(toPxX(x1), toPxY(y1));
        ctx.lineTo(toPxX(x2), toPxY(y2));
        ctx.stroke();

        // Tangent Point Marker
        ctx.fillStyle = slope >= 0 ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(ptX, ptY, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Coordinates tool-tip badge
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px Inter, sans-serif';
        const info = `M(${probeX.toFixed(1)}; ${curY.toFixed(1)}) | k = f'(x) = ${slope.toFixed(2)}`;
        ctx.fillText(info, Math.min(width - 230, Math.max(10, ptX - 80)), Math.max(25, ptY - 14));
      }
    }
  }, [funcType, params, probeX, showTangent, activeTab]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Unified Chapter I Header + Integrated Section Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-teal-300 mb-2 border border-slate-700">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CHƯƠNG I • SGK TOÁN 12 TẬP 1 KNTT (TRANG 5 – 44)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] leading-tight">
              Chương I: Ứng Dụng Đạo Hàm Để Khảo Sát Và Vẽ Đồ Thị Của Hàm Số
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Khối kiến thức thống nhất toàn chương gồm 6 mục: Bài 1 (Đơn điệu & Cực trị), Bài 2 & 5 (GTLN – GTNN & Tối ưu thực tiễn), Bài 3 (Đường tiệm cận), Bài 4 (Khảo sát & Vẽ đồ thị), Ôn tập cuối chương và Bảng tổng kết.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleTabChange(activeTab === 'all' ? 'monotonicity' : 'all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-teal-500 text-slate-950 border-teal-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{activeTab === 'all' ? 'Đang hiển thị gộp 1 khối' : 'Gộp tất cả mục (1 khối)'}</span>
            </button>

            {onOpenCasioModal && (
              <button
                onClick={onOpenCasioModal}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="p-1 rounded bg-amber-400 text-slate-950 font-bold">
                  <Calculator className="w-3 h-3" />
                </div>
                <span>Bấm Máy Casio Chương I</span>
              </button>
            )}
          </div>
        </div>

        {/* Integrated Navigation Sub-Tabs inside the Unified Header */}
        <div className="px-4 sm:px-6 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'Tất cả Chương I (1 khối)', icon: Layers },
            { id: 'monotonicity', label: '1. Bài 1: Đơn Điệu & Cực Trị (Tr.5–14)', icon: TrendingUp },
            { id: 'optimization', label: '2. Bài 2 & 5: GTLN - GTNN & Tối Ưu', icon: Box },
            { id: 'asymptotes', label: '3. Bài 3: 3 Đường Tiệm Cận (Tr.20–25)', icon: ArrowUpRight },
            { id: 'grapher', label: '4. Bài 4: Khảo Sát & Vẽ Đồ Thị (Tr.26–32)', icon: Sliders },
            { id: 'exercises', label: '5. Ôn Tập Chương I (Tr.42–44)', icon: FileCheck },
            { id: 'theory', label: '6. Bảng Tổng Kết Chương I', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Unified Body Container of Chapter I */}
      <div className="p-5 sm:p-6 space-y-10 bg-white">
        {/* =======================================================
            MỤC 1: BÀI 1 - TÍNH ĐƠN ĐIỆU & CỰC TRỊ CỦA HÀM SỐ (TRANG 5 - 14)
            ======================================================= */}
        {(activeTab === 'monotonicity' || activeTab === 'all') && (
          <Part2MonotonicityLab />
        )}

        {/* =======================================================
            MỤC 2: BÀI 2 & 5 - MIN - MAX & TỐI ƯU HÓA THỰC TIỄN (TRANG 15 & 33)
            ======================================================= */}
        {(activeTab === 'optimization' || activeTab === 'all') && (
          <div className={activeTab === 'all' ? 'pt-8 border-t-2 border-slate-200' : ''}>
            <Part2OptimizationLab />
          </div>
        )}

        {/* =======================================================
            MỤC 4: BÀI 4 - PHÒNG THÍ NGHIỆM KHẢO SÁT & VẼ ĐỒ THỊ (TRANG 26 - 32)
            ======================================================= */}
        {(activeTab === 'grapher' || activeTab === 'all') && (
          <div className={`space-y-5 ${activeTab === 'all' ? 'pt-8 border-t-2 border-slate-200' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Mục 4 • Bài 4 SGK Toán 12 Tập 1 (Trang 26 – 32)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-[-0.02em] mt-0.5">
                  Khảo Sát Sự Biến Thiên Và Vẽ Đồ Thị Của Hàm Số
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-md sm:text-right">
                Khảo sát trực quan 3 dạng hàm số trọng tâm: bậc ba, phân thức bậc 1/1 và bậc 2/1 kèm tâm đối xứng.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Math Info */}
          <div className="lg:col-span-5 space-y-4">
            {/* Function Preset Selector */}
            <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Chọn Dạng Hàm Số (Theo Chuẩn GDPT 2018):
              </span>
              <div className="space-y-2">
                {FUNCTION_TYPES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelectType(f.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
                      funcType === f.id
                        ? 'border-blue-500 bg-blue-50/60 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50/30'
                    }`}
                  >
                    <span className="font-bold text-slate-900">{f.name}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-2">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders for Parameters */}
            <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Điều Chỉnh Hệ Số Đồ Thị:
                </span>
                <span className="text-[11px] text-blue-600 font-mono font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                  Biến thiên thời gian thực
                </span>
              </div>

              <div className="space-y-3">
                {FUNCTION_TYPES.find(f => f.id === funcType)?.inputs.map((inp) => (
                  <div key={inp.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">{inp.label}:</span>
                      <span className="font-bold font-mono text-slate-900">{params[inp.key]}</span>
                    </div>
                    <input
                      type="range"
                      min={inp.min}
                      max={inp.max}
                      step={inp.step}
                      value={params[inp.key] ?? 1}
                      onChange={(e) => handleParamChange(inp.key, e.target.value)}
                      className="w-full h-1.5 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                ))}
              </div>

              {/* Tangent Probe Slider */}
              <div className="pt-3 border-t border-sky-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={showTangent}
                      onChange={(e) => setShowTangent(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    Rê điểm <MathView math="M(x_0; y_0)" /> xem tiếp tuyến động:
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-600">x₀ = {probeX}</span>
                </div>
                {showTangent && (
                  <input
                    type="range"
                    min="-4.5"
                    max="4.5"
                    step="0.1"
                    value={probeX}
                    onChange={(e) => setProbeX(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                )}
              </div>
            </div>

            {/* Analytical Results Box */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 text-xs space-y-2.5">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-700" />
                Đặc Trưng Hình Học Đồ Thị:
              </span>

              {funcType === 'cubic' && (
                <div className="space-y-1.5 text-slate-700 leading-relaxed">
                  <p>
                    • <strong>Đạo hàm bậc nhất:</strong>{' '}
                    <MathView
                      math={`y' = ${3 * params.a}x^2 ${2 * params.b >= 0 ? `+ ${2 * params.b}` : `- ${Math.abs(2 * params.b)}`}x ${params.c >= 0 ? `+ ${params.c}` : `- ${Math.abs(params.c)}`}`}
                      className="text-blue-800 font-semibold"
                    />
                  </p>
                  <p>
                    • <strong>Tâm đối xứng (Điểm uốn):</strong>{' '}
                    <MathView
                      math={`U\\left(-\\frac{b}{3a}; y_U\\right) = U\\left(${(-params.b / (3 * (params.a || 1))).toFixed(2)}; ${evaluateF(-params.b / (3 * (params.a || 1)))?.toFixed(2)}\\right)`}
                      className="text-purple-700 font-semibold"
                    />
                  </p>
                  <p className="text-[11px] text-slate-500">
                    💡 Đồ thị hàm số bậc ba luôn nhận điểm uốn <MathView math="U" /> (nghiệm của <MathView math="y'' = 6ax + 2b = 0" />) làm tâm đối xứng.
                  </p>
                </div>
              )}

              {funcType === 'rational1' && (
                <div className="space-y-1.5 text-slate-700 leading-relaxed">
                  <p>
                    • <strong>Tiệm cận đứng:</strong>{' '}
                    <span className="text-red-600 font-mono font-bold">x = {(-params.d / (params.c || 1)).toFixed(2)}</span>
                  </p>
                  <p>
                    • <strong>Tiệm cận ngang:</strong>{' '}
                    <span className="text-blue-600 font-mono font-bold">y = {(params.a / (params.c || 1)).toFixed(2)}</span>
                  </p>
                  <p>
                    • <strong>Tâm đối xứng:</strong> Giao điểm{' '}
                    <span className="text-purple-700 font-mono font-bold">I({(-params.d / (params.c || 1)).toFixed(1)}; {(params.a / (params.c || 1)).toFixed(1)})</span>
                  </p>
                </div>
              )}

              {funcType === 'rational2' && (() => {
                const pVal = params.p || 1;
                const alpha = params.a / pVal;
                const beta = (params.b - (params.a * params.q) / pVal) / pVal;
                return (
                  <div className="space-y-1.5 text-slate-700 leading-relaxed">
                    <p>
                      • <strong>Tiệm cận đứng:</strong>{' '}
                      <span className="text-red-600 font-mono font-bold">x = {(-params.q / pVal).toFixed(2)}</span>
                    </p>
                    <p>
                      • <strong>Tiệm cận xiên:</strong>{' '}
                      <span className="text-purple-700 font-mono font-bold">
                        y = {alpha.toFixed(1)}x {beta >= 0 ? `+ ${beta.toFixed(2)}` : `- ${Math.abs(beta).toFixed(2)}`}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      💡 Tiệm cận xiên là nội dung trọng tâm của SGK Toán 12 GDPT 2018 (Bài 3 & Bài 4).
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Canvas Graph View */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="text-xs font-bold text-slate-800">
                  Hệ Tọa Độ 2D Trực Quan Hóa Đồ Thị & Đường Tiệm Cận
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-blue-700 font-medium">
                  <span className="w-3 h-1 bg-blue-600 inline-block rounded-sm"></span> Đồ thị
                </span>
                {(funcType === 'rational1' || funcType === 'rational2') && (
                  <>
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <span className="w-3 h-1 bg-red-500 inline-block rounded-sm"></span> TC Đứng
                    </span>
                    {funcType === 'rational1' ? (
                      <span className="flex items-center gap-1 text-sky-600 font-medium">
                        <span className="w-3 h-1 bg-sky-600 inline-block rounded-sm"></span> TC Ngang
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-purple-600 font-medium">
                        <span className="w-3 h-1 bg-purple-600 inline-block rounded-sm"></span> TC Xiên
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="relative w-full aspect-[4/3] bg-white rounded-xl border border-sky-100 overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={650}
                height={500}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>
                💡 <strong>Tiếp tuyến tại điểm:</strong>{' '}
                Hệ số góc <MathView math="k = f'(x_0)" /> &gt; 0 biểu diễn hàm đồng biến (màu xanh lá), <MathView math="k < 0" /> nghịch biến (màu vàng cam).
              </span>
            </div>
          </div>
        </div>
      </div>
        )}

        {/* =======================================================
            MỤC 3: BÀI 3 - KHÁM PHÁ 3 ĐƯỜNG TIỆM CẬN (ĐỨNG, NGANG, XIÊN)
            ======================================================= */}
        {(activeTab === 'asymptotes' || activeTab === 'all') && (
          <div className={`space-y-5 ${activeTab === 'all' ? 'pt-8 border-t-2 border-slate-200' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Mục 3 • Bài 3 SGK Toán 12 Tập 1 (Trang 20 – 25)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-[-0.02em] mt-0.5">
                  Đường Tiệm Cận Của Đồ Thị Hàm Số (Ngang, Đứng, Xiên)
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-md sm:text-right">
                Xác định tiệm cận ngang, tiệm cận đứng và tiệm cận xiên bằng giới hạn hoặc phép chia đa thức.
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Tiệm cận ngang */}
            <div className="bg-white rounded-2xl p-5 border border-sky-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-bold text-slate-800 text-sm">Tiệm Cận Ngang</h4>
              </div>
              <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 text-xs space-y-1.5">
                <span className="text-[11px] text-slate-500 font-semibold block">Định nghĩa SGK (Trang 20):</span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 py-1 text-sky-800 font-semibold">
                  <MathView math="\lim_{x \to +\infty} f(x) = y_0" />
                  <span className="text-xs text-slate-500 font-normal">hoặc</span>
                  <MathView math="\lim_{x \to -\infty} f(x) = y_0" />
                </div>
                <span className="text-[11px] text-slate-600 block text-center">
                  Đường thẳng <MathView math="y = y_0" /> là tiệm cận ngang.
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khi điểm <MathView math="M(x; y)" /> di chuyển xa dần về vô cực trên đồ thị, khoảng cách từ <MathView math="M" /> đến đường thẳng <MathView math="y = y_0" /> tiến dần về 0.
              </p>
            </div>

            {/* 2. Tiệm cận đứng */}
            <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-bold text-slate-800 text-sm">Tiệm Cận Đứng</h4>
              </div>
              <div className="bg-red-50/70 p-3 rounded-xl border border-red-100 text-xs space-y-1.5">
                <span className="text-[11px] text-slate-500 font-semibold block">Định nghĩa SGK (Trang 21):</span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 py-1 text-red-700 font-semibold">
                  <MathView math="\lim_{x \to x_0^+} f(x) = \pm\infty" />
                  <span className="text-xs text-slate-500 font-normal">hoặc</span>
                  <MathView math="\lim_{x \to x_0^-} f(x) = \pm\infty" />
                </div>
                <span className="text-[11px] text-slate-600 block text-center">
                  Đường thẳng <MathView math="x = x_0" /> là tiệm cận đứng.
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Xuất hiện tại các điểm nghiệm làm mẫu số triệt tiêu mà tử số khác 0 (điểm gián đoạn vô cực của hàm phân thức).
              </p>
            </div>

            {/* 3. Tiệm cận xiên */}
            <div className="bg-white rounded-2xl p-5 border border-purple-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-bold text-slate-800 text-sm">Tiệm Cận Xiên (GDPT 2018)</h4>
              </div>
              <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-xs space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold block">Định nghĩa SGK (Trang 22):</span>
                <MathView math="\lim_{x \to \pm\infty} [f(x) - (ax + b)] = 0 \quad (a \neq 0)" block className="text-purple-700 font-semibold" />
                <span className="text-[11px] text-slate-600 block text-center">
                  Đường thẳng <MathView math="y = ax + b" /> là tiệm cận xiên.
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cách tìm bằng chia đa thức: Phân tích <MathView math="f(x) = ax + b + \frac{R}{px + q}" />, khi đó <MathView math="y = ax + b" /> là tiệm cận xiên.
              </p>
            </div>
          </div>

          {/* INTERACTIVE ASYMPTOTE CONVERGENCE SIMULATOR */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  Mô Phỏng Tương Tác: Khoảng Cách Từ Đồ Thị Đến Đường Tiệm Cận Khi x → +∞
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kéo thanh trượt hoành độ <MathView math="x" /> ra xa dần về vô cực để quan sát hiệu số <MathView math="|f(x) - y_{\text{TC}}| \to 0" />.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'slant', label: 'Ví dụ TC Xiên: y = (x² - x + 1)/(x - 1)' },
                  { id: 'rational1', label: 'Ví dụ TC Ngang: y = (2x + 1)/(x - 1)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAsymPreset(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      asymPreset === item.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const isSlant = asymPreset === 'slant';
              const fx = isSlant
                ? asymX + 1 / (asymX - 1)
                : (2 * asymX + 1) / (asymX - 1);
              const yAsym = isSlant ? asymX : 2;
              const diff = Math.abs(fx - yAsym);

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  <div className="lg:col-span-5 space-y-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-slate-800">Biểu thức phân tích (SGK Trang 22–23):</div>
                      {isSlant ? (
                        <MathView
                          math="y = f(x) = \frac{x^2 - x + 1}{x - 1} = x + \frac{1}{x - 1}"
                          block
                          className="text-purple-800 font-bold"
                        />
                      ) : (
                        <MathView
                          math="y = f(x) = \frac{2x + 1}{x - 1} = 2 + \frac{3}{x - 1}"
                          block
                          className="text-sky-800 font-bold"
                        />
                      )}
                      <div className="text-[11px] text-slate-600">
                        • Tiệm cận đứng: <strong className="text-red-600 font-mono">x = 1</strong> (do <MathView math="\lim_{x \to 1^+} f(x) = +\infty" />)
                      </div>
                      <div className="text-[11px] text-slate-600">
                        • {isSlant ? 'Tiệm cận xiên:' : 'Tiệm cận ngang:'}{' '}
                        <strong className="text-purple-700 font-mono">
                          {isSlant ? 'y = x' : 'y = 2'}
                        </strong>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Kéo hoành độ điểm M(x; f(x)) trên nhánh x &gt; 1:</span>
                        <span className="font-mono text-blue-700">x = {asymX.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min="1.3"
                        max="15"
                        step="0.1"
                        value={asymX}
                        onChange={(e) => setAsymX(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                        <div className="text-[10px] text-slate-500 font-semibold">Giá trị f(x)</div>
                        <div className="font-mono font-bold text-blue-800 text-sm mt-0.5">
                          {fx.toFixed(3)}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                        <div className="text-[10px] text-slate-500 font-semibold">
                          Tiệm cận y_TC
                        </div>
                        <div className="font-mono font-bold text-purple-800 text-sm mt-0.5">
                          {yAsym.toFixed(3)}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="text-[10px] text-slate-500 font-semibold">
                          Độ lệch |f(x) - y_TC|
                        </div>
                        <div className="font-mono font-bold text-emerald-800 text-sm mt-0.5">
                          {diff.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive SVG Plot for Asymptote Convergence */}
                  <div className="lg:col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-3">
                    <svg viewBox="0 0 520 260" className="w-full h-60 bg-white rounded-lg border border-slate-100">
                      {/* Grid & Axes */}
                      <line x1="40" y1="220" x2="500" y2="220" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="40" y1="15" x2="40" y2="235" stroke="#94a3b8" strokeWidth="1.5" />
                      <text x="502" y="224" fontSize="11" fontWeight="bold" fill="#475569">x</text>
                      <text x="26" y="22" fontSize="11" fontWeight="bold" fill="#475569">y</text>

                      {/* Vertical Asymptote x = 1 */}
                      {(() => {
                        const toX = (x) => 40 + (x / 16) * 450;
                        const toY = (y) => 220 - (y / 16) * 195;
                        const vx = toX(1);

                        // Curve path for x in [1.18, 15.5]
                        const pts = [];
                        for (let x = 1.18; x <= 15.5; x += 0.15) {
                          const y = isSlant ? x + 1 / (x - 1) : 2 + 3 / (x - 1);
                          if (y <= 16.5) {
                            pts.push(`${toX(x).toFixed(1)},${toY(y).toFixed(1)}`);
                          }
                        }

                        const curPx = toX(asymX);
                        const curPy = toY(fx);
                        const asymPy = toY(yAsym);

                        return (
                          <>
                            {/* Vertical asymptote x = 1 */}
                            <line
                              x1={vx}
                              y1="15"
                              x2={vx}
                              y2="225"
                              stroke="#ef4444"
                              strokeWidth="1.8"
                              strokeDasharray="5 4"
                            />
                            <text x={vx + 5} y="28" fontSize="10" fontWeight="bold" fill="#dc2626">
                              TCĐ x = 1
                            </text>

                            {/* Slant or Horizontal Asymptote */}
                            {isSlant ? (
                              <>
                                <line
                                  x1={toX(0)}
                                  y1={toY(0)}
                                  x2={toX(15.5)}
                                  y2={toY(15.5)}
                                  stroke="#9333ea"
                                  strokeWidth="1.8"
                                  strokeDasharray="6 4"
                                />
                                <text x={toX(12)} y={toY(12) + 16} fontSize="10" fontWeight="bold" fill="#7e22ce">
                                  TCX y = x
                                </text>
                              </>
                            ) : (
                              <>
                                <line
                                  x1="40"
                                  y1={toY(2)}
                                  x2="500"
                                  y2={toY(2)}
                                  stroke="#0284c7"
                                  strokeWidth="1.8"
                                  strokeDasharray="6 4"
                                />
                                <text x="415" y={toY(2) - 7} fontSize="10" fontWeight="bold" fill="#0369a1">
                                  TCN y = 2
                                </text>
                              </>
                            )}

                            {/* Function Curve */}
                            <polyline
                              fill="none"
                              stroke="#2563eb"
                              strokeWidth="2.4"
                              points={pts.join(' ')}
                            />

                            {/* Vertical Distance Segment between M(x, f(x)) and Asymptote */}
                            <line
                              x1={curPx}
                              y1={curPy}
                              x2={curPx}
                              y2={asymPy}
                              stroke="#10b981"
                              strokeWidth="2.5"
                            />
                            <circle cx={curPx} cy={curPy} r="5" fill="#2563eb" stroke="#fff" strokeWidth="1.5" />
                            <circle cx={curPx} cy={asymPy} r="4" fill="#9333ea" />
                            <text
                              x={Math.min(370, curPx + 8)}
                              y={Math.max(24, curPy - 8)}
                              fontSize="10"
                              fontWeight="bold"
                              fill="#0f172a"
                            >
                              M({asymX.toFixed(1)}; {fx.toFixed(2)}) • Δy = {diff.toFixed(3)}
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Real-World Asymptote Example from SGK (Hình 1.27) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              Ứng Dụng Thực Tiễn: Bài Toán Chi Phí Sản Xuất Trung Bình (SGK Trang 24 - Ví Dụ 4)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              Một đơn vị sản xuất ước tính chi phí sản xuất <MathView math="x" /> đơn vị sản phẩm là <MathView math="C(x) = 2x + 45" /> (triệu đồng). Chi phí sản xuất trung bình cho mỗi đơn vị sản phẩm là:
            </p>
            <MathView math="f(x) = \frac{C(x)}{x} = \frac{2x + 45}{x} = 2 + \frac{45}{x} \quad (x > 0)" block className="text-amber-900 font-semibold" />
            <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1">
              <p>
                • <strong>Ý nghĩa tiệm cận ngang:</strong> <MathView math="\lim_{x \to +\infty} f(x) = 2" /> (triệu đồng/sản phẩm). Khi sản lượng <MathView math="x" /> ngày càng lớn, chi phí trung bình luôn giảm dần nhưng không bao giờ xuống dưới 2 triệu đồng (chi phí biến đổi tối thiểu cho 1 sản phẩm).
              </p>
              <p>
                • <strong>Ý nghĩa tiệm cận đứng:</strong> <MathView math="\lim_{x \to 0^+} f(x) = +\infty" />. Nếu chỉ sản xuất số lượng rất ít (<MathView math="x \to 0" />), chi phí cố định chia đều sẽ làm đội giá thành lên cực kỳ cao.
              </p>
            </div>
          </div>
        </div>
        )}

        {/* =======================================================
            MỤC 5: ÔN TẬP CUỐI CHƯƠNG I (BÀI TẬP SGK & ĐỀ THI THỬ)
            ======================================================= */}
        {(activeTab === 'exercises' || activeTab === 'all') && (
          <div className={activeTab === 'all' ? 'pt-8 border-t-2 border-slate-200' : ''}>
            <Part2ExerciseBank />
          </div>
        )}

        {/* =======================================================
            MỤC 6: SƠ ĐỒ 3 BƯỚC & BẢNG TỔNG KẾT KHẢO SÁT HÀM SỐ
            ======================================================= */}
        {(activeTab === 'theory' || activeTab === 'all') && (
          <div className={`space-y-5 ${activeTab === 'all' ? 'pt-8 border-t-2 border-slate-200' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Mục 6 • Tổng Hợp Kiến Thức Chương I (SGK Trang 5 – 44)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-[-0.02em] mt-0.5">
                  Sơ Đồ Khảo Sát Hàm Số & Bảng Tổng Kết 3 Dạng Đồ Thị
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-md sm:text-right">
                Hệ thống hóa quy trình 3 bước khảo sát hàm số, đạo hàm, tiệm cận và tâm đối xứng.
              </p>
            </div>

            {/* 3 Steps Workflow */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                Sơ Đồ 3 Bước Khảo Sát Sự Biến Thiên & Vẽ Đồ Thị Hàm Số (SGK Trang 26)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">Tìm Tập Xác Định</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Xác định tập nguồn của hàm số <MathView math="y = f(x)" />, loại trừ các điểm làm mẫu số bằng 0 hoặc căn bậc chẵn âm.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">Khảo Sát Biến Thiên</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Tính đạo hàm <MathView math="y'" />, tìm nghiệm. Xét dấu <MathView math="y'" /> suy ra khoảng đồng biến, nghịch biến, cực trị. Tìm các giới hạn tại vô cực và đường tiệm cận. Lập Bảng Biến Thiên.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">Vẽ Đồ Thị & Tâm Đối Xứng</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Xác định các giao điểm với trục tọa độ <MathView math="Ox, Oy" />, các điểm cực trị, điểm uốn tâm đối xứng <MathView math="U" /> hoặc giao điểm tiệm cận <MathView math="I" /> rồi vẽ đồ thị hoàn chỉnh.
                  </p>
                </div>
              </div>
            </div>

            {/* Reference Table of 3 Standard Functions */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">
                Bảng Tổng Hợp 3 Dạng Hàm Số Trọng Tâm (Chuẩn GDPT 2018)
              </h4>

              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Dạng hàm số</th>
                      <th className="p-3">Đạo hàm y'</th>
                      <th className="p-3">Đường tiệm cận</th>
                      <th className="p-3">Tâm / Trục đối xứng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-sans">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">
                        Bậc ba: <MathView math="y = ax^3 + bx^2 + cx + d" />
                      </td>
                      <td className="p-3">
                        <MathView math="y' = 3ax^2 + 2bx + c" />
                      </td>
                      <td className="p-3 text-slate-400">Không có tiệm cận</td>
                      <td className="p-3 text-purple-700 font-medium">
                        Tâm đối xứng là điểm uốn <MathView math="U(-\frac{b}{3a}; y_U)" />
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">
                        Bậc nhất / Bậc nhất: <MathView math="y = \frac{ax + b}{cx + d}" />
                      </td>
                      <td className="p-3">
                        <MathView math="y' = \frac{ad - bc}{(cx + d)^2}" />
                      </td>
                      <td className="p-3">
                        TC đứng <MathView math="x = -\frac{d}{c}" />, TC ngang <MathView math="y = \frac{a}{c}" />
                      </td>
                      <td className="p-3 text-purple-700 font-medium">
                        Tâm đối xứng là giao điểm 2 tiệm cận <MathView math="I(-\frac{d}{c}; \frac{a}{c})" />
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">
                        Bậc hai / Bậc nhất: <MathView math="y = \frac{ax^2 + bx + c}{px + q}" />
                      </td>
                      <td className="p-3">
                        Tính bằng quy tắc đạo hàm phân thức
                      </td>
                      <td className="p-3">
                        TC đứng <MathView math="x = -\frac{q}{p}" />, TC xiên <MathView math="y = \alpha x + \beta" />
                      </td>
                      <td className="p-3 text-purple-700 font-medium">
                        Tâm đối xứng là giao điểm TC đứng & TC xiên
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
