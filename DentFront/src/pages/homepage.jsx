import { useNavigate } from "react-router-dom";
import "./PocetniEkran.css";

export default function PocetniEkran() {
  const navigate = useNavigate();

  return (
    <div className="pocetni-wrapper">
      <div className="pocetni-header">
        <span className="logo-icon">🦷</span>
        <h1 className="logo-text">DentApp</h1>
        <p className="logo-podnaslov">Sistem za upravljanje stomatološkom ordinacijom</p>
      </div>

      <div className="izbor-kartica">
        <div className="kartica" onClick={() => navigate("/lekar")}>
          <h2>Lekar</h2>
          <button className="kartica-btn">Ulaz za lekara</button>
        </div>

        <div className="kartica kartica-menadzment" onClick={() => navigate("/menadzment")}>
          <h2>Menadžment</h2>
          <button className="kartica-btn btn-menadzment">Ulaz za menadžment</button>
        </div>
      </div>
    </div>
  );
}