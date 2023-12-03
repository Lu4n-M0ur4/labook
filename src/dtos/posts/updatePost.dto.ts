import { z } from "zod"


export interface UpdatePostInputDTO { 
    content: string,
    token: string,
    idToEdit: string
}

export type UpdadePostsOutputDTO = undefined

export const UpdadePostSchema = z.object({
    content: z.string().min(1),
    token:z.string().min(1),
    idToEdit:z.string().min(1)
    
  }).transform(data => data as UpdatePostInputDTO)

