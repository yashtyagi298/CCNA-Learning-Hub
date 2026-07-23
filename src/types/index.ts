import type { LucideIcon } from "lucide-react";

export type TopicStatus = "not-started" | "learning" | "review" | "completed";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ResourceCategory = "Docs" | "Video" | "Lab" | "PDF" | "Cheatsheet" | "Blog";
export type TaskStatus = "todo" | "in-progress" | "completed" | "review";
export type TaskPriority = "Low" | "Medium" | "High";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  learnerOnly?: boolean;
}

export interface CcnaTopic {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  status: TopicStatus;
  progress: number;
  commands: string[];
  lab: string;
  interviewQuestions: string[];
  revisionNotes: string[];
  commonMistakes: string[];
  practiceTasks: string[];
  resources: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  category: ResourceCategory;
  source: string;
  duration: string;
  favorite: boolean;
  tags: string[];
  url: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  tone: "blue" | "green" | "amber" | "violet";
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  checklist: string[];
  status: TaskStatus;
  priority: TaskPriority;
  due: string;
  topic: string;
}

export interface Learner {
  id: string;
  name: string;
  handle: string;
  streak: number;
  topics: number;
  labs: number;
  score: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export interface JournalEntry {
  todayStudy: string;
  hours: number;
  topics: string;
  commands: string;
  problems: string;
  goals: string;
  mentorNotes: string;
}
