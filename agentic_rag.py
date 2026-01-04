import os
from dotenv import load_dotenv
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load API key
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in .env!")

# -------------------------------
#  Initialize LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.5, api_key=OPENAI_API_KEY)

# -------------------------------
# Load Documents (replace with your domain PDFs)
file_path = "sample_docs.pdf"  # replace with your domain PDFs
if not os.path.exists(file_path):
    # Demo documents if PDF not found
    from langchain_core.documents import Document
    pages = [
        Document(page_content="Python is a high-level programming language.", metadata={"page": 1}),
        Document(page_content="Python supports multiple programming paradigms.", metadata={"page": 2}),
        Document(page_content="FastAPI is a modern Python web framework.", metadata={"page": 3}),
    ]
else:
    loader = PyPDFLoader(file_path)
    pages = [page for page in loader.load()]

# -------------------------------
# Split into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
doc_splits = text_splitter.split_documents(pages)

# -------------------------------
# Create Chroma Vector Store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=OPENAI_API_KEY)
chroma_path = "./chroma_db_agentic_rag"
vectorstore = Chroma(
    collection_name="agentic_rag_docs",
    persist_directory=chroma_path,
    embedding_function=embeddings
)
vectorstore.add_documents(documents=doc_splits)

# -------------------------------
# Retrieval Tool
@tool
def retrieve_documents(query: str) -> str:
    """
    Search for relevant documents in the knowledge base.
    Only use for queries that require document info.
    """
    retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 5, "fetch_k": 10})
    results = retriever.invoke(query)
    if not results:
        return "No relevant documents found."
    return "\n\n---\n\n".join(f"Document {i+1}:\n{doc.page_content}" for i, doc in enumerate(results))

# -------------------------------
# Build Agentic RAG System
system_prompt = SystemMessage(content="""
You are a helpful assistant with access to a document retrieval tool.
DO NOT retrieve for simple greetings or general knowledge.
DO retrieve for domain-specific questions that need citations.
""")

tools = [retrieve_documents]
llm_with_tools = llm.bind_tools(tools)

def assistant(state: MessagesState) -> dict:
    messages = [system_prompt] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: MessagesState):
    last_message = state["messages"][-1]
    return "tools" if last_message.tool_calls else "__end__"

builder = StateGraph(MessagesState)
builder.add_node("assistant", assistant)
builder.add_node("tools", ToolNode(tools))
builder.add_edge(START, "assistant")
builder.add_conditional_edges("assistant", should_continue, {"tools": "tools", "__end__": END})
builder.add_edge("tools", "assistant")
memory = MemorySaver()
agent = builder.compile(checkpointer=memory)

# -------------------------------
# Query Function
def query_agent(query: str, thread_id: str = "default_session") -> dict:
    """
    Call this function from FastAPI
    Returns: {"answer": str, "used_retrieval": bool}
    """
    result = agent.invoke({"messages": [HumanMessage(content=query)]}, config={"configurable": {"thread_id": thread_id}})
    final_answer = ""
    used_retrieval = False

    for msg in result["messages"]:
        if isinstance(msg, AIMessage):
            if msg.tool_calls:
                used_retrieval = True
            if msg.content:
                final_answer = msg.content

    return {"answer": final_answer, "used_retrieval": used_retrieval}
