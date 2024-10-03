import express from 'express'
import pageController from '../controllers/pageController.js'

const pageRouter = express.Router()

pageRouter.get('/about', pageController.getAboutPage)
pageRouter.get('/contact', pageController.getContactPage)

export default pageRouter