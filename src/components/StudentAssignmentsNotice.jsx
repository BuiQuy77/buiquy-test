import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAssignmentsForClass,
  getStudentSubmissionForAssignment
} from '../services/assignmentDatabase';
import { getStoredTeacher } from '../services/studentDatabase';
import {
  Clock,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function StudentAssignmentsNotice({ onStartExam }) {
  const { currentUser, isStudent } = useAuth();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (isStudent && currentUser?.className) {
      const list = getAssignmentsForClass(currentUser.className);
      setAssignments(list);
    } else {
      setAssignments([]);
    }
  }, [isStudent, currentUser]);

  if (!isStudent || assignments.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-700/50 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-blue-300">
            Nhiệm Vụ Học Tập • Lớp {currentUser.className}
          </span>
          <span className="text-blue-400 text-xs">•</span>
          <span className="text-xs text-blue-200">
            Chào em, <strong>{currentUser.name}</strong>
          </span>
        </div>
        <div className="text-[11px] text-blue-300">
          Giáo viên giao: <strong>{getStoredTeacher()?.name || 'Thầy Nguyễn Đức Anh'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {assignments.map((asg) => {
          const submission = getStudentSubmissionForAssignment(asg.id, currentUser.id);
          const isDone = Boolean(submission);

          return (
            <div
              key={asg.id}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-xs rounded-xl p-3.5 border border-white/15 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                    Đề số {asg.examId}
                  </span>
                  <span className="text-[11px] text-blue-200 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-blue-300" />
                    {asg.durationMinutes} phút
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {asg.title}
                </h4>

                <div className="text-[11px] text-blue-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-300" />
                  <span>Hạn nộp: {new Date(asg.deadline).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                {isDone ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã nộp: {submission.totalScore} / 10.0</span>
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Chưa hoàn thành</span>
                  </span>
                )}

                <button
                  onClick={() => onStartExam && onStartExam(asg.examId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDone
                      ? 'bg-white/20 hover:bg-white/30 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30'
                  }`}
                >
                  <span>{isDone ? 'Xem lại bài làm' : 'Vào làm bài ngay'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
