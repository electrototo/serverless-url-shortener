import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import { Button, Col, Container, Row } from "react-bootstrap";
import invariant from "tiny-invariant";

import moment from 'moment';
import { Table } from "../components/table";
import { Link } from "../models/link";
import { useState } from "react";

import { linkService } from "../client/link-service";

export async function loader({ request, params }: LoaderFunctionArgs) {
    invariant(params.safeLink, 'safeLink parameter not specified');

    return await linkService.listShortcodes(params.safeLink);
}

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);

    return <>
        <h1>Woops! We detected an error</h1>
    </>;
}

export default function LinkDetail() {
    const data = useLoaderData<typeof loader>();
    const [ selectedValues, setSelectedValues ] = useState<Link[]>([]);

    return (
        <Container style={{ marginTop: '1rem' }}>
            <Row className="justify-content-space-between">
                <Col>
                <h1>Links <span className="text-body-secondary fs-3">({selectedValues.length > 0 ? `${selectedValues.length}/` : ''}{data.data.length})</span></h1>
                </Col>
                <Col md={2} className="align-content-center text-end">
                    <Button variant="danger">Delete</Button>
                </Col>
            </Row>
            <Table
                data={data.data}
                columns={[
                    {
                        displayName: 'URL',
                        selector: 'url',
                        render: (element) => <a href={element.url}>{element.url}</a>
                    },
                    {
                        displayName: 'Shortened',
                        selector: 'shortcode',
                        render: (element) => <a href={element.shortcode}>{element.shortcode}</a>
                    },
                    {
                        displayName: 'Creation Date',
                        selector: 'creationDate',
                        render: (element)  => moment(element.creationDate).local().format('YYYY-MM-DD HH:mm:ss')
                    }
                ]}
                onSelect={(entries) => setSelectedValues(entries)}
            />
        </Container>
    );
}