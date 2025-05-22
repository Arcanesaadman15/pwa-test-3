import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for basic user information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  program: text("program").notNull().default("beginner"), // beginner, intermediate, advanced
  currentDay: integer("current_day").notNull().default(1),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  completedDays: integer("completed_days").notNull().default(0),
  startDate: timestamp("start_date").notNull().defaultNow(),
  achievements: integer("achievements").notNull().default(0),
  level: integer("level").notNull().default(1),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
  preferences: jsonb("preferences"), // Store user preferences as JSON
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Task completions tracking
export const taskCompletions = pgTable("task_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  taskId: text("task_id").notNull(),
  day: integer("day").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  skipped: boolean("skipped").notNull().default(false),
  skipReason: text("skip_reason")
});

// User skills progression
export const userSkills = pgTable("user_skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(), // sleep, movement, nutrition, recovery, mindfulness
  level: integer("level").notNull().default(0),
  experience: integer("experience").notNull().default(0),
  unlockedSkills: jsonb("unlocked_skills"), // Array of unlocked skill IDs
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// User achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  shared: boolean("shared").notNull().default(false)
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertTaskCompletionSchema = createInsertSchema(taskCompletions).omit({
  id: true,
  completedAt: true
});

export const insertUserSkillSchema = createInsertSchema(userSkills).omit({
  id: true,
  updatedAt: true
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TaskCompletion = typeof taskCompletions.$inferSelect;
export type InsertTaskCompletion = z.infer<typeof insertTaskCompletionSchema>;
export type UserSkill = typeof userSkills.$inferSelect;
export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
