import { Router } from 'express';
import categoryController from '../../controllers/category.controller';
import { verifyEncargado, verifyDueño } from '../../middlewares/verifyJwt';

export const router = Router();

router.post('/', [verifyEncargado], categoryController.handleNewCategory);
router.get('/', categoryController.getCategoriesByOrganization);
router.delete('/:id', [verifyDueño], categoryController.handleDeleteCategory);