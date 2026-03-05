import { BrowserRouter, Routes, Route } from "react-router-dom";
import PocetniEkran from "./pages/homepage";
import LekarPage from "./pages/doktorpage";
import MenadzmentPage from "./pages/menadzmentpage";
import PacijentProfil from "./pages/pacijentPage";
import MenadzmentLekari from "./pages/menadzmentLekar";
import MenadzmentPacijenti from "./pages/menadzmentPacijent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PocetniEkran />} />
        <Route path="/lekar" element={<LekarPage />} />
        <Route path="/menadzment" element={<MenadzmentPage />} />
        <Route path="/pacijent/:id" element={<PacijentProfil />} />
        <Route path="/menadzment/lekari" element={<MenadzmentLekari />} />
        <Route path="/menadzment/pacijenti" element={<MenadzmentPacijenti />} />
      </Routes>
    </BrowserRouter>
  );
}
