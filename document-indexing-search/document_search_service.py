import json

from document_indexing_service import DOCUMENT_SEARCH_INDEX
from pretrained_transfermer_model import PretrainedTransformerModel

pretrained_transformer_model = PretrainedTransformerModel()

class DocumentSearchService:

    def __init__(self, elasticsearch):
        self.elasticsearch = elasticsearch

    # Search for documents in the document store based on a semantic query.
    def search_semantic(self, semantic_search_keyword):
        print("Semantic Search Keyword: ", semantic_search_keyword)
        vector_of_input_keyword = pretrained_transformer_model.encode(semantic_search_keyword)

        queryDescr = {
            "knn": {
                "field": "descriptionVector",
                "query_vector": vector_of_input_keyword,
                "k": 5,
                "num_candidates": 500
            }
        }
        queryName = {
            "knn": {
                "field": "nameVector",
                "query_vector": vector_of_input_keyword,
                "k": 2,
                "num_candidates": 500
            }
        }
        queryTags = {
            "knn": {
                "field": "tagVector",
                "query_vector": vector_of_input_keyword,
                "k": 3,
                "num_candidates": 500
            }
        }

        source_fields = ["fileName", "description", "accessGroup", "id", "fileCategory", "tags", "contact", "link"]

        resDescr = self.elasticsearch.search(index=DOCUMENT_SEARCH_INDEX, body=queryDescr, source=["fileName", "description", "accessGroup", "id", "fileCategory", "tags", "contact", "link"])
        resName = self.elasticsearch.search(index=DOCUMENT_SEARCH_INDEX, body=queryName, source=["fileName", "description", "accessGroup", "id", "fileCategory", "tags", "contact", "link"])
        resTag = self.elasticsearch.search(index=DOCUMENT_SEARCH_INDEX, body=queryTags, source=["fileName", "description", "accessGroup", "id", "fileCategory", "tags", "contact", "link"])

        all_hits = resDescr["hits"]["hits"] + resName["hits"]["hits"] + resTag["hits"]["hits"]

        merged = {}
        for hit in all_hits:
            doc_id = hit["_source"]["id"]
            if doc_id not in merged or hit["_score"] > merged[doc_id]["_score"]:
                merged[doc_id] = hit

        sorted_results = sorted(merged.values(), key=lambda x: x["_score"], reverse=True)

        filtered_results = [
            {field: hit["_source"].get(field) for field in source_fields}
            for hit in sorted_results
        ]

        searchedJson = json.dumps([
            {
                "name": item.get("fileName") if item.get("fileName") is not None else "N/A",
                "description": item.get("description") if item.get("description") is not None else "N/A",
                "accessGroup": item.get("accessGroup") if item.get("accessGroup") is not None else "N/A",
                "id": item.get("id") if item.get("id") is not None else "N/A",
                "category": item.get("fileCategory") if item.get("fileCategory") is not None else "N/A",
                "tags": item.get("tags") if item.get("tags") is not None else "N/A",
                "contact": item.get("contact") if item.get("contact") is not None else "N/A",
                "Link": item.get("link") if item.get("link") is not None else "N/A"
            }
            for item in filtered_results
        ], indent=2)

        print("Searched JSON: ", searchedJson)
        # Return the JSON string of the search results
        return searchedJson