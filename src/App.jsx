import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeroBanner from './components/HeroBanner';
import CurriculumList from './components/CurriculumList';
import Part2DerivativeAnalysis from './components/parts/Part2DerivativeAnalysis';
import Part1Calculus from './components/parts/Part1Calculus';
import Part2Geometry from './components/parts/Part2Geometry';
import Part4Probability from './components/parts/Part4Probability';
import Footer from './components/Footer';
import DeploymentGuideModal from './components/DeploymentGuideModal';
import CasioGuideModal from './components/CasioGuideModal';
import ARViewerModal from './components/ARViewerModal';
import SpatialGeometryStudio from './components/SpatialGeometryStudio';
import RealWorldMathVDC from './components/RealWorldMathVDC';
import AIRagAssistant from './components/AIRagAssistant';
import ExamPracticeModule from './components/ExamPracticeModule';
import StudentManagement from './components/StudentManagement';
import TeacherAssignments from './components/TeacherAssignments';
import StudentAssignmentsNotice from './components/StudentAssignmentsNotice';
import TeacherProfileModal from './components/TeacherProfileModal';
import AdminCustomization from './components/AdminCustomization';
import LoginModal from './components/LoginModal';
import { Sparkles } from 'lucide-react';

class ModuleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || String(error) };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: '' });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl border border-rose-200 p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Đã xảy ra lỗi hiển thị mô-đun
          </h3>
          <p className="text-xs text-rose-700 font-mono bg-rose-50 p-3 rounded-lg border border-rose-200">
            {this.state.errorMessage}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
            className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
          >
            Tải lại mô-đun
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeModule, setActiveModule] = useState('curriculum');
  const [curriculumResetKey, setCurriculumResetKey] = useState(0);
  const [examSubTab, setExamSubTab] = useState('catalog');
  const [derivativeSubTab, setDerivativeSubTab] = useState('all');
  const [calculusSubTab, setCalculusSubTab] = useState('all');
  const [casioInitialPart, setCasioInitialPart] = useState('part1');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [adminCustomizationTab, setAdminCustomizationTab] = useState('branding');
  const [adminCustomizationOpenAddModal, setAdminCustomizationOpenAddModal] = useState(false);

  const handleOpenAdminCustomization = (tab = 'branding', openAddModal = false) => {
    setAdminCustomizationTab(tab);
    setAdminCustomizationOpenAddModal(openAddModal);
    setActiveModule('admin_customization');
  };
  const resolveQRModelId = (params) => {
    const m = params.get('m') || params.get('model');
    const shortMap = {
      '1': 'revolution_vase',
      '2': 'sphere_plane_cut',
      '3': 'vector_orthogonal',
      '4': 'cubic_surface'
    };
    return shortMap[m] || m || 'revolution_vase';
  };

  const [currentARModelId, setCurrentARModelId] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return resolveQRModelId(params);
    }
    return 'revolution_vase';
  });
  const [isStandaloneAR, setIsStandaloneAR] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('ar') === 'true' || params.get('ar') === '1' || params.has('m');
    }
    return false;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ar') === 'true' || params.get('ar') === '1' || params.has('m')) {
      setCurrentARModelId(resolveQRModelId(params));
      setIsStandaloneAR(true);
      setActiveModule('ar');
    }
  }, []);

  const handleSelectModule = (modId) => {
    setActiveModule(modId);
    if (modId === 'curriculum') {
      setCurriculumResetKey((k) => k + 1);
    }
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCasioTab = (partId = 'part1') => {
    const targetPart =
      typeof partId === 'string' && !['curriculum', 'casio', 'ar'].includes(partId)
        ? partId
        : 'part1';
    setCasioInitialPart(targetPart);
    setActiveModule('casio');
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDerivativeSubTab = (subId) => {
    setActiveModule('part1');
    setDerivativeSubTab(subId);
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectExamSubTab = (subId) => {
    setActiveModule('exam_practice');
    setExamSubTab(subId || 'catalog');
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCalculusSubTab = (subId) => {
    setActiveModule('part2');
    setCalculusSubTab(subId);
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchAR = (modelId = 'revolution_vase') => {
    const validId = typeof modelId === 'string' ? modelId : 'revolution_vase';
    setCurrentARModelId(validId);
    setActiveModule('ar');
    const contentElem = document.getElementById('module-content');
    if (contentElem) {
      contentElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isStandaloneAR) {
    return (
      <ARViewerModal
        initialModelId={currentARModelId}
        standalone={true}
        onExitStandalone={() => {
          setIsStandaloneAR(false);
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900 flex selection:bg-slate-900 selection:text-white">
      <Sidebar
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        examSubTab={examSubTab}
        onSelectExamSubTab={handleSelectExamSubTab}
        calculusSubTab={calculusSubTab}
        onSelectCalculusSubTab={handleSelectCalculusSubTab}
        derivativeSubTab={derivativeSubTab}
        onSelectDerivativeSubTab={handleSelectDerivativeSubTab}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenCasioModal={() => handleOpenCasioTab(activeModule)}
        onOpenAR={() =>
          handleLaunchAR(
            activeModule === 'part3'
              ? 'sphere_plane_cut'
              : activeModule === 'part4'
              ? 'vector_orthogonal'
              : activeModule === 'part1'
              ? 'cubic_surface'
              : 'revolution_vase'
          )
        }
      />

      <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64 pt-14 md:pt-0">
        <main
          className={`flex-1 w-full mx-auto ${
            activeModule === 'geometry_studio' ||
            activeModule === 'exam_practice' ||
            activeModule === 'curriculum'
              ? 'max-w-full px-2 sm:px-4 py-2 sm:py-3'
              : 'max-w-6xl px-4 sm:px-6 py-5 sm:py-6'
          }`}
        >
          {![
            'curriculum',
            'ai_rag',
            'exam_practice',
            'casio',
            'ar',
            'geometry_studio',
            'real_world_vdc',
            'part1',
            'part2'
          ].includes(activeModule) && (
            <HeroBanner
              onSelectModule={handleSelectModule}
              onOpenCasioModal={() => handleOpenCasioTab(activeModule)}
              onOpenAR={() => handleLaunchAR('revolution_vase')}
            />
          )}

          <StudentAssignmentsNotice
            onStartExam={() => {
              setActiveModule('exam_practice');
              setExamSubTab('exam_room');
            }}
          />

          <section id="module-content" className="scroll-mt-16">
            <ModuleErrorBoundary resetKey={`${activeModule}-${derivativeSubTab}-${calculusSubTab}`}>
            {activeModule === 'curriculum' && (
              <CurriculumList
                resetTrigger={curriculumResetKey}
                onSelectModule={handleSelectModule}
                onSelectCalculusSubTab={handleSelectCalculusSubTab}
                onSelectDerivativeSubTab={handleSelectDerivativeSubTab}
                onOpenCasioModal={() => handleOpenCasioTab('part1')}
                onOpenAR={handleLaunchAR}
              />
            )}
            {activeModule === 'ai_rag' && (
              <AIRagAssistant
                onSelectModule={handleSelectModule}
                onSelectDerivativeSubTab={handleSelectDerivativeSubTab}
                onSelectCalculusSubTab={handleSelectCalculusSubTab}
                onOpenCasioModal={() => handleOpenCasioTab(activeModule)}
              />
            )}
            {activeModule === 'exam_practice' && (
              <ExamPracticeModule
                activeSubTab={examSubTab}
                onSelectSubTab={setExamSubTab}
                onOpenCasioModal={() => handleOpenCasioTab('part1')}
                onSelectAIRag={() => handleSelectModule('ai_rag')}
                onOpenAdminCustomization={(tab, openModal) => handleOpenAdminCustomization(tab || 'exams', openModal)}
              />
            )}
            {activeModule === 'real_world_vdc' && (
              <RealWorldMathVDC onOpenCasioModal={() => handleOpenCasioTab('part1')} />
            )}
            {activeModule === 'geometry_studio' && (
              <SpatialGeometryStudio
                onSelectModule={handleSelectModule}
                onSelectDerivativeSubTab={handleSelectDerivativeSubTab}
                onSelectCalculusSubTab={handleSelectCalculusSubTab}
                onOpenCasioModal={() => handleOpenCasioTab('part3')}
                onOpenAR={() => handleLaunchAR('sphere_plane_cut')}
              />
            )}
            {activeModule === 'casio' && <CasioGuideModal initialPart={casioInitialPart} />}
            {activeModule === 'ar' && <ARViewerModal initialModelId={currentARModelId} />}
            {activeModule === 'part1' && (
              <Part2DerivativeAnalysis
                activeSubTab={derivativeSubTab}
                onSelectSubTab={setDerivativeSubTab}
                onOpenCasioModal={() => handleOpenCasioTab('part1')}
                onOpenAR={() => handleLaunchAR('cubic_surface')}
              />
            )}
            {activeModule === 'part2' && (
              <Part1Calculus
                activeSubTab={calculusSubTab}
                onSelectSubTab={setCalculusSubTab}
                onOpenCasioModal={() => handleOpenCasioTab('part2')}
                onOpenAR={() => handleLaunchAR('revolution_vase')}
              />
            )}
            {activeModule === 'part3' && (
              <Part2Geometry
                onOpenCasioModal={() => handleOpenCasioTab('part3')}
                onOpenAR={() => handleLaunchAR('sphere_plane_cut')}
              />
            )}
            {activeModule === 'part4' && (
              <Part4Probability
                onOpenCasioModal={() => handleOpenCasioTab('part4')}
                onOpenAR={() => handleLaunchAR('vector_orthogonal')}
              />
            )}
            {activeModule === 'student_management' && <StudentManagement />}
            {activeModule === 'teacher_assignments' && <TeacherAssignments />}
            {activeModule === 'admin_customization' && (
              <AdminCustomization
                initialTab={adminCustomizationTab}
                openAddExamImmediately={adminCustomizationOpenAddModal}
              />
            )}
            </ModuleErrorBoundary>
          </section>
        </main>

        <Footer onOpenDeployModal={() => setIsDeployModalOpen(true)} />
      </div>

      <DeploymentGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      <LoginModal />

      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {activeModule !== 'ai_rag' && (
        <button
          onClick={() => handleSelectModule('ai_rag')}
          className="fixed bottom-5 right-5 z-40 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-lg border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Hỏi Trợ lý AI RAG</span>
        </button>
      )}
    </div>
  );
}
