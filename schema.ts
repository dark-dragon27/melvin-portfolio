import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Message model for contact form submissions
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Project model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  github: text("github").notNull(),
  liveUrl: text("live_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  projectTags: many(projectTags),
}));

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  image: true,
  github: true,
  liveUrl: true,
  featured: true,
});

// Tags model
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").default("gray"),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  projectTags: many(projectTags),
}));

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  color: true,
});

// Project-Tag junction table
export const projectTags = pgTable("project_tags", {
  projectId: integer("project_id").notNull().references(() => projects.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.tagId] }),
}));

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
  project: one(projects, {
    fields: [projectTags.projectId],
    references: [projects.id],
  }),
  tag: one(tags, {
    fields: [projectTags.tagId],
    references: [tags.id],
  }),
}));

export const insertProjectTagSchema = createInsertSchema(projectTags);

// Skills model
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  order: integer("order").default(0),
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  icon: true,
  category: true,
  description: true,
  order: true,
});

// Experiences (work, education) model
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  date: text("date"),
  type: text("type").notNull(), // "work" or "education"
  order: integer("order").default(0),
});

export const experiencesRelations = relations(experiences, ({ many }) => ({
  experienceDetails: many(experienceDetails),
}));

export const insertExperienceSchema = createInsertSchema(experiences).pick({
  title: true,
  subtitle: true,
  date: true,
  type: true,
  order: true,
});

// Experience details model
export const experienceDetails = pgTable("experience_details", {
  id: serial("id").primaryKey(),
  experienceId: integer("experience_id").notNull().references(() => experiences.id),
  detail: text("detail").notNull(),
  order: integer("order").default(0),
});

export const experienceDetailsRelations = relations(experienceDetails, ({ one }) => ({
  experience: one(experiences, {
    fields: [experienceDetails.experienceId],
    references: [experiences.id],
  }),
}));

export const insertExperienceDetailSchema = createInsertSchema(experienceDetails).pick({
  experienceId: true,
  detail: true,
  order: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;
export type InsertProjectTag = z.infer<typeof insertProjectTagSchema>;
export type ProjectTag = typeof projectTags.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertExperienceDetail = z.infer<typeof insertExperienceDetailSchema>;
export type ExperienceDetail = typeof experienceDetails.$inferSelect;
