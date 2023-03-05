import Product from '../models/product.model';
import Category from '../models/category.model';
import logger from '../config/logger';
import { Request, Response } from 'express';

const handleNewProduct = async (req: Request, res: Response) => {
    const { sku, name, category, description, EAN, price_cost, price_sale, stock, organization } = req.body;

    if (!sku) return res.status(400).json({ error: 'Missing sku' });
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!category) return res.status(400).json({ error: 'Missing category' });
    if (!description) return res.status(400).json({ error: 'Missing description' });
    if (!EAN) return res.status(400).json({ error: 'Missing EAN' });
    if (!price_cost) return res.status(400).json({ error: 'Missing price_cost' });
    if (!organization) return res.status(400).json({ error: 'Missing organization' });

    try {
        const foundCategory = await Category.findOne({ name: category });
        if (!foundCategory) return res.status(400).json({ error: 'Category not found' });
        const newProduct = new Product({
            sku: sku,
            name: name,
            category: foundCategory,
            description: description,
            EAN: EAN,
            price_cost: price_cost,
            price_sale: price_sale,
            stock: stock,
            organization: organization
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json(`Product ${savedProduct.name} created`);
    } catch (err) {
        logger.error.error(err);
        res.status(500).json({ error: err });
    }
}

export default {
    handleNewProduct
}