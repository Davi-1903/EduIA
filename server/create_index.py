from dotenv import load_dotenv
from pathlib import Path
from pinecone import Pinecone
from utils import get_env

load_dotenv(Path('../.env'))

pc = Pinecone(api_key=get_env('PINECONE_API_KEY'))

pc.create_index(
    name='eduia-rag-classic',
    dimension=1024,
    metric='cosine',
    spec={
        'serverless': {
            'cloud': 'aws',
            'region': 'us-east-1'
        }
    }
)

print(pc.describe_index('eduia-rag-classic'))
