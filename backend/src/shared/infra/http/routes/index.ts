import { Router } from 'express'
import { usersRoutes } from './users'
import { subjectsRoutes } from './subjects'
import { warningsRoutes } from './warnings'
import { authenticateRoutes } from './authenticate'
import { studentsRoutes } from './students'
import { gradesRoutes } from './grades'

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/subjects', subjectsRoutes)
routes.use('/warnings', warningsRoutes)
routes.use('/students', studentsRoutes)
routes.use('/grades', gradesRoutes)
routes.use(authenticateRoutes)

export { routes }
