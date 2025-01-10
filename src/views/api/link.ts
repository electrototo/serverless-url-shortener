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

const CreateLinkInputSchema = z.object({
    url: z.string()
});

const CreateLinkOutputSchema = z.object({
    url: z.string(),
    shortcode: z.string(),
    creationDate: z.string()
});

router.post('/', async (req, res) => {
    const input = CreateLinkInputSchema.parse(req.body);
    const link = await linkController.create(input.url);

    const output = CreateLinkOutputSchema.parse({
        url: link.url,
        shortcode: link.shortcode,
        creationDate: link.creationDate
    });

    res.send(JSON.stringify(output));
});

router.delete('/:shortcode', async (req, res) => {
    await linkController.delete(req.params.shortcode);

    res.status(200).send();
});

export default router;