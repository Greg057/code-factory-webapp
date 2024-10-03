import express from 'express'
import aboutController from '../controllers/aboutController.js'

const projectsRouter = express.Router()

projectsRouter.get('/', aboutController.getAboutPage)

export default projectsRouter