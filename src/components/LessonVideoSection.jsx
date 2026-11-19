import React, { useState, useEffect, useRef } from 'react';
import MathView from './MathView';
import { useAuth } from '../context/AuthContext';
import {
  getLessonVideo,
  saveCustomLessonVideo,
  resetLessonVideo,
  getLessonSlide,
  saveCustomLessonSlide,
  resetLessonSlide
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
  AlertCircle,
  Maximize2,
  Presentation,
  Monitor,
  Layers,
  Globe
} from 'lucide-react';

export default function LessonVideoSection({ lesson }) {
  const { isTeacher } = useAuth();
  const [videoData, setVideoData] = useState(null);
  const [slideData, setSlideData] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('theory'); // 'theory' | 'exercise' | 'video'
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fullscreen container ref
  const slideContainerRef = useRef(null);

  // AI Visual Slideshow state (Dành cho chế độ Chương trình tự tạo tóm tắt hoạt họa)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Admin form state
  const [adminUrl, setAdminUrl] = useState('');
  const [adminTitle, setAdminTitle] = useState('');
  const [adminAuthor, setAdminAuthor] = useState('');
  const [adminDuration, setAdminDuration] = useState('');
  const [adminNotesText, setAdminNotesText] = useState('');
  const [adminTheoryUrl, setAdminTheoryUrl] = useState('');
  const [adminExerciseUrl, setAdminExerciseUrl] = useState('');
  const [adminNotice, setAdminNotice] = useState('');

  useEffect(() => {
    if (!lesson) return;
    const loadedVideo = getLessonVideo(lesson.id, lesson);
    const loadedSlide = getLessonSlide(lesson.id, lesson);
    setVideoData(loadedVideo);
    setSlideData(loadedSlide);

    // Mặc định ưu tiên mở Slide Lý thuyết nếu bài có sẵn Slide Manim, ngược lại mở Video
    if (loadedSlide?.theoryUrl) {
      setActiveMediaTab('theory');
    } else {
      setActiveMediaTab('video');
    }

    setCurrentSlide(0);
    setIsAutoPlaying(false);
  }, [lesson]);

  // Lắng nghe sự kiện đồng bộ đám mây để cập nhật Slide & Video ngay lập tức khi máy khác lưu
  useEffect(() => {
    const handleCloudSync = () => {
      if (!lesson) return;
      const loadedVideo = getLessonVideo(lesson.id, lesson);
      const loadedSlide = getLessonSlide(lesson.id, lesson);
      setVideoData(loadedVideo);
      setSlideData(loadedSlide);
    };

    window.addEventListener('mathmate_cloud_synced', handleCloudSync);
    return () => window.removeEventListener('mathmate_cloud_synced', handleCloudSync);
  }, [lesson]);

  // Slideshow timer cho AI Visual Slideshow
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
    if (!isTeacher || !videoData) return;
    setAdminUrl(videoData.embedUrl || (videoData.youtubeId ? `https://www.youtube.com/watch?v=${videoData.youtubeId}` : ''));
    setAdminTitle(videoData.title || '');
    setAdminAuthor(videoData.author || '');
    setAdminDuration(videoData.duration || '10:00');
    setAdminNotesText((videoData.summaryNotes || []).join('\n'));
    setAdminTheoryUrl(slideData?.theoryUrl || '');
    setAdminExerciseUrl(slideData?.exerciseUrl || '');
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

  const handleSaveMedia = () => {
    const parsedEmbed = parseYoutubeEmbedUrl(adminUrl);
    const notes = adminNotesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedVideo = {
      ...videoData,
      title: adminTitle.trim() || videoData.title,
      author: adminAuthor.trim() || videoData.author,
      duration: adminDuration.trim() || '10:00',
      embedUrl: parsedEmbed,
      summaryNotes: notes.length > 0 ? notes : videoData.summaryNotes
    };

    const updatedSlide = {
      ...slideData,
      theoryUrl: adminTheoryUrl.trim() || null,
      exerciseUrl: adminExerciseUrl.trim() || null,
      title: lesson?.title || 'Bài giảng Manim Slides'
    };

    setVideoData(updatedVideo);
    setSlideData(updatedSlide);

    saveCustomLessonVideo(lesson.id, updatedVideo);
    saveCustomLessonSlide(lesson.id, updatedSlide);

    setIsAdminOpen(false);
  };

  const handleResetMedia = () => {
    if (window.confirm('Khôi phục video và slide mặc định của hệ thống cho bài học này?')) {
      resetLessonVideo(lesson.id);
      resetLessonSlide(lesson.id);
      const defVideo = getLessonVideo(lesson.id, lesson);
      const defSlide = getLessonSlide(lesson.id, lesson);
      setVideoData(defVideo);
      setSlideData(defSlide);
      setIsAdminOpen(false);
    }
  };

  const handleToggleFullscreen = () => {
    if (!slideContainerRef.current) return;
    if (!document.fullscreenElement) {
      slideContainerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
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

  const currentSlideUrl =
    activeMediaTab === 'theory'
      ? slideData?.theoryUrl
      : activeMediaTab === 'exercise'
      ? slideData?.exerciseUrl
      : null;

  const getGrade = () => {
    if (lesson?.grade === 11 || lesson?.grade === '11' || lesson?.id?.includes('toan11') || lesson?.id?.includes('-11-')) return '11';
    if (lesson?.grade === 12 || lesson?.grade === '12' || lesson?.id?.includes('toan12') || lesson?.id?.includes('-12-')) return '12';
    if (lesson?.grade === 10 || lesson?.grade === '10' || lesson?.id?.includes('toan10') || lesson?.id?.includes('-10-')) return '10';
    if (lesson?.sourceFile?.includes('11') || lesson?.book?.includes('11')) return '11';
    if (lesson?.sourceFile?.includes('12') || lesson?.book?.includes('12')) return '12';
    return '10';
  };
  const grade = getGrade();
  const slideRepoUrl = `https://buiquy77.github.io/toan${grade}-slides/`;
  const slideRepoLabel = `Cổng Slide Toán ${grade}`;

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header khu vực Video & Trình Chiếu Manim */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-50 text-[#005a54] rounded-xl border border-teal-100">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Bài Giảng Trình Chiếu Manim & Video Tóm Tắt
            </h2>
            <p className="text-xs text-slate-500">
              Kết hợp Hoạt họa Toán học tương tác cao (Manim Slides) và Video bài giảng trực quan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={slideRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50/80 hover:bg-teal-100 text-[#005a54] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            title={`Mở cổng toàn bộ kho bài trình chiếu Toán ${grade} trên GitHub Pages`}
          >
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">{slideRepoLabel}</span>
          </a>

          {isTeacher && (
            <button
              onClick={handleOpenAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-teal-300" />
              <span>Đổi Video / Slide (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* THANH CHUYỂN ĐỔI CHẾ ĐỘ: SLIDE LÝ THUYẾT / SLIDE BÀI TẬP / VIDEO YOUTUBE */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Tab 1: Slide Lý Thuyết */}
          <button
            onClick={() => setActiveMediaTab('theory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeMediaTab === 'theory'
                ? 'bg-[#005a54] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>📊 Slide Lý Thuyết (Manim)</span>
            {slideData?.theoryUrl ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Có sẵn bài trình chiếu" />
            ) : (
              <span className="text-[10px] opacity-60">(Chưa có)</span>
            )}
          </button>

          {/* Tab 2: Slide Bài Tập */}
          <button
            onClick={() => setActiveMediaTab('exercise')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeMediaTab === 'exercise'
                ? 'bg-[#005a54] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📝 Slide Bài Tập (Manim)</span>
            {slideData?.exerciseUrl ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Có sẵn bài trình chiếu" />
            ) : (
              <span className="text-[10px] opacity-60">(Chưa có)</span>
            )}
          </button>

          {/* Tab 3: Video YouTube */}
          <button
            onClick={() => setActiveMediaTab('video')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeMediaTab === 'video'
                ? 'bg-[#005a54] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>🎬 Video Tóm Tắt (YouTube / AI)</span>
          </button>
        </div>

        {/* Nút hành động nhanh cho Slide */}
        {(activeMediaTab === 'theory' || activeMediaTab === 'exercise') && currentSlideUrl && (
          <div className="flex items-center gap-1.5 px-1">
            <button
              onClick={handleToggleFullscreen}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-slate-800 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Phóng to toàn màn hình máy chiếu / máy tính"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#005a54]" />
              <span>Toàn màn hình</span>
            </button>
            <a
              href={currentSlideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-slate-800 text-[11px] font-bold flex items-center gap-1 transition-all shadow-2xs"
              title="Mở tab mới độc lập"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Tab mới</span>
            </a>
          </div>
        )}
      </div>

      {/* KHUNG HIỂN THỊ CHÍNH (SLIDE HOẶC VIDEO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CỘT TRÁI (7/12): Khung Trình chiếu Slide hoặc Video */}
        <div className="lg:col-span-7 space-y-3">
          {/* HIỂN THỊ SLIDE MANIM (LÝ THUYẾT HOẶC BÀI TẬP) */}
          {(activeMediaTab === 'theory' || activeMediaTab === 'exercise') && (
            <div
              ref={slideContainerRef}
              className="relative w-full aspect-video min-h-[360px] sm:min-h-[420px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex flex-col"
            >
              {currentSlideUrl ? (
                <iframe
                  src={currentSlideUrl}
                  title={`${lesson?.title || 'Bài học'} - ${activeMediaTab === 'theory' ? 'Slide Lý Thuyết' : 'Slide Bài Tập'}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="w-full h-full border-0 flex-1"
                />
              ) : (
                /* Thông báo khi bài học chưa có Slide */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-3 bg-gradient-to-br from-slate-900 to-slate-950">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                    <Presentation className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h4 className="text-sm font-bold text-white">
                      Bài học này chưa có bản trình chiếu Manim {activeMediaTab === 'theory' ? 'Lý Thuyết' : 'Bài Tập'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Thầy Cô có thể bấm nút <strong>"Đổi Video / Slide (Admin)"</strong> ở góc phải trên để dán đường link slide mới, hoặc bấm vào tab <strong>"Video Tóm Tắt"</strong> để xem video bài giảng!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setActiveMediaTab('video')}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Xem Video Bài Giảng
                    </button>
                    <a
                      href={slideRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-teal-400" />
                      <span>Xem Kho Slide Toán {grade}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HIỂN THỊ VIDEO YOUTUBE HOẶC AI SLIDESHOW */}
          {activeMediaTab === 'video' && (
            <>
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
            </>
          )}

          {/* Thanh thông tin dưới khung Media */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold text-slate-800">
              {activeMediaTab === 'theory'
                ? `📊 Slide Lý Thuyết: ${slideData?.title || lesson?.title}`
                : activeMediaTab === 'exercise'
                ? `📝 Slide Bài Tập: ${slideData?.title || lesson?.title}`
                : videoData.title}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {activeMediaTab === 'video'
                  ? `Thời lượng: ${videoData.duration} • Nguồn: ${videoData.author}`
                  : `Tác giả: Thầy Bùi Quý • Động cơ Manim Slides`}
              </span>
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

          {/* Mốc thời gian (Chapters) nếu có */}
          {videoData.chapters && videoData.chapters.length > 0 && activeMediaTab === 'video' && (
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

          {/* Hướng dẫn phím tắt khi trình chiếu Manim */}
          {(activeMediaTab === 'theory' || activeMediaTab === 'exercise') && (
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/80 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-[#005a54] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Mẹo Thầy Cô Giảng Bài Bằng Manim Slides:</span>
              </div>
              <ul className="space-y-1.5 leading-relaxed text-[11px]">
                <li>• Bấm nút <strong>"Tiếp tục ▶"</strong> (hoặc phím mũi tên <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">➡️</kbd>) để chuyển từng bước hoạt họa.</li>
                <li>• Bật nút <strong>"▶ Tự động"</strong> để bài trình chiếu tự động chiếu nối tiếp như một video bài giảng.</li>
                <li>• Bấm <strong>"Toàn màn hình"</strong> để phóng to hết cỡ khi chiếu lên Tivi hoặc Máy chiếu lớp học.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* MODAL CẤU HÌNH / THAY ĐỔI VIDEO & SLIDE DÀNH CHO ADMIN & GIÁO VIÊN */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-[#005a54] rounded-lg">
                  <Settings className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Cấu Hình Video & Slide Bài Giảng
                </h3>
              </div>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Cấu hình Slide Manim */}
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 space-y-2.5">
                <div className="text-xs font-bold text-[#005a54] flex items-center gap-1.5">
                  <Presentation className="w-4 h-4" />
                  <span>Cấu hình Bài trình chiếu Manim (GitHub Pages / Link Web):</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Link Slide Lý Thuyết:
                  </label>
                  <input
                    type="text"
                    value={adminTheoryUrl}
                    onChange={(e) => setAdminTheoryUrl(e.target.value)}
                    placeholder={`Ví dụ: https://buiquy77.github.io/toan${grade}-slides/Bai01_MenhDe_Slide.html`}
                    className="w-full p-2 rounded-lg border border-teal-200 text-xs bg-white focus:outline-none focus:border-[#005a54]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Link Slide Bài Tập:
                  </label>
                  <input
                    type="text"
                    value={adminExerciseUrl}
                    onChange={(e) => setAdminExerciseUrl(e.target.value)}
                    placeholder={`Ví dụ: https://buiquy77.github.io/toan${grade}-slides/Bai01_BaiTap_Slide.html`}
                    className="w-full p-2 rounded-lg border border-teal-200 text-xs bg-white focus:outline-none focus:border-[#005a54]"
                  />
                </div>
              </div>

              {/* Cấu hình Video YouTube */}
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
                  rows={3}
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
                onClick={handleResetMedia}
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
                  onClick={handleSaveMedia}
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
