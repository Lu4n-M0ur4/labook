import { z } from "zod"


export interface LoguinInputDTO {
  email:string,
  password:string
}

export type LoguinOutputDTO ={
    token:string
}

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
  }).transform(data => data as LoguinInputDTO)