import React, { useState } from 'react';
import MathView from '../MathView';
import { BookMarked, Sliders, CheckCircle2 } from 'lucide-react';

const ANTIDERIVATIVE_FAMILIES = [
  {
    id: 'quad',
    label: 'Hàm bậc hai: f(x) = 3x² - 3',
    fTex: '$f(x) = 3x^2 - 3$',
    FBaseTex: '$F_0(x) = x^3 - 3x$',
    generalTex: '$\\int (3x^2 - 3)\\,dx = x^3 - 3x + C$',
    fn: (x) => 3 * x * x - 3,
    Fn: (x, C) => x * x * x - 3 * x + C,
    defaultX0: 1,
    defaultY0: 2,
    domain: [-2.4, 2.4],
    range: [-6, 6],
    applicationNote:
      'Ví dụ vận tốc - quãng đường (HĐ1 Tr.4 SGK): Nếu vận tốc tức thời là v(t) = 3t² - 3 (m/s) và tại t₀ = 1 s vật ở vị trí s(1) = y₀, thì phương trình chuyển động là s(t) = t³ - 3t + C.'
  },
  {
    id: 'linear',
    label: 'Hàm bậc nhất: f(x) = 2x - 1',
    fTex: '$f(x) = 2x - 1$',
    FBaseTex: '$F_0(x) = x^2 - x$',
    generalTex: '$\\int (2x - 1)\\,dx = x^2 - x + C$',
    fn: (x) => 2 * x - 1,
    Fn: (x, C) => x * x - x + C,
    defaultX0: 2,
    defaultY0: 3,
    domain: [-2.2, 2.8],
    range: [-5, 7],
    applicationNote:
      'Mọi đường cong trong họ F(x) = x² - x + C đều là các parabol tịnh tiến theo phương trục tung Oy và có cùng hệ số góc tiếp tuyến f(x₀) = 2x₀ - 1 tại mỗi hoành độ x₀.'
  },
  {
    id: 'trig',
    label: 'Hàm lượng giác: f(x) = cos(x)',
    fTex: '$f(x) = \\cos x$',
    FBaseTex: '$F_0(x) = \\sin x$',
    generalTex: '$\\int \\cos x\\,dx = \\sin x + C$',
    fn: (x) => Math.cos(x),
    Fn: (x, C) => Math.sin(x) + C,
    defaultX0: 0,
    defaultY0: 1.5,
    domain: [-Math.PI, Math.PI],
    range: [-4.5, 4.5],
    applicationNote:
      'Ví dụ 3 Tr.6 SGK: Vì (sin x)\' = cos x với mọi x ∈ ℝ nên họ nguyên hàm của cos x là sin x + C. Điều kiện đầu F(x₀) = y₀ giúp xác định duy nhất đường cong đi qua điểm M(x₀; y₀).'
  },
  {
    id: 'exp',
    label: 'Hàm số mũ: f(x) = eˣ',
    fTex: '$f(x) = e^x$',
    FBaseTex: '$F_0(x) = e^x$',
    generalTex: '$\\int e^x\\,dx = e^x + C$',
    fn: (x) => Math.exp(x),
    Fn: (x, C) => Math.exp(x) + C,
    defaultX0: 0,
    defaultY0: 2,
    domain: [-2.5, 1.8],
    range: [-3, 7],
    applicationNote:
      'Bài toán tăng trưởng sinh học (Mục 4 Tr.9 SGK): Nếu tốc độ tăng số lượng vi khuẩn là N\'(t) = eᵗ thì số lượng vi khuẩn tại thời điểm t là N(t) = eᵗ + C.'
  }
];

export default function TheoryTables() {
  const [selectedFamilyId, setSelectedFamilyId] = useState('quad');
  const [x0, setX0] = useState(1);
  const [y0, setY0] = useState(2);

  const family =
    ANTIDERIVATIVE_FAMILIES.find((item) => item.id === selectedFamilyId) ||
    ANTIDERIVATIVE_FAMILIES[0];

  // Calculate C from initial condition F(x0) = y0 => Fn(x0, 0) + C = y0 => C = y0 - Fn(x0, 0)
  const baseAtX0 = family.Fn(x0, 0);
  const solvedC = +(y0 - baseAtX0).toFixed(2);
  const slopeAtX0 = +family.fn(x0).toFixed(2);

  const handleSelectFamily = (fam) => {
    setSelectedFamilyId(fam.id);
    setX0(fam.defaultX0);
    setY0(fam.defaultY0);
  };

  // SVG coordinate helpers
  const W = 520;
  const H = 280;
  const [xMin, xMax] = family.domain;
  const [yMin, yMax] = family.range;
  const mapX = (x) => ((x - xMin) / (xMax - xMin)) * W;
  const mapY = (y) => H - ((y - yMin) / (yMax - yMin)) * H;

  const buildPath = (cVal) => {
    const steps = 90;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const xv = xMin + (i / steps) * (xMax - xMin);
      const yv = family.Fn(xv, cVal);
      if (Number.isFinite(yv) && yv >= yMin - 3 && yv <= yMax + 3) {
        pts.push(`${pts.length === 0 ? 'M' : 'L'} ${mapX(xv).toFixed(1)} ${mapY(yv).toFixed(1)}`);
      }
    }
    return pts.join(' ');
  };

  const sampleOffsets = [-3, -1.5, 0, 1.5, 3];

  return (
    <div className="space-y-6">
      {/* Header Mục 1: Bài 11 Nguyên Hàm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
            Mục 1 • Bài 11: Nguyên hàm (Trang 4–11 SGK)
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 tracking-[-0.02em]">
            <MathView math="Họ nguyên hàm $F(x) + C$, Tính chất và Bảng nguyên hàm cơ bản" />
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          <MathView math="Định nghĩa $F'(x) = f(x)$ • Bài toán tìm hằng số $C$" />
        </span>
      </div>

      {/* PHÒNG THÍ NGHIỆM TƯƠNG TÁC BÀI 11: HỌ NGUYÊN HÀM F(x) + C & ĐIỀU KIỆN ĐẦU F(x0) = y0 */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Sliders className="w-3.5 h-3.5 text-teal-700" />
              <MathView math="Mô phỏng Họ nguyên hàm $\int f(x)\,dx = F_0(x) + C$ & Bài toán giá trị ban đầu $F(x_0) = y_0$" />
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              <MathView math="Chọn hàm dưới dấu tích phân $f(x)$ và điều chỉnh tọa độ điểm đi qua $M(x_0; y_0)$ để xác định duy nhất hằng số $C$." />
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ANTIDERIVATIVE_FAMILIES.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectFamily(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedFamilyId === item.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Cột điều khiển & Lời giải tìm C */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="space-y-1.5 pb-3 border-b border-slate-100">
              <div className="text-[11px] font-bold uppercase text-slate-400">Họ nguyên hàm tổng quát</div>
              <MathView
                content={family.generalTex}
                className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80"
              />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">
                    <MathView math="Hoành độ điều kiện đầu $x_0$:" />
                  </span>
                  <span className="font-mono font-bold text-teal-700">x₀ = {x0}</span>
                </div>
                <input
                  type="range"
                  min={+(xMin + 0.4).toFixed(1)}
                  max={+(xMax - 0.4).toFixed(1)}
                  step="0.5"
                  value={x0}
                  onChange={(e) => setX0(parseFloat(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">
                    <MathView math="Giá trị nguyên hàm $F(x_0) = y_0$:" />
                  </span>
                  <span className="font-mono font-bold text-teal-700">y₀ = {y0}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="5"
                  step="0.5"
                  value={y0}
                  onChange={(e) => setY0(parseFloat(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            {/* Kết quả giải tìm C */}
            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-teal-900">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <MathView math={`Lời giải xác định hằng số $C$ từ điều kiện $F(${x0}) = ${y0}$:`} />
              </div>
              <div className="text-slate-700 leading-relaxed font-mono text-[11px] bg-white/90 p-2.5 rounded-lg border border-teal-200/60 space-y-1">
                <div>1. Ta có: F₀({x0}) = {baseAtX0.toFixed(2)}</div>
                <div>
                  2. Thay F({x0}) = {y0} ⇒ {baseAtX0.toFixed(2)} + C = {y0} ⇒{' '}
                  <strong className="text-teal-800">C = {solvedC >= 0 ? `+${solvedC}` : solvedC}</strong>
                </div>
                <div>
                  3. Hệ số góc tiếp tuyến tại x₀ = {x0}: F&apos;({x0}) = f({x0}) ={' '}
                  <strong className="text-amber-700">{slopeAtX0}</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                {family.applicationNote}
              </p>
            </div>
          </div>

          {/* Cột đồ thị SVG Họ nguyên hàm F(x) + C */}
          <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 p-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
              <span className="font-bold text-slate-200">
                <MathView math="Đồ thị họ nguyên hàm $y = F_0(x) + C$ (Các đường cong tịnh tiến theo trục $Oy$)" />
              </span>
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono text-[11px]">
                Đường chọn: C = {solvedC} • Đi qua M({x0}; {y0})
              </span>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-64 bg-slate-950/60 rounded-lg border border-slate-800">
              {/* Grid lines */}
              {[-2, -1, 0, 1, 2].map((gx) => {
                if (gx < xMin || gx > xMax) return null;
                const px = mapX(gx);
                return (
                  <g key={`gx-${gx}`}>
                    <line
                      x1={px}
                      y1={0}
                      x2={px}
                      y2={H}
                      stroke={gx === 0 ? '#475569' : '#1e293b'}
                      strokeWidth={gx === 0 ? 1.5 : 1}
                    />
                    <text x={px + 4} y={mapY(0) - 4} fill="#64748b" fontSize="9">
                      {gx}
                    </text>
                  </g>
                );
              })}
              {[-4, -2, 0, 2, 4].map((gy) => {
                if (gy < yMin || gy > yMax) return null;
                const py = mapY(gy);
                return (
                  <g key={`gy-${gy}`}>
                    <line
                      x1={0}
                      y1={py}
                      x2={W}
                      y2={py}
                      stroke={gy === 0 ? '#475569' : '#1e293b'}
                      strokeWidth={gy === 0 ? 1.5 : 1}
                    />
                    {gy !== 0 && (
                      <text x={mapX(0) + 5} y={py - 3} fill="#64748b" fontSize="9">
                        {gy}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Family of curves F0(x) + c */}
              {sampleOffsets.map((cOff) => (
                <path
                  key={`fam-${cOff}`}
                  d={buildPath(cOff)}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.55"
                />
              ))}

              {/* Selected curve F0(x) + solvedC */}
              <path
                d={buildPath(solvedC)}
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="2.8"
              />

              {/* Tangent segment at (x0, y0) showing slope f(x0) */}
              {(() => {
                const dx = 0.55;
                const xA = x0 - dx;
                const yA = y0 - slopeAtX0 * dx;
                const xB = x0 + dx;
                const yB = y0 + slopeAtX0 * dx;
                return (
                  <line
                    x1={mapX(xA)}
                    y1={mapY(yA)}
                    x2={mapX(xB)}
                    y2={mapY(yB)}
                    stroke="#fbbf24"
                    strokeWidth="2"
                  />
                );
              })()}

              {/* Point M(x0, y0) */}
              <circle
                cx={mapX(x0)}
                cy={mapY(y0)}
                r="5.5"
                fill="#fbbf24"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text
                x={Math.min(W - 95, Math.max(10, mapX(x0) + 8))}
                y={Math.min(H - 12, Math.max(16, mapY(y0) - 8))}
                fill="#fef08a"
                fontSize="11"
                fontWeight="bold"
              >
                M({x0}; {y0})
              </text>
            </svg>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-slate-400">
              <span>{'--- Các đường nét đứt: Họ nguyên hàm F₀(x) + C với C ∈ {-3; -1,5; 0; 1,5; 3}'}</span>
              <span className="text-amber-300">Đoạn màu vàng: Tiếp tuyến hệ số góc F&apos;(x₀) = f(x₀) = {slopeAtX0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BẢNG NGUYÊN HÀM CÁC HÀM SỐ SƠ CẤP & TÍNH CHẤT TRỌNG TÂM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              BẢNG NGUYÊN HÀM CÁC HÀM SỐ SƠ CẤP (TRANG 10 SGK)
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-3 mb-4">
              1. Công thức nguyên hàm từng phần tử cơ bản
            </h3>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 overflow-hidden">
                <div className="text-xs font-semibold text-teal-700">Hàm lũy thừa & phân thức</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$\int x^\alpha\,dx = \frac{x^{\alpha+1}}{\alpha+1} + C \; (\alpha \neq -1)$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$\int \frac{1}{x}\,dx = \ln|x| + C$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 overflow-hidden">
                <div className="text-xs font-semibold text-teal-700">Hàm lượng giác</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$\int \cos x\,dx = \sin x + C$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$\int \sin x\,dx = -\cos x + C$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$\int \frac{1}{\cos^2 x}\,dx = \tan x + C$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$\int \frac{1}{\sin^2 x}\,dx = -\cot x + C$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 overflow-hidden">
                <div className="text-xs font-semibold text-teal-700">Hàm số mũ</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$\int e^x\,dx = e^x + C$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$\int a^x\,dx = \frac{a^x}{\ln a} + C \; (0 < a \neq 1)$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Lưu ý: Khi tìm nguyên hàm của 1/x trên khoảng (-∞; 0) hoặc (0; +∞), luôn viết dấu giá trị tuyệt đối ln|x| + C.
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              CÔNG THỨC TRỌNG TÂM BÀI 12 & BÀI 13 (TRANG 12–26 SGK)
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-3 mb-4">
              2. Công thức Newton-Leibniz, Diện tích & Thể tích
            </h3>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-amber-700 mb-1">
                  Định lí Newton-Leibniz & Tính chất tuyến tính (Bài 12)
                </div>
                <MathView
                  content="$$\int_a^b f(x)\,dx = F(x)\Big|_a^b = F(b) - F(a)$$"
                  className="text-slate-800"
                />
                <MathView
                  content="$$\int_a^b f(x)\,dx = \int_a^c f(x)\,dx + \int_c^b f(x)\,dx$$"
                  className="text-slate-800 mt-1"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-amber-700 mb-1">
                  Diện tích hình phẳng giới hạn bởi 2 đồ thị (Bài 13 - Mục 1)
                </div>
                <MathView
                  content="$$S = \int_a^b |f(x) - g(x)|\,dx$$"
                  className="text-slate-800"
                />
                <div className="text-xs text-slate-500 mt-1">
                  <MathView math="Giải $f(x) = g(x)$ tìm nghiệm $x_i \in (a; b)$ để tách cận và khử dấu giá trị tuyệt đối." />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 overflow-hidden">
                <div className="text-xs font-semibold text-amber-700">
                  <MathView math="Thể tích vật thể (Mặt cắt $S(x)$) & Khối tròn xoay quanh $Ox$ (Bài 13 - Mục 2)" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$V = \int_a^b S(x)\,dx$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200/70 flex items-center justify-center">
                    <MathView
                      math="$V_{Ox} = \pi \int_a^b [f(x)]^2\,dx$"
                      className="text-slate-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
            <BookMarked className="w-4 h-4 text-amber-600 shrink-0" />
            <MathView math="Chú ý phân biệt: Tính diện tích không có hệ số $\pi$, tính thể tích khối tròn xoay luôn nhân $\pi$ và bình phương bán kính $[f(x)]^2$." />
          </div>
        </div>
      </div>
    </div>
  );
}
