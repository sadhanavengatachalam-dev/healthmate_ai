
export interface PatientData {
  patientName: string;
  age: string;
  gender: string;
  language: string;
  location: string; // State/District for food
  prescriptionImage: string; // Base64 string of the uploaded image
  reportImage?: string; // Base64 string of the uploaded report (optional)
}

export interface AnimationScene {
  scene: number;
  visual: string;
  voiceover: string;
}

export interface Medication {
  name: string;
  dosage: string;
  timing: string;
  schedule_time: string; // HH:MM 24-hour format for alarms
  purpose: string;
}

export type MedStatus = 'PENDING' | 'TAKEN' | 'SNOOZED' | 'SKIPPED';

export interface MedicationLog {
  medIndex: number;
  status: MedStatus;
  timestamp: string;
  nextReminder?: string;
  snoozeTimestamp?: number; // Epoch time for snoozed alarm
  escalationLevel: number; // 0=None, 1=Soft, 2=Loud, 3=Caregiver
  note?: string; // Reason for skipping
}

export interface SymptomCheck {
  symptom: string;
  severity: 'NORMAL' | 'MODERATE' | 'EMERGENCY';
  action: string; // e.g. "Rest and drink water" or "Call 108 immediately"
}

export interface DetailedAnalysis {
  what_is_it: string;
  why_it_happened: string;
  body_part_affected: string;
  how_treatment_helps: string;
}

export interface AIResponse {
  condition: string;
  education_text: string;
  detailed_analysis?: DetailedAnalysis; // Structured explanation
  tts_script: string;
  animation_script: {
    scenes: AnimationScene[];
  };
  regional_food_list: string[];
  warnings: string[]; // Kept for backward compatibility, mapped to Red Zone
  red_zone_alerts: string[]; // Critical emergency alerts
  symptom_checker: SymptomCheck[]; // Smart check list
  sources: string[]; // Verified medical sources (WHO, Mayo, etc.)
  dos: string[];
  donts: string[];
  medications: Medication[];
  medication_tips: string[]; // General safety tips for the meds
  recommended_activities: string[];
  lifestyle_advice: string[]; // NEW: Specific lifestyle recommendations (Sleep, Stress, etc.)
  doctor_summary_used: string;
}

export enum AppView {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  DOCTOR_FORM = 'DOCTOR_FORM',
  LOADING = 'LOADING',
  DASHBOARD = 'DASHBOARD',
  REPORT = 'REPORT',
  LIFESTYLE = 'LIFESTYLE'
}
