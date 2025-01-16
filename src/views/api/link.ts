import express from 'express';
import { LinkController } from '../../controllers/link';
import { BASE_DOMAIN } from '../../globals';
import { DDBLink } from '../../models/link';
import { z } from 'zod';

const linkController = new LinkController({
    baseDomain: BASE_DOMAIN
});

const router = express.Router();

router.get('/', async (req, res) => {
    const links = await DDBLink.scan.go();

    res.send(JSON.stringify(links));
});

const ListShortCodesForUrlResponse = z.object({
    cursor: z.string().or(z.null()),
    data: z.array(z.object({
        url: z.string(),
        shortcode: z.string(),
        creationDate: z.string()
    }))
})

router.get('/:safeUrl', async (req, res) => {
    // decode the base64 encoded link

    const decodedUrl = atob(req.params.safeUrl);
    const urls = await linkController.retrieveURLShortCodes({ url: decodedUrl });

    res.send(JSON.stringify(ListShortCodesForUrlResponse.parse(urls)));
});

const CreateLinkInputSchema = z.object({
    url: z.string(),
    reuse: z.boolean().optional()
});

const CreateLinkOutputSchema = z.object({
    url: z.string(),
    shortcode: z.string(),
    creationDate: z.string()
});

router.post('/', async (req, res) => {
    const input = CreateLinkInputSchema.parse(req.body);
    const link = await linkController.create(input.url, input.reuse);

    const output = CreateLinkOutputSchema.parse({
        url: link.url,
        shortcode: link.shortcode,
        creationDate: link.creationDate
    });

    res.send(JSON.stringify(output));
});

router.delete('/:shortcode', async (req, res) => {
    // Decode the B64 provided shortcode
    const shortcode = atob(req.params.shortcode);

    await linkController.delete(shortcode);

    res.status(200).send();
});

export default router;