import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { CSSProperties, FormEvent, useEffect, useReducer, useRef, useState } from "react";
import { initialTableState, tableReducer } from "../redux/tableReducer";
import { listLinks } from "../client/list-links";
import { shortenLink as shortenLinkAPI } from "../client/shorten";

import { Form, Link, useLoaderData } from "@remix-run/react";

import { Col, Container, Table, Row, Button, Stack, Modal } from 'react-bootstrap';

import invariant from 'tiny-invariant';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({
  request
}: LoaderFunctionArgs) {
  return await listLinks();
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const url = formData.get('url') as string;

  invariant(url, 'URL is not defined');

  await shortenLinkAPI(url);

  return {};
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Container style={{ paddingTop: '1rem' }}>
      <Modal show={showModal}>
        <Form method="post">
          <Modal.Header closeButton>
            <Modal.Title>Shorten</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>URL to shorten</label>
              <input
                type="text"
                id="url"
                name="url"
                className="form-control"
                placeholder="https://google.com" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secodary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={handleClose} type="submit">Shorten</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Row className="justify-content-space-between">
        <Col>
          <h1>Links</h1>
        </Col>
        <Col md={2} className="align-content-center">
          <Stack direction="horizontal" gap={2}>
            <Button variant="danger">Delete</Button>
            <Button onClick={handleShow}>Shorten</Button>
          </Stack>
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
          </tr>
        </thead>
        <tbody>
          {data.map(entry => {
            const safeLink = btoa(entry.url)
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=/g, '');

            return (
              <tr key={entry.id}>
                <td style={{ width: '2rem' }}><input type="checkbox" /></td>
                <td style={{ wordWrap: 'break-word' }}>
                  <Link to={`/links/${safeLink}`}>{entry.url}</Link>
                </td>
                <td>
                  <a href={entry.shortcode}>{entry.shortcode}</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}