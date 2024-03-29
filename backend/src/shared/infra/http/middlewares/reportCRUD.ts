
import { NextFunction, Request, Response } from 'express'
import { OfferModel } from '../../../../entities/offer'
import mongoose, { Types } from 'mongoose'
import { getClassOfferList } from './classOfferCRUD';
import { getAllPresenceList, deleteOldPresences, countPresence, countPercent } from './presenceCRUD';
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
    next: NextFunction
) {
    try {

        // Extrai o ID do professor a partir dos parâmetros da requisição.
        const userId = req.query.userId;

        // Converte o ID do professor para um ObjectId do mongoose.
        const userObjectId = new mongoose.Types.ObjectId(userId as string);

        // Buscando ofertas e dizimos onde os dois não podem ser igualmente 0.
        const reportList: IOffer[] = await OfferModel.find({
            student: userObjectId,
            tithing: { $ne: 0 },
            offer: { $ne: 0 }
        });

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: reportList,
        })

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao buscar presença pelo ID</h1> <p>${error}</p>`);
    }
}


export async function getAllClassOffer(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const viewAll = req.query.viewAll;

        if (viewAll !== 'true') {
            return res.status(400).send(`<h1>Consulta inválida</h1>`);
        }

        // Buscando ofertas e dizimos onde os dois não podem ser igualmente 0.
        const reportList: IOffer[] = await OfferModel.find({});

        return res.status(200).json({
            success: true,
            message: 'Busca do relatório concluído com sucesso',
            items: reportList,
        })

    } catch (error) {
        return res.status(404).send(`<h1>Erro ao buscar todas as ofertas</h1> <p>${error}</p>`);
    }
}


export async function getReportByDateOrTeacherId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req?.query['teacherId'])
            return res.status(400).send(`<h1>Querystring ausente ou inválida</h1> <p>- teacherId: ${!!req.query['teacherId']}</p>`);

        let reportList = await getAllPresenceList(req, res, next);
        let classOfferList = await getClassOfferList(req, res, next);

        // Função para mesclar os arrays
        function mergeArrays(reportList, classOfferList, numberOfPresence) {
            // Criar um objeto para armazenar os elementos com _id como chave
            const mergedMap = {};
            // Adicionar elementos de reportList ao objeto mergedMap
            reportList.forEach(item => {
                const itemId = item.subject[0]._id.toString();
                if (!mergedMap[itemId]) {
                    mergedMap[itemId] = item;

                } else {
                    // Mesclar os objetos se o _id já existir
                    mergedMap[itemId] = { ...mergedMap[itemId], ...item };
                }
                if (typeof mergedMap[itemId].tithing !== 'number')
                    mergedMap[itemId].tithing = 0;

                if (typeof mergedMap[itemId].offer !== 'number')
                    mergedMap[itemId].offer = 0;
            });

            // Adicionar elementos de classOfferList ao objeto mergedMap
            classOfferList.forEach(item => {
                const itemId = item.subject[0]._id.toString();

                if (!mergedMap[itemId]) {
                    mergedMap[itemId] = item;
                } else {
                    if (typeof mergedMap[itemId].tithing === 'number') mergedMap[itemId].tithing += item?.tithing || 0;
                    else mergedMap[itemId].tithing = item?.tithing || 0;

                    if (typeof mergedMap[itemId].offer === 'number') mergedMap[itemId].offer += item?.offer || 0;
                    else mergedMap[itemId].offer = item?.offer || 0;
                }
            });

            // Retornar os valores do objeto mesclado como um array
            return Object.values(mergedMap).map((item: any) => {
                if (numberOfPresence[item.subjectName]) {
                    item.presenceNumber = numberOfPresence[item.subjectName];
                } else {
                    item.presenceNumber = 0;
                }
                if (typeof item?.nameStudent === 'string')
                    delete item.nameStudent;

                if (item?.presence === true)
                    delete item.presence;

                return item; // Retornar o item modificado
            });

        }

        // === Object.keys(mergedMap)
        const numberOfPresence = await countPresence(reportList);
        //const numberOfPresence = await deleteOldPresences(reportList);
        // Chamada da função para mesclar os arrays
        const mergedArray = mergeArrays(reportList, classOfferList, numberOfPresence);

        try {
            let tithing: number = 0;
            let offer: number = 0;
            //let subject: { [key: string]: any } = {};

            reportList = mergedArray;

            if (Array.isArray(reportList)) {

                reportList.forEach((element, index) => {
                    tithing += element?.tithing || 0;
                    offer += element?.offer || 0;
                });

                reportList.forEach((element, index) => {
                    //console.log(element);
                    reportList[index].teacherName = element?.teacher[0]?.name || '';
                    //reportList[index].studentName = element?.student[0]?.name || '';
                    reportList[index].subjectName = element?.subject[0]?.name || '';
                    reportList[index].studentsNumber = element?.subject[0]?.students.length;
                });

                reportList = Object.values(reportList.reduce((acc, cur) => {
                    const key = cur.subjectName;
                    if (!acc[key]) {
                        acc[key] = { ...cur };
                    } else {
                        acc[key].tithing += cur.tithing;
                        acc[key].offer += cur.offer;
                    }
                    return acc;
                }, {}));
            }
        } catch (error) {
            console.log(error);
        }


        reportList = await countPercent(reportList);

        reportList.sort((a, b) => b.presenceNumber - a.presenceNumber);
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

export async function getReportBySubjectId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        /* AS OUTRAS CLASSES JÁ FAZEM ISSO
        // Verifica se a data é válida
        const { startDate, endDate } = await checkDateQuery(req, res, next);
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Formato de data inválido',
                items: [],
            });
        }
        */

        return res.status(200).send('<h1>CRIAR RELATÓRIO INDIVIDUAL POR TURMA<h1/>');




        const getReportList = async () => {
            try {
                return await getClassOfferList(req, res, next);
                return {
                    classOffer: await getClassOfferList(req, res, next),
                    presence: await getClassOfferList(req, res, next),
                };
            } catch (e) {
                console.error(e);
                return null;
            }
        }

        // Executa a função reportList assíncrona para obter a lista de ofertas
        let reportList = await getReportList();

        //  console.log(reportList[0]?.student)
        /*
        console.log(reportList[0]?.teacher)
        console.log(reportList[0]?.student)
        console.log(reportList[0]?.subject)
        */
        /*
[
  {teacher
    _id: new ObjectId("65e641c85d7e2314d26a6a82"),
    code: '1',
    name: 'Newuba',
    email: 'newuba@gmail.com',
    password: '$2b$10$.zIkVJkrfxgAKPci0xJsIOBsdXo2C7EqKNgLxMpiTrDAbxwbVhNla',
    occupation: 'teacher',
    avatar: null,
    avatarURL: null,
    teacher: null,
    warningsAmount: 0,
    createdAt: 2024-03-04T21:48:56.011Z,
    __v: 0
  }
]
[
  {student
    _id: new ObjectId("65e6421e5d7e2314d26a6aa3"),
    code: '1',
    name: 'João',
    email: 'joao@gmail.com',
    password: '$2b$10$87rSYt.r32Vxzn06AKMotej1XfOWGcXc/NZzchPI2N25y9UPeCOP2',
    occupation: 'student',
    avatar: null,
    avatarURL: null,
    teacher: new ObjectId("65e641c85d7e2314d26a6a82"),
    warningsAmount: 1,
    createdAt: 2024-03-04T21:50:22.772Z,
    __v: 0
  }
]
[
  {subject
    _id: new ObjectId("65ee1228122fdcd45587431e"),
    code: '2',
    name: 'Professores',
    students: [
      new ObjectId("65e6421e5d7e2314d26a6aa3"),
      new ObjectId("65e64693c5250fd1e67f8927"),
      new ObjectId("65e73c908ca2b06d027a76d0")
    ],
    teacher: new ObjectId("65e641c85d7e2314d26a6a82"),
    createdAt: 2024-03-10T20:03:52.600Z,
    __v: 0
  }
]

        console.log('--reportList--')
        */
        /////////////////////////////
        ////////////////////////////
        let tithing: number = 0;
        let offer: number = 0;
        let subject: { [key: string]: any } = {};

        try {
            if (Array.isArray(reportList)) {

                reportList.forEach((element, index) => {
                    tithing += element?.tithing || 0;
                    offer += element?.offer || 0;
                });

                reportList.forEach((element, index) => {
                    //console.log(element);
                    reportList[index].teacherName = element?.teacher[0]?.name;
                    reportList[index].studentName = element?.student[0]?.name;
                    reportList[index].subjectName = element?.subject[0]?.name;
                    reportList[index].studentsNumber = element?.subject[0]?.students.length;

                    if (!!subject[element?.subject[0]?.subjectName]) {
                        reportList[subject[element?.subject[0]?.subjectName].currentIndex].countTithing += element?.tithing || 0;
                        reportList[subject[element?.subject[0]?.subjectName].currentIndex].countOffer += element?.offer || 0;
                    } else {
                        subject[element?.subject[0]?.subjectName] = {
                            currentIndex: index,
                            countTithing: element?.tithing || 0,
                            countOffer: element?.offer || 0
                        };
                        reportList[index].countTithing = element?.tithing || 0;
                        reportList[index].countOffer = element?.offer || 0;
                    }
                });
                reportList.push({
                    totalTithing: tithing,
                    totalOffer: offer,
                });

                // Filtering objects with the same value for the key 'subjectName'
                reportList = reportList.filter((object, index, array) => {
                    return array.findIndex(o => o.subjectName === object.subjectName) === index;
                });

            }
        } catch (error) {
            console.log(error);
        }

        /*
        console.log('--reportList--')
        console.log(reportList)
        console.log('--reportList--')
        */
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
