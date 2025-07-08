import { Button, Card, Input, Tabs, Typography, Tag, Pagination } from "antd";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import UploadModal from "./UploadModal";
import { searchPageActions } from "../data/searching";

const { Search } = Input;
const { TabPane } = Tabs;
const { Title, Paragraph, Link: AntLink } = Typography;

function SearchResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSearchText = location.state?.searchText || "";
  const [searchText, setSearchText] = useState(initialSearchText);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const recognitionRef = useRef(null);
  // Voice input handler (same as SearchPage)
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
      setSearchText(transcript);
      fetchSearchResults(transcript);
    };
    recognition.onerror = (event) => {
      alert('Voice input error: ' + event.error);
    };
    recognition.start();
  };

  const tagColors = {
    Doc: "purple",
    Application: "geekblue",
    Link: "green",
    Project: "orange",
  };

  // Fetch data only when search is triggered
  const fetchSearchResults = (query) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/search_document/?semantic_search_query=${encodeURIComponent(query)}`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(json => {
        setData(Array.isArray(json) ? json : json.results || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  // Only fetch on initial mount if there is initialSearchText
  useEffect(() => {
    if (initialSearchText) {
      fetchSearchResults(initialSearchText);
    }
    // eslint-disable-next-line
  }, []);

  const onClick = () => {
    dispatch(searchPageActions.openModal());
  };

  const [expandedStates, setExpandedStates] = useState({});

  const toggleExpanded = (index) => {
    setExpandedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handler for search box
  const handleSearch = (value) => {
    setSearchText(value);
    fetchSearchResults(value);
  };

  // Categorize data by category (case-insensitive, fallback to empty string)
  const categorizedData = {
    All: data,
    Doc: data.filter(item => (item.category || '').toLowerCase() === 'doc'),
    Application: data.filter(item => (item.category || '').toLowerCase() === 'application'),
    Link: data.filter(item => (item.category || '').toLowerCase() === 'link'),
    Project: data.filter(item => (item.category || '').toLowerCase() === 'project'),
  };

  // Tab state
  const [activeTab, setActiveTab] = useState('All');

  // Pagination logic for each tab
  const getPaginatedData = (category) => {
    const arr = categorizedData[category] || [];
    return arr.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when data/search or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchText, activeTab]);

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
            <img
              src={process.env.PUBLIC_URL + '/scb-logo.png'}
              alt="SCB Logo"
              style={{ width: 54, height: 54, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 12px rgba(79,140,255,0.13)', border: '2px solid #38cfa6', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h1
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: '2.1rem',
                  letterSpacing: '2.5px',
                  color: '#fff',
                  textShadow: '0 2px 12px rgba(0,0,0,0.10)',
                  fontFamily: 'Segoe UI, Arial, sans-serif',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => navigate('/')}
              >
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

      {/* Search box and Upload button */}
      <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 60 }}>
        <div style={{
          width: 700,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 0,
          position: 'relative',
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: 32,
            boxShadow: '0 4px 24px rgba(79,140,255,0.13)',
            padding: 8,
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(79,140,255,0.18)'
          }}>
            <Input
              placeholder="Search for documents, apps, links..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onPressEnter={e => handleSearch(e.target.value)}
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
              onClick={() => handleSearch(searchText)}
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
              <span style={{ fontWeight: 700, letterSpacing: 1 }}>Search</span>
            </button>
          </div>
          {/* Simple Upload button at the right */}
          <Button onClick={onClick} style={{
            marginLeft: 16,
            height: 40,
            borderRadius: 20,
            fontWeight: 500,
            fontSize: 15,
            minWidth: 80,
            background: '#fff',
            color: '#4f8cff',
            border: '1px solid #4f8cff',
            boxShadow: 'none',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            transition: 'background 0.2s, color 0.2s',
          }}>Upload</Button>
        </div>
      </div>

      {/* Results section */}
      <div style={{ padding: '20px', position: 'relative' }}>
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key)}
          centered
          tabBarGutter={24}
          tabBarStyle={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 18,
            boxShadow: '0 2px 12px rgba(79,140,255,0.07)',
            padding: '8px 0',
            marginBottom: 18,
            fontWeight: 700,
            fontSize: 18,
            minHeight: 48,
            display: 'flex',
            justifyContent: 'center',
            border: '1.5px solid #e3eefd',
          }}
          moreIcon={null}
        >
          {['All', 'Doc', 'Application', 'Link', 'Project'].map(tab => {
            // Add an icon for each tab for better look
            const tabIcons = {
              All: '📋',
              Doc: '📄',
              Application: '🖥️',
              Link: '🔗',
              Project: '📁',
            };
            const tabKey = tab;
            const tabData = categorizedData[tabKey] || [];
            const paginatedTabData = getPaginatedData(tabKey);
            return (
              <TabPane
                tab={
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: activeTab === tabKey ? 700 : 500,
                    color: activeTab === tabKey ? '#4f8cff' : '#333',
                    fontSize: 15,
                    letterSpacing: 0.5,
                    padding: '0 10px',
                    borderRadius: 14,
                    background: activeTab === tabKey ? 'linear-gradient(90deg, #e3eefd 0%, #f8fbff 100%)' : 'none',
                    boxShadow: activeTab === tabKey ? '0 2px 8px rgba(79,140,255,0.08)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ fontSize: 16 }}>{tabIcons[tabKey]}</span>
                    {tab}
                  </span>
                }
                key={tabKey}
              >
                <div style={{
                  background: '#f8fbff',
                  borderRadius: 18,
                  boxShadow: '0 4px 24px rgba(79,140,255,0.10)',
                  border: '1.5px solid #e3eefd',
                  padding: '32px 32px 24px 32px',
                  marginBottom: 32,
                  minHeight: 200,
                }}>
                  {loading && <div>Loading...</div>}
                  {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                  {!loading && !error && tabData.length === 0 && <div>No results found.</div>}
                  {paginatedTabData.map((item, idx) => {
                    const index = (currentPage - 1) * pageSize + idx;
                    const words = (item.description || '').trim().split(/\s+/);
                    const isLong = words.length > 15;
                    const expanded = expandedStates[index] || false;
                    const displayedDescription =
                      isLong && !expanded
                        ? words.slice(0, 15).join(" ") + "..."
                        : item.description;

                    return (
                      <Card key={index} style={{ marginBottom: "20px", borderRadius: 14, boxShadow: '0 2px 12px rgba(79,140,255,0.07)', border: '1.5px solid #dbeafe' }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Title level={5} style={{ margin: 0 }}>
                            {(() => {
                              if (!item.name) return '';
                              // Remove underscores and file extension
                              const nameWithoutUnderscores = item.name.replace(/_/g, ' ');
                              const nameWithoutExt = nameWithoutUnderscores.replace(/\.[^/.]+$/, '');
                              return nameWithoutExt;
                            })()}
                          </Title>
                          <Tag color={tagColors[item.category] || "default"}>
                            {item.category?.toUpperCase?.() || ''}
                          </Tag>
                        </div>

                        <Paragraph style={{ marginTop: 8 }}>
                          {displayedDescription}
                          {isLong && (
                            <span
                              onClick={() => toggleExpanded(index)}
                              style={{
                                color: "#1890ff",
                                cursor: "pointer",
                                marginLeft: 8,
                              }}
                            >
                              {expanded ? "Show less" : "Read more"}
                            </span>
                          )}
                        </Paragraph>

                        <Paragraph>
                          {(item.Link && item.Link !== 'N/A') ? (
                              <AntLink href={item.Link} target="_blank">
                            {item.Link}
                          </AntLink>
                            ) : (
                              <AntLink href={item.filename || '#'} target="_blank">
                            {item.name}
                              </AntLink>
                            )} 

                          <br />
                          Contact: {item.contact || 'N/A'}
                        </Paragraph>
                      </Card>
                    );
                  })}
                  {!loading && !error && tabData.length > pageSize && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: 32,
                      background: 'rgba(255,255,255,0.85)',
                      borderRadius: 16,
                      boxShadow: '0 2px 12px rgba(79,140,255,0.08)',
                      padding: '12px 32px',
                      border: '1.5px solid #e3eefd',
                      width: 'fit-content',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={tabData.length}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper={false}
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: '#4f8cff',
                        }}
                        itemRender={(page, type, originalElement) => {
                          if (type === 'prev') {
                            return <span style={{ color: '#38cfa6', fontWeight: 700, fontSize: 18, padding: '0 8px' }}>← Prev</span>;
                          }
                          if (type === 'next') {
                            return <span style={{ color: '#4f8cff', fontWeight: 700, fontSize: 18, padding: '0 8px' }}>Next →</span>;
                          }
                          return <span style={{
                            color: currentPage === page ? '#fff' : '#4f8cff',
                            background: currentPage === page ? 'linear-gradient(90deg, #4f8cff 0%, #38cfa6 100%)' : 'none',
                            borderRadius: 8,
                            padding: '2px 10px',
                            fontWeight: currentPage === page ? 800 : 600,
                            fontSize: 16,
                            margin: '0 2px',
                            transition: 'all 0.2s',
                            boxShadow: currentPage === page ? '0 2px 8px rgba(79,140,255,0.10)' : 'none',
                            border: currentPage === page ? '1.5px solid #38cfa6' : '1.5px solid transparent',
                          }}>{page}</span>;
                        }}
                      />
                    </div>
                  )}
                </div>
              </TabPane>
            );
          })}
        </Tabs>
        <UploadModal></UploadModal>
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
        marginTop: 40,
        boxShadow: '0 -2px 12px rgba(79,140,255,0.05)'
      }}>
        © {new Date().getFullYear()} SCB Search Engine &nbsp;|&nbsp; Powered by AI &nbsp;|&nbsp; <a href="https://www.scb.com" target="_blank" rel="noopener noreferrer" style={{ color: '#38cfa6', textDecoration: 'none', fontWeight: 700 }}>SCB</a>
      </footer>
    </div>
  );
}

export default SearchResult;
