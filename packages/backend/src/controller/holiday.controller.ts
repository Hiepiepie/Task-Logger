import {Request, Response} from "express";
import fetch from "node-fetch";

export const getHolidayApi = async (_: Request, res: Response) => {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    const response = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=3e987b59a87572df172295dc9efeb7dc666073f0&country=DE&year=${year}&month=${month}`, {
        method: 'GET',
    });
    const holidays = await response.json();
    res.status(holidays.meta.code).send({
        data: holidays.response
    });
}