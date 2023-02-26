import { Router } from 'express';
import categoryController from '../../controllers/category.controller';

const router = Router();

router.post('/', categoryController.handleNewCategory);