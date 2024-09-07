import express from 'express'
import projectsRouter from './routes/projectsRouter.js'

const app = express()

app.use(express.static('public'))

app.set("view engine", "ejs")
app.set("views", "views")

app.get("/", projectsRouter)

app.listen(8000, () => console.log("server started"))