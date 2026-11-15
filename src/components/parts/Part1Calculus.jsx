import React from 'react';
import SolidOfRevolution3D from './SolidOfRevolution3D';
import RiemannIntegralLab from './RiemannIntegralLab';
import StemSimulations from './StemSimulations';
import ExerciseBank from './ExerciseBank';
import TheoryTables from './TheoryTables';
import {
  Box,
  Activity,
  Cpu,
  CheckSquare,
  BookMarked,
  Calculator,
  Camera,
  LayoutGrid
} from 'lucide-react';

const SUB_TABS = [
  { id: 'all', label: 'Tất cả Chương IV (1 khối)', icon: LayoutGrid },
  { id: 'theory', label: '1. Bài 11: Nguyên hàm (Tr.4–11)', icon: BookMarked },
  { id: 'riemann', label: '2. Bài 12: Tích phân & Riemann (Tr.12–18)', icon: Activity },
  { id: '3d-solid', label: '3. Bài 13: Diện tích & Khối tròn xoay 3D (Tr.19–26)', icon: Box },
  { id: 'stem', label: '4. Ứng dụng thực tế STEM (SGK)', icon: Cpu },
  { id: 'exercises', label: '5. Ôn tập cuối chương IV (Tr.27–28)', icon: CheckSquare }
];

export default function Part1Calculus({
  activeSubTab = 'all',
  onSelectSubTab,
  onOpenCasioModal,
  onOpenAR
}) {
  const currentTab = activeSubTab || 'all';
  const isAll = currentTab === 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Thanh điều hướng hợp nhất trong cùng 1 khối Chương IV */}
      <div className="bg-slate-900 text-white px-5 py-5 sm:px-6 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wide">
                CHƯƠNG IV • TOÁN 12 TẬP 2 KNTT (TRANG 4–28)
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                Khối kiến thức & thực hành thống nhất (5 phần)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-[-0.02em]">
              Nguyên hàm, Tích phân và Ứng dụng hình học của tích phân
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Toàn bộ Chương IV được hợp nhất trong một khối xuyên suốt theo đúng trình tự SGK Toán 12 Tập 2: Bài 11 (Nguyên hàm & họ nguyên hàm), Bài 12 (Tích phân & tổng Riemann), Bài 13 (Diện tích hình phẳng & thể tích khối tròn xoay 3D), Mô hình thực tế STEM và Bài tập cuối chương IV.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenAR && (
              <button
                onClick={() => onOpenAR('revolution_vase')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-teal-400" />
                <span>Mô hình 3D / AR</span>
              </button>
            )}

            {onOpenCasioModal && (
              <button
                onClick={onOpenCasioModal}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Casio Chương IV</span>
              </button>
            )}
          </div>
        </div>

        {/* Thanh chọn chế độ xem: Xem toàn bộ 1 khối hoặc lọc từng bài */}
        <div className="flex gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-slate-800 scrollbar-none">
          {SUB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectSubTab && onSelectSubTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nội dung các mục của Chương IV nằm liền mạch trong cùng 1 khối */}
      <div className="p-4 sm:p-6 divide-y divide-slate-200 space-y-8">
        {/* MỤC 1: BÀI 11 - NGUYÊN HÀM & HỌ NGUYÊN HÀM */}
        {(isAll || currentTab === 'theory') && (
          <div id="c4-sec-theory" className="pt-2 first:pt-0">
            <TheoryTables />
          </div>
        )}

        {/* MỤC 2: BÀI 12 - TÍCH PHÂN & TỔNG RIEMANN */}
        {(isAll || currentTab === 'riemann') && (
          <div id="c4-sec-riemann" className="pt-8 first:pt-0">
            <RiemannIntegralLab />
          </div>
        )}

        {/* MỤC 3: BÀI 13 - ỨNG DỤNG HÌNH HỌC & KHỐI TRÒN XOAY 3D */}
        {(isAll || currentTab === '3d-solid') && (
          <div id="c4-sec-3d-solid" className="pt-8 first:pt-0">
            <SolidOfRevolution3D />
          </div>
        )}

        {/* MỤC 4: MÔ PHỎNG BÀI TOÁN THỰC TIỄN STEM TRONG SGK */}
        {(isAll || currentTab === 'stem') && (
          <div id="c4-sec-stem" className="pt-8 first:pt-0">
            <StemSimulations />
          </div>
        )}

        {/* MỤC 5: BÀI TẬP CUỐI CHƯƠNG IV */}
        {(isAll || currentTab === 'exercises') && (
          <div id="c4-sec-exercises" className="pt-8 first:pt-0">
            <ExerciseBank />
          </div>
        )}
      </div>
    </div>
  );
}
