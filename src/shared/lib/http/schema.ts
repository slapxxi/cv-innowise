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

export const skillCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const skillSchema = z.object({
  name: z.string(),
  mastery: z.string(),
  categoryId: z.string().nullable(),
});

export const profileSchema = z.object({
  skills: skillSchema.array(),
});

export const userSchema = z.object({
  id: z.string(),
  profile: profileSchema,
});
