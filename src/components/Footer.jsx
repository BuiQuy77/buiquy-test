import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="font-medium text-slate-700">
          MathMate • Hệ thống Học liệu Toán THPT (Lớp 10, 11, 12)
        </div>
        <div className="text-[11px] text-slate-400">
          SGK Kết nối tri thức • Dựng hình không gian 3D • Mô phỏng giải tích & Casio
        </div>
      </div>
    </footer>
  );
}
