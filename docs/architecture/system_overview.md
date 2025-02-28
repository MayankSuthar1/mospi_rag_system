# System Architecture Overview

This document provides a high-level overview of the MoSPI RAG System architecture.

## System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Client (Web Browser)                         │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    UI       │  │   State     │  │  API        │  │ Chat/Doc    │ │
│  │ Components  │  │ Management  │  │ Client      │  │ Viewers     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Backend (Django REST API)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    User     │  │  Document   │  │Conversation │  │  Analytics  │ │
│  │ Management  │  │ Processing  │  │   Module    │  │   Module    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└───┬───────────────────┬───────────────────┬───────────────────────┬─┘
    │                   │                   │                       │
    ▼                   ▼                   ▼                       ▼
┌──────────┐     ┌─────────────────┐ ┌─────────────────┐    ┌──────────────┐
│Database  │     │Document Storage │ │  Vector Store   │    │ External APIs│
│(Postgres)│     │   (File/S3)     │ │ (pgvector/FAISS)│    │ (Gemini API) │
└──────────┘     └─────────────────┘ └─────────────────┘    └──────────────┘
```

## Data Flow

1. **Document Ingestion Flow**:
   - User uploads documents through frontend
   - Backend processes documents (text extraction, OCR)
   - Documents are chunked and embedded
   - Embeddings stored in vector database
   - Document metadata and locations stored in database

2. **Message-Based Q&A Flow**:
   - User creates a conversation or uses existing one
   - User sends a question message about uploaded documents
   - Message is embedded and vector search retrieves relevant chunks
   - Retrieved chunks form context for Gemini API
   - Gemini API generates response based on context and message
   - Response with source attribution returned and saved in conversation

3. **Web Search Augmentation Flow**:
   - When internal document results are insufficient
   - Web search API is queried for relevant information
   - Web results are combined with internal document results
   - Combined context sent to Gemini API for unified response

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL with pgvector extension
- **Document Processing**: PyPDF2, Tesseract OCR
- **Vector Embeddings**: Sentence Transformers / OpenAI Embeddings
- **RAG Implementation**: LangChain / LlamaIndex
- **AI Integration**: Google Gemini API
- **Deployment**: Docker, Kubernetes

## Security Architecture

- JWT-based authentication
- Role-based access control
- Data encryption at rest and in transit
- API rate limiting
- Document access auditing

## Scalability Considerations

- Horizontal scaling of API servers
- Distributed document processing with queues
- Caching of frequent message responses
- Conversation history management
- Database replication and sharding strategies

## User Experience Flow

1. **Document Management**
   - User uploads documents
   - System processes documents in background
   - User receives notification when processing completes
   - User can view and manage uploaded documents

2. **Conversational Interface**
   - User creates a new conversation or continues existing one
   - User asks questions about uploaded documents
   - System retrieves relevant document content
   - System generates conversational responses with citations
   - Conversation history persists for future reference

3. **Citation and Source Tracking**
   - Responses include references to source documents
   - Users can click on citations to view original document
   - Confidence scores or relevance metrics shown for transparency