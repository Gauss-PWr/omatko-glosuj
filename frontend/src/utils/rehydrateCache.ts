import { postersApi } from '@/services/posters';
import type { AppDispatch } from '@/store';

const API_CACHE = 'api-cache-v1';

export async function rehydratePostersCache(dispatch: AppDispatch) {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const base = import.meta.env.VITE_APP_API_BASE_URL + '/posters';
    const cache = await caches.open(API_CACHE);
    const req = new Request(base);
    const resp = await cache.match(req);
    if (!resp) return;
    const data = await resp.json();
    // Seed RTK Query cache for getPosters
    dispatch(
      postersApi.util.updateQueryData('getPosters', undefined, () => {
        return data;
      })
    );
  } catch {
    // swallow errors (offline or unsupported)
    return;
  }
}
