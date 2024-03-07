import mongoose, { Types } from 'mongoose'

export interface Presence {
  _id: Types.ObjectId
  presence: boolean
  teacher: Types.ObjectId
  student: Types.ObjectId
  createdAt: Date
}

const presenceSchema = new mongoose.Schema({
  presence: { type: Boolean, default: null, },
  teacher: { type: 'ObjectId', ref: 'User', default: null },
  student: { type: 'ObjectId', ref: 'Student', default: null },
  createdAt: { type: Date, default: Date.now },
})

export const PresenceModel = mongoose.model<Presence>('Presence', presenceSchema)




/*

const teste = new PresenceModel({
  presence: true,
  teacher: '65e641c85d7e2314d26a6a82',
  student: '65e6421e5d7e2314d26a6aa3',
})

teste.save();

const example = teste.presence;

console.log('@@@@@@@@@@@@@@@@@@@@@@');
console.log(example);
console.log('@@@@@@@@@@@@@@@@@@@@@@');




// id student: 65e6421e5d37e2314d26a6aa3

const newPresence = new PresenceModel({
  presence: true,
  teacher: '65e641c853d7e2314d26a6a82',
  student: '65e6421e5d37e2314d26a6aa3',
})

newPresence.save();
*/

/*

@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@ 
import { presentList } from './presence'

presentList('65e641c85d7e2314d26a6a82'); //ASSIM QUE FAZ PARA USAR
@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@


// Encontrar todos os registros onde o professor estava presente
export const presentList = (teacherObjectId) => {

  // Supondo que você tenha o ID do professor para quem deseja obter a lista de presenças
  const teacherId = '65e641c85d7e2314d26a6a82';

  // Certifique-se de converter o ID do professor para um objeto ObjectId
  teacherObjectId = new mongoose.Types.ObjectId(teacherId);

  PresenceModel.find({ teacher: teacherObjectId, presence: true })
    .then((presentList) => {
      console.log('Lista de presenças do professor:', presentList);
    })
    .catch((error) => {
      console.error('Erro ao obter a lista de presenças do professor:', error);
    });
}



*/