import React, { useState, useEffect, useRef } from 'react';
import MathView from '../MathView';

const FUNCTIONS = [
  {
    id: 'poly',
    name: 'f(x) = x² - 2x + 2',
    fn: (x) => x * x - 2 * x + 2,
    str: 'x^2 - 2x + 2',
    antiderivStr: 'F(x) = \\frac{x^3}{3} - x^2 + 2x',
    exactAntideriv: (x) => x ** 3 / 3 - x * x + 2 * x
  },
  {
    id: 'sin',
    name: 'f(x) = sin(x) + 1.2',
    fn: (x) => Math.sin(x) + 1.2,
    str: '\\sin(x) + 1.2',
    antiderivStr: 'F(x) = -\\cos(x) + 1{,}2x',
    exactAntideriv: (x) => -Math.cos(x) + 1.2 * x
  },
  {
    id: 'sqrt',
    name: 'f(x) = √x',
    fn: (x) => Math.sqrt(Math.max(0, x)),
    str: '\\sqrt{x}',
    antiderivStr: 'F(x) = \\frac{2}{3}x\\sqrt{x}',
    exactAntideriv: (x) => (2 / 3) * Math.pow(Math.max(0, x), 1.5)
  },
  {
    id: 'exp',
    name: 'f(x) = e^(0.5x)',
    fn: (x) => Math.exp(0.5 * x),
    str: 'e^{0.5x}',
    antiderivStr: 'F(x) = 2e^{0{,}5x}',
    exactAntideriv: (x) => 2 * Math.exp(0.5 * x)
  }
];

export default function RiemannIntegralLab() {
  const canvasRef = useRef(null);
  const [selectedFn, setSelectedFn] = useState(FUNCTIONS[0]);
  const [a, setA] = useState(0.5);
  const [b, setB] = useState(3.5);
  const [n, setN] = useState(12);
  const [method, setMethod] = useState('mid'); // 'left' | 'mid' | 'right'

  const safeA = Math.max(0, Math.min(a, 4.0));
  const safeB = Math.max(safeA + 0.5, Math.min(b, 4.5));

  const fa = selectedFn.exactAntideriv(safeA);
  const fb = selectedFn.exactAntideriv(safeB);
  const exactVal = fb - fa;

  const dx = (safeB - safeA) / n;
  let riemannSum = 0;
  for (let i = 0; i < n; i++) {
    let evalX = safeA + i * dx;
    if (method === 'mid') evalX += dx / 2;
    if (method === 'right') evalX += dx;
    riemannSum += selectedFn.fn(evalX) * dx;
  }

  const errorPct =
    exactVal !== 0 ? Math.abs(((riemannSum - exactVal) / exactVal) * 100).toFixed(2) : '0.00';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const padL = 50,
      padR = 30,
      padT = 30,
      padB = 40;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const xMin = -0.5;
    const xMax = 5.0;
    const yMin = -0.5;
    const yMax = 7.0;

    const toPxX = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
    const toPxY = (y) => padT + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);

    for (let x = 0; x <= 5; x += 1) {
      ctx.beginPath();
      ctx.moveTo(toPxX(x), toPxY(yMin));
      ctx.lineTo(toPxX(x), toPxY(yMax));
      ctx.stroke();
    }
    for (let y = 0; y <= 6; y += 1) {
      ctx.beginPath();
      ctx.moveTo(toPxX(xMin), toPxY(y));
      ctx.lineTo(toPxX(xMax), toPxY(y));
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(toPxX(xMin), toPxY(0));
    ctx.lineTo(toPxX(xMax), toPxY(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toPxX(0), toPxY(yMin));
    ctx.lineTo(toPxX(0), toPxY(yMax));
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('x', toPxX(xMax) - 15, toPxY(0) + 18);
    ctx.fillText('y', toPxX(0) - 18, toPxY(yMax) + 12);
    for (let x = 1; x <= 4; x++) {
      ctx.fillText(x.toString(), toPxX(x) - 4, toPxY(0) + 16);
    }

    // Draw Riemann Rectangles
    for (let i = 0; i < n; i++) {
      const xLeft = safeA + i * dx;
      const xRight = xLeft + dx;
      let evalX = xLeft;
      if (method === 'mid') evalX = xLeft + dx / 2;
      if (method === 'right') evalX = xRight;

      const yVal = selectedFn.fn(evalX);
      const pxLeft = toPxX(xLeft);
      const pxRight = toPxX(xRight);
      const pxTop = toPxY(yVal);
      const pxBottom = toPxY(0);

      ctx.fillStyle = 'rgba(13, 148, 136, 0.20)';
      ctx.fillRect(pxLeft, pxTop, pxRight - pxLeft, pxBottom - pxTop);

      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth = 1.4;
      ctx.strokeRect(pxLeft, pxTop, pxRight - pxLeft, pxBottom - pxTop);

      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(toPxX(evalX), pxTop, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Continuous curve y = f(x)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    const steps = 300;
    for (let i = 0; i <= steps; i++) {
      const curX = xMin + (i / steps) * (xMax - xMin);
      const curY = selectedFn.fn(curX);
      const px = toPxX(curX);
      const py = toPxY(curY);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Bounds markers (a and b)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(toPxX(safeA), toPxY(0));
    ctx.lineTo(toPxX(safeA), toPxY(selectedFn.fn(safeA)));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toPxX(safeB), toPxY(0));
    ctx.lineTo(toPxX(safeB), toPxY(selectedFn.fn(safeB)));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`a=${safeA}`, toPxX(safeA) - 12, toPxY(0) + 30);
    ctx.fillText(`b=${safeB}`, toPxX(safeB) - 12, toPxY(0) + 30);
  }, [selectedFn, safeA, safeB, dx, n, method]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
            Mục 2 • Bài 12: Tích phân & Tổng Riemann (Trang 12–18 SGK)
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 tracking-[-0.02em]">
            Bản chất hình học của Tích phân xác định & Công thức Newton-Leibniz
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Khi chia đoạn [a; b] thành n phần bằng nhau với Δx = (b - a)/n và cho n → ∞, tổng diện tích các hình chữ nhật Sₙ = ∑ f(cᵢ)Δx hội tụ về ∫ₐᵇ f(x)dx = F(b) - F(a).
          </p>
        </div>

        {/* Function selector */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {FUNCTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFn(f)}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedFn.id === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Canvas */}
        <div className="lg:col-span-2 bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full max-w-[640px] h-auto rounded-lg border border-slate-200/80 bg-white"
          />
          <div className="w-full mt-3 px-3 py-2 bg-white rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <MathView
              content={`$$\\text{Nguyên hàm: } ${selectedFn.antiderivStr}$$`}
              className="text-slate-800 font-semibold"
            />
            <span className="font-mono text-xs text-teal-800 font-bold">
              F({safeB}) - F({safeA}) = {fb.toFixed(4)} - ({fa.toFixed(4)}) = {exactVal.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Sliders & Numbers */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            {/* Number of intervals n */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-semibold">Số hình chữ nhật chia nhỏ (n):</span>
                <span className="text-teal-700 font-bold text-sm font-mono">{n} dải</span>
              </div>
              <input
                type="range"
                min="4"
                max="80"
                step="2"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>4 (xấp xỉ thô)</span>
                <span>40 (khá mịn)</span>
                <span>80 (hội tụ sát)</span>
              </div>
            </div>

            {/* Bounds a and b */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-semibold">
                  Cận dưới a:
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={+(safeB - 0.5).toFixed(1)}
                  value={safeA}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!Number.isNaN(val)) {
                      setA(Math.max(0, Math.min(val, safeB - 0.5)));
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-semibold">
                  Cận trên b:
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={+(safeA + 0.5).toFixed(1)}
                  max="4.5"
                  value={safeB}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!Number.isNaN(val)) {
                      setB(Math.max(safeA + 0.5, Math.min(val, 4.5)));
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Method choice */}
            <div>
              <label className="text-[11px] text-slate-600 block mb-1.5 font-semibold">
                Cách chọn điểm lấy chiều cao dải chữ nhật:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'left', label: 'Đầu mút trái' },
                  { id: 'mid', label: 'Trung điểm' },
                  { id: 'right', label: 'Đầu mút phải' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`py-1.5 text-xs rounded-lg border font-semibold transition-all cursor-pointer ${
                      method === m.id
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Precision Comparison Card */}
          <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Bề rộng mỗi dải Δx = (b-a)/n:</span>
              <span className="text-slate-900 font-mono font-bold text-xs">{dx.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Tổng Riemann Sₙ (Xấp xỉ):</span>
              <span className="text-teal-800 font-mono font-bold text-sm">
                {riemannSum.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Tích phân Newton-Leibniz F(b)-F(a):</span>
              <span className="text-slate-900 font-mono font-bold text-sm">
                {exactVal.toFixed(4)}
              </span>
            </div>
            <div className="pt-2 border-t border-teal-200 flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Sai số tương đối |Sₙ - I| / |I|:</span>
              <span
                className={`font-mono font-bold ${
                  parseFloat(errorPct) < 1 ? 'text-teal-700' : 'text-amber-700'
                }`}
              >
                {errorPct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
