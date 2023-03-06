import { Router } from 'express';
import categoryController from '../../controllers/category.controller';
import { verifyEncargado, verifyDueño } from '../../middlewares/verifyJwt';
import { checkDuplicateCategories } from '../../middlewares/verifyNewCat';

export const router = Router();

router.post('/', [verifyEncargado, checkDuplicateCategories], categoryController.handleNewCategory);
router.get('/', [verifyEncargado], categoryController.getCategoriesByOrganization);
router.delete('/:id', [verifyDueño], categoryController.handleDeleteCategory);