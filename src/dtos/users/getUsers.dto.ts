import { z } from "zod"
import { UserModel } from "../../models/User"

export interface GetUsersInputDTO {
    token: string
}

export type GetUsersOutputDTO = UserModel[]

export const GetUsersSchema = z.object({
    token: z.string().min(1)
}).transform(data => data as GetUsersInputDTO)
 //dto prepared to receive a query