import express, { Application, Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import credentials from './middlewares/credentials'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { connect } from './config/mongo'
import { createRoles } from './libs/initialSetup'
import { vierifyJwt } from './middlewares/verifyJwt'
import { verifyAdmin } from './middlewares/verifyJwt'
import { router as registerRouter } from './routes/register.route'
import { router as authRouter } from './routes/auth.route'
import { router as refreshTokenRouter } from './routes/refreshToken.route'
import { router as organizationRouter } from './routes/admin/organization.route'
import { router as organizationApiRouter } from './routes/api/organization.route'
import { router as employeeRouter } from './routes/admin/employee.route'

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
// CORS
app.use(credentials)
app.use(cors({ origin: true, credentials: true }))

/*    ROUTES    */
app.use('/auth/register', registerRouter)
app.use('/auth/login', authRouter)
app.use('/auth/refresh', refreshTokenRouter)

app.use(vierifyJwt) // JWT verification in next routes
app.use('/api/organization', organizationApiRouter)

app.use(verifyAdmin) // Admin verification in next routes
app.use('/admin/organization', organizationRouter)
app.use('/admin/employee', employeeRouter)


/*    ERROR    */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(500).json('Server error')
  next()
})

export default app
