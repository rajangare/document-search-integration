from document_indexing_service import DOCUMENT_DESC_INDEX, DOCUMENT_NAME_INDEX, DOCUMENT_TAG_INDEX
from pretrained_transfermer_model import PretrainedTransformerModel

pretrained_transformer_model = PretrainedTransformerModel()

class DocumentSearchService:

    def __init__(self, elasticsearch):
        self.elasticsearch = elasticsearch

    # Search for documents in the document store based on a semantic query.
    def search_semantic(self, semantic_search_keyword):
        print("Semantic Search Keyword: ", semantic_search_keyword)
        vector_of_input_keyword = pretrained_transformer_model.encode(semantic_search_keyword)

        descriptionQuery = {
            "field": "descriptionVector",
            "query_vector": vector_of_input_keyword,
            "k": 10,
            "num_candidates": 500
        }

        fileNameQuery = {
            "field": "nameVector",
            "query_vector": vector_of_input_keyword,
            "k": 10,
            "num_candidates": 500
        }

        tagQuery = {
            "field": "tagVector",
            "query_vector": vector_of_input_keyword,
            "k": 10,
            "num_candidates": 500
        }

        resDescription = self.elasticsearch.knn_search(index=DOCUMENT_DESC_INDEX
                            , knn=descriptionQuery
                            , source=["Description"]
                            )
        resultsDescription = resDescription["hits"]["hits"]

        resFileName = self.elasticsearch.knn_search(index=DOCUMENT_NAME_INDEX
                                                       , knn=fileNameQuery
                                                       , source=["fileName"]
                                                       )
        resultsFileName = resFileName["hits"]["hits"]

        resTag = self.elasticsearch.knn_search(index=DOCUMENT_TAG_INDEX
                                                       , knn=tagQuery
                                                       , source=["tags"]
                                                       )
        resultsTags = resTag["hits"]["hits"]

        # Combine results from all three queries
        all_results = resultsDescription + resultsFileName + resultsTags

        # Remove duplicates based on document ID
        sorted_results = sorted(all_results, key=lambda x: x.get('_score', 0), reverse=True)
        sorted_results = [
            {
                "id": hit["_source"].get("id"),
                "fileName": hit["_source"].get("fileName"),
                "description": hit["_source"].get("description"),
                "tags": hit["_source"].get("tags"),
                "accessGroup": hit["_source"].get("accessGroup"),
                "fileCategory": hit["_source"].get("fileCategory"),
                "uploadDate": hit["_source"].get("uploadDate")
            } for hit in sorted_results
        ]

        return sorted_results