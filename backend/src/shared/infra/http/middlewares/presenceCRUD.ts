
import { NextFunction, Request, Response } from 'express'
import { PresenceModel } from '../../../../entities/presence'
import mongoose, { Types } from 'mongoose'

// Middleware para enviar dados para o mongo

export function sendToMongo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try { // TRABALHANDO3 (SAVE)

        // Verificando se a requisição, o corpo da requisição ou o usuário no corpo da requisição são nulos ou inválidos
        if (!req || !req.body || !req.body.user)
            return res.status(400).send(`<h1>Corpo da requisição ausente ou inválido</h1>`);

        // Exibindo no console o corpo da requisição (para fins de debug).
        /*
        console.log('/////////////////////////');
        console.log(req?.body);
        console.log('/////////////////////////');
        /////////////////////////
        {
          user: {
            _id: '65e6421e5d7e2314d26a6aa3',
            code: '1',
            name: 'João',
            email: 'joao@gmail.com',
            password: '$2b$10$87rSYt.r32Vxzn06AKMotej1XfOWGcXc/NZzchPI2N25y9UPeCOP2',
            occupation: 'student',
            avatar: null,
            avatarURL: null,
            teacher: '65e641c85d7e2314d26a6a82',
            warningsAmount: 1,
            createdAt: '2024-03-04T21:50:22.772Z',
            __v: 0
          }
        }
        /////////////////////////
        */

        const { _id, teacher, presence } = req.body.user;

        // Criando uma nova instância do modelo PresenceModel com as propriedades extraídas.
        const newPresence = new PresenceModel({
            presence,
            teacher,
            student: _id,
        })

        // Salvando a nova instância no banco de dados.
        newPresence.save();

        return res.status(200).send(`<h1>sendToMongo</h1>`);

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a presença</h1> <p>${error}</p>`);
    }
}


export async function getFromMongo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        // TRABALHANDO5 (GET)

        // URL PARA TESTAR a consulta das presenças no dia 07/03/2024:
        // http://localhost:4444/presence/65e641c85d7e2314d26a6a82?date=2024-03-07


        // Extrai o ID do professor a partir dos parâmetros da requisição.
        const teacherId = req.params.teacherId;

        if (!teacherId || !req.query['date'])
            return res.status(400).send(`<h1>ID do professor ou data ausente</h1>`)

        // Extrai a data da consulta da query da requisição e converte para um objeto Date
        const dateQueryParam: string = req.query.date as string; // Ajuste o tipo conforme necessário
        const dateFilter = new Date(dateQueryParam);

        // Verifica se a data é válida
        if (isNaN(dateFilter.getTime())) {
            return res.status(400).json({ mensagem: 'Formato de data inválido' });
        }

        // Converte o ID do professor para um ObjectId do mongoose.
        const teacherObjectId = new mongoose.Types.ObjectId(teacherId);

        // Realiza uma agregação no modelo PresenceModel para obter a lista de presenças
        const presentList: IPresence[] = await PresenceModel.aggregate([
            {
                $match: {
                    teacher: teacherObjectId,
                    createdAt: {
                        $gte: dateFilter,
                        $lt: new Date(dateFilter.getTime() + 24 * 60 * 60 * 1000),
                    },
                },
            },
            {
                $sort: {
                    student: 1, // Classifica por aluno (ascendente) para garantir a ordem correta na próxima etapa
                    createdAt: -1, // Classifica por data de criação em ordem decrescente
                },
            },
            {
                $group: {
                    _id: '$student',
                    latestPresence: { $first: '$$ROOT' },
                },
            },
            {
                $replaceRoot: { newRoot: '$latestPresence' },
            },
        ]);

        // Excluir registros duplicados mantendo apenas o mais recente
        await PresenceModel.deleteMany({
            _id: { $nin: presentList.map((presence) => presence._id) },
        });

        return res.status(200).json({ data: { count: presentList.length, presentList } });

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a presença</h1> <p>${error}</p>`);
    }
}
