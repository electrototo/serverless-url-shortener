import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { Form, Link, useLoaderData } from "@remix-run/react";

import { Col, Container, Row, Button, Stack, Modal } from 'react-bootstrap';

import invariant from 'tiny-invariant';
import { Table } from "../components/table";

import { Link as LinkModel } from '../models/link';
import { linkService } from "../client/link-service";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return await linkService.listLinks();
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('_action');
  const url = formData.getAll('url') as string[];

  invariant(url, 'URL is not defined');

  if (action === 'create') {
    await linkService.shorten(url[0]);
  } else if (action === 'delete') {
    await linkService.bulkDeleteLinks(url);
  }

  return {};
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const [ showModal, setShowModal ] = useState<boolean>(false);
  const [ selectedValues, setSelectedValues ] = useState<LinkModel[]>([]);

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
            <Button variant="primary" onClick={handleClose} name="_action" value="create" type="submit">Shorten</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Row className="justify-content-space-between">
        <Col>
            <h1>Links <span className="text-body-secondary fs-3">({selectedValues.length > 0 ? `${selectedValues.length}/` : ''}{data.length})</span></h1>
        </Col>
        <Col md={2} className="align-content-center">
          <Form method="post">
            <Stack direction="horizontal" gap={2}>
              <Button variant="danger" type="submit" name="_action" value="delete">Delete</Button>
              <Button onClick={handleShow}>Shorten</Button>
            </Stack>
            {
              selectedValues.map(entry => {
                return (
                  <input key={entry.shortcode} type="hidden" name="url" value={entry.shortcode} />
                );
              })
            }
          </Form>
        </Col>
      </Row>
      <Table
        data={data}
        columns={[
          {
            selector: 'url',
            displayName: 'URL',
            render: (element) => {
              const base64EncodedLink = btoa(element.url);

              return (
                <Link to={`/links/${base64EncodedLink}`}>{element.url}</Link>
              );
            }
          },
          {
            selector: 'shortcode',
            displayName: 'Shortened',
            render: (element) => <a href={element.shortcode}>{element.shortcode}</a>
          }
        ]}
        onSelect={(elements) => setSelectedValues(elements)} striped />
    </Container>
  );
}