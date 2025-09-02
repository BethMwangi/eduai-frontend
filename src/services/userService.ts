// src/services/userService.ts
import { authFetch } from "@/lib/authFetch";
import type { Student, User , ApiQuestionDetail, PracticeSession, PracticeSessionDetail, Grade, Subject , Level , AllSubjectsProgressResponse, SubjectProgress, TopicProgress} from "@/types/auth";
import type { ApiResponse } from "@/types/api";
import { unwrapApi } from "@/types/api";
import type { PaginatedPracticeSessions } from "@/types/auth";


/**
 * Helper that fetches and unwraps potential ApiResponse<T> wrappers.
 */
async function fetchAndUnwrap<T>(
  path: string,
  getValidAccessToken: () => Promise<string | null>,
  opts: RequestInit = {}
): Promise<T> {
  const result = await authFetch<T | ApiResponse<T>>(path, opts, getValidAccessToken);
  return unwrapApi(result);
}

export const userService = {

   register: async (
    email: string,
    password: string,
    role: string,
    firstName?: string,
    lastName?: string
  ) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role,
        first_name: firstName, 
        last_name: lastName,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = (data && (data.error || data.detail)) || "Registration failed";
      const err: Error & { data?: unknown } = new Error(message);
      err.data = data;
      throw err;
    }
    return data; 
  },
  getProfile: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<User>("/users/profile/", getValidAccessToken),

  addChild: (
    getValidAccessToken: () => Promise<string | null>,
    payload: {
      first_name: string;
      last_name: string;
      date_of_birth: string;
      grade: number;
      school_name: string;
      county: string;
      password: string;
    }
  ) =>
    fetchAndUnwrap<Student>(
      "/users/add-child/",
      getValidAccessToken,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  getGrades: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Grade[]>("/academics/grades/", getValidAccessToken),

 getLevels: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Level[]>("/academics/levels/", getValidAccessToken),

  getGradesByLevel: (
    getValidAccessToken: () => Promise<string | null>,
    level: string
  ) =>
    fetchAndUnwrap<Grade[]>(`/academics/levels/${encodeURIComponent(level)}/grades/`, getValidAccessToken),

  getChildren: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Student[]>("/users/my-children/", getValidAccessToken),

  getChildDetail: (
    getValidAccessToken: () => Promise<string | null>,
    childId: number
  ) =>
    fetchAndUnwrap<Student>(
      `/users/children/${childId}/`,
      getValidAccessToken
    ),

  updateChild: (
    getValidAccessToken: () => Promise<string | null>,
    childId: number,
    payload: {
      first_name?: string;
      last_name?: string;
      date_of_birth?: string;
      grade?: number;
      school_name?: string;
      county?: string;
    }
  ) =>
    fetchAndUnwrap<Student>(
      `/users/children/${childId}/update/`,
      getValidAccessToken,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    ),

  getGradeQuestions: (
    getValidAccessToken: () => Promise<string | null>,
    filters?: {
      subject_id?: number;
      difficulty?: "easy" | "medium" | "hard";
      page?: number;
    }
  ) => {
    const params = new URLSearchParams();
    if (filters?.subject_id !== undefined)
      params.set("subject_id", String(filters.subject_id));
    if (filters?.difficulty) params.set("difficulty", filters.difficulty);
    if (filters?.page !== undefined)
      params.set("page", String(filters.page));
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchAndUnwrap<unknown>(
      `/questions/questions/grade_questions/${query}`,
      getValidAccessToken
    );
  },

getQuestionById: (
  getValidAccessToken: () => Promise<string | null>,
  questionId: number
) =>
  fetchAndUnwrap<ApiQuestionDetail>(
    `/questions/questions/${questionId}/`,
    getValidAccessToken
  ),
  recordQuestionAttempt: (
    getValidAccessToken: () => Promise<string | null>,
    data: {
      question_id: number;
      selected_option: string;
      confidence?: string;
      self_explanation?: string;
      asked_ai_help?: boolean;
    }
  ) =>
    fetchAndUnwrap<unknown>(
      "/questions/attempts/record_attempt/",
      getValidAccessToken,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),


getActivePracticeSessions: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<PracticeSession[]>(
      "/practice-sessions/active/",
      getValidAccessToken
    ),

  getPracticeSessionDetail: (
    getValidAccessToken: () => Promise<string | null>,
    sessionId: number
  ) =>
    fetchAndUnwrap<PracticeSessionDetail>(
      `/practice-sessions/${sessionId}/`,
      getValidAccessToken
    ),

  completePracticeSession: (
    getValidAccessToken: () => Promise<string | null>,
    sessionId: number,
    data: {
      final_score?: number;
      time_spent?: number;
      answers?: Array<{
        question_id: number;
        selected_option: string;
        is_correct: boolean;
        time_spent: number;
      }>;
    }
  ) =>
    fetchAndUnwrap<unknown>(
      `/practice-sessions/${sessionId}/complete/`,
      getValidAccessToken,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  getCompletedPracticeSessions: (
    getValidAccessToken: () => Promise<string | null>,
    page?: number
  ) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.set("page", String(page));
    const query = params.toString() ? `?${params.toString()}` : "";
    
    return fetchAndUnwrap<PaginatedPracticeSessions>(
      `/practice-sessions/completed/${query}`,
      getValidAccessToken
    );
  },

  // Grade and Subject APIs (if you need them)
  getGradesList: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Grade[]>("/grades/", getValidAccessToken),

  getGradeDetail: (
    getValidAccessToken: () => Promise<string | null>,
    gradeId: number
  ) =>
    fetchAndUnwrap<Grade>(`/grades/${gradeId}/`, getValidAccessToken),

  getSubjectsList: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Subject[]>("/subjects/", getValidAccessToken),

  getSubjectsByGrade: (
    getValidAccessToken: () => Promise<string | null>,
    gradeId: number
  ) =>
    fetchAndUnwrap<Subject[]>(
      `/grades/${gradeId}/subjects/`,
      getValidAccessToken
    ),
getSubjectProgress: (
    getValidAccessToken: () => Promise<string | null>,
    subjectId: number
  ) =>
    fetchAndUnwrap<{
      subject_progress: SubjectProgress;
      topic_progress: TopicProgress[];
    }>(`/questions/subjects/${subjectId}/progress/`, getValidAccessToken),

  // Get progress for all subjects
  getAllSubjectsProgress: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<AllSubjectsProgressResponse>(
      "/questions/progress/all-subjects/",
      getValidAccessToken
    ),
  // Get student question attempt stats by subject
  getStudentStatsBySubject: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Array<{
      subject_id: number;
      subject_name: string;
      subject_display_name: string;
      total_attempts: number;
      correct_attempts: number;
      accuracy: number;
      last_activity: string | null;
    }>>("/questions/attempts/stats_by_subject/", getValidAccessToken),

};
