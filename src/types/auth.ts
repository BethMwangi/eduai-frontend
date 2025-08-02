// src/types/auth.ts
export type UserRole = "student" | "parent" | "teacher";

export interface User {
  id: string | number;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar?: string; // optional, for future profile pictures
}

/** Payload inside the JWT. */
export interface JwtPayload {
  exp?: number;
  iat?: number;
  user_id?: string | number;
  email?: string;
  role?: UserRole;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

/** Options used to register a user. */
export interface RegisterOptions {
  email: string;
  password: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
}

export type Student = {
  id: number;
  full_name: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age: number;
  grade: number;
  grade_name: string;
  school_name: string;
  county: string;
  current_streak_days: number;
  longest_streak_days: number;
  last_activity_date: string | null;
  parent_name: string;
  grade_level: string;
  total_subjects: number;
  overall_average_score: number;
  total_questions_attempted: number;
  total_correct_answers: number;
};
/** Response from login endpoint. */
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterOptions {
  email: string;
  password: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
}

/** Request bodies for auth endpoints (frontend-side). */
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}
/** Contract for the auth context. */
export interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (opts: RegisterOptions) => Promise<void>;
  logout: () => Promise<void>;
  getValidAccessToken: () => Promise<string | null>;
}

export interface UserComponentProps {
  user: User;
}

export interface ApiQuestionDetail {
  id: number;
  question_text: string;
  question_type: string; 
  options: Record<string, string>;
  difficulty: "easy" | "medium" | "hard";
  subject: {
    id: number;
    name: string;
    display_name: string;
  };
  grade: {
    id: number;
    name: string;
    display_name: string;
  };
  correct_answer_index?: number;
  explanation?: string;
  detailed_explanation?: string;
  tips?: string[];
  related_concepts?: string[];
  estimated_time?: string;
  points?: number;
  attempts_count?: number;
  tags?: string[];
}



export function mapJwtToUser(payload: JwtPayload): User | null {
  if (!payload.email || !payload.role) return null;
  const first_name = payload.first_name || "";
  const last_name = payload.last_name || "";
  const full_name = payload.full_name || `${first_name} ${last_name}`.trim() || undefined;

  return {
    id: payload.user_id ?? "",
    email: payload.email,
    role: payload.role,
    first_name,
    last_name,
    full_name,
  };
}

/** Basic runtime type guard for User-like objects. */
export function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (typeof obj.id === "string" || typeof obj.id === "number") &&
    typeof obj.email === "string" &&
    typeof obj.role === "string" &&
    typeof obj.first_name === "string" &&
    typeof obj.last_name === "string"
  );
}


