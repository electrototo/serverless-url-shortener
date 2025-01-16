import { Link } from "../models/link";

interface ListLinksResponse {
    cursor: string;
    data: { shortcode: string; creationDate: string; url: string }[];
};

export const listLinks = async (): Promise<Link[]> => {
    const response = await fetch('http://localhost:3000/api/link');
    const data = (await response.json()) as ListLinksResponse;

    return data.data.map(entry => ({
        id: entry.shortcode,
        url: entry.url,
        shortcode: entry.shortcode,
        creationDate: entry.creationDate
    }));
};