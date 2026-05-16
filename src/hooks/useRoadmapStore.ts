import { create } from 'zustand';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  tool_required: string | null;
  tool_filled?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Phase {
  phase_number: number;
  name: string;
  tagline?: string;
  status: 'locked' | 'active' | 'completed';
  duration_label?: string;
  checklist_progress?: { done: number; total: number };
  completed_at?: string | null;
  checklist_items?: ChecklistItem[];
  tasks?: TaskItem[];
  gate_met?: boolean;
  gate_requirement?: string;
}

export interface RoadmapStore {
  phases: Phase[];
  currentPhase: number;
  overallProgress: number;
  isGateModalOpen: boolean;
  pendingUnlockPhase: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setRoadmapData: (data: { current_phase: number; overall_progress_pct: number; phases: Phase[] }) => void;
  setPhaseDetail: (phaseId: number, detail: Phase) => void;
  toggleChecklistItem: (phaseId: number, itemId: string, completed: boolean) => Promise<boolean>;
  toggleTask: (phaseId: number, taskId: string, completed: boolean) => Promise<boolean>;
  completePhase: (phaseId: number) => Promise<boolean>;
  closeGateModal: () => void;
  setLoading: (loading: boolean) => void;
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  phases: [],
  currentPhase: 1,
  overallProgress: 0,
  isGateModalOpen: false,
  pendingUnlockPhase: null,
  isLoading: true,
  error: null,

  setRoadmapData: (data) => set({
    currentPhase: data.current_phase,
    overallProgress: data.overall_progress_pct,
    phases: data.phases,
    isLoading: false,
    error: null
  }),

  setPhaseDetail: (phaseId, detail) => set((state) => {
    const newPhases = [...state.phases];
    const index = newPhases.findIndex(p => p.phase_number === phaseId);
    if (index !== -1) {
      newPhases[index] = { ...newPhases[index], ...detail };
    } else {
      newPhases.push(detail);
    }
    return { phases: newPhases };
  }),

  toggleChecklistItem: async (phaseId, itemId, completed) => {
    try {
      const res = await fetch(`/api/roadmap/phase/${phaseId}/checklist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, completed })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update checklist");
      }

      // Optimistic update
      set((state) => {
        const newPhases = [...state.phases];
        const pIndex = newPhases.findIndex(p => p.phase_number === phaseId);
        if (pIndex > -1 && newPhases[pIndex].checklist_items) {
          const cIndex = newPhases[pIndex].checklist_items!.findIndex(c => c.id === itemId);
          if (cIndex > -1) {
            newPhases[pIndex].checklist_items![cIndex].completed = completed;
          }
          newPhases[pIndex].gate_met = data.gate_met;
        }
        return { phases: newPhases };
      });

      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  },

  toggleTask: async (phaseId, taskId, completed) => {
    try {
      const res = await fetch(`/api/roadmap/phase/${phaseId}/task`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, completed })
      });

      if (!res.ok) throw new Error("Failed to update task");

      // Optimistic update
      set((state) => {
        const newPhases = [...state.phases];
        const pIndex = newPhases.findIndex(p => p.phase_number === phaseId);
        if (pIndex > -1 && newPhases[pIndex].tasks) {
          const tIndex = newPhases[pIndex].tasks!.findIndex(t => t.id === taskId);
          if (tIndex > -1) {
            newPhases[pIndex].tasks![tIndex].completed = completed;
          }
        }
        return { phases: newPhases };
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  completePhase: async (phaseId) => {
    try {
      const res = await fetch(`/api/roadmap/phase/${phaseId}/complete`, {
        method: 'POST'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to complete phase");

      // Set modal state
      set((state) => {
        const newPhases = [...state.phases];
        
        // Mark current as completed
        const currIndex = newPhases.findIndex(p => p.phase_number === phaseId);
        if (currIndex > -1) newPhases[currIndex].status = 'completed';
        
        // Mark next as active
        const nextIndex = newPhases.findIndex(p => p.phase_number === data.next_phase_unlocked);
        if (nextIndex > -1) newPhases[nextIndex].status = 'active';

        return {
          phases: newPhases,
          currentPhase: data.next_phase_unlocked,
          isGateModalOpen: true,
          pendingUnlockPhase: data.next_phase_unlocked
        };
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  closeGateModal: () => set({ isGateModalOpen: false, pendingUnlockPhase: null }),
  setLoading: (loading) => set({ isLoading: loading })
}));
