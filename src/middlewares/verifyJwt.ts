import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import Role from '../models/role.model'
import { IRole } from '../interfaces/role.interface'

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secret'

export const vierifyJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: String | undefined = req.header('Authorization') || req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(
            token,
            JWT_SECRET,
            (err: any, decoded: any) => {
                if (err) return res.sendStatus(403)
                req.body.username = decoded.UserInfo.username
                req.body.roles = decoded.UserInfo.roles
                next()
            }
        )
    } catch (error) {
        res.sendStatus(403)
    }
}

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: String | undefined = req.header('Authorization') || req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(
            token,
            JWT_SECRET,
            async (err: any, decoded: any) => {
                if (err) return res.sendStatus(403)
                const roles: IRole[] = decoded.UserInfo.roles
                const adminRole = await Role.findOne({ name: 'admin' }).exec()
                if (!adminRole) return res.sendStatus(403)
                const isAdmin = roles.some(role => role.toString() === adminRole._id.toString())
                if (!isAdmin) return res.sendStatus(403)
                next()
            }
        )
    } catch (error) {
        res.sendStatus(403)
    }
}