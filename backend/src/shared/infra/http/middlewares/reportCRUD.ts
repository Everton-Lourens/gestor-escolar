
import { NextFunction, Request, Response } from 'express'
import { OfferModel } from '../../../../entities/offer'
import mongoose, { Types } from 'mongoose'

// Middleware para enviar dados para o mongo

export async function getReport(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        // TRABALHANDO5 (GET)

        // URL PARA TESTAR a consulta das ofertas do dia 07/03/2024:
        // http://localhost:4444/class-offer/65e641c85d7e2314d26a6a82?date=2024-03-09


        // Extrai o ID do professor a partir dos parâmetros da requisição.
        const userId = req.params.user;

        if (!userId || !req.query['report'])
            return res.status(400).send(`<h1>ID do usuário ausente</h1>`)

        // Converte o ID do professor para um ObjectId do mongoose.
        const userObjectId = new mongoose.Types.ObjectId(userId);


        const offerList: IOffer[] = await OfferModel.find({ _id: userObjectId });

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: offerList,
          })

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a presença</h1> <p>${error}</p>`);
    }
}



export async function getReportById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        // TRABALHANDO5 (GET)

        // URL PARA TESTAR a consulta das ofertas do dia 07/03/2024:
        // http://localhost:4444/class-offer/65e641c85d7e2314d26a6a82?date=2024-03-09


        // Extrai o ID do professor a partir dos parâmetros da requisição.
        const userId = req.params.user;

        if (!userId || !req.query['date'])
            return res.status(400).send(`<h1>ID do professor ou data ausente</h1>`)

        // Extrai a data da consulta da query da requisição e converte para um objeto Date
        const dateQueryParam: string = req.query.date as string; // Ajuste o tipo conforme necessário
        const dateFilter = new Date(dateQueryParam);

        // Verifica se a data é válida
        if (isNaN(dateFilter.getTime())) {
            return res.status(400).json({ mensagem: 'Formato de data inválido' });
        }

        // Converte o ID do professor para um ObjectId do mongoose.
        const userObjectId = new mongoose.Types.ObjectId(userId);


        const offerList: IOffer[] = await OfferModel.aggregate([
            {
                $match: {
                    teacher: userObjectId,
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
                    latestOffer: { $first: '$$ROOT' },
                },
            },
            {
                $replaceRoot: { newRoot: '$latestOffer' },
            },
        ]);

        // Excluir registros duplicados mantendo apenas o mais recente
        await OfferModel.deleteMany({
            _id: { $nin: offerList.map((offer) => offer._id) },
        });

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: offerList,
          })

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a presença</h1> <p>${error}</p>`);
    }
}


export async function getReportBySubject(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        // TRABALHANDO5 (GET)

        // URL PARA TESTAR a consulta das ofertas do dia 07/03/2024:
        // http://localhost:4444/class-offer/65e641c85d7e2314d26a6a82?date=2024-03-09


        // Extrai o ID do professor a partir dos parâmetros da requisição.
        const userId = req.params.user;

        if (!userId || !req.query['date'])
            return res.status(400).send(`<h1>ID do professor ou data ausente</h1>`)

        // Extrai a data da consulta da query da requisição e converte para um objeto Date
        const dateQueryParam: string = req.query.date as string; // Ajuste o tipo conforme necessário
        const dateFilter = new Date(dateQueryParam);

        // Verifica se a data é válida
        if (isNaN(dateFilter.getTime())) {
            return res.status(400).json({ mensagem: 'Formato de data inválido' });
        }

        // Converte o ID do professor para um ObjectId do mongoose.
        const userObjectId = new mongoose.Types.ObjectId(userId);


        const offerList: IOffer[] = await OfferModel.aggregate([
            {
                $match: {
                    teacher: userObjectId,
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
                    latestOffer: { $first: '$$ROOT' },
                },
            },
            {
                $replaceRoot: { newRoot: '$latestOffer' },
            },
        ]);

        // Excluir registros duplicados mantendo apenas o mais recente
        await OfferModel.deleteMany({
            _id: { $nin: offerList.map((offer) => offer._id) },
        });

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: offerList,
          })

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a presença</h1> <p>${error}</p>`);
    }
}

