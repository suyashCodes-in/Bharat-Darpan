/**
 * guides.ts — Guide-related API functions.
 *
 * Key responsibility: transform the frontend's GuideFormData shape into the
 * exact JSON the backend DigiLocker /verify endpoint expects, so neither
 * the form component nor the backend service need to know about each other.
 */

import { apiFetch } from './api';
import type { GuideFormData } from '../types';
import type { UserProfile } from './auth';

// ── Response shapes ──────────────────────────────────────────────────────────

export interface GuideListResponse {
  items: UserProfile[];
  total: number;
  limit: number;
  skip: number;
}

export interface GuideRegistrationResponse {
  user: UserProfile;
  verification: {
    _id: string;
    status: 'verified' | 'rejected';
    documentType: string;
    verifiedAt?: string;
  };
}

// ── API calls ────────────────────────────────────────────────────────────────

/**
 * Fetch the list of DigiLocker-verified guides.
 * Optionally filter by city and/or language.
 */
export async function listGuides(
  city?: string,
  language?: string,
): Promise<GuideListResponse> {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (language) params.set('language', language);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<GuideListResponse>(`/api/digilocker/guides${qs}`, { public: true });
}

/**
 * Register the currently logged-in user as a guide via DigiLocker verification.
 * Transforms GuideFormData (flat strings from the React form) to the backend shape.
 *
 * Field mapping:
 *   aadhar        → documentId  (documentType is always 'aadhaar')
 *   location      → city
 *   languages     → languages[] (comma-split)
 *   experience    → experienceYears (number)
 *   expertise     → specialties[]  (single value wrapped in array)
 *   about         → bio
 */
export async function registerGuide(
  form: GuideFormData,
): Promise<GuideRegistrationResponse> {
  // Send the raw GuideFormData — the backend controller's normaliseFrontendPayload()
  // handles the transformation via the frontendGuideSchema adapter.
  return apiFetch<GuideRegistrationResponse>('/api/digilocker/verify', {
    method: 'POST',
    body: form,
  });
}
