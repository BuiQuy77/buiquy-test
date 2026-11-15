import React, { useState } from 'react';
import MathView from '../MathView';
import { Rocket, Factory, TrendingUp, HeartPulse } from 'lucide-react';

export default function StemSimulations() {
  const [activeTab, setActiveTab] = useState('pottery');

  // 1. Pottery state (Bài 4.35 SGK trang 28 - Bình gốm Bát Tràng)
  // Đường sinh mặt ngoài y = (1/175)x^2 + (3/35)x + 2 (0 <= x <= H), bán kính đáy tại x = 0 là 2 cm
  const [potteryHeight, setPotteryHeight] = useState(30); // cm
  const [thickness, setThickness] = useState(1); // cm

  const { outerVolume, innerVolume, clayVolume } = React.useMemo(() => {
    const H = potteryHeight;
    const steps = 200;
    const dx = H / steps;
    let sumOuter = 0;
    let sumInner = 0;
    for (let i = 0; i < steps; i++) {
      const x = (i + 0.5) * dx;
      const rOuter = (1 / 175) * x * x + (3 / 35) * x + 2;
      const rInner = Math.max(0, rOuter - thickness);
      sumOuter += rOuter * rOuter * dx;
      sumInner += rInner * rInner * dx;
    }
    const vOut = Math.PI * sumOuter;
    const vIn = Math.PI * sumInner;
    return {
      outerVolume: vOut,
      innerVolume: vIn,
      clayVolume: vOut - vIn
    };
  }, [potteryHeight, thickness]);

  // 2. Projectile state (Bài 4.7 Tr.11 & Bài 4.30 Tr.28)
  const [v0, setV0] = useState(160);
  const g = 9.8;
  const [simTime, setSimTime] = useState(4.0);
  const [isPlayingFlight, setIsPlayingFlight] = useState(false);

  const tPeak = v0 / g;
  const hMax = (v0 * v0) / (2 * g);
  const currentHeight = Math.max(0, v0 * simTime - 0.5 * g * simTime * simTime);
  const currentVelocity = v0 - g * simTime;

  React.useEffect(() => {
    let timer;
    if (isPlayingFlight) {
      timer = setInterval(() => {
        setSimTime((prev) => {
          if (prev >= 2 * tPeak) {
            setIsPlayingFlight(false);
            return 0;
          }
          return +(prev + 0.2).toFixed(1);
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlayingFlight, tPeak]);

  // 3. Lorenz Curve & Gini Coefficient state (Bài 4.16 SGK trang 25)
  // L(x) = x^p trên [0; 1], hệ số Gini G = 2 * \int_0^1 (x - x^p) dx = (p - 1) / (p + 1)
  const [lorenzPower, setLorenzPower] = useState(2.0);
  const [popSharePct, setPopSharePct] = useState(60); // x = 0.60 (60% dân số thu nhập thấp nhất)
  const giniIndex = (lorenzPower - 1) / (lorenzPower + 1);
  const popX = popSharePct / 100;
  const incomeSharePct = Math.pow(popX, lorenzPower) * 100;
  const inequalityArea = 0.5 - 1 / (lorenzPower + 1);

  // 4. Poiseuille Blood Flow state (Bài 4.13 SGK trang 18)
  // v(r) = k(R^2 - r^2), lưu lượng Q = \int_0^R 2\pi r v(r) dr = (\pi k R^4) / 2
  const [arteryR, setArteryR] = useState(0.25); // cm (bán kính động mạch)
  const [probeRatio, setProbeRatio] = useState(0.4); // r / R
  const [kFactor, setKFactor] = useState(1200); // hằng số áp suất - độ nhớt (1 / (cm·s))

  const probeR = +(arteryR * probeRatio).toFixed(3);
  const vMax = kFactor * arteryR * arteryR; // cm/s tại tâm r = 0
  const vAtProbe = kFactor * (arteryR * arteryR - probeR * probeR); // cm/s tại r
  const vAvg = 0.5 * vMax; // \bar{v} = (1 / (\pi R^2)) \int_0^R 2\pi r v(r) dr = vMax / 2
  const bloodFlowQ = (Math.PI * kFactor * Math.pow(arteryR, 4)) / 2; // cm^3/s (mL/s)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
            Mục 4 • Mô phỏng thực tiễn STEM trong SGK Chương IV
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 tracking-[-0.02em]">
            Phòng thí nghiệm ứng dụng Nguyên hàm & Tích phân trong Kỹ thuật, Cơ học, Kinh tế, Y sinh
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Trực quan hóa 4 bài toán thực tế trích trực tiếp từ SGK Toán 12 Tập 2 KNTT (Bài 4.7, Bài 4.13, Bài 4.16 và Bài 4.35).
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('pottery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pottery'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            1. Bình gốm Bát Tràng (Bài 4.35)
          </button>
          <button
            onClick={() => setActiveTab('ballistics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ballistics'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            2. Đạn pháo & Cơ học (Bài 4.7)
          </button>
          <button
            onClick={() => setActiveTab('lorenz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'lorenz'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            3. Kinh tế Lorenz & Gini (Bài 4.16)
          </button>
          <button
            onClick={() => setActiveTab('blood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'blood'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            4. Y sinh & Dòng máu (Bài 4.13)
          </button>
        </div>
      </div>

      {/* Tab 1: Pottery (Bài 4.35 trang 28 SGK) */}
      {activeTab === 'pottery' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <div className="space-y-4">
            <div className="border-l-3 border-amber-500 pl-3">
              <h4 className="text-slate-900 font-bold text-sm">
                Bài toán chế tác bình gốm Bát Tràng (SGK Trang 28 - Bài 4.35)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Một nghệ nhân gốm Bát Tràng chế tác chiếc bình có đường sinh mặt ngoài là đồ thị hàm số:
                <MathView
                  math="y = \frac{1}{175}x^2 + \frac{3}{35}x + 2 \quad (0 \le x \le H\text{ cm})"
                  className="text-amber-800 font-mono text-xs mx-1 font-semibold"
                />
                quay quanh trục Ox (bán kính đáy tại x = 0 là R(0) = 2 cm, bán kính miệng tại x = 30 là R(30) ≈ 9,71 cm). Thành bình dày d cm.
              </p>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-semibold">Chiều cao bình gốm (H):</span>
                  <span className="text-amber-700 font-mono font-bold">{potteryHeight} cm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={potteryHeight}
                  onChange={(e) => setPotteryHeight(parseInt(e.target.value, 10))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-semibold">Độ dày thành bình gốm (d):</span>
                  <span className="text-amber-700 font-mono font-bold">{thickness} cm</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={thickness}
                  onChange={(e) => setThickness(parseFloat(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Kết quả tính toán bằng tích phân khối tròn xoay:
              </span>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-amber-200/70">
                  <span className="text-[11px] text-slate-500 block">Thể tích phủ bì:</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {outerVolume.toFixed(1)} cm³
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ≈ {(outerVolume / 1000).toFixed(2)} Lít
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-amber-200/70">
                  <span className="text-[11px] text-slate-500 block">Dung tích lòng bình:</span>
                  <span className="text-sm font-bold text-teal-800 font-mono">
                    {innerVolume.toFixed(1)} cm³
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ≈ {(innerVolume / 1000).toFixed(2)} Lít
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-amber-200/70">
                  <span className="text-[11px] text-amber-800 font-semibold block">Lượng đất sét:</span>
                  <span className="text-sm font-bold text-amber-700 font-mono">
                    {clayVolume.toFixed(1)} cm³
                  </span>
                  <span className="text-[10px] text-slate-500 block">V_ngoài - V_trong</span>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Illustration */}
          <div className="flex flex-col items-center justify-center bg-white rounded-xl p-5 border border-slate-200">
            <svg viewBox="0 0 420 220" className="w-full max-w-[420px] h-auto overflow-visible">
              <defs>
                <linearGradient id="potteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              {/* Trục xoay Ox */}
              <line
                x1="25"
                y1="110"
                x2="390"
                y2="110"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <polygon points="390,106 398,110 390,114" fill="#94a3b8" />

              {/* Vỏ ngoài bình gốm (đáy bán kính R(0) = 2cm > 0) */}
              <path
                d="M 75 88 Q 150 68 230 42 Q 270 22 300 20 L 300 200 Q 270 198 230 178 Q 150 152 75 132 Z"
                fill="url(#potteryGrad)"
                opacity="0.92"
                stroke="#b45309"
                strokeWidth="1.5"
              />

              {/* Lòng rỗng bên trong */}
              <path
                d={`M ${75 + thickness * 5} ${88 + thickness * 3.5} Q 150 ${68 + thickness * 3.5} 230 ${42 + thickness * 4} Q 270 ${22 + thickness * 4.5} 300 ${20 + thickness * 4.5} L 300 ${200 - thickness * 4.5} Q 270 ${198 - thickness * 4.5} 230 ${178 - thickness * 4} Q 150 ${152 - thickness * 3.5} ${75 + thickness * 5} ${132 - thickness * 3.5} Z`}
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              <text x="190" y="114" fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="500">
                Trục quay Ox
              </text>
              <text x="312" y="114" fill="#b45309" fontSize="11" textAnchor="start" fontWeight="bold">
                Miệng (x={potteryHeight})
              </text>
              <text x="65" y="114" fill="#b45309" fontSize="11" textAnchor="end" fontWeight="bold">
                Đáy R(0)=2cm
              </text>
            </svg>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              Mặt cắt dọc bình gốm Bát Tràng: V_ngoài = π ∫₀³⁰ (x²/175 + 3x/35 + 2)² dx ≈ 3668,4 cm³ (với H = 30 cm).
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Ballistics (Bài 4.7 trang 11 SGK) */}
      {activeTab === 'ballistics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <div className="space-y-4">
            <div className="border-l-3 border-teal-600 pl-3">
              <h4 className="text-slate-900 font-bold text-sm">
                Động lực học viên đạn bắn thẳng đứng (SGK Trang 11 - Bài 4.7)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Một viên đạn được bắn thẳng đứng lên trên từ mặt đất với vận tốc đầu v₀ = {v0} m/s, vận tốc tại thời điểm t là v(t) = {v0} - 9,8t (m/s). Độ cao của viên đạn là nguyên hàm của vận tốc:
                <MathView
                  math={`s(t) = \\int_0^t (${v0} - 9{,}8\\tau)\\,d\\tau = ${v0}t - 4{,}9t^2\\text{ (m)}`}
                  className="text-teal-800 font-mono text-xs block my-1 font-semibold"
                />
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 font-semibold">
                  <MathView math="Vận tốc ban đầu $v_0$:" />
                </span>
                <div className="flex gap-1.5">
                  {[120, 160, 200].map((val) => (
                    <button
                      key={val}
                      onClick={() => {
                        setIsPlayingFlight(false);
                        setV0(val);
                        setSimTime(3.0);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border cursor-pointer ${
                        v0 === val
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {val} m/s {val === 160 ? '(SGK)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-700 font-semibold">Mô phỏng theo thời gian:</span>
                <button
                  onClick={() => setIsPlayingFlight(!isPlayingFlight)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isPlayingFlight
                      ? 'bg-rose-600 text-white'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {isPlayingFlight ? 'Tạm dừng' : 'Chạy mô phỏng bay'}
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Thời điểm khảo sát (t):</span>
                  <span className="text-teal-700 font-mono font-bold">
                    t = {simTime} s (Đỉnh tại t = {tPeak.toFixed(2)} s)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={(2 * tPeak).toFixed(1)}
                  step="0.1"
                  value={simTime}
                  onChange={(e) => {
                    setIsPlayingFlight(false);
                    setSimTime(parseFloat(e.target.value));
                  }}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Độ cao tức thời s(t):</span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {currentHeight.toFixed(1)} m
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Độ cao cực đại H_max = {hMax.toFixed(1)} m
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Vận tốc tức thời v(t):</span>
                <span
                  className={`text-xl font-bold font-mono ${
                    currentVelocity >= 0 ? 'text-teal-700' : 'text-amber-700'
                  }`}
                >
                  {currentVelocity.toFixed(1)} m/s
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {currentVelocity >= 0 ? 'Đang đi lên (v ≥ 0)' : 'Đang rơi xuống (v < 0)'}
                </span>
              </div>
            </div>
          </div>

          {/* Trajectory visualization */}
          <div className="relative h-[260px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-end p-4">
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-teal-950/70 border-t border-teal-800/40"></div>
            <div className="absolute left-4 top-4 bottom-6 w-12 flex flex-col justify-between text-[10px] font-mono text-slate-400 border-r border-slate-700 pr-1">
              <span>{hMax.toFixed(0)}m</span>
              <span>{(hMax / 2).toFixed(0)}m</span>
              <span>0m</span>
            </div>
            <div
              className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-75 flex flex-col items-center"
              style={{
                bottom: `${Math.min(205, 18 + (currentHeight / hMax) * 185)}px`
              }}
            >
              <div className="w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
                ▲
              </div>
              <span className="text-[11px] text-teal-300 font-mono mt-1 bg-slate-950/90 px-2 py-0.5 rounded border border-teal-500/30">
                s({simTime}s) = {currentHeight.toFixed(1)}m
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Lorenz Curve & Gini Coefficient (Bài 4.16 trang 25 SGK) */}
      {activeTab === 'lorenz' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <div className="space-y-4">
            <div className="border-l-3 border-indigo-600 pl-3">
              <h4 className="text-slate-900 font-bold text-sm">
                Đường cong Lorenz & Hệ số bất bình đẳng thu nhập Gini (SGK Trang 25 - Bài 4.16)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <MathView math="Đường phân giác $y = x$ biểu thị sự bình đẳng tuyệt đối. Đường cong Lorenz $y = L(x) = x^p$ ($x \in [0; 1]$) biểu thị tỉ lệ tổng thu nhập của $100x\%$ dân số có thu nhập thấp nhất. Hệ số Gini là tỉ số giữa diện tích hình phẳng giới hạn bởi $y=x$ và $y=L(x)$ so với diện tích tam giác dưới đường $y=x$ (bằng $1/2$):" />
              </p>
              <MathView
                content={`$$G = 2 \\int_0^1 \\left(x - x^{${lorenzPower}}\\right)dx = \\frac{${lorenzPower} - 1}{${lorenzPower} + 1} = ${giniIndex.toFixed(3)}$$`}
                className="text-indigo-900 font-semibold text-xs mt-2 bg-white p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-semibold">
                    <MathView math="Bậc hàm Lorenz $p$ trong $L(x) = x^p$:" />
                  </span>
                  <span className="text-indigo-700 font-mono font-bold">
                    p = {lorenzPower.toFixed(1)} {lorenzPower === 2 ? '(Mẫu câu a Bài 4.16 SGK)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.1"
                  max="4.0"
                  step="0.1"
                  value={lorenzPower}
                  onChange={(e) => setLorenzPower(parseFloat(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>p = 1.1 (Bình đẳng cao)</span>
                  <span>p = 2.0 (Gini = 1/3 ≈ 0.333)</span>
                  <span>p = 4.0 (Chênh lệch lớn)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-semibold">
                    <MathView math="Khảo sát nhóm $x\%$ dân số thu nhập thấp nhất:" />
                  </span>
                  <span className="text-indigo-700 font-mono font-bold">
                    x = {popSharePct}% dân số
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={popSharePct}
                  onChange={(e) => setPopSharePct(parseInt(e.target.value, 10))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Diện tích lệch S:</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {inequalityArea.toFixed(4)}
                </span>
                <span className="text-[10px] text-slate-400 block">∫₀¹ (x - xᵖ) dx</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Hệ số Gini (G = 2S):</span>
                <span className="text-base font-bold text-indigo-700 font-mono">
                  {giniIndex.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {giniIndex < 0.35 ? 'Phân phối khá đều' : giniIndex < 0.5 ? 'Trung bình' : 'Bất bình đẳng cao'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{popSharePct}% dân số nắm:</span>
                <span className="text-base font-bold text-amber-700 font-mono">
                  {incomeSharePct.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block">tổng thu nhập</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Lorenz Curve */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col items-center justify-center">
            {(() => {
              const size = 240;
              const pad = 34;
              const toX = (u) => pad + u * (size - 2 * pad);
              const toY = (v) => size - pad - v * (size - 2 * pad);

              const curvePts = [];
              for (let i = 0; i <= 50; i++) {
                const u = i / 50;
                const v = Math.pow(u, lorenzPower);
                curvePts.push(`${toX(u).toFixed(1)},${toY(v).toFixed(1)}`);
              }
              const areaPolygon = `${toX(0)},${toY(0)} ${toX(1)},${toY(1)} ${curvePts
                .slice()
                .reverse()
                .join(' ')}`;

              const px = toX(popX);
              const pyLorenz = toY(Math.pow(popX, lorenzPower));
              const pyEqual = toY(popX);

              return (
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[290px] h-auto">
                  {/* Axes */}
                  <line x1={pad} y1={toY(0)} x2={toX(1)} y2={toY(0)} stroke="#475569" strokeWidth="1.5" />
                  <line x1={pad} y1={toY(0)} x2={pad} y2={toY(1)} stroke="#475569" strokeWidth="1.5" />
                  <line x1={toX(1)} y1={toY(0)} x2={toX(1)} y2={toY(1)} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1={pad} y1={toY(1)} x2={toX(1)} y2={toY(1)} stroke="#e2e8f0" strokeDasharray="3 3" />

                  {/* Shaded inequality area between y = x and y = L(x) */}
                  <polygon points={areaPolygon} fill="rgba(79, 70, 229, 0.18)" />

                  {/* Line of equality y = x */}
                  <line
                    x1={toX(0)}
                    y1={toY(0)}
                    x2={toX(1)}
                    y2={toY(1)}
                    stroke="#0f766e"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Lorenz curve y = x^p */}
                  <polyline
                    points={curvePts.join(' ')}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2.6"
                  />

                  {/* Vertical probe line at popX */}
                  <line
                    x1={px}
                    y1={toY(0)}
                    x2={px}
                    y2={pyEqual}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                  <circle cx={px} cy={pyLorenz} r="4" fill="#4f46e5" />

                  {/* Labels */}
                  <text x={pad - 10} y={toY(0) + 12} fontSize="9" fill="#475569">
                    0
                  </text>
                  <text x={toX(1) - 4} y={toY(0) + 12} fontSize="9" fill="#475569">
                    1
                  </text>
                  <text x={pad - 12} y={toY(1) + 4} fontSize="9" fill="#475569">
                    1
                  </text>
                  <text x={toX(0.42)} y={toY(0.52)} fontSize="9" fill="#0f766e" fontWeight="bold">
                    y = x
                  </text>
                  <text x={toX(0.58)} y={toY(Math.pow(0.58, lorenzPower)) + 13} fontSize="9" fill="#4f46e5" fontWeight="bold">
                    L(x) = x^{lorenzPower}
                  </text>
                </svg>
              );
            })()}
            <p className="text-[11px] text-slate-500 text-center mt-1">
              <MathView math="Miền tô màu tím là diện tích $\int_0^1 [x - L(x)]\,dx$. Hệ số Gini bằng $2$ lần diện tích miền này." />
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Poiseuille Blood Flow (Bài 4.13 trang 18 SGK) */}
      {activeTab === 'blood' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
          <div className="space-y-4">
            <div className="border-l-3 border-rose-600 pl-3">
              <h4 className="text-slate-900 font-bold text-sm">
                Định luật Poiseuille về vận tốc & lưu lượng máu trong động mạch (SGK Trang 18 - Bài 4.13)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Vận tốc máu (cm/s) tại vị trí cách tâm động mạch một khoảng r (cm) được cho bởi v(r) = k(R² - r²) với 0 ≤ r ≤ R. Lưu lượng máu Q qua tiết diện tròn và vận tốc trung bình v̄ được xác định bằng tích phân:
              </p>
              <MathView
                content="$$Q = \int_0^R 2\pi r \cdot k(R^2 - r^2)\,dr = \frac{\pi k R^4}{2}, \qquad \bar{v} = \frac{Q}{\pi R^2} = \frac{1}{2}v_{\max}$$"
                className="text-rose-900 font-semibold text-xs mt-2 bg-white p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-semibold">Bán kính động mạch (R):</span>
                  <span className="text-rose-700 font-mono font-bold">{arteryR.toFixed(2)} cm</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.40"
                  step="0.02"
                  value={arteryR}
                  onChange={(e) => setArteryR(parseFloat(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-semibold">
                    Khoảng cách từ tâm mạch đến điểm đo r = {(probeRatio * 100).toFixed(0)}% R:
                  </span>
                  <span className="text-rose-700 font-mono font-bold">r = {probeR} cm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={probeRatio}
                  onChange={(e) => setProbeRatio(parseFloat(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-semibold">Hệ số độ chênh áp - độ nhớt (k):</span>
                  <span className="text-rose-700 font-mono font-bold">k = {kFactor}</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2000"
                  step="100"
                  value={kFactor}
                  onChange={(e) => setKFactor(parseInt(e.target.value, 10))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Vận tốc tại r={probeR}:</span>
                <span className="text-base font-bold text-rose-700 font-mono">
                  {vAtProbe.toFixed(1)} cm/s
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Tâm mạch: {vMax.toFixed(1)} cm/s
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Vận tốc TB (v̄):</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {vAvg.toFixed(1)} cm/s
                </span>
                <span className="text-[10px] text-slate-400 block">= 1/2 v_max</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Lưu lượng máu Q:</span>
                <span className="text-base font-bold text-teal-800 font-mono">
                  {bloodFlowQ.toFixed(2)} mL/s
                </span>
                <span className="text-[10px] text-slate-400 block">∝ R⁴ (Định luật bậc 4)</span>
              </div>
            </div>
          </div>

          {/* SVG Parabolic Blood Velocity Profile */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col items-center justify-center">
            <svg viewBox="0 0 380 210" className="w-full max-w-[380px] h-auto">
              {/* Artery walls */}
              <rect x="30" y="30" width="320" height="10" fill="#fda4af" stroke="#e11d48" strokeWidth="1" />
              <rect x="30" y="170" width="320" height="10" fill="#fda4af" stroke="#e11d48" strokeWidth="1" />
              <rect x="30" y="40" width="320" height="130" fill="#fff1f2" />

              {/* Centerline r = 0 */}
              <line x1="30" y1="105" x2="350" y2="105" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.2" />

              {/* Parabolic velocity profile curve */}
              <path
                d="M 90 40 Q 330 105 90 170"
                fill="rgba(225, 29, 72, 0.14)"
                stroke="#be123c"
                strokeWidth="2.5"
              />

              {/* Velocity vectors across radius */}
              {[-0.8, -0.5, -0.25, 0, 0.25, 0.5, 0.8].map((ratio, idx) => {
                const yPos = 105 + ratio * 65;
                const vRatio = 1 - ratio * ratio;
                const xEnd = 90 + vRatio * 120;
                return (
                  <g key={idx}>
                    <line x1="90" y1={yPos} x2={xEnd} y2={yPos} stroke="#e11d48" strokeWidth="1.8" />
                    <polygon points={`${xEnd},${yPos - 3} ${xEnd + 6},${yPos} ${xEnd},${yPos + 3}`} fill="#e11d48" />
                  </g>
                );
              })}

              {/* Highlighted probe position r */}
              {(() => {
                const yProbe = 105 - probeRatio * 65;
                const vRatio = 1 - probeRatio * probeRatio;
                const xProbe = 90 + vRatio * 120;
                return (
                  <g>
                    <line x1="90" y1={yProbe} x2={xProbe} y2={yProbe} stroke="#0f766e" strokeWidth="2.8" />
                    <circle cx={xProbe} cy={yProbe} r="4.5" fill="#0f766e" />
                    <text x={xProbe + 10} y={yProbe + 4} fontSize="10" fill="#0f766e" fontWeight="bold">
                      v(r) = {vAtProbe.toFixed(1)} cm/s
                    </text>
                  </g>
                );
              })()}

              <text x="36" y="24" fontSize="10" fill="#be123c" fontWeight="bold">
                Thành động mạch (r = R, v = 0)
              </text>
              <text x="245" y="101" fontSize="10" fill="#475569">
                Trục tâm mạch (r = 0)
              </text>
            </svg>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              <MathView math="Phân bố vận tốc parabol $v(r) = k(R^2 - r^2)$: Tại tâm mạch ($r=0$) máu chảy nhanh nhất, tại thành mạch ($r=R$) vận tốc bằng $0$." />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
