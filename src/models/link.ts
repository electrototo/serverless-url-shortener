import { Entity } from "electrodb";
import { dynamodDBClient } from "../clients/dynamodb";

export interface Link {
    url: string;
    shortcode: string;
    creationDate: string;
}

export const DDBLink = new Entity({
    model: {
        entity: 'link',
        version: '1',
        service: 'shortener'
    },
    attributes: {
        url: {
            type: 'string',
            required: true
        },
        shortcode: {
            type: 'string',
            required: true
        },
        creationDate: {
            type: 'string',
            required: true,
            default: new Date().toISOString()
        }
    },
    indexes: {
        byShortCode: {
            pk: {
                casing: 'none',
                field: 'pk',
                composite: ['shortcode']
            }
        },
        byUrl: {
            index: 'longUrlIndex',
            pk: {
                casing: 'none',
                field: 'gsi1pk',
                composite: ['url']
            },
        }
    }
}, { client: dynamodDBClient, table: 'links' });