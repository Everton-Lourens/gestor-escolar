
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
        });

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
    try {

        // Executa a função reportList assíncrona para obter a lista de ofertas
        let reportList = await getAllPresenceList(req, res, next);

        ////AAAAAAAAAAAAAAA
        reportList = [
            ...reportList,
        ];

        // Cria um mapa para armazenar as contagens de presença de cada aluno
        const presenceCountMap = {};

        // Itera sobre o array reportList para contabilizar as presenças de cada aluno
        reportList.forEach(report => {
            // Verifica se o aluno já está no mapa, se não estiver, adiciona com contagem inicial zero
            if (!presenceCountMap.hasOwnProperty(report.nameStudent)) {
                presenceCountMap[report.nameStudent] = 0;
            }
            // Incrementa a contagem se a presença for verdadeira
            if (report.presence === true) {
                presenceCountMap[report.nameStudent]++;
            }
        });

        // Atualiza cada objeto no reportList com a contagem de presença correspondente
        reportList.forEach(report => {
            report.presenceCount = presenceCountMap[report.nameStudent];
        });

        // Aqui você pode remover os objetos duplicados com base no nome do aluno, se necessário
        reportList = reportList.filter((object, index, array) => {
            return array.findIndex(o => o.nameStudent === object.nameStudent) === index;
        });

        /*
         let presence: number = 0;
         let subject: { [key: string]: any } = {};
 
         try {
             if (Array.isArray(reportList)) {
 
                 reportList.forEach((element, index) => {
                     presence += element?.presence ? 1 : 0;
                 });
 
                 reportList.push({
                     countPresence: presence,
                 });
                 console.log('--reportList--')
                 console.log(reportList)
                 console.log('--reportList--')
                 // Filtering objects with the same value for the key 'nameStudent'
                 reportList = reportList.filter((object, index, array) => {
                     return array.findIndex(o => o.nameStudent === object.nameStudent) === index;
                 });
 
             }
         } catch (error) {
             console.log(error);
         }
 */
         reportList.sort((a, b) => b.presenceCount - a.presenceCount);

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: reportList || [],
        })

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: `Erro ao buscar ofertas das turma pela data: "${error}"`,
            items: [],
        });
    }

}


export async function getAllPresenceList(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Verifica se a data é válida
    const { startDate, endDate } = await checkDateQuery(req, res, next);

    const subjectId = req.params?.subjectId || null;

    const getPresenceList = async () => {
        if (subjectId) {
            return await PresenceModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate, // Data maior ou igual a startDate
                            $lte: endDate    // Data menor ou igual a endDate
                        },
                        subject: new mongoose.Types.ObjectId(subjectId)// Filtrar por subjectId
                    }
                },
                {
                    $lookup: {
                        from: 'subjects', // Nome da coleção a ser populada
                        localField: 'subject',
                        foreignField: '_id',
                        as: 'subject'
                    }
                },
                {
                    $lookup: {
                        from: 'users', // Nome da coleção a ser populada
                        localField: 'teacher',
                        foreignField: '_id',
                        as: 'teacher'
                    }
                },
                {
                    $lookup: {
                        from: 'users', // Nome da coleção a ser populada
                        localField: 'student',
                        foreignField: '_id',
                        as: 'student'
                    }
                },
                // Outros $lookup para outras chaves estrangeiras, se necessário
            ]).exec();
        } else {
            return await PresenceModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate, // Data maior ou igual a startDate
                            $lte: endDate    // Data menor ou igual a endDate
                        },
                        //@@@@@@@@@subject: new mongoose.Types.ObjectId(subjectId)// Filtrar por subjectId
                    }
                },
                {
                    $lookup: {
                        from: 'subjects', // Nome da coleção a ser populada
                        localField: 'subject',
                        foreignField: '_id',
                        as: 'subject'
                    }
                },
                {
                    $lookup: {
                        from: 'users', // Nome da coleção a ser populada
                        localField: 'teacher',
                        foreignField: '_id',
                        as: 'teacher'
                    }
                },
                {
                    $lookup: {
                        from: 'users', // Nome da coleção a ser populada
                        localField: 'student',
                        foreignField: '_id',
                        as: 'student'
                    }
                },
                // Outros $lookup para outras chaves estrangeiras, se necessário
            ]).exec();
        }

    }
    const presenceList = await getPresenceList();
    return await deleteTheOldestFromTheSameDay(presenceList);
}


export async function countPresence(presentList) {
    presentList = await deleteTheOldestFromTheSameDay(presentList);

    const countPresence = {};
    presentList.forEach(item => {
        const subjectName = item.subject[0].name;
        if (item?.presence === true)
            countPresence[subjectName] = (countPresence[subjectName] || 0) + 1
        // ????            countPresence[item._id].presenceNumber = (countPresence[item._id].presenceNumber || 0) + 1
    });
    return countPresence;
}

export async function countPercent(presentList) {
    return presentList.map((item: any) => {
        const percent = (Number(item?.presenceNumber) || 0) / (Number(item?.studentsNumber)) * 100;
        item.percentNumber = parseFloat(percent.toFixed(1)) || 0.00;
        return item; // Retornar o item modificado
    });
}

// Função para eliminar presenças duplicadas, mantendo apenas a mais recente
async function deleteDuplicatePresencesAndGetUnique(presentList) {
    try {
        presentList = countPercent(presentList);
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



export async function deleteTheOldestFromTheSameDay(presentList) {
    try {
        // Mapear presenças únicas por pessoa e dia
        const uniquePresencesMap = new Map();

        for (const presence of presentList) {
            const key = `${presence.nameStudent}_${presence.createdAt.toDateString()}`;

            // Se já existir uma presença para esta pessoa neste dia
            if (uniquePresencesMap.has(key)) {
                const existingPresence = uniquePresencesMap.get(key);

                // Verificar se a presença atual é mais recente
                if (presence.createdAt > existingPresence.createdAt) {
                    // Atualizar a presença mais antiga com a atual
                    uniquePresencesMap.set(key, presence);
                }
            } else {
                // Se não existir uma presença para esta pessoa neste dia, adicionar à lista
                uniquePresencesMap.set(key, presence);
            }
        }

        // IDs das presenças mais antigas a serem excluídas
        const presenceIdsToDelete = [];

        // Identificar as presenças mais antigas a serem excluídas
        for (const [, presence] of uniquePresencesMap) {
            const { _id, nameStudent, createdAt } = presence;
            const similarPresences = presentList.filter(p => p.nameStudent === nameStudent && p.createdAt.toDateString() === createdAt.toDateString());

            // Se houver mais de uma presença (ou falta) para esta pessoa neste dia
            if (similarPresences.length > 1) {
                // Encontrar a presença mais antiga
                const oldestPresence = similarPresences.reduce((oldest, current) => current.createdAt < oldest.createdAt ? current : oldest);

                // Adicionar o ID da presença mais antiga à lista de IDs a serem excluídos
                presenceIdsToDelete.push(oldestPresence._id);
            }
        }

        // Excluir todas as presenças mais antigas de uma vez
        if (presenceIdsToDelete.length > 0) {
            await PresenceModel.deleteMany({
                _id: { $in: presenceIdsToDelete }
            });
        }

        // Obter presenças únicas a partir do mapa
        const uniquePresences = Array.from(uniquePresencesMap.values());

        // Retornar as presenças únicas
        return uniquePresences;
    } catch (error) {
        console.error('Erro ao excluir a presença mais antiga:', error);
        throw error;
    }
}
