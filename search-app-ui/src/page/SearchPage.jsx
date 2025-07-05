import { Input } from "antd";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const {Search } = Input;
function SearchPage() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const onClick = () => {
    if (!value.trim()) return;
    navigate('/result', { state: { searchText: value } });
  };

  return (
    <div>
      {/* Header with logo, title, badge, and tagline */}
      <div style={{
        width: '100vw',
        minWidth: '100%',
        background: 'linear-gradient(90deg, #4f8cff 0%, #38cfa6 100%)',
        borderRadius: 0,
        padding: 0,
        margin: 0,
        boxShadow: '0 8px 32px rgba(79,140,255,0.13)',
        border: 'none',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 90,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: 40 }}>
            <img src={process.env.PUBLIC_URL + '/scb-logo.png'} alt="SCB Logo" style={{ width: 54, height: 54, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 12px rgba(79,140,255,0.13)', border: '2px solid #38cfa6', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h1 style={{
                margin: 0,
                fontWeight: 800,
                fontSize: '2.1rem',
                letterSpacing: '2.5px',
                color: '#fff',
                textShadow: '0 2px 12px rgba(0,0,0,0.10)',
                fontFamily: 'Segoe UI, Arial, sans-serif',
              }}>
                SCB Search Engine
              </h1>
              <span style={{
                display: 'inline-block',
                marginTop: 4,
                color: '#fff',
                fontWeight: 500,
                fontSize: '0.92rem',
                letterSpacing: '0.5px',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                textShadow: '0 2px 8px rgba(56,207,166,0.18)',
                opacity: 0.92,
              }}>
                Discover and connect with knowledge instantly - AI at your fingertips.
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginRight: 40 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #ffe066 0%, #38cfa6 100%)',
                color: '#222',
                borderRadius: '50px',
                padding: '7px 26px 7px 18px',
                fontWeight: 700,
                fontSize: '1.15rem',
                boxShadow: '0 2px 8px rgba(56,207,166,0.10)',
                letterSpacing: '1.5px',
                border: '2px solid #fff',
                fontFamily: 'cursive, sans-serif',
                textShadow: '0 1px 4px rgba(255,255,255,0.18)'
              }}
            >
              <span style={{
                marginRight: 8,
                fontSize: '1.2em',
                verticalAlign: 'middle',
                color: '#4f8cff',
                fontWeight: 900,
                textShadow: '0 1px 4px #fff',
              }}>⚡</span>
              Powered by AI
            </span>
          </div>
        </div>
      </div>
      {/* Search box */}
      <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 60 }}>
        <div style={{
          width: 520,
          background: 'rgba(255,255,255,0.25)',
          borderRadius: 32,
          boxShadow: '0 4px 24px rgba(79,140,255,0.13)',
          display: 'flex',
          alignItems: 'center',
          padding: 8,
          backdropFilter: 'blur(8px)',
          border: '1.5px solid rgba(79,140,255,0.18)'
        }}>
          <Input
            placeholder="Search for documents, apps, links..."
            value={value}
            onChange={e => setValue(e.target.value)}
            onPressEnter={onClick}
            style={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              fontSize: 18,
              height: 44,
              background: 'transparent',
              flex: 1,
              paddingLeft: 18,
              color: '#222',
              fontWeight: 500,
            }}
            allowClear
          />
          <button
            onClick={onClick}
            style={{
              marginLeft: -2,
              fontWeight: 700,
              fontSize: 18,
              height: 44,
              background: 'linear-gradient(90deg, #4f8cff 0%, #38cfa6 100%)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(56,207,166,0.10)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 28px',
              borderRadius: 22,
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s',
              fontFamily: 'Segoe UI, Arial, sans-serif'
            }}
          >
            <span role="img" aria-label="search" style={{ marginRight: 8, fontSize: 20 }}>🔍</span>
            <span style={{ fontWeight: 700, letterSpacing: 1 }}>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;