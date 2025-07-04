
from sentence_transformers import SentenceTransformer

class PretrainedTransformerModel:
    def __init__(self, model_name="all-mpnet-base-v2"):
        self.model = SentenceTransformer(model_name)

    def encode(self, sentence):
        return self.model.encode(sentence)

    def vector_transformer(self, sentence):
        # 2. Calculate embeddings by calling model.encode()
        embeddings = self.encode(sentence)
        print("embeddings : ", embeddings.shape)

        return embeddings
