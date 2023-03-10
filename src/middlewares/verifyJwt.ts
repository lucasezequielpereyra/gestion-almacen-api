import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import Role from '../models/role.model'
import { IRole } from '../interfaces/role.interface'

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secret'

export const vierifyJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: String | undefined = req.header('Authorization') || req.header('authorization')
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
    const authHeader: String | undefined = req.header('Authorization') || req.header('authorization')
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

export const verifyEmpleado = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: String | undefined = req.header('Authorization') || req.header('authorization')
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(
            token,
            JWT_SECRET,
            async (err: any, decoded: any) => {
                if (err) return res.sendStatus(403)
                const roles: IRole[] = decoded.UserInfo.roles
                const empleadoRole = await Role.findOne({ name: 'empleado' })
                if (!empleadoRole) return res.sendStatus(403)
                const isEmpleado = roles.some(role => role.toString() === empleadoRole._id.toString())
                if (!isEmpleado) return res.sendStatus(403)
                req.body.organization = decoded.UserInfo.organization
                next()
            }
        )
    } catch (error) {
        res.sendStatus(403)
    }
}

export const verifyEncargado = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: String | undefined = req.header('Authorization') || req.header('authorization')
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(
            token,
            JWT_SECRET,
            async (err: any, decoded: any) => {
                if (err) return res.sendStatus(403)
                const roles: IRole[] = decoded.UserInfo.roles
                const encargadoRole = await Role.findOne({ name: 'encargado' })
                if (!encargadoRole) return res.sendStatus(403)
                const isEncargado = roles.some(role => role.toString() === encargadoRole._id.toString())
                if (!isEncargado) return res.sendStatus(403)
                req.body.organization = decoded.UserInfo.organization
                next()
            }
        )
    } catch (error) {
        res.sendStatus(403)
    }
}

export const verifyDue??o = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: String | undefined = req.header('Authorization') || req.header('authorization')
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(
            token,
            JWT_SECRET,
            async (err: any, decoded: any) => {
                if (err) return res.sendStatus(403)
                const roles: IRole[] = decoded.UserInfo.roles
                const due??oRole = await Role.findOne({ name: 'due??o' }).exec()
                if (!due??oRole) return res.sendStatus(403)
                const isDue??o = roles.some(role => role.toString() === due??oRole._id.toString())
                if (!isDue??o) return res.sendStatus(403)
                next()
            }
        )
    } catch (error) {
        res.sendStatus(403)
    }
}