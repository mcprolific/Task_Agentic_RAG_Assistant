## Practice Exercises
## Exercise 1: Build Your Own Agentic RAG System

### Task
Build an agentic RAG system on a topic of your choice (NOT biochemistry - use your own domain).

### Domain Suggestions
- Technology tutorials (Python, JavaScript, etc.)
- Agriculture
- Finance
- Historical documents
- Study notes from a course
- Recipe collection
- Legal documents (simplified)

### Requirements

**1. Document Collection**
- Gather 5-10 documents (PDF or TXT) in your chosen domain
- Documents should be substantial (5000+ words each)
- Topics should be related but distinct

**2. Vector Store Setup**
- Load documents using appropriate loader
- Split into chunks (experiment with chunk size)
- Create Chroma vector store with embeddings
- Test retrieval with sample queries

**3. Retrieval Tool**
- Create `@tool` decorated function for retrieval
- Use MMR or similarity search
- Return formatted context
- Include metadata in responses

**4. Agentic RAG System**
- Build LangGraph with agent and tool nodes
- Implement conditional edges (agent decides when to retrieve)
- Add conversation memory
- Create helpful system prompt

**5. Testing & Evaluation**
- Test with 10 diverse queries:
  - 5 that require retrieval
  - 5 that don't require retrieval
- Document which queries trigger retrieval
- Evaluate answer quality

### Deliverables
1. Jupyter notebook with complete implementation
2. Test results showing agent decisions
3. Brief report (300-500 words):
   - What domain did you choose and why?
   - How did you tune chunk size?
   - Did the agent make good retrieval decisions?
   - What worked well? What needs improvement?

### Example System Behavior
```
Query: "What is Python?"
Agent Decision: NO retrieval needed (general knowledge)
Response: "Python is a high-level programming language..."

Query: "How do I use the new API endpoint for user authentication?"
Agent Decision: YES, retrieve from documentation
Response: [Retrieved docs] "Based on the documentation, the new authentication endpoint..."
```


<!-- 

https://tailwindcss.com/docs/installation/using-vite
npm install axios
npm install tailwindcss @tailwindcss/vite 

npm install framer-motion

npm install -D tailwind-scrollbar


-->

