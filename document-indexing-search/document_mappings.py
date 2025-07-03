documentMetaData = {
    "properties": {
        "id": {
            "type": "text"
        },
        "fileName": {
            "type": "text"
        },
        "description": {
            "type": "text"
        },
        "tags": {
            "type": "text"
        },
        "accessGroup": {
            "type": "text"
        },
        "fileCategory": {
            "type": "text"
        },
        "uploadDate": {
            "type": "date"
        },
        "descriptionVector": {
            "type":"dense_vector",
            "dims": 768,
            "index":True,
            "similarity": "l2_norm"
        },
        "nameVector": {
            "type":"dense_vector",
            "dims": 768,
            "index":True,
            "similarity": "l2_norm"
        },
        "tagVector": {
            "type":"dense_vector",
            "dims": 768,
            "index":True,
            "similarity": "l2_norm"
        }
    }
}