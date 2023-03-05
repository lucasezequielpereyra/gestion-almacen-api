import { Router } from 'express';
import producController from '../../controllers/product.controller';
import { verifyEncargado } from '../../middlewares/verifyJwt';

export const router = Router();

router.post('/', [verifyEncargado], producController.handleNewProduct);