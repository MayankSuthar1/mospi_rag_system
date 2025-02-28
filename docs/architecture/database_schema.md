# Database Schema Design

## Overview

The MoSPI RAG System uses PostgreSQL with pgvector extension for both relational data storage and vector embeddings. This document outlines the database schema design for the system.

## Entity Relationship Diagram

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│      User      │     │     Document   │     │  DocumentChunk │
├────────────────┤     ├────────────────┤     ├────────────────┤
│ id             │     │ id             │     │ id             │
│ email          │     │ title          │     │ document_id    │
│ password       │     │ description    │     │ chunk_index    │
│ name           │     │ file_path      │     │ text_content   │
│ role           │     │ file_type      │     │ embedding      │
│ created_at     │     │ user_id        │     │ metadata       │
│ last_login     │     │ category_id    │     └────────────────┘
└────────────────┘     │ created_at     │
        │              │ updated_at     │            ▲
        │              └────────────────┘            │
        │                      │                     │
        │                      │                     │
        ▼                      ▼                     │
┌────────────────┐     ┌────────────────┐           │
│UserPreference  │     │    Category    │           │
├────────────────┤     ├────────────────┤           │
│ id             │     │ id             │           │
│ user_id        │     │ name           │           │
│ theme          │     │ description    │           │
│ chat_settings  │     │ parent_id      │           │
│ view_mode      │     └────────────────┘           │
└────────────────┘                                  │
                                                    │
┌────────────────┐     ┌────────────────┐          │
│  Conversation  │     │     Message    │          │
├────────────────┤     ├────────────────┤          │
│ id             │     │ id             │          │
│ user_id        │     │ conversation_id│          │
│ title          │     │ content        │----------┘
│ created_at     │----►│ is_user        │
│ updated_at     │     │ created_at     │
└────────────────┘     │ doc_references │
                       └────────────────┘
                       
┌────────────────┐     ┌────────────────┐
│   ApiUsage     │     │SystemMetrics   │
├────────────────┤     ├────────────────┤
│ id             │     │ id             │
│ endpoint       │     │ name           │
│ user_id        │     │ value          │
│ tokens_used    │     │ timestamp      │
│ timestamp      │     │ metadata       │
└────────────────┘     └────────────────┘
```


## Table Definitions

### User Table

```sql
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
```

### UserPreference Table

```sql
CREATE TABLE user_preference (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'light',
    chat_settings JSONB DEFAULT '{}',
    view_mode VARCHAR(50) DEFAULT 'list'
);
```

### Category Table

```sql
CREATE TABLE category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES category(id) ON DELETE SET NULL
);
```

### Document Table

```sql
CREATE TABLE document (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES "user"(id) ON DELETE SET NULL,
    category_id UUID REFERENCES category(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX document_user_id_idx ON document(user_id);
CREATE INDEX document_category_id_idx ON document(category_id);
```

### DocumentChunk Table

```sql
CREATE TABLE document_chunk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES document(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    text_content TEXT NOT NULL,
    embedding VECTOR(1536),  -- Assuming using OpenAI's embedding model
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX document_chunk_document_id_idx ON document_chunk(document_id);
CREATE INDEX document_chunk_embedding_idx ON document_chunk USING ivfflat (embedding vector_l2_ops);
```

### Conversation Table

```sql
CREATE TABLE conversation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX conversation_user_id_idx ON conversation(user_id);
```

### Message Table

```sql
CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    doc_references JSONB DEFAULT '[]'
);

CREATE INDEX message_conversation_id_idx ON message(conversation_id);
```

### ApiUsage Table

```sql
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES "user"(id) ON DELETE SET NULL,
    tokens_used INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX api_usage_user_id_idx ON api_usage(user_id);
```

### SystemMetrics Table

```sql
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX system_metrics_name_idx ON system_metrics(name);
CREATE INDEX system_metrics_timestamp_idx ON system_metrics(timestamp);
```

## Initialization

```sql
-- Create pgvector extension if not exists
CREATE EXTENSION IF NOT EXISTS pgvector;

-- Create initial admin user
INSERT INTO "user" (email, password, name, role)
VALUES ('admin@mospi.gov.in', 'hashed_password_here', 'Admin', 'admin');

-- Create default categories
INSERT INTO category (name, description)
VALUES 
    ('Economic', 'Economic statistics and data'),
    ('Social', 'Social statistics and demographics'),
    ('Agricultural', 'Agricultural statistics and data');
```

## Development Setup
```