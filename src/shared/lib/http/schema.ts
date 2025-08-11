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

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  internalName: z.string(),
  domain: z.string(),
  description: z.string(),
  environment: z.string().array(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  createdAt: z.string(),
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

export const cvProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  internalName: z.string(),
  description: z.string(),
  domain: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  environment: z.string().array(),
  responsibilities: z.string().array(),
  roles: z.string().array(),
  project: z.object({ id: z.string(), name: z.string() }),
});

export const cvSchema = z.object({
  skills: skillSchema.array().default([]),
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
