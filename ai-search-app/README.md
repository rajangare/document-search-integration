# SCB Search Engine UI (`search-app-ui`)

## Overview

`search-app-ui` is a modern React-based web application for the SCB Search Engine, designed to help users search, discover, and upload documents, applications, links, and projects. The UI is clean, responsive, and leverages Ant Design for a professional look and feel. It integrates with a backend API to provide semantic search, document upload, and tag management features.

## Features

- **Semantic Search:** Search for documents, applications, links, and projects using natural language queries.
- **Modern UI/UX:** Beautiful, responsive interface with a custom header, boxed search results, and a persistent footer.
- **Upload Modal:** Upload files or links with metadata (title, description, tags, category, access group, contact).
- **Tag Suggestions:** Dynamic tag suggestions fetched from the backend.
- **Pagination:** Fancy, colored pagination for easy navigation of large result sets.
- **Category Filtering:** Tabs for All, Doc, Application, Link, and Project (future enhancement: filter by tab).
- **Expandable Descriptions:** Long descriptions are truncated with a "Read more" link after 15 words.
- **Persistent Footer:** Footer always stays at the bottom of the page.

## Folder Structure

```
search-app-ui/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── ...
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   ├── data/
│   │   ├── configureStore.js
│   │   ├── rootReducer.js
│   │   ├── rootSaga.js
│   │   └── searching/
│   │       ├── index.js
│   │       ├── saga.js
│   │       └── slice.js
│   ├── page/
│   │   ├── SearchPage.jsx
│   │   ├── SearchResult.jsx
│   │   ├── UploadModal.jsx
│   │   └── sample_document_json.json
│   └── util/
│       └── httpservices.js
├── package.json
├── README.md
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd search-app-ui
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```sh
   npm start
   # or
   yarn start
   ```
4. The app will be available at `http://localhost:3000` by default.

### Backend API
- The UI expects a backend API running at `http://localhost:8000` (configurable via `API_BASE_URL` in the code).
- Key endpoints:
  - `GET /search_document/?semantic_search_query=...` — Search documents
  - `POST /upload/` — Upload files or links
  - `GET /all_tags/` — Fetch tag suggestions

## Usage

1. **Search:** Enter a query in the search box and press Enter or click Search. Results are shown in boxed cards with pagination.
2. **Upload:** Click the Upload button to open the modal. Choose File or Link, fill in details, and submit.
3. **Tags:** Add tags manually or select from suggestions.
4. **Pagination:** Navigate through results using the colored pagination controls.
5. **Read More:** Click "Read more" to expand long descriptions.

## Customization

- To change the API base URL, update the `API_BASE_URL` variable in the relevant files (e.g., `UploadModal.jsx`, `SearchResult.jsx`).
- To add more categories, update the `categoryList` in `UploadModal.jsx` and `tagColors` in `SearchResult.jsx`.

## Technologies Used

- React 18+
- Ant Design (antd)
- Redux Toolkit (for state management)
- React Router DOM
- Axios

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.
