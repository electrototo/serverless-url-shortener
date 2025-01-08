import cors from 'cors';
import express, { Express } from 'express';
import { DDBLink, Link } from './models/link';
import { LinkController } from './controllers/link';

const app: Express = express();
const port = process.env.PORT || 3000;

const baseDomain = 'https://s.to';

app.use(cors());
app.use(express.json());

const linkController = new LinkController({});

app.get('/', async (req, res) => {
    const links = await DDBLink.scan.go();

    res.send(JSON.stringify(links));
});

app.post('/', async (req, res) => {
    // try and find if the URL has not been created before
    const url = req.body.url;
    const link = await linkController.create(url);

    res.send(JSON.stringify(link));
});

app.get('/:shortCode', async (req, res) => {
    const shortCode = `${baseDomain}/${req.params.shortCode}`;
    const link: Link | undefined = await linkController.retrieve({ shortcode: shortCode });

    if (!link) {
        res.status(404).end();
        return;
    }

    res.redirect(link.url);
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
})