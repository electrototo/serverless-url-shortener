import { DDBLink, Link } from "../models/link";

export interface LinkControllerProps {
}

export class LinkController {
    alphabet: string = 'abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    baseDomain = 'https://s.to';

    constructor(props: LinkControllerProps) {
    }

    async retrieve(props: { shortcode?: string, url?: string }): Promise<Link | undefined> {
        const { url, shortcode } = props;

        if (url === undefined && shortcode === undefined || url !== undefined && shortcode !== undefined) {
            throw new Error('Either url or short code need to be defined');
        }

        const response = url !== undefined ?
            await DDBLink.query.byUrl({ url }).go() :
            await DDBLink.query.byShortCode({ shortcode: shortcode! }).go();

        if (response.data.length === 0) {
            return undefined;
        }

        const entry = response.data[0]!;

        return {
            url: entry.url,
            shortcode: entry.shortcode
        };
    }

    async create(url: string): Promise<Link> {
        // Will either shorten the link or return the already shortened version of the link
        const link: Link | undefined = await this.retrieve({ url });

        if (link) {
            return link;
        }

        const shortCode = this.createShortCode();
        const response = await DDBLink.create({
            url: url,
            shortcode: `${this.baseDomain}/${shortCode}`
        }).go();

        return {
            url: response.data.url,
            shortcode: response.data.shortcode
        }
    }

    createShortCode(length: number = 7): string {
        let shortCode: string = '';

        for (let i = 0; i < 7; i++) {
            shortCode = shortCode + this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
        }

        return shortCode;
    }
}