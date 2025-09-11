// src/services/userService.ts
import { authFetch } from "@/lib/authFetch";
import type {
  Student,
  ApiQuestionDetail,
  PracticeSession,
  PracticeSessionDetail,
  Grade,
  Subject,
  Level,
  AllSubjectsProgressResponse,
  SubjectProgress,
  TopicProgress,
  QuestionSequenceParams,
  SequenceResponse,
  SubjectTopicsResponse,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";
import { unwrapApi } from "@/types/api";
import type { PaginatedPracticeSessions } from "@/types/auth";
import type { ExamLite, ExamDetail, ExamPaperTaking } from "@/types/exams";

async function fetchAndUnwrap<T>(
  path: string,
  getValidAccessToken: () => Promise<string | null>,
  opts: RequestInit = {}
): Promise<T> {
  const result = await authFetch<T | ApiResponse<T>>(
    path,
    opts,
    getValidAccessToken
  );
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
      const message =
        (data && (data.error || data.detail)) || "Registration failed";
      const err: Error & { data?: unknown } = new Error(message);
      err.data = data;
      throw err;
    }
    return data;
  },
  getProfile: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Student>("/users/profile/", getValidAccessToken),

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
    fetchAndUnwrap<Student>("/users/add-child/", getValidAccessToken, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getGrades: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Grade[]>("/academics/grades/", getValidAccessToken),

  getLevels: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Level[]>("/academics/levels/", getValidAccessToken),

  getGradesByLevel: (
    getValidAccessToken: () => Promise<string | null>,
    level: string
  ) =>
    fetchAndUnwrap<Grade[]>(
      `/academics/levels/${encodeURIComponent(level)}/grades/`,
      getValidAccessToken
    ),

  getChildren: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Student[]>("/users/my-children/", getValidAccessToken),

  getChildDetail: (
    getValidAccessToken: () => Promise<string | null>,
    childId: number
  ) =>
    fetchAndUnwrap<Student>(`/users/children/${childId}/`, getValidAccessToken),

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
      page_size?: number;
    }
  ) => {
    const params = new URLSearchParams();

    if (
      filters?.subject_id !== undefined &&
      !isNaN(filters.subject_id) &&
      filters.subject_id > 0
    ) {
      params.set("subject_id", String(filters.subject_id));
    }

    if (filters?.difficulty) {
      params.set("difficulty", filters.difficulty);
    }

    if (filters?.page !== undefined && filters.page > 0) {
      params.set("page", String(filters.page));
    }

    if (filters?.page_size !== undefined && filters.page_size > 0) {
      params.set("page_size", String(filters.page_size));
    }

    const query = params.toString() ? `?${params.toString()}` : "";

    return fetchAndUnwrap<unknown>(
      `/questions/questions/grade_questions/${query}`,
      getValidAccessToken
    );
  },

  getSubjectsList: (
    getValidAccessToken: () => Promise<string | null>,
    gradeId?: number
  ) => {
    const params = new URLSearchParams();
    if (gradeId) params.set("grade_id", String(gradeId));
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchAndUnwrap<Subject[]>(
      `/academics/subjects/${query}`,
      getValidAccessToken
    );
  },

  getQuestionSequence: (
    getValidAccessToken: () => Promise<string | null>,
    params: QuestionSequenceParams
  ) => {
    const queryParams = new URLSearchParams();
    queryParams.append("index", params.index.toString());
    if (params.subject_id)
      queryParams.append("subject_id", params.subject_id.toString());
    if (params.difficulty) queryParams.append("difficulty", params.difficulty);
    if (params.grade_id)
      queryParams.append("grade_id", params.grade_id.toString());

    const url = `/questions/questions/sequence/?${queryParams.toString()}`;
    return fetchAndUnwrap<SequenceResponse>(url, getValidAccessToken);
  },

  getQuestionById: (
    getValidAccessToken: () => Promise<string | null>,
    questionId: number
  ) =>
    fetchAndUnwrap<ApiQuestionDetail>(
      `/questions/questions/${questionId}/`,
      getValidAccessToken
    ),

  getSubjectTopics: (
    getValidAccessToken: () => Promise<string | null>,
    subjectId: number
  ) => {
    const url = `/questions/questions/topics/?subject_id=${subjectId}`;
    return fetchAndUnwrap<SubjectTopicsResponse>(url, getValidAccessToken);
  },
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

  getActivePracticeSessions: (
    getValidAccessToken: () => Promise<string | null>
  ) =>
    fetchAndUnwrap<PracticeSession[]>(
      "/questions/practice-sessions/active/",
      getValidAccessToken
    ),

  getPracticeSessionDetail: (
    getValidAccessToken: () => Promise<string | null>,
    sessionId: number
  ) =>
    fetchAndUnwrap<PracticeSessionDetail>(
      `/questions/practice-sessions/${sessionId}/`,
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
      `/questions/practice-sessions/${sessionId}/complete/`,
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
      `/questions/practice-sessions/completed/${query}`,
      getValidAccessToken
    );
  },

  // Grade and Subject APIs (if you need them)
  getGradesList: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Grade[]>("/grades/", getValidAccessToken),

  getGradeDetail: (
    getValidAccessToken: () => Promise<string | null>,
    gradeId: number
  ) => fetchAndUnwrap<Grade>(`/grades/${gradeId}/`, getValidAccessToken),

  getAlSubjectsList: (getValidAccessToken: () => Promise<string | null>) =>
    fetchAndUnwrap<Subject[]>("/subjects/", getValidAccessToken),

  getSubjectsByGrade: (
    getValidAccessToken: () => Promise<string | null>,
    gradeId: number
  ) =>
    fetchAndUnwrap<Subject[]>(
      `/grades/${gradeId}/subjects/`,
      getValidAccessToken
    ),

  getSubjectQuestions: (
    getValidAccessToken: () => Promise<string | null>,
    subjectId: number,
    page: number = 1
  ) => {
    const params = new URLSearchParams();
    params.set("subject_id", subjectId.toString());
    params.set("page", page.toString());
    params.set("page_size", "100");

    return fetchAndUnwrap<unknown>(
      `/questions/questions/grade_questions/?${params.toString()}`,
      getValidAccessToken
    );
  },

  getTopicQuestions: (
    getValidAccessToken: () => Promise<string | null>,
    params: {
      subject_id: number;
      topic: string;
      difficulty?: string;
      index?: number;
    }
  ) => {
    const queryParams = new URLSearchParams();
    queryParams.append("subject_id", params.subject_id.toString());
    queryParams.append("topic", params.topic);
    if (params.difficulty) queryParams.append("difficulty", params.difficulty);
    queryParams.append("index", (params.index || 1).toString());

    const url = `/questions/questions/sequence/?${queryParams.toString()}`;
    return fetchAndUnwrap<SequenceResponse>(url, getValidAccessToken);
  },

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
  getStudentStatsBySubject: (
    getValidAccessToken: () => Promise<string | null>
  ) =>
    fetchAndUnwrap<
      Array<{
        subject_id: number;
        subject_name: string;
        subject_display_name: string;
        total_attempts: number;
        correct_attempts: number;
        accuracy: number;
        last_activity: string | null;
      }>
    >("/questions/attempts/stats_by_subject/", getValidAccessToken),

  getExams: async (
    getValidAccessToken: () => Promise<string | null>,
    filters?: {
      level?: string;
      type?: string;
      year?: string | number;
      search?: string;
    }
  ) => {
    const params = new URLSearchParams();
    params.set("embed", "papers");

    if (filters?.level && filters.level !== "all")
      params.set("level", filters.level);
    if (filters?.type && filters.type !== "all")
      params.set("exam_type", filters.type);
    if (filters?.year && String(filters.year) !== "all")
      params.set("year", String(filters.year));
    if (filters?.search?.trim()) params.set("search", filters.search.trim());

    const q = params.toString() ? `?${params.toString()}` : "";
    const result = await fetchAndUnwrap<ExamLite[]>(
      `/exams/exams/${q}`,
      getValidAccessToken
    );
    return result;
  },

  getExamDetail: (
    getValidAccessToken: () => Promise<string | null>,
    examId: number
  ) => fetchAndUnwrap<ExamDetail>(`/exams/${examId}/`, getValidAccessToken),

  getPaperForTaking: (
    getValidAccessToken: () => Promise<string | null>,
    paperId: number
  ) =>
    fetchAndUnwrap<ExamPaperTaking>(
      `/exams/papers/${paperId}/taking/`,
      getValidAccessToken
    ),
};
