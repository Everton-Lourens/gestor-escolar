import 'reflect-metadata'
import express, { Express, Request, Response } from 'express'
import 'express-async-errors'
import dbConnection from './src/shared/infra/mongodb/index'
import cors from 'cors'
import { routes } from './src/shared/infra/http/routes'
import './src/shared/containers'
import { Mongoose } from 'mongoose'
import { handleError } from './src/shared/infra/http/middlewares/handleError'
import { sendPresence, getPresenceListByDate } from './src/shared/infra/http/middlewares/presenceCRUD';
import { sendClassOffer, getClassOfferListByDateOrTeacherId, getClassOffer } from './src/shared/infra/http/middlewares/classOfferCRUD';
import { getReportByDateOrTeacherId } from './src/shared/infra/http/middlewares/reportCRUD';

interface CustomExpress extends Express {
  mongo?: Mongoose
}

const app: CustomExpress = express()

const PORT = process.env.SERVER_PORT

app.mongo = dbConnection

app.use(express.json())
app.use(cors())
app.use(routes)
app.use(handleError)

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}!`))

app.get('/', async (req: Request, res: Response) => {
  return res.status(200).send(`<h1>Servidor rodando na porta  ${PORT}</h1>`)
})


app.post('/presence', sendPresence, async (req: Request, res: Response) => {
  // TRABALHANDO2
  //Envia o body para o middleware "sendPresence"
  return res.status(200).send(`<h1>PRESENÇA MARCADA COM SUCESSO</h1>`)
})


app.get('/presence/:teacherId', getPresenceListByDate, async (req: Request, res: Response) => {
    // TRABALHANDO4
// middleware
})

app.get('/report', getReportByDateOrTeacherId, async (req: Request, res: Response) => {
  // TRABALHANDO4
// middleware
})


app.get('/class-offer', getClassOffer, async (req: Request, res: Response) => {
    // TRABALHANDO4
// middleware
})

app.post('/class-offer', sendClassOffer, async (req: Request, res: Response) => {
  // TRABALHANDO2
  //Envia o body para o middleware "sendPresence"
  return res.status(200).send(`<h1>OFERTA ENVIADA COM SUCESSO</h1>`)
})


app.get('/class-offer/:teacherId', getClassOfferListByDateOrTeacherId, async (req: Request, res: Response) => {
    // TRABALHANDO4
// middleware
})