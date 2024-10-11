import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, useAuth } from "@clerk/remix";
import { ConvexReactClient } from "convex/react";
import { useState } from "react";

import "./tailwind.css";
import { ConvexProviderWithClerk } from "convex/react-clerk";

export const loader: LoaderFunction = (args) => rootAuthLoader(args, () => {
  const CONVEX_URL = process.env["CONVEX_URL"]!;
  return {
    ENV: {
      CONVEX_URL
    }
  };
});

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const { ENV } = useRouteLoaderData<typeof loader>("root");
  const [convex] = useState(() => new ConvexReactClient(ENV.CONVEX_URL));

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Outlet />
    </ConvexProviderWithClerk>
  )
}

export default ClerkApp(App)
