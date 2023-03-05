import { Router } from 'express';
import categoryController from '../../controllers/category.controller';

export const router = Router();

router.post('/', categoryController.handleNewCategory);
router.get('/:organization', categoryController.getCategoriesByOrganization);