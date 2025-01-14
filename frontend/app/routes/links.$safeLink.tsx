import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import { Button, Col, Container, Row } from "react-bootstrap";
import invariant from "tiny-invariant";
import { listShortCodes } from "../client/list-shortcodes";

import moment from 'moment';
import { Table } from "../components/table";

export async function loader({ request, params }: LoaderFunctionArgs) {
    invariant(params.safeLink, 'safeLink parameter not specified');

    return await listShortCodes(params.safeLink);
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

    return (
        <Container style={{ marginTop: '1rem' }}>
            <Row className="justify-content-space-between">
                <Col>
                <h1>Links</h1>
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
                onSelect={() => {}}
            />
        </Container>
    );
}