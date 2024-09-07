import express from 'express'
import projectsController from '../controllers/projectsController.js'

const projectsRouter = express.Router()

projectsRouter.get('/', projectsController.getProjects)

export default projectsRouter