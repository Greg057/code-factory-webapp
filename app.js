import express from 'express';
import 'dotenv/config';
import projectsRouter from './routes/projectsRouter.js';
import pageRouter from './routes/pageRouter.js';
import sitemapRouter from './routes/sitemapRouter.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
});

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-cdn.com", "https://www.googletagmanager.com", "https://d3js.org", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: ["'self'", "trusted-cdn.com"],
        imgSrc: ["'self'", "trusted-cdn.com"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "trusted-cdn.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
    }
}));

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.set("view engine", "ejs")
app.set("views", "views")

app.use("/", projectsRouter)
app.use("/sitemap.xml", sitemapRouter);
app.use("/page/", pageRouter)

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
