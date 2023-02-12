import express, { Application, Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import { connect } from './config/mongo'
import { createRoles } from './libs/initialSetup'

const app: Application = express()

/*    CONFIGS    */
connect()
createRoles()

/*    MIDDLEWARES    */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(cors())

/*    ERROR    */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(500).json('Server error')
  next()
})

export default app
