import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import 'bootstrap/dist/css/bootstrap.min.css';
import './components/table.css';

import { Container, Nav, Navbar } from 'react-bootstrap';

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="main">
        <Navbar variant="light" bg="light">
          <Container>
            <Navbar.Brand href="">Shortener</Navbar.Brand>
            <Navbar.Collapse>
              <Nav>
                <NavLink
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link' }
                  to='/'>
                    Home
                  </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Outlet />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}