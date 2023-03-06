import { Router } from 'express';
import producController from '../../controllers/product.controller';
import { verifyEncargado, verifyEmpleado } from '../../middlewares/verifyJwt';

export const router = Router();

router.post('/', [verifyEncargado], producController.handleNewProduct);
router.get('/', [verifyEmpleado], producController.getProductsByOrganization);
router.put('/:id', [verifyEncargado], producController.handleUpdateProduct);