import api from "./api";
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

  logout: async (refreshToken: string) => {
    try {
      await api.post("/auth/logout/", { refresh_token: refreshToken });
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("API logout failed:", error);
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
};