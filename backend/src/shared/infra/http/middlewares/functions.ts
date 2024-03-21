import { NextFunction, Request, Response } from 'express'


export async function checkDateQuery(
    req: Request,
    res: Response,
    next: NextFunction,
) {

    try {
        if (!req.query['startDate'] || !req.query['endDate']) {
            req.query.startDate = new Date().toISOString();
            req.query.endDate = new Date().toISOString();
        }

        // Extrai a data da consulta da query da requisição e converte para um objeto Date
        const startDateQueryParam: string = req.query.startDate as string; // Ajuste o tipo conforme necessário
        const startDateFilter = new Date(startDateQueryParam);

        // Extrai a data da consulta da query da requisição e converte para um objeto Date
        const endDateQueryParam: string = req.query.endDate as string; // Ajuste o tipo conforme necessário
        const endDateFilter = new Date(endDateQueryParam);

        // Verifica se a data é válida
        if (isNaN(startDateFilter.getTime()) || isNaN(endDateFilter.getTime())) {
            return { startDate: null, endDate: null };
        }
        console.log({ startDate: startDateFilter, endDate: endDateFilter });
        return { startDate: startDateFilter, endDate: endDateFilter };

    } catch (error) {
        return { startDate: null, endDate: null };
    }
}