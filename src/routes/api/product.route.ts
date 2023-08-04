import { Router } from 'express'
import producController from '../../controllers/product.controller'
import { verifyEncargado, verifyEmpleado } from '../../middlewares/verifyJwt'
import { checkDuplicateProducts } from '../../middlewares/verifyNewPrd'

export const router = Router()

router.post(
  '/',
  [verifyEncargado, checkDuplicateProducts],
  producController.handleNewProduct
)

router.get('/', [verifyEmpleado], producController.getProductsByOrganization)

router.get(
  '/inactive',
  [verifyEmpleado],
  producController.getDeletesProductsByOrganization
)

router.put(
  '/:id',
  [verifyEncargado, checkDuplicateProducts],
  producController.handleUpdateProduct
)

router.put(
  '/inactive/:id',
  [verifyEncargado],
  producController.handleActiveProduct
)

router.delete(
  '/:id',
  [verifyEncargado],
  producController.handleLogicalDeleteProduct
)
