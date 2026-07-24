import { Tier, SavedPrompt, PromptFormState } from '../types';

const TIER_STORAGE_KEY = 'prompt_builder_tier';
const HISTORY_STORAGE_KEY = 'prompt_builder_history';
const GENERATIONS_STORAGE_KEY = 'prompt_builder_free_gens';

export const MAX_FREE_GENERATIONS = 5;

export function getFreeGenerationsCount(): number {
  try {
    const saved = localStorage.getItem(GENERATIONS_STORAGE_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load generation count:', err);
  }
  return 0;
}

export function incrementFreeGenerationsCount(): number {
  const current = getFreeGenerationsCount();
  const updated = current + 1;
  try {
    localStorage.setItem(GENERATIONS_STORAGE_KEY, updated.toString());
  } catch (err) {
    console.error('Failed to save generation count:', err);
  }
  return updated;
}


export function getStoredTier(): Tier {
  try {
    const saved = localStorage.getItem(TIER_STORAGE_KEY);
    if (saved === 'pro') return 'pro';
  } catch (err) {
    console.error('Failed to load tier status:', err);
  }
  return 'free';
}

export function saveTierStatus(tier: Tier): void {
  try {
    localStorage.setItem(TIER_STORAGE_KEY, tier);
  } catch (err) {
    console.error('Failed to save tier status:', err);
  }
}

export function activatePro(): { success: boolean; message: string } {
  saveTierStatus('pro');
  return { success: true, message: 'Pro unlocked successfully! All task categories and templates are now active.' };
}

export function getSavedPrompts(): SavedPrompt[] {
  try {
    const json = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load prompt history:', err);
  }
  return [];
}

export function savePromptToHistory(
  title: string,
  formState: PromptFormState,
  promptText: string
): SavedPrompt[] {
  const existing = getSavedPrompts();
  const newPrompt: SavedPrompt = {
    id: `prompt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim() || 'Untitled Prompt',
    taskTypeId: formState.taskTypeId,
    promptText,
    createdAt: Date.now(),
    isFavorite: false,
    formState: { ...formState }
  };

  const updated = [newPrompt, ...existing];
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save prompt to history:', err);
  }
  return updated;
}

export function toggleFavoritePrompt(id: string): SavedPrompt[] {
  const existing = getSavedPrompts();
  const updated = existing.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update favorite status:', err);
  }
  return updated;
}

export function deleteSavedPrompt(id: string): SavedPrompt[] {
  const existing = getSavedPrompts();
  const updated = existing.filter((p) => p.id !== id);
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete prompt:', err);
  }
  return updated;
}

export function clearPromptHistory(): SavedPrompt[] {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
  return [];
}
