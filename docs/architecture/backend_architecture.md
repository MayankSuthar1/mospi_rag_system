# Backend Architecture

## Technology Stack

- **Framework**: Django 5.x with Django REST Framework
- **Database**: PostgreSQL with pgvector extension
- **Authentication**: Django REST Auth with JWT
- **Document Processing**: PyPDF2, Tesseract OCR, Langchain
- **Vector Storage**: FAISS or pgvector
- **AI Integration**: Google Gemini API
- **Task Queue**: Celery with Redis
- **Caching**: Redis
- **Testing**: pytest

## Directory Structure

```
/backend/
├── backend/                  # Project configuration
│   ├── settings.py
│   └── urls.py
├── users/               # User management
│   ├── models.py
│   ├── serializers.py
│   └── views.py
├── documents/           # Document processing
│   ├── models.py
│   ├── serializers.py
│   ├── services.py
│   └── views.py
├── conversation/        # Message-based Q&A functionality
│   ├── models.py
│   ├── serializers.py
│   ├── services.py
│   └── views.py
├── analytics/           # Usage analytics
│       ├── models.py
│       ├── serializers.py
│       └── views.py
├── rag/                     # RAG system implementation
│   ├── embeddings.py
│   ├── retriever.py
│   ├── context_builder.py
│   └── llm_integration.py
├── utils/                   # Shared utilities
│   ├── ocr.py
│   ├── pdf_extraction.py
│   └── text_processors.py
├── tasks/                   # Celery tasks
│   ├── document_processing.py
│   └── indexing.py
├── manage.py
└── requirements.txt
```

## Core Modules

### 1. Document Processing Pipeline

```
┌───────────────┐      ┌────────────────┐      ┌───────────────┐
│  Document     │      │  Text          │      │  Document     │
│  Upload       ├─────►│  Extraction    ├─────►│  Chunking     │
└───────────────┘      └────────────────┘      └───────┬───────┘
                                                       │
┌───────────────┐      ┌────────────────┐      ┌───────▼───────┐
│  Database     │      │  Vector        │      │  Embedding    │
│  Storage      │◄─────┤  Storage       │◄─────┤  Generation   │
└───────────────┘      └────────────────┘      └───────────────┘
```

**Key Components:**
- Document upload handler with validation
- PDF text extraction service
- OCR service for scanned documents
- Text chunking strategies (by paragraph, fixed-length, etc.)
- Embedding generation using transformer models
- Vector storage interface (FAISS/pgvector)
- Metadata extraction and storage

### 2. Message-Based RAG System

```
┌───────────────┐      ┌────────────────┐      ┌───────────────┐
│  User         │      │  Message       │      │  Vector       │
│  Message      ├─────►│  Embedding     ├─────►│  Retrieval    │
└───────────────┘      └────────────────┘      └───────┬───────┘
                                                       │
┌───────────────┐      ┌────────────────┐      ┌───────▼───────┐
│  Response     │      │  Gemini API    │      │  Context      │
│  Generation   │◄─────┤  Integration   │◄─────┤  Building     │
└───────────────┘      └────────────────┘      └───────────────┘
```

**Key Components:**
- Message preprocessing and embedding
- Vector similarity retrieval service
- Context building from retrieved document chunks
- Prompt engineering for Gemini API
- Response generation with source attribution
- Conversation history management

### 3. Web Search Integration

- Integration with web search APIs
- Results filtering and ranking
- Combining internal documents and web search results
- Context window management for efficient prompting

### 4. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login/` | POST | User authentication |
| `/api/auth/logout/` | POST | User logout |
| `/api/documents/` | GET/POST | List and upload documents |
| `/api/documents/{id}/` | GET/PUT/DELETE | Document operations |
| `/api/conversations/` | GET/POST | List and create conversations |
| `/api/conversations/{id}/` | GET/PUT/DELETE | Conversation operations |
| `/api/conversations/{id}/messages/` | GET/POST | List and send messages |
| `/api/analytics/usage/` | GET | System usage statistics |

## Database Schema

Core tables and their relationships:
- User
- Document
- DocumentChunk
- Conversation
- Message
- UserPreference
- SystemMetrics

## Async Processing

- Document processing tasks handled by Celery workers
- Embedding generation as background tasks
- Chunking and indexing pipeline
- Periodic re-indexing of documents

## Security Measures

- Input validation and sanitization
- Rate limiting on API endpoints
- Document access control based on user permissions
- Authentication middleware
- Secure handling of API keys

## Performance Optimization

- Message response caching
- Optimized vector retrieval algorithms
- Database query optimization
- Connection pooling
- Batch processing for document ingestion