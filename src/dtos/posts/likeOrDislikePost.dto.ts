import { z } from "zod"


export interface LikeOrDislikePostInputDTO { 
    token: string,
    postId: string,
    like: boolean
}

export type LikeOrDislikePostOutputDTO = undefined

export const likeOrDislikeSchema = z.object({
    token:z.string().min(1),
    postId:z.string().min(1),
    like: z.boolean()
    
  }).transform(data => data as LikeOrDislikePostInputDTO)

