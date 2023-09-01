import { Router } from 'express'
import saleController from '../../controllers/sale.controller'

export const router = Router()

router.post('/', saleController.handleNewSale)
