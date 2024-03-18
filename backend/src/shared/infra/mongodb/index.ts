import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()

const MONGO_USERNAME = process.env.database_username
const MONGO_PASSWORD = process.env.database_password

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:27017/admin`;
//const mongoURL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@gestor-escolar-cluster.c2i24so.mongodb.net/`
// Função para extrair o nome do banco de dados da URL de conexão MongoDB
function getDatabaseName(mongoURL) {
  const urlParts = mongoURL.split('/');
  return urlParts[urlParts.length - 1]; // O último elemento da URL é o nome do banco de dados
}

const dbName = getDatabaseName(mongoURL);
console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ Nome do banco de dados:', dbName);

mongoose.connect(mongoURL)
mongoose.connection
  .on(
    'error',
    console.error.bind(console, 'Erro ao conectar com o banco de dados'),
  )
  .once('open', () => {
    console.log('Conexão com o banco de dados estabelecida com sucesso')
  })

export default mongoose
