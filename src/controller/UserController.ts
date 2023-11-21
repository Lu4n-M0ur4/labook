import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { UserBusiness } from "../business/UserBusiness";


export class UserController {
    constructor(private userBusiness:UserBusiness){}
  public findUsers = async (req: Request, res: Response) => {
    try {

      
      const output = await this.userBusiness.findUsers()

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}