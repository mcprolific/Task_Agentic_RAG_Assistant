from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agentic_rag import query_agent

app = FastAPI(title="Agentic RAG API")

@app.get("/")
def home():
    return {"message": "Hello World"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    session_id: str = "default_session"

class QueryResponse(BaseModel):
    answer: str
    used_retrieval: bool

@app.post("/query", response_model=QueryResponse)
def run_query(request: QueryRequest):
    try:
        res = query_agent(request.query, thread_id=request.session_id)
        return QueryResponse(answer=res["answer"], used_retrieval=res["used_retrieval"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
