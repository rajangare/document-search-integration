from elastic_connection import get_elasticsearch_client
from tag_index_mapping import tagIndexMapping
import json

TAG_INDEX_NAME = "tag_search_index"
UNDEFINED_TAG_INDEX_NAME = "undefined_tag_index"

class TagIndexing:

    def __init__(self, elasticInstance):
        self.elasticInstance = elasticInstance

    def create_index(self, index_name):
        if not self.elasticInstance.indices.exists(index=index_name):
            self.elasticInstance.indices.create(index=index_name, mappings=tagIndexMapping)
            print(f"Index '{index_name}' created.")
        else:
            print(f"Index '{index_name}' already exists.")

    def get_or_create_index_for_tag(self, tag_name):
        query = {
            "match": {
                "TagName": tag_name
            }
        }
        result = self.elasticInstance.search(index="_all", query=query)
        if result['hits']['total']['value'] > 0:
            tag_index = result['hits']['hits'][0]['_source']['IndexName']
            print(f"Tag '{tag_name}' found in index '{tag_index}'.")
            return tag_index
        else:
            print(f"Index not found for Tag '{tag_name}' adding it, to 'undefined_index'.")
            undefined_index = "undefined_index"
            if not self.elasticInstance.indices.exists(index=undefined_index):
                self.create_index(undefined_index)
            tag_document = {
                "IndexName": undefined_index,
                "TagName": tag_name
            }
            self.elasticInstance.index(index=undefined_index, document=tag_document)
            print(f"Tag '{tag_name}' added to 'undefined_index' index.")
            return undefined_index


    def delete_index(self, index_name):
        if self.elasticInstance.indices.exists(index=index_name):
            self.elasticInstance.indices.delete(index=index_name)
            print(f"Index '{index_name}' deleted.")
        else:
            print(f"Index '{index_name}' does not exist.")




    def add_tag_to_index(self, index_name, tag_name):
        if self.elasticInstance.indices.exists(index=index_name):
            tagDocument = {
                "IndexName": index_name,
                "TagName": tag_name
            }
            self.elasticInstance.index(index=index_name, document=tagDocument, id=tag_name)
            print(f"Tag '{tag_name}' added to index '{index_name}'.")
        else:
            print(f"Index '{index_name}' does not exist. Please create it first.")



    def get_tags_by_index(self, index_name):
        if self.elasticInstance.indices.exists(index=index_name):
            result = self.elasticInstance.search(index=index_name, query={"match_all": {}})
            tags = [hit['_source']['TagName'] for hit in result['hits']['hits']]
            print(f"tags '{tags}' for index '{index_name}':")
            return tags
        else:
            print(f"Index '{index_name}' does not exist.")
            return []


    def get_index_by_tag(self, tag_name):
        query = {
            "match": {
                "TagName": tag_name
            }
        }
        result = self.elasticInstance.search(index="_all", query=query)
        indices = [hit['_source']['IndexName'] for hit in result['hits']['hits']]

        if not indices:
            print(f"No index found for tag '{tag_name}'.")
        else:
            print(f"Indices for tag '{tag_name}': {indices}")

        return indices if indices else f"No index found for tag '{tag_name}'."


    # Method - Input list of tags and return the matching indexes
    def get_indexes_by_tags(self, tag_names):
        query = {
            "terms": {
                "TagName": tag_names
            }
        }
        result = self.elasticInstance.search(index="_all", query=query, size=10000)
        indices = set(hit['_source']['IndexName'] for hit in result['hits']['hits'])
        print(f"Indices matching tags {tag_names}: {list(indices)}")
        return list(indices)


    #3. Create new tag API with sends tag name
    #3.1 We need to design define which load the index name as undefine tag index
    #3.2 Save the tag with index undefine and tag name from step 3
    def create_new_tag_api(self, tag_name):
        # Check if tag already exists in any index
        query = {
            "match": {
                "TagName": tag_name
            }
        }

        result = self.elasticInstance.search(index="_all", query=query)
        if result['hits']['total']['value'] == 0:
            # Ensure 'undefine' index exists
            undefined_index = "undefined_index"
            if not self.elasticInstance.indices.exists(index=undefined_index):
                self.create_index(undefined_index)
            tag_document = {
                "IndexName": undefined_index,
                "TagName": tag_name
            }
            self.elasticInstance.index(index=undefined_index, document=tag_document)
            print(f"Tag '{tag_name}' added to 'undefine' index.")
            return {"status": "success", "message": f"Tag '{tag_name}' added to 'undefine' index."}
        else:
            print(f"Tag '{tag_name}' already exists in an index.")
            return {"status": "exists", "message": f"Tag '{tag_name}' already exists in an index."}




    # GET Method - which search accepts the semantic and searches in tag index and returns the matching tag name.
    def search_tags_by_semantic_string(self, search_string):
        searchQuery = {
            "match": {
                "TagName": {
                    "query": search_string,
                    "fuzziness": "AUTO"
                }
            }
        }

        result = self.elasticInstance.search(index="_all", query=searchQuery, size=100)
        print(result)
        tags = list({hit['_source']['TagName'] for hit in result['hits']['hits']})
        print(f"Tags matching '{search_string}': {tags}")
        return tags


    def get_all_tags(self):
        index_name = TAG_INDEX_NAME
        all_docs = []
        page = self.elasticInstance.search(
            index=index_name,
            scroll='2m',
            body={
                "query": {"match_all": {}},
                "size": 1000
            }
        )
        sid = page['_scroll_id']
        scroll_size = len(page['hits']['hits'])
        all_docs.extend([hit['_source'] for hit in page['hits']['hits']])

        while scroll_size > 0:
            page = self.elasticInstance.scroll(scroll_id=sid, scroll='2m')
            sid = page['_scroll_id']
            scroll_size = len(page['hits']['hits'])
            all_docs.extend([hit['_source'] for hit in page['hits']['hits']])

        print(f"Total documents fetched: {len(all_docs)}")
        return [doc['TagName'] for doc in all_docs if 'TagName' in doc]


    def load_tag_documents(self, json_file):
        index_name = TAG_INDEX_NAME
        if not self.elasticInstance.indices.exists(index=index_name):
            self.create_index(index_name)

        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for record in data:
            self.add_tag_to_index(record["IndexName"], record["TagName"])

        all_docs = []
        page = self.elasticInstance.search(
            index=index_name,
            scroll='2m',
            body={
                "query": {"match_all": {}},
                "size": 1000
            }
        )
        sid = page['_scroll_id']
        scroll_size = len(page['hits']['hits'])
        all_docs.extend([hit['_source'] for hit in page['hits']['hits']])

        while scroll_size > 0:
            page = self.elasticInstance.scroll(scroll_id=sid, scroll='2m')
            sid = page['_scroll_id']
            scroll_size = len(page['hits']['hits'])
            all_docs.extend([hit['_source'] for hit in page['hits']['hits']])

        print(f"Total documents fetched: {len(all_docs)}")
        return all_docs



if __name__ == "__main__":
    elasticInstance = get_elasticsearch_client()
    tag_indexing = TagIndexing(elasticInstance)
    tag_indexing.create_index(TAG_INDEX_NAME)

    tag_indexing.load_tag_documents("tagSample.json")

    tag_indexing.get_tags_by_index(TAG_INDEX_NAME)

    #tag_indexing.add_tag_to_index("test_index", "tag1")
    #tag_indexing.add_tag_to_index("test_index", "tag2 akash")
    #tag_indexing.add_tag_to_index("test_index", "tag3")
    #tag_indexing.add_tag_to_index("test_index", "tag4")

    #tag_indexing.create_index("rajkumar_index")
    #tag_indexing.add_tag_to_index("rajkumar_index", "example_tag1 by akash")
    #tag_indexing.add_tag_to_index("rajkumar_index", "example_tag2")
    #tag_indexing.add_tag_to_index("rajkumar_index", "example_tag3")

    #tag_indexing.search_tags_by_semantic_string("akash")

    #tag_indexing.get_tags_by_index("test_index")
    #tag_indexing.get_index_by_tag("tag1")

    #tag_indexing.get_index_by_tag("tag1")

    # tag_indexing.create_tags_index("new_test_index3")
    # tag_indexing.rename_tag_in_index("new_test_index3", "example_tag1", "example_tag_renamed")
    # tag_indexing.rename_index("new_test_index3", "renamed_test_index")
    # tag_indexing.add_tag_to_index("renamed_test_index", "example_tag2")
