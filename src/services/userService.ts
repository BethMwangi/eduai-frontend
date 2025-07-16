import api, { getApiUrl } from "./api";
import type { LoginResponse } from "@/types/auth";

export const userService = {
  login(email: string, password: string) {
    return api.post<LoginResponse>("/auth/login/", { email, password });
  },

  register(
    email: string,
    password: string,
    role: string,
    firstName?: string,
    lastName?: string
  ) {
    return api.post("/auth/register/", {
      email,
      password,
      role,
      firstName,
      lastName,
    });
  },

  getProfile: () => {
    return api.get("/users/profile/");
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await api.post("/auth/logout/", { refresh_token: refreshToken });
        localStorage.removeItem("refreshToken");
      }

      // Clear any other auth-related items from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      return true;
    } catch (error) {
      console.warn("API logout failed:", error);
      return false;
    }
  },

  addChild: (payload: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    grade: number;
    school_name: string;
    county: string;
    password: string;
  }) => {
    return api.post("/users/add-child/", payload);
  },

  getGrades: () => {
    return api.get("/academics/grades/");
  },

  getLevels: () => {
    return api.get("/academics/levels/");
  },

  getGradesByLevel: (level: string) => {
    return api.get(`/academics/levels/${level}/grades/`);
  },

  getChildren: () => {
    return api.get("/users/my-children/");
  },

  getChildDetail: (childId: number) => {
    return api.get(`/users/children/${childId}/`);
  },

  updateChild: (
    childId: number,
    payload: {
      first_name?: string;
      last_name?: string;
      date_of_birth?: string;
      grade?: number;
      school_name?: string;
      county?: string;
    }
  ) => {
    return api.put(`/users/children/${childId}/update/`, payload);
  },

  getGradeQuestions: (filters?: {
    subject_id?: number;
    difficulty?: "easy" | "medium" | "hard";
    page?: number;
  }) => {
    const params: Record<string, string | number> = {};
    if (filters?.subject_id) params.subject_id = filters.subject_id;
    if (filters?.difficulty) params.difficulty = filters.difficulty;
    if (filters?.page) params.page = filters.page;

    return api.get(getApiUrl("/questions/questions/grade_questions/"), { params });
  },
};
