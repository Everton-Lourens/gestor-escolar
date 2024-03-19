
import { NextFunction, Request, Response } from 'express'
import { PresenceModel } from '../../../../entities/presence'
import mongoose, { Types } from 'mongoose'
import { DynamoDBStreams } from 'aws-sdk';
import { checkDateQuery } from './functions';

// Middleware para enviar dados para o mongo

export async function sendPresence(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try { // TRABALHANDO3 (SAVE)

        /*
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        QUANDO EU ADICIONO A PRESENÇA, NÃO VAI DE PRIMEIRA PARA O BANCO DE DADOS....
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        */


        // Verificando se a requisição, o corpo da requisição ou o usuário no corpo da requisição são nulos ou inválidos
        if (!req || !req.body || !req.body.user)
            return res.status(400).send(`<h1>Corpo da requisição ausente ou inválido</h1> <p>- req: ${!!req}<br>- body: ${!!req?.body}<br>- user: ${!!req.body.user}</p>`);

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

        const { _id, name, teacher, presence, subject } = req.body.user;
        const subjectId = subject._id;
        const subjectName = subject.name;

        // Criando uma nova instância do modelo PresenceModel com as propriedades extraídas.
        const newPresence = new PresenceModel({
            presence,
            teacher,
            student: _id,
            nameStudent: name,
            subject: subjectId,
            subjectName,
        })

        // Salvando a nova instância no banco de dados.
        await newPresence.save();

        return res.status(200).send(`<h1>sendPresence</h1>`);

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a presença</h1> <p>${error}</p>`);
    }
}



export async function getAllClassOffer(
    req: Request,
    res: Response,
    _next: NextFunction
) {
    try {
        const viewAll = req.query.viewAll;

        if (viewAll !== 'true') {
            return res.status(400).send(`<h1>Consulta inválida</h1>`);
        }

        // Buscando ofertas e dizimos onde os dois não podem ser igualmente 0.
        const offerList: IOffer[] = await PresenceModel.find({});

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: offerList,
        })

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao buscar todas as ofertas</h1> <p>${error}</p>`);
    }
}


export async function getPresenceByDateOrSubjectId(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        // Executa a função presenceList assíncrona para obter a lista de ofertas
        const presenceList = await getPresenceList(req, res, next);

        const sucess = (Array.isArray(presenceList) && presenceList.length > 0) ? true : false;

        return res.status(sucess ? 200 : 400).json({
            success: true,
            message: sucess ? 'Busca da lista de presença concluída com sucesso' : 'Busca da lista de presença falhou',
            items: presenceList || [],
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: `Erro ao buscar ofertas das turma pela data: "${error}"`,
            items: [],
        });
    }
}

export async function getPresenceList(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // Verifica se a data é válida
    const { startDate, endDate } = await checkDateQuery(req, res, next);

    const subjectId = new mongoose.Types.ObjectId(req.params.subjectId);

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: 'Formato de data inválido',
            items: [],
        });
    }

    try {

        const presentList = await PresenceModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate, // Data maior ou igual a startDate
                        $lte: endDate    // Data menor ou igual a endDate
                    },
                    subject: subjectId // Filtrar por subjectId
                }
            },
            // Outros $lookup para outras chaves estrangeiras, se necessário
        ]).exec();

        return await deleteDuplicatePresencesAndGetUnique(presentList);

        return;
        return;
        await PresenceModel.deleteMany({
            createdAt: {
                $gte: new Date(startDate), // Data maior ou igual a startDate
                $lte: new Date(endDate)    // Data menor ou igual a endDate
            }
        });

    } catch (error) {
        console.error('Erro ao buscar ofertas por data:', error);
        throw error;
    }

}



// Função para eliminar presenças duplicadas, mantendo apenas a mais recente
async function deleteDuplicatePresencesAndGetUnique(presentList) {
    try {
        // Mapear presenças únicas por pessoa e dia
        const uniquePresencesMap = new Map();

        // Lista de IDs das presenças a serem excluídas
        const presenceIdsToDelete = [];

        for (const presence of presentList) {
            const key = `${presence.nameStudent}_${presence.createdAt.toDateString()}`;

            // Se já existir uma presença para esta pessoa neste dia
            if (uniquePresencesMap.has(key)) {
                const existingPresence = uniquePresencesMap.get(key);

                // Verificar se a presença atual é mais recente
                if (presence.createdAt > existingPresence.createdAt) {
                    // Se sim, substituir pela presença atual
                    uniquePresencesMap.set(key, presence);
                    // Adicionar a presença anterior à lista de IDs a serem excluídos
                    presenceIdsToDelete.push(existingPresence._id);
                } else {
                    // Adicionar a presença atual à lista de IDs a serem excluídos
                    presenceIdsToDelete.push(presence._id);
                }
            } else {
                // Se não existir uma presença para esta pessoa neste dia, adicionar à lista
                uniquePresencesMap.set(key, presence);
            }

            // Se a presença for falsa, adicionar à lista de IDs a serem excluídos
            if (presence.presence === false) {
                presenceIdsToDelete.push(presence._id);
            }
        }

        // Obter presenças únicas a partir do mapa
        const uniquePresences = Array.from(uniquePresencesMap.values());

        // Excluir presenças duplicadas e presenças com presence: false
        await PresenceModel.deleteMany({
            _id: { $in: presenceIdsToDelete }
        });

        // Ordena a array de presenças com base na quantidade de presenças (quantidade de vezes em que presence é true)
        uniquePresences.sort((a, b) => {
            const countA = uniquePresences.filter(item => item.student.toString() === a.student.toString() && item.presence === true).length;
            const countB = uniquePresences.filter(item => item.student.toString() === b.student.toString() && item.presence === true).length;
            return countB - countA; // Ordena em ordem decrescente
        });

        return uniquePresences;
    } catch (error) {
        console.error('Erro ao excluir presenças duplicadas:', error);
        throw error;
    }
}
