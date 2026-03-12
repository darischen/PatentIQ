
import React, { useState } from 'react';
import { Search, Zap, Bell } from 'lucide-react';
import LoginScreen from './components/LoginScreen';
import ProjectDashboard from './components/ProjectDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import StrategySandbox from './components/StrategySandbox';
import FeatureHeatmap from './components/FeatureHeatmap';
import PriorArtExplorer from './components/PriorArtExplorer';
import SimilarPatentsExplorer from './components/SimilarPatentsExplorer';
import ConfidenceBreakdown from './components/ConfidenceBreakdown';
import HistoryView from './components/HistoryView';
import HelpView from './components/HelpView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';
import FeaturesAnalyzed from './components/FeaturesAnalyzed';
import FeatureOverlap from './components/FeatureOverlap';
import CaptureScreen from './components/CaptureScreen';
import Sidebar from './components/Sidebar';
import { Screen, AnalysisResult, Project, ChatMessage } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Dashboard Download Page', date: '2 days ago' }
  ]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);

  const handleLogin = (username: string) => {
    setUser(username);
    setCurrentScreen('projects');
  };

  const handleAddProject = (name: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      date: 'Just now'
    };
    setProjects([newProject, ...projects]);
    setActiveProject(newProject);
    setAnalysisData(null);
    setCurrentScreen('welcome');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    if (project.analysisResult) {
      setAnalysisData(project.analysisResult);
    } else {
      setAnalysisData(null);
    }
    // Always navigate to the welcome screen so users can view/edit their chat history
    setCurrentScreen('welcome');
  };

  const handleStartAnalysis = (data: AnalysisResult, history: ChatMessage[]) => {
    setAnalysisData(data);
    
    // Persist to project "backend" state
    if (activeProject) {
      const updatedProject = { ...activeProject, analysisResult: data, chatHistory: history };
      setProjects(prev => prev.map(p => 
        p.id === activeProject.id ? updatedProject : p
      ));
      setActiveProject(updatedProject);
    }
    
    setCurrentScreen('dashboard');
  };

  const handleUpdateHistory = (history: ChatMessage[]) => {
    if (activeProject) {
      const updatedProject = { ...activeProject, chatHistory: history };
      setProjects(prev => prev.map(p => 
        p.id === activeProject.id ? updatedProject : p
      ));
      setActiveProject(updatedProject);
    }
  };

  const handleBackToProjects = () => {
    setCurrentScreen('projects');
  };

  const handleCapturedContent = (imageData: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Visual Scan ${new Date().toLocaleTimeString()}`,
      date: 'Just now',
      thumbnail: imageData
    };
    setProjects([newProject, ...projects]);
    setActiveProject(newProject);
    setCurrentScreen('welcome');
  };

  const isAnalysisScreen = ['dashboard', 'sandbox', 'heatmap', 'explorer', 'features', 'overlap', 'similar-patents', 'confidence', 'history', 'help', 'settings', 'profile'].includes(currentScreen);

  if (currentScreen === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (currentScreen === 'projects' && user) {
    return (
      <ProjectDashboard 
        username={user} 
        projects={projects} 
        onSelectProject={handleSelectProject}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === 'capture' && user) {
    return (
      <CaptureScreen 
        onNavigate={setCurrentScreen}
        onCapture={handleCapturedContent}
      />
    );
  }

  if (currentScreen === 'welcome') {
    return (
      <WelcomeScreen 
        projectName={activeProject?.name} 
        initialHistory={activeProject?.chatHistory}
        hasExistingAnalysis={!!activeProject?.analysisResult}
        onAnalyze={handleStartAnalysis} 
        onUpdateHistory={handleUpdateHistory}
        onGoBackToAnalysis={() => setCurrentScreen('dashboard')}
        onBack={handleBackToProjects}
        onNavigate={setCurrentScreen}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {isAnalysisScreen && (
          <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 flex-shrink-0">
            <div className="flex-1 max-w-xl relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="text-slate-400" size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search patents, ideas, or prior art..." 
                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-full pl-11 pr-6 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setActiveProject(null);
                  setCurrentScreen('welcome');
                }}
                className="flex items-center gap-2.5 bg-[#0f172a] hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-lg active:scale-95 group"
              >
                <Zap size={14} className="fill-white text-white group-hover:scale-110 transition-transform" />
                Analyze New Idea
              </button>

              <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
                <Bell size={18} />
              </button>

              <div 
                onClick={() => setCurrentScreen('profile')}
                className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all ml-1 relative group"
              >
                <img 
                  src="https://picsum.photos/seed/patent-pro-expert/100/100" 
                  alt="User Avatar" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                />
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
          {currentScreen === 'dashboard' && analysisData && (
            <Dashboard 
              data={analysisData} 
              onNavigate={setCurrentScreen} 
              projectChat={activeProject?.chatHistory} 
            />
          )}
          {currentScreen === 'sandbox' && analysisData && (
            <StrategySandbox data={analysisData} onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'heatmap' && analysisData && (
            <FeatureHeatmap data={analysisData} onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'explorer' && analysisData && (
            <PriorArtExplorer data={analysisData} onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'similar-patents' && analysisData && (
            <SimilarPatentsExplorer data={analysisData} onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'confidence' && analysisData && (
            <ConfidenceBreakdown data={analysisData} projectName={activeProject?.name} onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'history' && (
            <HistoryView onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'help' && (
            <HelpView onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'settings' && (
            <SettingsView onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'profile' && (
            <ProfileView onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'features' && analysisData && (
            <FeaturesAnalyzed data={analysisData} onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'overlap' && analysisData && (
            <FeatureOverlap data={analysisData} onNavigate={setCurrentScreen} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
