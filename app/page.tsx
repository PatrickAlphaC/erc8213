"use client";

import { useEffect, useState } from "react";
import App from "./App";

// HashRouter touches `document` on construction, which doesn't exist during
// next build's prerender step. Render nothing on the server, mount the
// router after hydration on the client.
export default function Page() {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <App />;
}
