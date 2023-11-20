import z from "zod";

export interface LikeOrDislikeInputDTO {
  userId: string;
  postId: string;
  like: boolean;
}

export type LikeOrDislikeOutputDTO = undefined;

export const LikeOrDislikeSchema = z
  .object({
    userId: z.string(),
    postId: z.string(),
    like: z.boolean(),
  })
  .transform((data) => data as LikeOrDislikeInputDTO);
