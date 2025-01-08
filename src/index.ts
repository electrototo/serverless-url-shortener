import cors from 'cors';
import express, { Express, Request } from 'express';
import { DDBLink } from './models/link';

const app: Express = express();
const port = process.env.PORT || 3000;

const alphabet = 'abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const baseDomain = 'https://s.to';

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    const links = await DDBLink.scan.go();

    console.log(links);
    res.send(JSON.stringify(links));
});

app.post('/', async (req, res) => {
    // try and find if the URL has not been created before
    const url = req.body.url;
    const response = await DDBLink.query.byUrl({ url }).go();

    if (response.data.length > 0) {
        const shortened = response.data[0];

        res.send(JSON.stringify({
            url,
            shortCode: shortened?.shortcode
        }));

        return;
    }

    let shortCode: string = '';
    for (let i = 0; i < 7; i++) {
        shortCode = shortCode + alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    const shortened = `${baseDomain}/${shortCode}`;

    await DDBLink.create({
        url: req.body.url,
        shortcode: shortened
    }).go();

    res.send(JSON.stringify({
        url: req.body.url,
        shortcode: shortened
    }));
});

app.get('/:shortCode', async (req, res) => {
    const shortCode = `${baseDomain}/${req.params.shortCode}`;
    const response = await DDBLink.get({
        shortcode: shortCode
    }).go();

    console.log(`shortCode: ${req.params.shortCode}, response`, response);

    if (!response.data?.url) {
        res.status(404).end();
        return;
    }

    res.redirect(response.data!.url);
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
})