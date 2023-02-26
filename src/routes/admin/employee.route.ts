import { Router } from 'express'
import employeeController from '../../controllers/employee.controller'

export const router = Router()

router.post('/', employeeController.handleNewEmployee)
router.get('/', employeeController.handleGetEmployees)
router.put('/:id', employeeController.handleUpdateEmployee)