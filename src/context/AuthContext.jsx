import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GUEST_USER,
  DEFAULT_TEACHER,
  getStoredTeacher,
  saveTeacher,
  getStoredStudents
} from '../services/studentDatabase';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'mathmate_active_user_session';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role && parsed.role !== 'guest') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Lỗi nạp phiên đăng nhập:', e);
    }
    // Mặc định ban đầu luôn là Khách viếng thăm
    return GUEST_USER;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginNotice, setLoginNotice] = useState('');

  // Lưu phiên đăng nhập vào sessionStorage
  useEffect(() => {
    try {
      if (currentUser && currentUser.role !== 'guest') {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Lỗi lưu phiên đăng nhập:', e);
    }
  }, [currentUser]);

  // Đăng nhập bằng tài khoản & mật khẩu
  const login = (username, password) => {
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    // 1. Kiểm tra tài khoản Giáo viên
    const teacher = getStoredTeacher();
    if (teacher.username.toLowerCase() === cleanUser && teacher.password === cleanPass) {
      const sessionUser = {
        id: teacher.id,
        username: teacher.username,
        name: teacher.name,
        role: 'teacher',
        class: 'Ban Giảng Dạy',
        avatar: teacher.avatar || '👨‍🏫',
        subject: teacher.subject
      };
      setCurrentUser(sessionUser);
      setIsLoginModalOpen(false);
      setLoginNotice('');
      return { success: true, user: sessionUser };
    }

    // 2. Kiểm tra tài khoản Học sinh trong DB
    const students = getStoredStudents();
    const matchedStudent = students.find(
      (s) => s.username.toLowerCase() === cleanUser && String(s.password).trim() === cleanPass
    );

    if (matchedStudent) {
      const sessionUser = {
        id: matchedStudent.id,
        username: matchedStudent.username,
        name: matchedStudent.name,
        role: 'student',
        class: matchedStudent.class,
        gender: matchedStudent.gender,
        avatar: matchedStudent.gender === 'Nữ' ? '👩‍🎓' : '👨‍🎓'
      };
      setCurrentUser(sessionUser);
      setIsLoginModalOpen(false);
      setLoginNotice('');
      return { success: true, user: sessionUser };
    }

    return {
      success: false,
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác! (Mật khẩu mặc định là 123)'
    };
  };

  // Đăng nhập nhanh 1-Click (Tiện ích đặc biệt cho Ban Giám Khảo & Giáo viên chấm thi)
  const quickLogin = (roleType, studentId = null) => {
    if (roleType === 'teacher') {
      const teacher = getStoredTeacher();
      const user = {
        id: teacher.id,
        username: teacher.username,
        name: teacher.name,
        role: 'teacher',
        class: 'Ban Giảng Dạy',
        avatar: '👨‍🏫',
        subject: teacher.subject
      };
      setCurrentUser(user);
    } else if (roleType === 'student') {
      const students = getStoredStudents();
      const st = studentId
        ? students.find((s) => s.id === studentId || s.username === studentId)
        : students[0];

      if (st) {
        const user = {
          id: st.id,
          username: st.username,
          name: st.name,
          role: 'student',
          class: st.class,
          gender: st.gender,
          avatar: st.gender === 'Nữ' ? '👩‍🎓' : '👨‍🎓'
        };
        setCurrentUser(user);
      }
    } else {
      // Khách
      setCurrentUser(GUEST_USER);
    }
    setIsLoginModalOpen(false);
    setLoginNotice('');
  };

  const logout = () => {
    setCurrentUser(GUEST_USER);
  };

  const promptLoginForFeature = (featureDescription) => {
    setLoginNotice(
      featureDescription ||
        'Tính năng này yêu cầu đăng nhập tài khoản Học sinh hoặc Giáo viên để sử dụng đầy đủ.'
    );
    setIsLoginModalOpen(true);
  };

  const updateTeacherProfile = (updatedProfile) => {
    saveTeacher(updatedProfile);
    if (currentUser?.role === 'teacher') {
      setCurrentUser((prev) => ({
        ...prev,
        username: updatedProfile.username,
        name: updatedProfile.name,
        subject: updatedProfile.subject,
        school: updatedProfile.school
      }));
    }
  };

  const isGuest = !currentUser || currentUser.role === 'guest';
  const isStudent = currentUser?.role === 'student';
  const isTeacher = currentUser?.role === 'teacher';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isGuest,
        isStudent,
        isTeacher,
        login,
        quickLogin,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginNotice,
        setLoginNotice,
        promptLoginForFeature,
        updateTeacherProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
