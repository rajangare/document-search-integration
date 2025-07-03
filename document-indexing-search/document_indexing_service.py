import os
import shutil
import uuid
from datetime import datetime

from pretrained_transfermer_model import PretrainedTransformerModel

UPLOAD_DIR = "D:\\RAJKUMAR\\projects\\PYTHON_PROJECTS\\document-indexing-search\\documents"
DOCUMENT_DESC_INDEX = "document_desc_index"
DOCUMENT_NAME_INDEX = "document_name_index"
DOCUMENT_TAG_INDEX = "document_tag_index"

pretrained_transformer_model = PretrainedTransformerModel()

class DocumentIndexingService:

    def __init__(self, elasticsearch):
        self.elasticsearch = elasticsearch


    def create_index(self, index_name):
        if not self.elasticsearch.indices.exists(index=index_name):
            self.elasticsearch.indices.create(index=index_name)
            print(f"Index '{index_name}' created.")
        else:
            print(f"Index '{index_name}' already exists.")

    def upload_and_index_file(self, file, fileMetaData):
        # Save the file
        file_id = str(uuid.uuid4())
        print("Generated File ID: ", file_id)

        if file:
            # Prefix the filename with file_id
            file_ext = os.path.splitext(file.filename)[1]
            new_filename = f"{file_id}_{file.filename}"
            file_path = os.path.join(UPLOAD_DIR, new_filename)
            print("Saving file with new filename: ", new_filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

        print("File Title: ", fileMetaData.title)
        self.index_content(fileMetaData, file_id)
        print("Document indexed in Elasticsearch with ID:", file_id)
        print("Content uploaded and indexed successfully.")

        return file_id

    def index_content(self, fileMetaData, file_id):
        # Prepare metadata for indexing
        document = {
            "id": file_id,
            "fileName": fileMetaData.title,
            "description": fileMetaData.description,
            "tags": fileMetaData.tags,
            "accessGroup": fileMetaData.access_group,
            "fileCategory": fileMetaData.category,
            "uploadDate": datetime.now(),
            "descriptionVector": pretrained_transformer_model.vector_transformer(fileMetaData.description),
            "nameVector": pretrained_transformer_model.vector_transformer(fileMetaData.title),
            "tagVector": pretrained_transformer_model.vector_transformer(fileMetaData.tags)
        }

        # Index the DOCUMENT_DESC_INDEX in Elasticsearch
        self.elasticsearch.index(
            index=DOCUMENT_DESC_INDEX,  # Replace with your actual index name if different
            id=file_id,
            document=document
        )

        # Index the DOCUMENT_NAME_INDEX in Elasticsearch
        self.elasticsearch.index(
            index=DOCUMENT_NAME_INDEX,  # Replace with your actual index name if different
            id=file_id,
            document=document
        )

        # Index the DOCUMENT_TAG_INDEX in Elasticsearch
        self.elasticsearch.index(
            index=DOCUMENT_TAG_INDEX,  # Replace with your actual index name if different
            id=file_id,
            document=document
        )

    def get_file_by_id(self, file_id):
        # Search for the file in UPLOAD_DIR with the given file_id prefix
        for filename in os.listdir(UPLOAD_DIR):
            if filename.startswith(f"{file_id}_"):
                file_path = os.path.join(UPLOAD_DIR, filename)
                print("File found: ", file_path)
                return file_path  # Or open and return the file stream if needed
        return None

    def get_data_by_indexname(self, index_name):
        print(f"Fetching data from index: {index_name}")
        if not self.elasticsearch.indices.exists(index=index_name):
            print(f"Index '{index_name}' does not exist.")
            return []

        # Search for all documents in the specified index
        response = self.elasticsearch.search(index=index_name, query={"match_all": {}})
        hits = response.get("hits", {}).get("hits", [])

        # Extract and return the source of each hit
        return [hit["_source"] for hit in hits]