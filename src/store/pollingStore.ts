import { create } from 'zustand';

type PendingLabelProject = {
    dataset: {
        id: string;
    };
    [key: string]: unknown;
};

type PollingStore = {
    pendingLabelProjects: PendingLabelProject[];
    addPending: (item: PendingLabelProject) => void;
    removePending: (datasetId: string) => void;
    setPending: (queue: PendingLabelProject[]) => void;
};

export const usePollingStore = create<PollingStore>((set) => ({
    pendingLabelProjects: [],
    addPending: (item) => set(state => ({
        pendingLabelProjects: [...state.pendingLabelProjects, item]
    })),
    removePending: (datasetId) => set(state => ({
        pendingLabelProjects: state.pendingLabelProjects.filter(p => p.dataset.id !== datasetId)
    })),
    setPending: (queue) => set({ pendingLabelProjects: queue }),
})); 
