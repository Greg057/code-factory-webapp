import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
import { Router } from 'express';

const sitemapRouter = Router();

sitemapRouter.get('/', async (req, res) => {
    try {
        res.header('Content-Type', 'application/xml');
        res.header('Content-Encoding', 'gzip');

        const smStream = new SitemapStream({ hostname: 'https://code-factory.io' });
        const pipeline = smStream.pipe(createGzip());

        // Add each page URL
        smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
        smStream.write({ url: '/projects', changefreq: 'weekly', priority: 0.8 });
        smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });
        
        // Add more routes as needed
        smStream.end();

        // Stream the response
        streamToPromise(pipeline).then((sm) => res.send(sm)).catch((e) => {
            console.error(e);
            res.status(500).end();
        });
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

export default sitemapRouter;
