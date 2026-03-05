import { useNavigate } from 'react-router-dom';

export default function MenadzmentNavbar() {
  const navigate = useNavigate();

  return (
    <nav style={navStyle}>
      <div style={logoStyle} onClick={() => navigate('/menadzment')}>
        <strong>DentApp</strong> Admin
      </div>
      
      <div style={linksContainer}>
        <span onClick={() => navigate('/menadzment/lekari')} style={linkItem}>Lekari</span>
        <span onClick={() => navigate('/menadzment/pacijenti')} style={linkItem}>Pacijenti</span>
      </div>
    </nav>
  );
}

const navStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  padding: '15px 5%', 
  background: '#fff', 
  borderBottom: '1px solid #eee',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 100
};

const logoStyle = { cursor: 'pointer', fontSize: '18px', color: '#2b6cb0' };
const linksContainer = { display: 'flex', gap: '30px' };
const linkItem = { cursor: 'pointer', fontSize: '15px', fontWeight: '500', color: '#4a5568' };