from elasticsearch import Elasticsearch

host = "https://localhost:9200"
ca_certs = "C:\\HOMEWARE\\ITToolbox\\apps\\elasticsearch-9.0.3\\config\\certs\\http_ca.crt"
username = "elastic"
password = "a7FSwUE0HziGeHYM6=ZQ"


def get_elasticsearch_client():
   global es
   try:
       es = Elasticsearch(
           hosts=[host],
           basic_auth=(username, password),
           ca_certs=ca_certs
       )

   except Exception as e:
       print("Error creating Elasticsearch client: {}".format(e))


   if es.ping():
       print("Elasticsearch is connected successfully!")
   else:
       print("Elasticsearch connection failed!")

   if not es.ping():
        raise Exception("Failed to connect to Elasticsearch at {}".format(host))

   return es

get_elasticsearch_client()