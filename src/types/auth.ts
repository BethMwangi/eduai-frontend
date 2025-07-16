
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export type AuthUser = User;
export type AuthSession = Session;
export type AuthToken = JWT;


export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number | string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
}
export interface HeroSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
}

export interface UserComponentProps {
  user: {
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    role?: string;
    avatar?: string;
  };
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

export interface CustomUser {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  full_name?: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export type TokenResponse = {
  access: string;
  refresh?: string;
};
