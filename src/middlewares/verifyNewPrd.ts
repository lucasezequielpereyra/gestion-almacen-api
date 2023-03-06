import Product from '../models/product.model';
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const checkDuplicateProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { sku, EAN } = req.body;

    const searchBySku = await Product.find({ sku: sku }).exec();
    if (searchBySku.length > 0) return res.sendStatus(400)

    const searchByEAN = await Product.find({ EAN: EAN }).exec();
    if (searchByEAN.length > 0) return res.sendStatus(400)

    next();
}