import User from '../models/user.model'
import Role from '../models/role.model'
import Organization from '../models/organization.model'
import { Request, Response } from 'express'
import logger from '../config/logger'
import { IUser } from '../interfaces/user.interface'

const handleNewEmployee = async (req: Request, res: Response) => {
    const { employeeUser, password, email, employeeRoles, organization } = req.body
    if (!employeeUser || !password || !email || !employeeRoles || !organization) return res.status(400).json({ message: 'Missing parameters' })

    try {
        const foundRoles = await Role.find({ name: { $in: employeeRoles } })

        console.log(employeeRoles)

        const foundOrganization = await Organization.find({ name: organization })

        const newUser = new User({
            username: employeeUser,
            password,
            email,
            roles: foundRoles.map(role => role._id),
            organization: foundOrganization.map(organization => organization._id)
        })

        await newUser.save()

        return res.status(201).json({ message: 'User created', user: newUser })
    } catch (error) {
        logger.error.error(error)
        return res.status(500).json({ message: 'Internal server error', error })
    }
}

const handleUpdateEmployee = async (req: Request, res: Response) => {
    const { id } = req.params
    const { employeeUser, password, email, employeeRoles, organization } = req.body

    if (!id) return res.status(400).json({ message: 'Missing parameters' })

    try {
        const foundEmployee: IUser | null = await User.findOne({ _id: id })
        if (!foundEmployee) return res.status(404).json({ message: 'Employee not found' })

        const foundRoles = await Role.find({ name: { $in: employeeRoles } })

        const foundOrganization = await Organization.find({ name: organization })

        const updateEmployee = await User.findOneAndUpdate({ _id: foundEmployee._id }, {
            username: employeeUser || foundEmployee.username,
            password: password || foundEmployee.password,
            email: email || foundEmployee.email,
            roles: foundRoles.map(role => role._id) || foundEmployee.roles,
            organization: foundOrganization.map(organization => organization._id) || foundEmployee.organization
        }, { new: true })

        res.status(200).json({ message: 'Employee updated', employee: updateEmployee })

    } catch (error) {
        logger.error.error(error)
        return res.status(500).json({ message: 'Internal server error', error })
    }
}

const handleGetEmployees = async (req: Request, res: Response) => {
    try {
        const getRoles = await Role.find({
            name: {
                $in: ['dueño', 'empleado', 'encargado']
            }
        })

        if (getRoles) {
            const employees = await User.find({
                roles: {
                    $in: getRoles.map(role => role._id)
                }
            }).populate('roles').populate('organization')

            res.status(200).json({ message: 'Employees found', employees })
        } else {
            res.status(404).json({ message: 'Employee role not found' })
        }

    } catch (error) {
        logger.error.error(error)
        return res.status(500).json({ message: 'Internal server error', error })
    }
}

export default {
    handleNewEmployee,
    handleUpdateEmployee,
    handleGetEmployees
}