import { Router } from 'express'
import ownerController from '../../controllers/owner.controller'

export const router = Router()

router.get('/employees', ownerController.getOrgazationEmployees)
