import { Input } from "antd";
import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

const {Search } = Input;
function SearchPage() {
  const [value, setValue] = useState('');
  const recognitionRef = useRef(null);
  const navigate = useNavigate();


  const onClick = () => {
    if (!value.trim()) return;
    navigate('/result', { state: { searchText: value } });
  };

  // Voice input handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
    }
    const recognition = recognitionRef.current;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setValue(transcript);
    };
    recognition.onerror = (event) => {
      alert('Voice input error: ' + event.error);
    };
    recognition.start();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          width: 700,
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
            onClick={handleVoiceInput}
            title="Voice Search"
            style={{
              marginLeft: 6,
              fontWeight: 700,
              fontSize: 18,
              height: 40,
              minWidth: 40,
              background: 'linear-gradient(90deg, #ffe066 0%, #38cfa6 100%)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(56,207,166,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 10px',
              borderRadius: 20,
              color: '#4f8cff',
              cursor: 'pointer',
              transition: 'background 0.2s',
              fontFamily: 'Segoe UI, Arial, sans-serif'
            }}
          >
            <span role="img" aria-label="mic" style={{ fontSize: 28 }}>🎤</span>
          </button>
          <button
            onClick={onClick}
            style={{
              marginLeft: 6,
              fontWeight: 700,
              fontSize: 18,
              height: 40,
              minWidth: 40,
              background: 'linear-gradient(90deg, #4f8cff 0%, #38cfa6 100%)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(56,207,166,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 16px',
              borderRadius: 20,
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s',
              fontFamily: 'Segoe UI, Arial, sans-serif'
            }}
          >
            <span role="img" aria-label="search" style={{ fontSize: 28, marginRight: 8 }}>🔍</span>
            <span style={{ fontWeight: 700, letterSpacing: 1, fontSize: 14 }}>Search</span>
          </button>
        </div>
      </div>
      {/* Footer */}
      <footer style={{
        width: '100%',
        background: 'linear-gradient(90deg, #e3eefd 0%, #f8fbff 100%)',
        color: '#4f8cff',
        textAlign: 'center',
        padding: '18px 0 10px 0',
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: 0.5,
        borderTop: '1.5px solid #e3eefd',
        marginTop: 'auto',
        boxShadow: '0 -2px 12px rgba(79,140,255,0.05)'
      }}>
        © {new Date().getFullYear()} SCB Search Engine &nbsp;|&nbsp; Powered by AI &nbsp;|&nbsp; <a href="https://www.scb.com" target="_blank" rel="noopener noreferrer" style={{ color: '#38cfa6', textDecoration: 'none', fontWeight: 700 }}>SCB</a>
      </footer>
    </div>
  );
}

export default SearchPage;