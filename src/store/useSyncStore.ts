import { create } from 'zustand';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  pendingMutations: number;
  errorMessage: string | null;

  setStatus: (status: SyncStatus) => void;
  setPendingMutations: (count: number) => void;
  recordSyncSuccess: () => void;
  setSyncError: (error: string) => void;
  syncNow: (targetUid?: string) => Promise<boolean>;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'idle',
  lastSyncedAt: null,
  pendingMutations: 0,
  errorMessage: null,

  setStatus: (status) => set({ status }),
  setPendingMutations: (pendingMutations) => set({ pendingMutations }),
  recordSyncSuccess: () =>
    set({
      status: 'synced',
      lastSyncedAt: Date.now(),
      pendingMutations: 0,
      errorMessage: null,
    }),
  setSyncError: (errorMessage) => set({ status: 'error', errorMessage }),

  syncNow: async (targetUid?: string) => {
    try {
      // Dynamic import to break potential module cycle
      const { SyncQueueWorker } = await import('@/services/sync/SyncQueueWorker');
      const res = await SyncQueueWorker.processQueue(targetUid);
      return res.success;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sync execution failed';
      set({ status: 'error', errorMessage: msg });
      return false;
    }
  },
}));
