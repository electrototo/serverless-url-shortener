import { encode } from "punycode";
import { Link } from "../models/link";

export interface LinkServiceConfig {
    endpoint: string;
};

type Paginated<T> = {
    cursor: string;
    data: T[];
};

type ListLinksResponse = Paginated<Link>;
type ListShortcodesResponse = Paginated<Link>;

export class LinkService {
    private endpoint: string;

    constructor(config: LinkServiceConfig) {
        this.endpoint = config.endpoint;
    }

    async shorten(url: string): Promise<void> {
        await fetch(`${this.endpoint}/api/link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url
            })
        });
    }
    
    async bulkDeleteLinks(shortCodes: string[]): Promise<void> {
        await fetch(`${this.endpoint}/api/link/batch-delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shortcodes: shortCodes
            })
        });
    }

    async deleteLink(encodedShortcode: string): Promise<void> {
        await fetch(`${this.endpoint}/api/link/${encodedShortcode}`, {
            method: 'DELETE'
        });
    }

    async listShortcodes(encodedUrl: string) {
        // Will return all the shortcodes associated to an URL

        const response = await fetch(`${this.endpoint}/api/link/${encodedUrl}`);
        const data = (await response.json()) as ListShortcodesResponse;

        return data;
    }

    async listLinks(): Promise<Link[]> {
        // Will return all links that were shortened

        const response = await fetch(`${this.endpoint}/api/link`);
        const data = (await response.json()) as ListLinksResponse;

        return data.data.map(entry => ({
            id: entry.shortcode,
            url: entry.url,
            shortcode: entry.shortcode,
            creationDate: entry.creationDate
        }));
    }
}

export const linkService = new LinkService({
    endpoint: 'http://localhost:3000'
})