import { Button, Card, Input, Tabs, Typography, Tag, Pagination } from "antd";
import { useState, useEffect } from "react";
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

  // Pagination logic
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when data/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchText]);

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
              onClick={() => handleSearch(searchText)}
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
        <Tabs defaultActiveKey="1" centered>
        <TabPane tab="All" key="1">
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
            {!loading && !error && data.length === 0 && <div>No results found.</div>}
            {paginatedData.map((item, idx) => {
              const index = (currentPage - 1) * pageSize + idx;
              const words = (item.description || '').trim().split(/\s+/);
              const isLong = words.length > 10;
              const expanded = expandedStates[index] || false;
              const displayedDescription =
                isLong && !expanded
                  ? words.slice(0, 10).join(" ") + "..."
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
                      {item.name}
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
                    <AntLink href={item.Link} target="_blank">
                      {item.Link}
                    </AntLink>
                    <br />
                    Contact: {item.contact || 'N/A'}
                  </Paragraph>
                </Card>
              );
            })}
            {!loading && !error && data.length > pageSize && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={data.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper={false}
                />
              </div>
            )}
          </div>
        </TabPane>
        <TabPane tab="Doc" key="2">
        </TabPane>
        <TabPane tab="Application" key="3">
        </TabPane>
        <TabPane tab="Link" key="4">
        </TabPane>
        <TabPane tab="Project" key="5">
        </TabPane>
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
