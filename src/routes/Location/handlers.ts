import { send400Error } from './../../tools/Error/400';
import { Request, Response, NextFunction } from 'express';

interface Data {
    city: string;
    countryName: string;
}

export const getCity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const lang = req.query.lang || "en";

    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`)
    const data: Data  = await response.json()

    if (!data) return send400Error(res);

    res.send({
        city: data.city
    })
}