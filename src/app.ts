import express, { Application, Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { connect } from './config/mongo'
import { createRoles } from './libs/initialSetup'
import { router as registerRouter } from './routes/register.route'
import { router as authRouter } from './routes/auth.route'

const app: Application = express()

/*    CONFIGS    */
connect()
createRoles()

/*    MIDDLEWARES    */
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(cors())

/*    ROUTES    */
app.use('/auth/register', registerRouter)
app.use('/auth/login', authRouter)

/*    ERROR    */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(500).json('Server error')
  next()
})

export default app
