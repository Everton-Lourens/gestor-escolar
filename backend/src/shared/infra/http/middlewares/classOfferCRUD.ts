
import { NextFunction, Request, Response } from 'express'
import { OfferModel } from '../../../../entities/offer'
import mongoose, { Types } from 'mongoose'
import { checkDateQuery } from './functions';


// Middleware para enviar dados para o mongo

export async function sendClassOffer(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try { // TRABALHANDO3 (SAVE)

        // Verifica se a data é válida
        const isValidDateQuery = await checkDateQuery(req, res, next);
        if (!isValidDateQuery) {
            return res.status(400).json({
                success: false,
                message: 'Formato de data inválido',
                items: [],
            });
        }

        // Verificando se a requisição, o corpo da requisição ou o usuário no corpo da requisição são nulos ou inválidos
        if (!req || !req.body || !req.body.data)
            return res.status(400).send(`<h1>Corpo da requisição ausente ou inválido</h1> <p>- req: ${!!req}<br>- body: ${!!req?.body}<br>- classOffer: ${!!req.body.data}</p>`);

        const { student, subject } = req.body.data;
        const studentId = student._id;
        const { _id, teacher, offer, tithing } = subject;

        /*
        console.log(req.body.data);
{
  _id: '65eb7a078b29e359dfd48663',
  student: {
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
  },
  subject: {
    _id: '65eb74468b29e359dfd4860a',
    code: '1',
    name: 'Jovens',
    students: [
      '65e6421e5d7e2314d26a6aa3',
      '65e7ad132f436f4502356f92',
      '65e7ad2f2f436f4502356fa6',
      '65e7ad442f436f4502356fae',
      '65ea31b7e44d88a144fe74c2'
    ],
    teacher: '65e641c85d7e2314d26a6a82',
    createdAt: '2024-03-08T20:25:42.442Z',
    __v: 0,
    tithing: 1002,
    offer: 0
  },
  firstGrade: 0,
  secondGrade: 0,
  createdAt: '2024-03-08T20:50:15.903Z',
  __v: 0
}

        */

        const newTithing = (Number(tithing) || 0).toFixed(2);
        const newOffer = (Number(offer) || 0).toFixed(2);

        if (!newTithing && !newOffer)
            return res.status(400).send(`<h1>Corpo da requisição ausente ou inválido</h1> <p>- req: ${!!req}<br>- body: ${!!req?.body}<br>- classOffer: ${!!req.body.data}</p>`);

        // Criando uma nova instância do modelo OfferModel com as propriedades extraídas.
        const sendNewOffer = new OfferModel({
            subject: _id,
            teacher,
            student: studentId,
            tithing: newTithing || 0,
            offer: newOffer || 0,
        });

        // Salvando a nova instância no banco de dados.
        await sendNewOffer.save();

        return res.status(200).send(`<h1>sendOffer and sendTithing</h1>`);

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao salvar a a oferta</h1> <p>${error}</p>`);
    }
}


export async function getClassOffer(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // URL PARA TESTAR a consulta das ofertas do dia 07/03/2024:
        //http://localhost:4444/class-offer?userId=65e6421e5d7e2314d26a6aa3

        if (!req.query['userId'] && !req.query['viewAll']) {
            return res.status(400).send(`<h1>Querystring ausente ou inválida</h1> <p>- userId: ${!!req.query['userId']}<br>- viewAll: ${!!req.query['viewAll']}</p>`);
        }

        if (req.query['viewAll']) {
            return await getAllClassOffer(req, res, next);
        }

        if (req.query['userId']) {
            return await getClassOfferById(req, res, next);
        }

        return res.status(400).send(`<h1>Querystring ausente ou inválida</h1> <p>- userId: ${!!req.query['userId']}<br>- viewAll: ${!!req.query['viewAll']}</p>`);

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao buscar presença pelo ID</h1> <p>${error}</p>`);
    }
}


export async function getClassOfferById(
    req: Request,
    res: Response,
    _next: NextFunction
) {
    try {

        // Extrai o ID do professor a partir dos parâmetros da requisição.
        const userId = req.query.userId;

        // Converte o ID do professor para um ObjectId do mongoose.
        const userObjectId = new mongoose.Types.ObjectId(userId as string);

        // Buscando ofertas e dizimos onde os dois não podem ser igualmente 0.
        const offerList: IOffer[] = await OfferModel.find({
            student: userObjectId,
            tithing: { $ne: 0 },
            offer: { $ne: 0 }
        });

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: offerList,
        })

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao buscar presença pelo ID</h1> <p>${error}</p>`);
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
        const offerList: IOffer[] = await OfferModel.find({});

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: offerList,
        })

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao buscar todas as ofertas</h1> <p>${error}</p>`);
    }
}


export async function getClassOfferListByDateOrTeacherId(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        // Executa a função classOfferList assíncrona para obter a lista de ofertas
        const classOfferList = await getClassOfferList(req, res, next);

        const sucess = (Array.isArray(classOfferList) && classOfferList.length > 0) ? true : false;

        return res.status(sucess ? 200 : 400).json({
            success: true,
            message: sucess ? 'Busca do relatório concluído com sucesso' : 'Busca do relatório falhou',
            items: classOfferList || [],
        })

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: `Erro ao buscar ofertas das turma pela data: "${error}"`,
            items: [],
        });
    }
}

export async function getClassOfferList(
    req: Request,
    res: Response,
    next: NextFunction,
) {

    if (!req?.query['teacherId'])
        return res.status(400).send(`<h1>Querystring ausente ou inválida</h1> <p>- teacherId: ${!!req.query['teacherId']}</p>`);

    // Verifica se a data é válida
    const { startDate, endDate } = await checkDateQuery(req, res, next);
    const teacherId = req.query?.teacherId || null;

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: 'Formato de data inválido',
            items: [],
        });
    }
    try {
        let offerList = await OfferModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate), // Data maior ou igual a startDate
                        $lte: new Date(endDate)    // Data menor ou igual a endDate
                    },
                    teacher: new mongoose.Types.ObjectId(teacherId as string)// Filtrar por teacherId
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

        /*
        if (offerList.length === 0) {
            offerList = await OfferModel.aggregate([
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
        */

        return offerList;

        await OfferModel.deleteMany({
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