import axios from "axios";
import { achievements, activities, learners, resources, tasks, topicProgress, topics, weeklyStudy } from "@/mock/data";
import type { JournalEntry, StudyTask, TaskStatus } from "@/types";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:4000/api",
  timeout: 8000
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ccna-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const wait = (ms = 220) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const mockApi = {
  async getDashboard() {
    await wait();
    return { topics, activities, weeklyStudy, topicProgress };
  },
  async getTopics() {
    await wait();
    return topics;
  },
  async getResources() {
    await wait();
    return resources;
  },
  async getTasks() {
    await wait();
    return tasks;
  },
  async getLeaderboard() {
    await wait();
    return learners;
  },
  async getAchievements() {
    await wait();
    return achievements;
  }
};

export const backendApi = {
  async register(payload: { name: string; email: string; password: string }) {
    const { data } = await apiClient.post("/auth/register", payload);
    return data;
  },
  async login(payload: { email: string; password: string; expectedRole?: "learner" | "admin" }) {
    const { data } = await apiClient.post("/auth/login", payload);
    return data;
  },
  async getDashboard() {
    const { data } = await apiClient.get("/dashboard");
    return data;
  },
  async saveJournal(payload: JournalEntry) {
    const { data } = await apiClient.post("/journals", payload);
    return data;
  },
  async getJournals() {
    const { data } = await apiClient.get("/journals");
    return data;
  },
  async getTasks() {
    const { data } = await apiClient.get("/tasks");
    return data;
  },
  async createTask(payload: Omit<StudyTask, "id">) {
    const { data } = await apiClient.post("/tasks", payload);
    return data;
  },
  async updateTask(id: string, payload: { status: TaskStatus }) {
    const { data } = await apiClient.patch(`/tasks/${id}`, payload);
    return data;
  },
  async saveSubnettingAttempt(payload: { score: number; total: number; answers: Record<number, string> }) {
    const { data } = await apiClient.post("/quiz/subnetting-attempts", payload);
    return data;
  },
  async getAdminOverview() {
    const { data } = await apiClient.get("/admin/overview");
    return data;
  },
  async getAdminLearner(id: string) {
    const { data } = await apiClient.get(`/admin/learners/${id}`);
    return data;
  },
  async resetProgress() {
    const { data } = await apiClient.delete("/progress");
    return data;
  }
};
