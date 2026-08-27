import { apiClient } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export const auth = {
  getLoginUrl: () => `${API_URL}/auth/github`,
  
  async me() {
    const { data } = await apiClient.get("/auth/me");
    return data.data;
  },

  async logout() {
    await apiClient.post("/auth/logout");
  },
};

export const repositories = {
  async list(params?: { page?: number; limit?: number }) {
    const { data } = await apiClient.get("/repositories", { params });
    return data;
  },

  async get(id: string) {
    const { data } = await apiClient.get(`/repositories/${id}`);
    return data.data;
  },

  async update(id: string, updates: { reviewEnabled?: boolean; enabled?: boolean }) {
    const { data } = await apiClient.patch(`/repositories/${id}`, updates);
    return data.data;
  },

  async stats(id: string) {
    const { data } = await apiClient.get(`/repositories/${id}/stats`);
    return data.data;
  },
};

export const reviews = {
  async dashboardStats() {
    const { data } = await apiClient.get("/reviews/stats/dashboard");
    return data.data;
  },

  async list(params?: { page?: number; limit?: number; status?: string; repositoryId?: string }) {
    const { data } = await apiClient.get("/reviews", { params });
    return data;
  },

  async get(id: string) {
    const { data } = await apiClient.get(`/reviews/${id}`);
    return data.data;
  },

  async findings(id: string, params?: { severity?: string; category?: string }) {
    const { data } = await apiClient.get(`/reviews/${id}/findings`, { params });
    return data.data;
  },

  async create(repositoryId: string, pullRequestId: string) {
    const { data } = await apiClient.post("/reviews", { repositoryId, pullRequestId });
    return data.data;
  },

  async retry(id: string) {
    const { data } = await apiClient.post(`/reviews/${id}/retry`);
    return data.data;
  },
};

export const pullRequests = {
  async list(params?: { page?: number; limit?: number; status?: string; repositoryId?: string }) {
    const { data } = await apiClient.get("/pull-requests", { params });
    return data;
  },

  async get(id: string) {
    const { data } = await apiClient.get(`/pull-requests/${id}`);
    return data.data;
  },
};

export const github = {
  async installUrl() {
    const { data } = await apiClient.get("/github/install-url");
    return data.data.installUrl as string;
  },

  async installations() {
    const { data } = await apiClient.get("/github/installations");
    return data.data;
  },

  async syncRepositories(installationId: string) {
    await apiClient.post(`/github/installations/${installationId}/sync`);
  },

  async disconnect(installationId: string) {
    await apiClient.delete(`/github/installations/${installationId}`);
  },
};

export const settings = {
  async getReviewSettings(repositoryId: string) {
    const { data } = await apiClient.get(`/settings/review/${repositoryId}`);
    return data.data;
  },

  async updateReviewSettings(repositoryId: string, updates: Record<string, unknown>) {
    const { data } = await apiClient.patch(`/settings/review/${repositoryId}`, updates);
    return data.data;
  },

  async updateAccount(updates: { displayName?: string }) {
    const { data } = await apiClient.patch("/settings/account", updates);
    return data.data;
  },
};
