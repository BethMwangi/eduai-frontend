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
export interface ApiQuestion {
  id: number;
  subject: {
    id: number;
    name: string;
    display_name: string;
    category: string;
    category_display: string;
    is_compulsory: boolean;
    is_active: boolean;
    grade_display: string;
    total_questions: number;
    total_students_enrolled: number;
  };
  grade: {
    id: number;
    name: string;
    level: string;
    display_name: string;
    level_display: string;
    minimum_age: number | null;
    maximum_age: number | null;
    is_active: boolean;
  };
  topic: string;
  question_type: string;
  question_text: string;
  options: Record<string, string>;
  correct_option: string;
  explanation: string;
  option_explanations?: Record<string, string>;
  difficulty: "easy" | "medium" | "hard";
  video_url: string | null;
  animation_asset_url: string | null;
  created_at: string;
  attempts_count?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SequenceResponse {
  count: number;
  index: number;
  has_next: boolean;
  has_prev: boolean;
  next_index: number | null;
  prev_index: number | null;
  progress: {
    current: number;
    total: number;
  };
  results: ApiQuestionDetail[];
  grade_info?: {
    id: number;
    name: string;
    display_name: string;
  };
  subject_info?: {
    id: number;
    name: string;
    display_name: string;
  };
}

export interface SubjectTopicsResponse {
  subject_info: {
    id: number;
    name: string;
    display_name: string;
  };
  topics: Array<{
    topic: string;
    description?: string;
    question_count: number;
    easy_count: number;
    medium_count: number;
    hard_count: number;
    student_progress?: {
      questions_attempted: number;
      questions_correct: number;
      accuracy_percentage: number;
      completion_percentage: number;
      last_accessed: string | null;
      can_continue: boolean;
    };
  }>;
}

export interface QuestionSequenceParams {
  index: number;
  subject_id?: number;
  difficulty?: "easy" | "medium" | "hard";
  grade_id?: number;
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
  current_position?: number;
  total_questions?: number;
}

export function mapJwtToUser(payload: JwtPayload): User | null {
  if (!payload.email || !payload.role) return null;
  const first_name = payload.first_name || "";
  const last_name = payload.last_name || "";
  const full_name =
    payload.full_name || `${first_name} ${last_name}`.trim() || undefined;

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
export interface PracticeSession {
  id: number;
  student: number;
  subject:
    | {
        id: number;
        name: string;
        display_name: string;
        grade?: {
          id: number;
          name: string;
          display_name: string;
        };
      }
    | string; // Can be either object or string
  topic: string;
  current_question_sequence: number;
  questions_pool: number[];
  questions_completed: number; // Add this property
  total_questions: number;
  score: number;
  current_score?: number; // Add this as optional
  difficulty: "Easy" | "Medium" | "Hard";
  status: "in-progress" | "completed";
  time_spent_seconds: number;
  time_spent?: number; // Alternative property name
  last_accessed: string;
  lastAccessed?: string; // Alternative property name
  started_at: string;
  progress_percentage?: number;
}

export interface PracticeSessionDetail extends PracticeSession {
  questions: Array<{
    id: number;
    question_text: string;
    options: string[];
    correct_answer: string;
    user_answer?: string;
    is_answered: boolean;
    explanation?: string;
  }>;
  current_question_index: number;
}

export interface CompletedPracticeSession {
  id: number;
  student: number;
  subject:
    | {
        id: number;
        name: string;
        display_name: string;
      }
    | string; // Can be either object or string
  topic: string;
  questions_completed: number;
  total_questions: number;
  score: number;
  current_score?: number;
  final_score?: number;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "completed";
  time_spent_seconds: number;
  time_spent?: number;
  started_at: string;
  completed_at: string;
  lastAccessed?: string;
}

export interface PaginatedPracticeSessions {
  count: number;
  next: string | null;
  previous: string | null;
  results: CompletedPracticeSession[];
}

export interface Grade {
  id: number;
  name: string;
  level: "junior" | "senior";
  display_name: string;
  level_display: string;
  minimum_age: number | null;
  maximum_age: number | null;
  is_active: boolean;
}

export interface GradeInfo {
  id: number;
  name: string;
  display_name: string;
}

export interface Level {
  level: "junior" | "senior";
  display_name: string;
}

export interface Subject {
  id: number;
  name: string;
  description?: string;
  grade_id?: number;
  display_name: string;
  category: string;
  category_display: string;
  is_compulsory: boolean;
  is_active: boolean;
  grade_display: string;
  total_questions: number;
  total_students_enrolled: number;
  created_at: string;
  updated_at: string;
}

export interface SubjectProgress {
  id: number;
  subject: {
    id: number;
    name: string;
    display_name: string;
  };
  total_questions_available: number;
  total_questions_attempted: number;
  total_questions_correct: number;
  accuracy_percentage: number;
  last_attempt_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TopicProgress {
  id: number;
  topic_name: string;
  topic: string;
  total_questions: number;
  questions_available: number;
  questions_attempted: number;
  questions_correct: number;
  accuracy_percentage: number;
  completion_percentage: number;
  difficulty?: string;
  last_activity: string | null;
  last_attempt_date?: string | null;
  last_practice_session: {
    id: number;
    topic: string;
    score: number;
    status: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface AllSubjectsProgressResponse {
  [subjectId: string]: {
    subject_progress: SubjectProgress;
    topic_progress: TopicProgress[];
  };
}

export interface SubjectProgressData {
  subject_id: number;
  subject_name: string;
  subject_display_name: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
  last_activity: string | null;
  progress_percentage?: number;
}

export interface QuestionPracticeProps {
  questionId: string;
}
export interface GradeQuestionsResponse {
  grade_info: GradeInfo;

  total_questions: number;
  questions: ApiQuestion[];
}
export interface IndividualQuestion {
  id: string;
  type: "question";
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  year: string;
  questionType: string;
  attempts: number;
  bestScore: number | null;
  lastAttempt: string | null;
  tags: string[];
  timeEstimate: string;
  points: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hints: string[];
  relatedTopics: string[];
}

export interface ExamPaper {
  id: number;
  type: "exam";
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  year: string;
  examType: string;
  questions: number;
  duration: string;
  attempts: number;
  maxScore: number;
  lastScore?: number;
  tags: string[];
  description: string;
  instructions: string[];
  syllabus?: string[];
  sampleQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}
