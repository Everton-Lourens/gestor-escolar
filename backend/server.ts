import 'reflect-metadata'
import express, { Express, Request, Response } from 'express'
import 'express-async-errors'
import dbConnection from './src/shared/infra/mongodb/index'
import cors from 'cors'
import { routes } from './src/shared/infra/http/routes'
import './src/shared/containers'
import { Mongoose } from 'mongoose'
import { handleError } from './src/shared/infra/http/middlewares/handleError'
import { sendPresence, getPresenceByDateOrSubjectId } from './src/shared/infra/http/middlewares/presenceCRUD';
import { sendClassOffer, getClassOfferListByDateOrTeacherId, getClassOffer } from './src/shared/infra/http/middlewares/classOfferCRUD';
import { getReportByDateOrTeacherId, getReportBySubjectId } from './src/shared/infra/http/middlewares/reportCRUD';
import { getPresenceList } from './src/shared/infra/http/middlewares/presenceCRUD';

interface CustomExpress extends Express {
  mongo?: Mongoose
}

const app: CustomExpress = express()

const PORT = process.env.PORT || process.env.SERVER_PORT;

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


app.get('/presence/subject/:subjectId', getPresenceByDateOrSubjectId, async (req: Request, res: Response) => {
  // TRABALHANDO4
  // middleware
})
 
app.get('/report/subject/:subjectId', getReportBySubjectId, async (req: Request, res: Response) => {
  // TRABALHANDO4
  // middleware
})

app.get('/report/class-offer', getReportByDateOrTeacherId, async (req: Request, res: Response) => {
  // TRABALHANDO4
  // middleware
})

app.get('/report/presence/subject/:subjectId', getPresenceList, async (req: Request, res: Response) => {
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