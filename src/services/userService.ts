import api from "./api";
import type { LoginResponse } from "@/types/auth";

export const userService = {
  login(email: string, password: string) {
    return api.post<LoginResponse>("/auth/login/", { email, password });
  },

  register(email: string, password: string, role: string) {
    return api.post("/auth/register/", { email, password, role });
  },

  getProfile() {
    return api.get("/users/profile/");
  },

};
