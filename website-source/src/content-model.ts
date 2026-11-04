import { z } from "zod";

const shortText = z.string().max(240);
const line = z.string().max(1000);
const tags = z.array(z.string().trim().min(1).max(60)).max(30);
const webUrl = z
  .string()
  .max(2000)
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return (
        ["http:", "https:"].includes(url.protocol) &&
        !url.username &&
        !url.password
      );
    } catch {
      return false;
    }
  }, "链接需要使用完整的 http:// 或 https:// 地址");
const id = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9_-]+$/, "内容 ID 无效");

export const profileSchema = z
  .object({
    name: shortText,
    role: shortText,
    location: shortText,
    email: z.union([z.literal(""), z.string().email().max(320)]),
    github: webUrl,
    website: webUrl,
    bio: z.string().max(12000),
    avatar: webUrl,
    now: line,
    skills: tags,
    education: z.string().max(6000),
  })
  .strict();

export const projectSchema = z
  .object({
    id,
    title: z.string().trim().min(1).max(240),
    summary: line,
    category: shortText,
    tags,
    date: shortText,
    url: webUrl,
    body: z.string().max(60000),
    featured: z.boolean(),
  })
  .strict();

export const experienceSchema = z
  .object({
    id,
    company: z.string().trim().min(1).max(240),
    role: shortText,
    type: shortText,
    period: shortText,
    description: z.string().max(12000),
  })
  .strict();

export const awardSchema = z
  .object({
    id,
    title: z.string().trim().min(1).max(240),
    issuer: shortText,
    date: shortText,
    description: z.string().max(12000),
  })
  .strict();

export const postSchema = z
  .object({
    id,
    title: z.string().trim().min(1).max(240),
    summary: line,
    body: z.string().max(60000),
    category: shortText,
    tags,
    date: shortText,
    status: z.enum(["published", "draft"]),
  })
  .strict();

const uniqueIds = <T extends { id: string }>(values: T[]) =>
  new Set(values.map((value) => value.id)).size === values.length;
export const contentSchema = z
  .object({
    profile: profileSchema,
    projects: z
      .array(projectSchema)
      .max(100)
      .refine(uniqueIds, "项目 ID 不能重复"),
    experiences: z
      .array(experienceSchema)
      .max(100)
      .refine(uniqueIds, "经历 ID 不能重复"),
    awards: z.array(awardSchema).max(100).refine(uniqueIds, "奖项 ID 不能重复"),
    posts: z.array(postSchema).max(300).refine(uniqueIds, "文章 ID 不能重复"),
  })
  .strict();

export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Award = z.infer<typeof awardSchema>;
export type Post = z.infer<typeof postSchema>;
export type Content = z.infer<typeof contentSchema>;

export const emptyContent: Content = {
  profile: {
    name: "",
    role: "",
    location: "",
    email: "",
    github: "",
    website: "",
    bio: "",
    avatar: "",
    now: "",
    skills: [],
    education: "",
  },
  projects: [],
  experiences: [],
  awards: [],
  posts: [],
};
