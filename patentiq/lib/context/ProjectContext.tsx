'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, AnalysisResult, ChatMessage } from '@/lib/types/project';

interface ProjectContextType {
  projects: Project[];
  trash: Project[];
  activeProject: Project | null;
  analysisData: AnalysisResult | null;
  user: string | null;
  setUser: (user: string | null) => void;
  addProject: (name: string) => Project;
  deleteProject: (id: string) => void;
  restoreProject: (id: string) => void;
  permanentDeleteProject: (id: string) => void;
  selectProject: (project: Project) => void;
  setAnalysisData: (data: AnalysisResult | null) => void;
  updateProjectAnalysis: (data: AnalysisResult, history: ChatMessage[]) => void;
  updateChatHistory: (history: ChatMessage[]) => void;
  renameProject: (id: string, name: string) => void;
  logout: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [trash, setTrash] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [analysisData, setAnalysisDataState] = useState<AnalysisResult | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('patentiq-state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.projects) setProjects(state.projects);
        if (state.trash) setTrash(state.trash);
        if (state.user) setUser(state.user);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('patentiq-state', JSON.stringify({ projects, trash, user }));
    } catch {}
  }, [projects, trash, user, loaded]);

  const addProject = useCallback((name: string): Project => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      createdAt: Date.now()
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProject(newProject);
    setAnalysisDataState(null);
    return newProject;
  }, []);

  const deleteProject = useCallback((id: string) => {
    const projectToDelete = projects.find(p => p.id === id);
    if (projectToDelete) {
      const deletedProject = { ...projectToDelete, deletedAt: Date.now() };
      setTrash(t => [deletedProject, ...t]);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  }, [projects]);

  const restoreProject = useCallback((id: string) => {
    setTrash(prev => {
      const project = prev.find(p => p.id === id);
      if (project) {
        setProjects(ps => [project, ...ps]);
      }
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const permanentDeleteProject = useCallback((id: string) => {
    setTrash(prev => prev.filter(p => p.id !== id));
  }, []);

  const selectProject = useCallback((project: Project) => {
    setActiveProject(project);
    setAnalysisDataState(project.analysisResult || null);
  }, []);

  const setAnalysisData = useCallback((data: AnalysisResult | null) => {
    setAnalysisDataState(data);
  }, []);

  const updateProjectAnalysis = useCallback((data: AnalysisResult, history: ChatMessage[]) => {
    setAnalysisDataState(data);
    setActiveProject(prev => {
      if (!prev) return prev;
      const updated = { ...prev, analysisResult: data, chatHistory: history };
      setProjects(ps => ps.map(p => p.id === prev.id ? updated : p));
      return updated;
    });
  }, []);

  const updateChatHistory = useCallback((history: ChatMessage[]) => {
    setActiveProject(prev => {
      if (!prev) return prev;
      return { ...prev, chatHistory: history };
    });
  }, []);

  // Sync active project chat history to projects list
  useEffect(() => {
    if (activeProject) {
      setProjects(ps => ps.map(p =>
        p.id === activeProject.id ? { ...p, chatHistory: activeProject.chatHistory } : p
      ));
    }
  }, [activeProject?.chatHistory]);

  const renameProject = useCallback((id: string, name: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p));
    setActiveProject(prev => prev && prev.id === id ? { ...prev, name } : prev);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveProject(null);
    setAnalysisDataState(null);
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects, trash, activeProject, analysisData, user,
      setUser, addProject, deleteProject, restoreProject, permanentDeleteProject,
      selectProject, setAnalysisData, updateProjectAnalysis, updateChatHistory,
      renameProject, logout
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
}
