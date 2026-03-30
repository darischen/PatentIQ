'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, AnalysisResult, ChatMessage } from '@/lib/types/project';
import * as storage from '@/lib/storage/hybrid';

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
  updateProjectAnalysis: (data: AnalysisResult, history: ChatMessage[], updatedAt?: string) => void;
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

  // Initialize hybrid storage and load data
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize hybrid storage (detects Supabase → Docker → localStorage)
        await storage.initializeStorage();

        // Load projects and trash from hybrid storage
        const savedProjects = await storage.loadProjects();
        const savedTrash = await storage.loadTrash();

        setProjects(savedProjects);
        setTrash(savedTrash);

        // Load user from localStorage (Auth0 manages this)
        const saved = localStorage.getItem('patentiq-state');
        if (saved) {
          const state = JSON.parse(saved);
          if (state.user) setUser(state.user);
        }
      } catch (err) {
        console.error('Failed to initialize storage:', err);
      }
      setLoaded(true);
    };

    initialize();
  }, []);

  // Save to hybrid storage on change (tries Supabase → Docker → localStorage)
  useEffect(() => {
    if (!loaded) return;
    storage.saveState({ projects, trash, user });
  }, [projects, trash, user, loaded]);

  const addProject = useCallback((name: string): Project => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      createdAt: Date.now()
    };
    setProjects(prev => [newProject, ...prev]);
    storage.addProject(newProject);
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
      storage.deleteProject(id, projectToDelete);
    }
  }, [projects]);

  const restoreProject = useCallback((id: string) => {
    setTrash(prev => {
      const project = prev.find(p => p.id === id);
      if (project) {
        setProjects(ps => [project, ...ps]);
        storage.restoreProject(id);
      }
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const permanentDeleteProject = useCallback((id: string) => {
    setTrash(prev => {
      const filtered = prev.filter(p => p.id !== id);
      storage.permanentDeleteProject(id);
      return filtered;
    });
  }, []);

  const selectProject = useCallback((project: Project) => {
    setActiveProject(project);
    setAnalysisDataState(project.analysisResult || null);
  }, []);

  const setAnalysisData = useCallback((data: AnalysisResult | null) => {
    setAnalysisDataState(data);
  }, []);

  const updateProjectAnalysis = useCallback((data: AnalysisResult, history: ChatMessage[], updatedAt?: string) => {
    setAnalysisDataState(data);
    setActiveProject(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        analysisResult: data,
        chatHistory: history,
        // Update timestamp if provided from API response
        ...(updatedAt && { updatedAt: new Date(updatedAt).getTime() })
      };
      setProjects(ps => ps.map(p => p.id === prev.id ? updated : p));
      storage.updateProject(updated);
      return updated;
    });
  }, []);

  const updateChatHistory = useCallback((history: ChatMessage[]) => {
    setActiveProject(prev => {
      if (!prev) return prev;
      const updated = { ...prev, chatHistory: history };
      storage.updateProject(updated);
      return updated;
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
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, name } : p);
      const project = updated.find(p => p.id === id);
      if (project) {
        storage.updateProject(project);
      }
      return updated;
    });
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
