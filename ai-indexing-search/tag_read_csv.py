import csv

from elastic_connection import get_elasticsearch_client
from tag_indexing import TagIndexing


class ReadCSVTag:
    global elasticInstance

    def __init__(self, elasticInstance):
        self.elasticInstance = elasticInstance

    def load_tag_from_csv_update_index(self, input_csv, output_csv):
        with open(input_csv, mode='r', newline='', encoding='utf-8') as infile, \
                open(output_csv, mode='w', newline='', encoding='utf-8') as outfile:
            reader = csv.DictReader(infile)
            fieldnames = ['TagName', 'IndexName']
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()
            for row in reader:
                tag_name = row.get('TagName')
                index_name = self.get_index_for_tag(tag_name) if tag_name else None
                if not index_name:
                    index_name = 'undefined'
                writer.writerow({'TagName': tag_name, 'IndexName': index_name})
        print(f"Updated tag indices written to '{output_csv}'.")


# Example usage:
if __name__ == "__main__":
    elasticInstance = get_elasticsearch_client()
    read_csv = ReadCSVTag(elasticInstance)
    read_csv.load_tags_from_csv('tags.csv')