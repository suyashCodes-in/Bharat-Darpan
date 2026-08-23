// ── Attraction / City Data ──────────────────────────────────────────
export interface Attraction {
  name: string;
  img: string;
}

export type CityKey =
  | 'delhi' | 'agra' | 'jaipur' | 'kashmir' | 'ladakh'
  | 'shimla' | 'dehradun' | 'manali' | 'varanasi' | 'chennai' | 'banglore';

// ── Landing Page SPA State ──────────────────────────────────────────
export type Step = 'city' | 'attractions' | 'services';

export type ModalId =
  | 'modal-guide'
  | 'modal-hotel'
  | 'modal-food'
  | 'modal-packages'
  | 'modal-register-guide'
  | 'modal-place';

export interface LandingState {
  step: Step;
  selectedCity: CityKey | null;
  selectedAttraction: string | null;
  activeModal: ModalId | null;
}

// ── Landing Page Reducer Actions ────────────────────────────────────
export type LandingAction =
  | { type: 'SELECT_CITY';       city: CityKey }
  | { type: 'SELECT_ATTRACTION'; name: string }
  | { type: 'OPEN_MODAL';        modal: ModalId }
  | { type: 'CLOSE_MODAL' }
  | { type: 'RESET' };

// ── Auth Forms ──────────────────────────────────────────────────────
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ── Guide Registration ──────────────────────────────────────────────
export interface GuideFormData {
  name: string;
  email: string;
  phone: string;
  aadhar: string;
  location: string;
  languages: string;
  experience: string;
  expertise: string;
  about: string;
}
