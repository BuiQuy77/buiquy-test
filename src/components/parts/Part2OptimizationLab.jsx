import React, { useState, useRef, useEffect } from 'react';
import MathView from '../MathView';
import { 
  Maximize2, 
  Box, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  BookOpen, 
  Award,
  ArrowRight
} from 'lucide-react';

export default function Part2OptimizationLab() {
  const [sheetSize, setSheetSize] = useState(24); // Kích thước cạnh tấm tôn hình vuông a (cm)
  const [cutSize, setCutSize] = useState(4); // Cạnh hình vuông cắt ở mỗi góc x (cm)

  // Tính toán toán học tối ưu
  const optimalCut = sheetSize / 6; // Đạo hàm V'(x) = (a - 2x)(a - 6x) = 0 => x = a/6
  const currentVolume = cutSize * Math.pow(sheetSize - 2 * cutSize, 2);
  const maxVolume = optimalCut * Math.pow(sheetSize - 2 * optimalCut, 2);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const pad = 45;
    const maxCut = sheetSize / 2;
    const toPxX = (x) => pad + (x / maxCut) * (width - 2 * pad);
    const toPxY = (v) => height - pad - (v / (maxVolume * 1.25)) * (height - 2 * pad);

    // Canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 1; x < maxCut; x += 2) {
      ctx.beginPath();
      ctx.moveTo(toPxX(x), pad);
      ctx.lineTo(toPxX(x), height - pad);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(pad, height - pad);
    ctx.lineTo(width - pad + 15, height - pad);
    ctx.moveTo(pad, height - pad);
    ctx.lineTo(pad, pad - 15);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('x (cm - Cạnh góc cắt)', width - pad - 60, height - pad + 25);
    ctx.fillText('V(x) (cm³ - Thể tích hộp)', pad - 35, pad - 20);

    // Draw V(x) curve
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const steps = 150;
    for (let i = 0; i <= steps; i++) {
      const xVal = (i / steps) * maxCut;
      const vVal = xVal * Math.pow(sheetSize - 2 * xVal, 2);
      const px = toPxX(xVal);
      const py = toPxY(vVal);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Fill under curve
    ctx.lineTo(toPxX(maxCut), toPxY(0));
    ctx.lineTo(toPxX(0), toPxY(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(2, 132, 199, 0.06)';
    ctx.fill();

    // Optimal Cut Peak Point (x = a/6)
    const optPx = toPxX(optimalCut);
    const optPy = toPxY(maxVolume);

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(optPx, optPy);
    ctx.lineTo(optPx, height - pad);
    ctx.moveTo(optPx, optPy);
    ctx.lineTo(pad, optPy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(optPx, optPy, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(`Cực đại V_max: x = a/6 = ${optimalCut.toFixed(1)} cm`, optPx - 60, optPy - 12);

    // Current Cut Point
    if (cutSize > 0 && cutSize < maxCut) {
      const curPx = toPxX(cutSize);
      const curPy = toPxY(currentVolume);

      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(curPx, curPy);
      ctx.lineTo(curPx, height - pad);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(curPx, curPy, 7, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Hiện tại: ${currentVolume.toFixed(0)} cm³`, curPx + 10, curPy + 4);
    }
  }, [sheetSize, cutSize, optimalCut, currentVolume, maxVolume]);

  return (
    <div className="space-y-5">
      {/* Unified Section Header inside Chapter I Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mục 2 • Bài 2 (Trang 15–19) & Bài 5 (Trang 33–41) SGK Toán 12 Tập 1</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-[-0.02em] mt-0.5">
            Giá Trị Lớn Nhất, Nhỏ Nhất & Bài Toán Tối Ưu Hóa Thực Tiễn
          </h3>
        </div>
        <p className="text-xs text-slate-500 max-w-md sm:text-right">
          Quy tắc tìm <MathView math="\max_{[a;b]} f(x), \min_{[a;b]} f(x)" /> và mô hình tối ưu thể tích, chi phí, lợi nhuận.
        </p>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Real World Problem Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Box className="w-4 h-4 text-amber-600" />
              Mô Hình Tối Ưu Hóa Gấp Hộp Tôn (SGK Trang 31):
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Từ một tấm tôn hình vuông cạnh <MathView math="a" />, người thợ cắt bỏ ở 4 góc 4 hình vuông bằng nhau có cạnh bằng <MathView math="x" />, rồi gập các mép lại để được một chiếc hộp không nắp. Hãy tìm <MathView math="x" /> để thể tích chiếc hộp đạt <strong>giá trị lớn nhất</strong>.
            </p>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1 text-slate-700">
              <div>• Kích thước đáy hộp: <MathView math="(a - 2x) \times (a - 2x)" /></div>
              <div>• Chiều cao hộp: <MathView math="x" /></div>
              <div className="font-bold text-amber-900 pt-1">
                • Hàm thể tích: <MathView math="V(x) = x(a - 2x)^2 \quad (0 < x < \frac{a}{2})" />
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-600" />
              Điều Chỉnh Kích Thước Mô Hình:
            </span>

            {/* Slider Sheet Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Cạnh tấm tôn <MathView math="a" />:</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {sheetSize} cm
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="48"
                step="2"
                value={sheetSize}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setSheetSize(val);
                  if (cutSize >= val / 2) setCutSize(Math.max(1, (val / 2) - 1));
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            {/* Slider Cut Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Cạnh góc cắt <MathView math="x" />:</span>
                <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {cutSize} cm
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max={(sheetSize / 2) - 0.5}
                step="0.5"
                value={cutSize}
                onChange={(e) => setCutSize(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Thể Tích Hiện Tại</span>
                <span className="text-lg font-black text-slate-800 font-mono">
                  {currentVolume.toFixed(0)} <span className="text-xs font-normal">cm³</span>
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-600 block uppercase font-bold">Thể Tích Lớn Nhất</span>
                <span className="text-lg font-black text-emerald-700 font-mono">
                  {maxVolume.toFixed(0)} <span className="text-xs font-normal">cm³</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setCutSize(Number(optimalCut.toFixed(1)))}
              className="w-full py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Tự Động Đưa Về Kích Thước Tối Ưu (x = a/6 = {optimalCut.toFixed(1)} cm)</span>
            </button>
          </div>

          {/* Theory on Max - Min on closed interval */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Quy Tắc Tìm Max - Min Trên Đoạn [a; b] (SGK Trang 16)
            </h4>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Để tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số <MathView math="y = f(x)" /> liên tục trên đoạn <MathView math="[a; b]" />:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <li>Tính đạo hàm <MathView math="f'(x)" />. Tìm các điểm <MathView math="x_1, x_2, \dots \in (a; b)" /> mà tại đó <MathView math="f'(x) = 0" /> hoặc đạo hàm không xác định.</li>
                <li>Tính các giá trị <MathView math="f(a), f(b), f(x_1), f(x_2), \dots" /></li>
                <li>Tìm số lớn nhất <MathView math="M = \max f(x)" /> và số nhỏ nhất <MathView math="m = \min f(x)" /> trong các số vừa tính.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Canvas & Step-by-step Mathematical Proof */}
        <div className="lg:col-span-7 space-y-5">
          {/* Curve Visualization Canvas */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Đồ Thị Hàm Thể Tích V(x) & Điểm Đạt Cực Đại
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                V_max tại x = a/6
              </span>
            </div>

            <div className="w-full aspect-[4/3] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={700}
                height={520}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Mathematical Proof Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Lời Giải Chi Tiết Bằng Đạo Hàm (Chuẩn Bài Thi Tốt Nghiệp THPT):
            </span>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div>
                  <strong>Bước 1: Thiết lập hàm số và tập xác định</strong>
                </div>
                <div>
                  Điều kiện: <MathView math="0 < 2x < a \iff 0 < x < \frac{a}{2}" />.
                </div>
                <div>
                  Hàm số: <MathView math="V(x) = x(a - 2x)^2 = 4x^3 - 4ax^2 + a^2x" />.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div>
                  <strong>Bước 2: Lấy đạo hàm và giải phương trình <MathView math="V'(x) = 0" /></strong>
                </div>
                <div>
                  <MathView math="V'(x) = 12x^2 - 8ax + a^2 = (2x - a)(6x - a)" />.
                </div>
                <div>
                  Cho <MathView math="V'(x) = 0 \iff x = \frac{a}{2} \text{ (loại)} \quad \text{hoặc} \quad x = \frac{a}{6} \text{ (thỏa mãn)}" />.
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                <div>
                  <strong>Bước 3: Kết luận tối ưu thực tiễn</strong>
                </div>
                <div>
                  Bảng biến thiên cho thấy <MathView math="V'(x)" /> đổi dấu từ <MathView math="+" /> sang <MathView math="-" /> qua <MathView math="x = \frac{a}{6}" />.
                </div>
                <div>
                  Do đó thể tích hộp đạt giá trị lớn nhất khi người thợ cắt mỗi góc một hình vuông có cạnh bằng <strong>một phần sáu</strong> cạnh tấm tôn ban đầu:
                </div>
                <div className="font-bold text-center py-1 text-sm text-emerald-800">
                  <MathView math="x = \frac{a}{6} \implies V_{\max} = \frac{2a^3}{27}" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
