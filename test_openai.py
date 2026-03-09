import httpx
from openai import OpenAI

# Force HTTP/1.1 instead of HTTP/2
transport = httpx.HTTPTransport(http2=False)
http_client = httpx.Client(transport=transport)

client = OpenAI(http_client=http_client)

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="test"
)

print("Embedding length:", len(response.data[0].embedding))
