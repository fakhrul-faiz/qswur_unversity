export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface University {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Indicator {
  id: string;
  university_id: string;
  category: string;
  metric_name: string;
  value: number;
  calculated_score?: number;
  created_at: string;
}

export interface Profile {
  user_id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface TOCFormData {
  // Indicators
  academic_reputation: number;
  employer_reputation: number;
  faculty_student_ratio: number;
  citations_per_faculty: number;
  international_faculty: number;
  international_students: number;
  international_students_diversity: number;
  international_research_network: number;
  employment_outcomes: number;
  sustainability: number;
  
  // Classification
  size: string;
  focus: string;
  research: string;
  status: string;
  
  // Overall
  ranking: number;
  overall_score: number;
}

export interface FSRFormData {
  total_academic_staff: number;
  total_students: number;
}

export interface IFRFormData {
  international_staff: number;
  total_academic_staff: number;
}

export interface ISRFormData {
  international_students: number;
  total_students: number;
}

export interface CalculationResult {
  ratio: number;
  percentage: number;
  score: number;
}