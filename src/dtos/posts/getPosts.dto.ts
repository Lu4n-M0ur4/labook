import { z } from "zod"
import { PostModel } from "../../models/Post"

export interface GetVideosInputDTO { 
    nameToSearch?: string
}

export type GetPostsOutputDTO = PostModel[]

export const GetPostSchema = z.object({
    nameToSearch: z.string().min(1).optional()
  }).transform(data => data as GetVideosInputDTO)

