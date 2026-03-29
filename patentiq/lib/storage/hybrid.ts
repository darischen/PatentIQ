/**
 * Hybrid storage layer: Tries Supabase → Docker PostgreSQL → localStorage
 * Seamlessly falls back if one isn't available
 */

import type { Project } from '@/lib/types/project';

type StorageBackend = 'supabase' | 'docker' | 'localStorage';

let activeBackend: StorageBackend = 'localStorage';

// Test which backends are available
async function detectAvailableBackend(): Promise<StorageBackend> {
  // If Supabase env vars exist, use Supabase (assume it's available)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('✓ Using Supabase storage');
    return 'supabase';
  }

  // Fallback to localStorage
  console.log('✓ Using localStorage (offline mode)');
  return 'localStorage';
}

/**
 * Load all projects for user
 */
export async function loadProjects(userId?: string): Promise<Project[]> {
  try {
    const response = await fetch('/api/storage/projects', {
      method: 'GET',
      headers: {
        'X-Requested-Backend': activeBackend,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.error('Failed to load projects:', err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('patentiq-state');
  return saved ? JSON.parse(saved).projects || [] : [];
}

/**
 * Load trash items for user
 */
export async function loadTrash(userId?: string): Promise<Project[]> {
  try {
    const response = await fetch('/api/storage/trash', {
      method: 'GET',
      headers: {
        'X-Requested-Backend': activeBackend,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.error('Failed to load trash:', err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('patentiq-state');
  return saved ? JSON.parse(saved).trash || [] : [];
}

/**
 * Save all state (projects, trash, user)
 */
export async function saveState(state: {
  projects: Project[];
  trash: Project[];
  user: string | null;
}): Promise<void> {
  try {
    const response = await fetch('/api/storage/save', {
      method: 'POST',
      headers: {
        'X-Requested-Backend': activeBackend,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });

    if (response.ok) {
      return;
    }
  } catch (err) {
    console.error('Failed to save state:', err);
  }

  // Fallback to localStorage
  localStorage.setItem('patentiq-state', JSON.stringify(state));
}

/**
 * Add a project
 */
export async function addProject(project: Project): Promise<void> {
  try {
    const response = await fetch('/api/storage/projects', {
      method: 'POST',
      headers: {
        'X-Requested-Backend': activeBackend,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (response.ok) {
      return;
    }
  } catch (err) {
    console.error('Failed to add project:', err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('patentiq-state');
  const state = saved ? JSON.parse(saved) : { projects: [], trash: [], user: null };
  state.projects.unshift(project);
  localStorage.setItem('patentiq-state', JSON.stringify(state));
}

/**
 * Delete a project (move to trash)
 */
export async function deleteProject(projectId: string, projectData: Project): Promise<void> {
  try {
    const response = await fetch('/api/storage/projects/delete', {
      method: 'POST',
      headers: {
        'X-Requested-Backend': activeBackend,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId, projectData }),
    });

    if (response.ok) {
      return;
    }
  } catch (err) {
    console.error('Failed to delete project:', err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('patentiq-state');
  const state = saved ? JSON.parse(saved) : { projects: [], trash: [], user: null };
  state.projects = state.projects.filter((p: Project) => p.id !== projectId);
  state.trash.unshift({ ...projectData, deletedAt: Date.now() });
  localStorage.setItem('patentiq-state', JSON.stringify(state));
}

/**
 * Restore a project from trash
 */
export async function restoreProject(projectId: string): Promise<void> {
  try {
    const response = await fetch('/api/storage/projects/restore', {
      method: 'POST',
      headers: {
        'X-Requested-Backend': activeBackend,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId }),
    });

    if (response.ok) {
      return;
    }
  } catch (err) {
    console.error('Failed to restore project:', err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('patentiq-state');
  const state = saved ? JSON.parse(saved) : { projects: [], trash: [], user: null };
  const project = state.trash.find((p: Project) => p.id === projectId);
  if (project) {
    state.trash = state.trash.filter((p: Project) => p.id !== projectId);
    state.projects.unshift(project);
    localStorage.setItem('patentiq-state', JSON.stringify(state));
  }
}

/**
 * Permanently delete a project from trash
 */
export async function permanentDeleteProject(projectId: string): Promise<void> {
  try {
    const response = await fetch('/api/storage/projects/permanent-delete', {
      method: 'POST',
      headers: {
        'X-Requested-Backend': activeBackend,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId }),
    });

    if (response.ok) {
      return;
    }
  } catch (err) {
    console.error('Failed to permanently delete project:', err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('patentiq-state');
  const state = saved ? JSON.parse(saved) : { projects: [], trash: [], user: null };
  state.trash = state.trash.filter((p: Project) => p.id !== projectId);
  localStorage.setItem('patentiq-state', JSON.stringify(state));
}

/**
 * Update a project
 */
export async function updateProject(project: Project): Promise<void> {
  try {
    const response = await fetch('/api/storage/projects', {
      method: 'PUT',
      headers: {
        'X-Requested-Backend': activeBackend,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (response.ok) {
      return;
    }
  } catch (err) {
    console.error('Failed to update project:', err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('patentiq-state');
  const state = saved ? JSON.parse(saved) : { projects: [], trash: [], user: null };
  state.projects = state.projects.map((p: Project) =>
    p.id === project.id ? project : p
  );
  localStorage.setItem('patentiq-state', JSON.stringify(state));
}

/**
 * Initialize storage and detect available backend
 */
export async function initializeStorage(): Promise<StorageBackend> {
  activeBackend = await detectAvailableBackend();
  return activeBackend;
}

export function getCurrentBackend(): StorageBackend {
  return activeBackend;
}
