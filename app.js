import express from 'express'
import 'dotenv/config'
import projectsRouter from './routes/projectsRouter.js'
import pageRouter from './routes/pageRouter.js'
import sitemapRouter from './routes/sitemapRouter.js'


const app = express()
app.set('etag', 'strong');



// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

app.use(express.static('public'));


app.set("view engine", "ejs")
app.set("views", "views")

app.use("/", projectsRouter)
app.use("/sitemap.xml", sitemapRouter);
app.use("/page/", pageRouter)
app.use((req, res) => {
    res.status(404).render('404');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
