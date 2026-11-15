import React, { useState, useEffect } from 'react';
import MathView from './MathView';
import {
  getLessonVideo,
  saveCustomLessonVideo,
  resetLessonVideo
} from '../data/lessonMediaData';
import {
  Play,
  Pause,
  Video,
  Settings,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Film,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LessonVideoSection({ lesson }) {
  const [videoData, setVideoData] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // AI Visual Slideshow state (Dành cho chế độ Chương trình tự tạo tóm tắt hoạt họa)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Admin form state
  const [adminUrl, setAdminUrl] = useState('');
  const [adminTitle, setAdminTitle] = useState('');
  const [adminAuthor, setAdminAuthor] = useState('');
  const [adminDuration, setAdminDuration] = useState('');
  const [adminNotesText, setAdminNotesText] = useState('');
  const [adminNotice, setAdminNotice] = useState('');

  useEffect(() => {
    if (!lesson) return;
    const loaded = getLessonVideo(lesson.id, lesson);
    setVideoData(loaded);
    setCurrentSlide(0);
    setIsAutoPlaying(false);
  }, [lesson]);

  // Slideshow timer
  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev >= 3 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleOpenAdmin = () => {
    if (!videoData) return;
    setAdminUrl(videoData.embedUrl || (videoData.youtubeId ? `https://www.youtube.com/watch?v=${videoData.youtubeId}` : ''));
    setAdminTitle(videoData.title || '');
    setAdminAuthor(videoData.author || '');
    setAdminDuration(videoData.duration || '10:00');
    setAdminNotesText((videoData.summaryNotes || []).join('\n'));
    setAdminNotice('');
    setIsAdminOpen(true);
  };

  const parseYoutubeEmbedUrl = (rawUrl = '') => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;
    if (trimmed.includes('/embed/')) return trimmed;

    // watch?v=ID
    const vMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vMatch && vMatch[1]) {
      return `https://www.youtube.com/embed/${vMatch[1]}`;
    }

    // youtu.be/ID
    const beMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (beMatch && beMatch[1]) {
      return `https://www.youtube.com/embed/${beMatch[1]}`;
    }

    return trimmed;
  };

  const handleSaveVideo = () => {
    const parsedEmbed = parseYoutubeEmbedUrl(adminUrl);
    const notes = adminNotesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = {
      ...videoData,
      title: adminTitle.trim() || videoData.title,
      author: adminAuthor.trim() || videoData.author,
      duration: adminDuration.trim() || '10:00',
      embedUrl: parsedEmbed,
      summaryNotes: notes.length > 0 ? notes : videoData.summaryNotes
    };

    setVideoData(updated);
    saveCustomLessonVideo(lesson.id, updated);
    setIsAdminOpen(false);
  };

  const handleResetVideo = () => {
    if (window.confirm('Khôi phục video tóm tắt mặc định của hệ thống cho bài học này?')) {
      resetLessonVideo(lesson.id);
      const def = getLessonVideo(lesson.id, lesson);
      setVideoData(def);
      setIsAdminOpen(false);
    }
  };

  if (!videoData) return null;

  const sections = lesson?.sections || [];
  const formulas = sections.flatMap((s) => s.formulas || []);
  const terms = lesson?.terms || [];

  const slides = [
    {
      title: 'Slide 1: Thuật Ngữ & Bài Toán Khởi Động',
      desc: 'Nắm chắc các thuật ngữ nền tảng và bài toán mô hình mở đầu.',
      content: (
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#005a54] uppercase tracking-wider">
            Thuật ngữ then chốt:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {terms.slice(0, 4).map((t, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-extrabold text-slate-900 text-xs">{t.term}: </span>
                <span className="text-xs text-slate-600">{t.definition}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Slide 2: Yêu Cầu Cần Đạt (Mục Tiêu Bài Học)',
      desc: 'Các năng lực Toán học trọng tâm cần đạt được sau khi học xong bài.',
      content: (
        <div className="space-y-2">
          {(lesson?.objectives || []).map((obj, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 flex items-start gap-2 text-xs text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-[#005a54] shrink-0 mt-0.5" />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Slide 3: Công Thức Toán Học Cốt Lõi',
      desc: 'Bảng công thức then chốt bắt buộc ghi nhớ để làm bài thi.',
      content: (
        <div className="space-y-2">
          {formulas.length > 0 ? (
            formulas.slice(0, 3).map((f, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-center overflow-x-auto">
                <MathView math={f} block={true} />
              </div>
            ))
          ) : (
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-600">
              {lesson?.subtitle || 'Xem chi tiết các định lý và tính chất trong sách giáo khoa.'}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Slide 4: Ví Dụ Mẫu & Kĩ Thuật Casio',
      desc: 'Phân tích phương pháp giải nhanh và kiểm tra kết quả bằng máy tính.',
      content: (
        <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-2">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Mẹo làm bài thi & Kiểm tra Casio fx-580 / fx-880:</span>
          </div>
          <p className="leading-relaxed">
            Áp dụng các chức năng TABLE (quét hàm số), d/dx (đạo hàm tại 1 điểm), tích phân ∫ và CALC 10^9 để loại trừ nhanh đáp án sai trong đề thi tốt nghiệp THPT.
          </p>
        </div>
      )
    }
  ];

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header khu vực Video Tóm Tắt */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Video Tóm Tắt Bài Học & Trọng Tâm Kiến Thức
            </h2>
            <p className="text-xs text-slate-500">
              {videoData.embedUrl ? 'Video bài giảng trực quan & Mốc thời gian (Timestamps)' : 'Chương trình AI Tự Tạo: Trình Chiếu Tóm Tắt Trực Quan'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdmin}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-teal-300" />
            <span>Đổi Video / Quản trị (Admin)</span>
          </button>
        </div>
      </div>

      {/* KHUNG PHÁT VIDEO / TRÌNH DIỄN TRỰC QUAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CỘT TRÁI (7/12): Khung Video (Iframe YouTube hoặc AI Slideshow) */}
        <div className="lg:col-span-7 space-y-3">
          {videoData.embedUrl ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
              <iframe
                src={videoData.embedUrl}
                title={videoData.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* AI VISUAL SLIDESHOW SUMMARY (Chương trình tự tạo) */
            <div className="w-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 text-white shadow-md flex flex-col justify-between min-h-[340px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    <span className="text-xs font-extrabold text-teal-300 uppercase tracking-wider">
                      {slides[currentSlide].title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Trang {currentSlide + 1} / {slides.length}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  {slides[currentSlide].desc}
                </p>

                <div className="pt-2 text-slate-900">
                  {slides[currentSlide].content}
                </div>
              </div>

              {/* Điều khiển Slideshow */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentSlide((s) => (s > 0 ? s - 1 : slides.length - 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                    title="Slide trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoPlaying ? 'Tạm dừng' : 'Tự động chạy'}</span>
                  </button>
                  <button
                    onClick={() => setCurrentSlide((s) => (s < slides.length - 1 ? s + 1 : 0))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                    title="Slide sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'w-6 bg-teal-400' : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold text-slate-800">{videoData.title}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Thời lượng: {videoData.duration} • Nguồn: {videoData.author}</span>
            </span>
          </div>
        </div>

        {/* CỘT PHẢI (5/12): Ghi chú tóm tắt & Mốc thời gian (Timestamps) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tóm tắt trọng tâm */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
            <div className="text-xs font-extrabold text-[#005a54] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Ghi Chú Trọng Tâm Bài Học</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              {(videoData.summaryNotes || []).map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#005a54] font-bold">•</span>
                  <span><MathView math={note} /></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mốc thời gian (Chapters) */}
          {videoData.chapters && videoData.chapters.length > 0 && (
            <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-200/80 space-y-2.5">
              <div className="text-xs font-extrabold text-[#005a54] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Mốc Thời Gian Video (Chương Mục)</span>
              </div>
              <div className="space-y-1.5">
                {videoData.chapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white border border-teal-100 flex items-center justify-between text-xs hover:border-[#005a54] transition-all"
                  >
                    <span className="font-medium text-slate-800">{ch.label}</span>
                    <span className="font-mono font-bold text-[#005a54] bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                      {ch.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL CẤU HÌNH / THAY ĐỔI VIDEO DÀNH CHO ADMIN & GIÁO VIÊN */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <Video className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Quản Trị Video Tóm Tắt Bài Học
                </h3>
              </div>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường dẫn Video YouTube (hoặc MP4):
                </label>
                <input
                  type="text"
                  value={adminUrl}
                  onChange={(e) => setAdminUrl(e.target.value)}
                  placeholder="Ví dụ: https://www.youtube.com/watch?v=... hoặc để trống để dùng AI Slideshow"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#005a54]"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  * Mẹo: Nếu để trống ô này, hệ thống sẽ tự động kích hoạt chế độ **Trình Chiếu AI Tự Động** trực quan.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề video bài giảng:
                </label>
                <input
                  type="text"
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#005a54]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tác giả / Kênh:
                  </label>
                  <input
                    type="text"
                    value={adminAuthor}
                    onChange={(e) => setAdminAuthor(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#005a54]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời lượng (phút:giây):
                  </label>
                  <input
                    type="text"
                    value={adminDuration}
                    onChange={(e) => setAdminDuration(e.target.value)}
                    placeholder="12:30"
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#005a54]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú tóm tắt (mỗi dòng là một ý gạch đầu dòng):
                </label>
                <textarea
                  rows={4}
                  value={adminNotesText}
                  onChange={(e) => setAdminNotesText(e.target.value)}
                  placeholder="Nhập các ý trọng tâm cần ghi nhớ..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#005a54]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetVideo}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                Khôi phục mặc định
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveVideo}
                  className="px-5 py-2 rounded-xl bg-[#005a54] hover:bg-[#004742] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
