import { DDBLink, Link } from "../models/link";

export interface Paginated<T> {
    data: T[];
    cursor: string | null;
}

export interface LinkControllerProps {
    baseDomain: string;
}

export class LinkController {
    alphabet: string = 'abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    baseDomain: string;

    constructor(props: LinkControllerProps) {
        this.baseDomain = props.baseDomain;
    }

    async retrieveURLShortCodes(props: { url: string }): Promise<Paginated<Link>> {
        const response = await DDBLink.query.byUrl({ url: props.url }).go();

        return {
            cursor: response.cursor,
            data: response.data.map(entry => ({
                url: entry.url,
                shortcode: entry.shortcode,
                creationDate: entry.creationDate
            }))
        };
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
            shortcode: entry.shortcode,
            creationDate: entry.creationDate
        };
    }

    async create(url: string, reuse?: boolean): Promise<Link> {
        // Will either shorten the link or return the already shortened version of the link
        const link: Link | undefined = await this.retrieve({ url });

        if (link && reuse) {
            return link;
        }

        const shortCode = this.createShortCode();
        const response = await DDBLink.create({
            url: url,
            shortcode: `${this.baseDomain}/${shortCode}`
        }).go();

        return {
            url: response.data.url,
            shortcode: response.data.shortcode,
            creationDate: response.data.creationDate
        }
    }

    async bulkDelete(shortcodes: string[]): Promise<void> {
        await DDBLink.delete(shortcodes.map(shortcode => ({ shortcode }))).go();
    }

    async delete(shortcode: string): Promise<void> {
        // The pk of the table is the whole shortened link
        await DDBLink.delete({
            shortcode
        }).go();
    }

    createShortCode(length: number = 7): string {
        let shortCode: string = '';

        for (let i = 0; i < length; i++) {
            shortCode = shortCode + this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
        }

        return shortCode;
    }
}