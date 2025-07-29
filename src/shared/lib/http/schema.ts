import * as z from 'zod/v4';

export const errorSchema = z.object({
  message: z.string(),
  extensions: z.object({
    response: z.object({ message: z.string().array() }).optional(),
    exception: z.object({ message: z.string() }).optional(),
  }),
});

export const errorResponseSchema = z.object({
  errors: errorSchema.array(),
});

export const errorsSchema = errorResponseSchema.transform((data) => {
  return {
    errors: data.errors
      .map((e) => {
        if (e.extensions.exception) {
          return e.extensions.exception.message;
        }
        return e.extensions.response!.message;
      })
      .flatMap((m) => m),
  };
});

export const skillSchema = z.object({
  name: z.string(),
  mastery: z.enum(['Novice', 'Advanced', 'Competent', 'Proficient', 'Expert']),
  categoryId: z.string().nullable(),
});

export const languageSchema = z.object({
  id: z.string(),
  name: z.string(),
  nativeName: z.string(),
  iso2: z.string(),
  createdAt: z.string(),
  proficiency: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native']),
});

export const cvSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  education: z.string().nullable(),
  description: z.string(),
  user: z.object({ id: z.string(), email: z.string() }).nullable(),
  skills: skillSchema.array().default([]),
  languages: languageSchema.array().default([]),
});

export const skillCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const profileSchema = z.object({
  skills: skillSchema.array(),
});

export const userSchema = z.object({
  id: z.string(),
  profile: profileSchema,
});
