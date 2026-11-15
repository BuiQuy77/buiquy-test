import React from 'react';
import {
  Box,
  Compass,
  TrendingUp,
  GitBranch,
  ArrowRight,
  Calculator,
  Camera,
  BookOpen
} from 'lucide-react';

export default function HeroBanner({ onSelectModule, onOpenCasioModal, onOpenAR }) {
  const cards = [
    {
      id: 'part1',
      title: 'Chương I: Khảo sát & Đồ thị hàm số',
      tag: 'Tập 1',
      desc: 'Đơn điệu, cực trị, GTLN - GTNN, tiệm cận đứng/ngang/xiên và khảo sát hàm bậc ba, hàm phân thức.',
      icon: TrendingUp
    },
    {
      id: 'part2',
      title: 'Chương IV: Nguyên hàm & Tích phân',
      tag: 'Tập 2',
      desc: 'Tổng Riemann, diện tích hình phẳng, thể tích khối tròn xoay 3D và bài toán chuyển động.',
      icon: Box
    },
    {
      id: 'part3',
      title: 'Chương V: Phương pháp tọa độ Oxyz',
      tag: 'Tập 2',
      desc: 'Phương trình mặt phẳng, đường thẳng, mặt cầu, góc và khoảng cách trong không gian tọa độ.',
      icon: Compass
    },
    {
      id: 'part4',
      title: 'Chương VI: Xác suất có điều kiện',
      tag: 'Tập 2',
      desc: 'Công thức nhân xác suất, sơ đồ hình cây, xác suất toàn phần và công thức Bayes.',
      icon: GitBranch
    }
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="rounded-xl p-5 bg-white border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-semibold text-teal-800">
            SGK Toán THPT Kết nối tri thức • Lớp 10, 11, 12
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-[-0.02em]">
            Hệ Thống Tra Cứu SGK, Dựng Hình 3D & Mô Phỏng Giải Tích
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tra cứu trực tiếp từng trang sách giáo khoa và văn bản OCR, thực hành dựng thiết diện không gian 3D, giải bài toán thực tế trả lời ngắn và kiểm tra bằng máy tính Casio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectModule('curriculum')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#0d3b3e] hover:bg-[#092b2d] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Danh mục SGK</span>
          </button>

          <button
            onClick={onOpenCasioModal}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-700" />
            <span>Máy tính Casio</span>
          </button>

          <button
            onClick={onOpenAR}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-slate-700" />
            <span>Mô hình 3D</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={() => onSelectModule(c.id)}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm tracking-[-0.02em] group-hover:text-[#0d3b3e] transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{c.desc}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                <span>Mở chuyên đề</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
