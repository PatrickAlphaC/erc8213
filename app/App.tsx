"use client";

import { HashRouter, Routes, Route } from "react-router-dom";
import HomePageClient from "./HomePageClient";
import WalletsClient from "./wallets/WalletsClient";
import ImplementClient from "./implement/ImplementClient";
import VerifyClient from "./verify/VerifyClient";
import ComputeClient from "./compute/ComputeClient";
import NotFoundClient from "./NotFoundClient";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePageClient />} />
        <Route path="/wallets" element={<WalletsClient />} />
        <Route path="/implement" element={<ImplementClient />} />
        <Route path="/verify" element={<VerifyClient />} />
        <Route path="/compute" element={<ComputeClient />} />
        <Route path="*" element={<NotFoundClient />} />
      </Routes>
    </HashRouter>
  );
}
