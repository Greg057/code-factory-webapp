import express from 'express'
import projectsController from '../controllers/projectsController.js'

const projectsRouter = express.Router()

projectsRouter.get('/', projectsController.getProjects)
projectsRouter.get('/projects/:id', projectsController.getProjectDetails)
projectsRouter.get('/projects/:id/:milestone', projectsController.getMilestoneDetailsJSON);

export default projectsRouter