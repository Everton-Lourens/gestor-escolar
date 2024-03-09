
import { NextFunction, Request, Response } from 'express'
import { OfferModel } from '../../../../entities/offer'
import mongoose, { Types } from 'mongoose'

// Middleware para enviar dados para o mongo

export async function sendClassOffer(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try { // TRABALHANDO3 (SAVE)

        // Verificando se a requisição, o corpo da requisição ou o usuário no corpo da requisição são nulos ou inválidos
        if (!req || !req.body || !req.body.data)
            return res.status(400).send(`<h1>Corpo da requisição ausente ou inválido</h1> <p>- req: ${!!req}<br>- body: ${!!req?.body}<br>- classOffer: ${!!req.body.data}</p>`);

        const { student, subject } = req.body.data;
        const studentId = student._id;
        const { _id, name, teacher, offer } = subject;

        const newOffer = (Number(offer) || 0).toFixed(2);

        // Criando uma nova instância do modelo OfferModel com as propriedades extraídas.
        const sendNewOffer = new OfferModel({
            subject: _id,
            className: name,
            teacher,
            student: studentId,
            offer: newOffer,
        });

        // Salvando a nova instância no banco de dados.
        await sendNewOffer.save();

        return res.status(200).send(`<h1>sendOffer</h1>`);

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a a oferta</h1> <p>${error}</p>`);
    }
}


export async function getClassOfferListForDate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        // TRABALHANDO5 (GET)

        // URL PARA TESTAR a consulta das ofertas do dia 07/03/2024:
        // http://localhost:4444/class-offer/65e641c85d7e2314d26a6a82?date=2024-03-09


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


        const offerList: IOffer[] = await OfferModel.aggregate([
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

        return res.status(200).json({ data: { count: offerList.length, offerList } });

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a presença</h1> <p>${error}</p>`);
    }
}
