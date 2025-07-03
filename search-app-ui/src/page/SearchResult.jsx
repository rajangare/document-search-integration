import { Button, Card, Input, Tabs, Typography, Tag } from "antd";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import UploadModal from "./UploadModal";
import { searchPageActions } from "../data/searching";

const { Search } = Input;
const { TabPane } = Tabs;
const { Title, Paragraph, Link: AntLink } = Typography;

function SearchResult() {
  const location = useLocation();
  const searchText = location.state?.searchText || "No search input";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const tagColors = {
  Doc: "purple",
  Application: "geekblue",
  Link: "green",
  Project: "orange",
};


  useEffect(() => {
    if (!searchText || searchText === 'No search input') return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8000/search_document/?semantic_search_query=${encodeURIComponent(searchText)}`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(json => {
        // If API returns an array, use it directly; if object, try to extract array
        setData(Array.isArray(json) ? json : json.results || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [searchText]);

  const onClick=()=>{
    dispatch(searchPageActions.openModal());
  };

  const [expandedStates, setExpandedStates] = useState({});

  const toggleExpanded = (index) => {
    setExpandedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Search
            placeholder="Input"
            style={{ width: "500px" }}
            enterButton
            value={searchText}
            readOnly
          />
        </div>
        <div>
          <Button type="primary" onClick={onClick}>Upload</Button>
        </div>
      </div>

      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="All" key="1">
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
          {!loading && !error && data.length === 0 && <div>No results found.</div>}
          {data.map((item, index) => {
            const words = (item.description || '').trim().split(/\s+/);
            const isLong = words.length > 10;
            const expanded = expandedStates[index] || false;
            const displayedDescription =
              isLong && !expanded
                ? words.slice(0, 10).join(" ") + "..."
                : item.description;

            return (
              <Card key={index} style={{ marginBottom: "20px" }}>
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
                  Contact: {item.conatct}
                </Paragraph>
              </Card>
            );
          })}
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
  );
}

export default SearchResult;
