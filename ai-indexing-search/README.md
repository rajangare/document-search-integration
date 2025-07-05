# Document Indexing Search

A Python-based API for managing document indexing and semantic search using Elasticsearch and FastAPI. This project enables uploading, indexing, searching, and downloading documents with metadata, as well as managing access groups.

## Features

- **Upload documents** with associated metadata.
- **Index documents** in Elasticsearch for fast retrieval.
- **Semantic search** using vector similarity (supports multiple vectors).
- **Download documents** by file ID.
- **Manage and retrieve access groups**.
- **RESTful API** with interactive Swagger documentation.

## Requirements

- Python 3.x
- pip
- Elasticsearch (running instance)
- Elasticsearch Python client
- FastAPI
- Uvicorn


## BERT- Utilizes `SentenceTransformer` for generating semantic embeddings of document descriptions.

- Integrated `SentenceTransformer('all-mpnet-base-v2')` for generating description embeddings (`descriptionVector`) during document indexing.
- Endpoints now return file URLs with the full server context using FastAPI's `Request` object.
- Added utility to retrieve the service base URL within API endpoints.
- Search results from description, file name, and tags are merged and sorted by relevance score.

## API Endpoints

### 1. Upload File with Metadata

- **POST** `/upload_with_metadata/`
- **Description:** Upload a file with metadata fields as form-data.
- **Request:** `multipart/form-data` with fields: `file`, `title`, `description`
- **Response:** Uploaded filename and metadata.

### 2. Upload Metadata Only

- **POST** `/upload_metadata/`
- **Description:** Upload document metadata as a JSON object.
- **Request:** JSON body matching the `FileMetadata` schema.
- **Response:** Echoes received metadata.

### 3. Semantic Search

- **POST** `/semantic_search/`
- **Description:** Search documents using one or more vectors.
- **Request:** JSON body with a list of vectors.
- **Response:** Top matching documents for each vector.

### 4. Download File

- **GET** `/download/{file_id}`
- **Description:** Download a file by its unique ID.
- **Response:** File stream with appropriate content type.

### 5. Get Access Groups

- **GET** `/access_groups/`
- **Description:** Retrieve a list of available access groups.
- **Response:** JSON list of group names.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<user>/document-indexing-search.git
   cd document-indexing-search


## Installation

```bash
pip install -r requirements.txt
pip install elasticsearch

Start API server:
uvicorn main:app --reload
```

## Running the `main` API Locally

1. Make sure you have FastAPI and Uvicorn installed:
   ```bash
   pip install fastapi uvicorn
   
2. Start the API server from your project directory:
   ```bash
   uvicorn main:app --reload
   
3. Access the API at:
http://127.0.0.1:8000/search_tags/?search_string=your_query


4. You can also view the interactive SWAGGER docs at:
http://127.0.0.1:8000/docs