import z from "zod";

export const userSchema = z.object({
  avatar: z.string({
    required_error: "avatar is required",
  }),
});

export type UserType = z.infer<typeof userSchema>;
