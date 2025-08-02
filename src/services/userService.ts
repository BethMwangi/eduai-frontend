// src/services/userService.ts
import { authFetch } from "@/lib/authFetch";
import type { Student, User } from "@/types/auth";
import type { ApiResponse } from "@/types/api";
import { unwrapApi } from "@/types/api";


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
    fetchAndUnwrap<unknown>("/academics/grades/", getValidAccessToken),

  getLevels: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<unknown>("/academics/levels/", getValidAccessToken),

  getGradesByLevel: (
    getValidAccessToken: () => Promise<string | null>,
    level: string
  ) =>
    fetchAndUnwrap<unknown>(
      `/academics/levels/${encodeURIComponent(level)}/grades/`,
      getValidAccessToken
    ),

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
    fetchAndUnwrap<unknown>(
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
};
