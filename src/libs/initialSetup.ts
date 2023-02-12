import Role from '../models/role.model'
import { IRole } from '../interfaces/role.interface'
import logger from '../config/logger'

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount()
    if (count > 0) return

    logger.info.info('Creating roles...')

    const values: IRole[] = await Promise.all([
      new Role({ name: 'user' }).save(),
      new Role({ name: 'admin' }).save()
    ])

    logger.info.info(values)
  } catch (err) {
    logger.error.error(err)
  }
}
