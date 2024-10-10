import express from 'express'
import projectsRouter from './routes/projectsRouter.js'
import pageRouter from './routes/pageRouter.js'

const app = express()

app.use(express.static('public'))

app.set("view engine", "ejs")
app.set("views", "views")

app.use("/", projectsRouter)
app.use("/page/", pageRouter)
app.use((req, res, next) => {
    res.status(404).render('404');
});


app.listen(8000, () => console.log("server started"))