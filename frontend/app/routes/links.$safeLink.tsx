import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import invariant from "tiny-invariant";
import { listShortCodes } from "../client/list-shortcodes";

import moment from 'moment';

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

    return <Container style={{ marginTop: '1rem' }}>
      <Row className="justify-content-space-between">
        <Col>
          <h1>Links</h1>
        </Col>
        <Col md={2} className="align-content-center text-end">
            <Button variant="danger">Delete</Button>
        </Col>
      </Row>
      <Table style={{ maxWidth: '100%', tableLayout: 'fixed' }} striped>
        <thead>
          <tr>
            <th style={{ width: '2rem' }}>
              <input type="checkbox" />
            </th>
            <th>
              URL
            </th>
            <th>
              Shortened
            </th>
            <th>
                Creation Date
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.map(entry => {
            return (
              <tr key={entry.shortcode}>
                <td style={{ width: '2rem' }}><input type="checkbox" /></td>
                <td style={{ wordWrap: 'break-word' }}>
                    <a href={entry.url}>{entry.url}</a>
                </td>
                <td>
                  <a href={entry.shortcode}>{entry.shortcode}</a>
                </td>
                <td>
                    {moment(entry.creationDate).local().format('YYYY-MM-DD HH:mm:ss')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>;
}