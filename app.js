import express from 'express'
import projectsRouter from './routes/projectsRouter.js'
import aboutRouter from './routes/aboutRouter.js'

const app = express()

app.use(express.static('public'))

app.set("view engine", "ejs")
app.set("views", "views")

app.use("/", projectsRouter)
app.use("/about", aboutRouter)

app.listen(8000, () => console.log("server started"))