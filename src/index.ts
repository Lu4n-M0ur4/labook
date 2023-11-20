import express, { Request, Response } from 'express'
import cors from 'cors'
import { UserDatabase } from './database/UserDatabase'


const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/usersTest", async (req: Request, res: Response) => {
    try {

        const userDatabase = new UserDatabase()
        const output =  await userDatabase.findUsers()
       
        
       
        res.status(200).send({ message: output })


    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})