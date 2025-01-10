import express from 'express';
import { BASE_DOMAIN } from '../globals';
import { LinkController } from '../controllers/link';
import { Link } from '../models/link';

const router = express.Router();

const linkController = new LinkController({
    baseDomain: BASE_DOMAIN
});

router.get('/:shortcode', async (req, res) => {
    const shortCode = `${BASE_DOMAIN}/${req.params.shortcode}`;
    const link: Link | undefined = await linkController.retrieve({ shortcode: shortCode });

    if (!link) {
        res.status(404).end();
        return;
    }

    res.redirect(link.url);
});

export default router;