/**
 * places.ts — Places API functions.
 *
 * Bridges the rich backend Place model to the frontend's simpler Attraction shape
 * used by AttractionsSection. Also exposes getPlace() for the PlaceModal to show
 * live details (description, ratings, etc.).
 */

import { apiFetch } from './api';
import type { Attraction } from '../types';

// ── Backend Place shape (subset we care about) ───────────────────────────────

export interface BackendPlace {
  _id: string;
  name: string;
  slug: string;
  summary?: string;
  description: string;
  city?: string;
  state?: string;
  country?: string;
  category: string;
  specialties?: string[];
  famousFeatures?: string[];
  images: string[];
  coverImage?: string;
  entryFee: number;
  bestTimeToVisit?: string;
  timings?: string;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
}

interface PlaceListResponse {
  items: BackendPlace[];
  total: number;
}

// ── API calls ────────────────────────────────────────────────────────────────

export async function listPlaces(city?: string): Promise<BackendPlace[]> {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await apiFetch<PlaceListResponse>(`/api/places${qs}`, { public: true });
  return res.items;
}

export async function getPlace(
  idOrSlug: string,
): Promise<{ place: BackendPlace; reviews: unknown[] }> {
  return apiFetch<{ place: BackendPlace; reviews: unknown[] }>(
    `/api/places/${idOrSlug}`,
    { public: true },
  );
}

/**
 * Convert a BackendPlace to the simpler Attraction shape the frontend cards use.
 * Falls back to a placeholder image if the place has no images.
 */
export function placeToAttraction(place: BackendPlace): Attraction {
  return {
    name: place.name,
    img:
      place.coverImage ||
      place.images[0] ||
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
  };
}
