import api from "./api";
import { TokenResponse, LoginCredentials } from "@/models/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/api/login", {
      username: credentials.username,
      password: credentials.password,
    });

    const { access_token } = response.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify({ username: credentials.username }));

    return response.data;
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("access_token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getUser(): { username: string } | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
