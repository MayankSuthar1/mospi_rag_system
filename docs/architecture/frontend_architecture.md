# Frontend Architecture

## Technology Stack

- **Framework**: Next.js
- **UI Library**: React
- **State Management**: React Context API and SWR/React Query
- **Styling**: TailwindCSS with custom theme
- **Component Library**: Headless UI with custom components
- **Testing**: Jest, React Testing Library
- **API Integration**: Axios

## Directory Structure

```
/frontend/
├── public/
│   ├── assets/
│   └── favicon.ico
├── app/              # Next.js app directory (TSX pages)
│   ├── api/          # API routes (if needed)
│   ├── auth/         # Authentication pages
│   ├── documents/    # Document management pages\
│   └── settings/     # User settings pages
├── components/
│   ├── common/       # Reusable UI components
│   ├── layouts/      # Page layout components\
│   ├── documents/    # Document management components
│   └── user/         # User-related components
├── hooks/            # Custom React hooks
├── contexts/         # React contexts for state management
├── lib/         # API service integrations
├── styles/           # Global styles and Tailwind config
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Components

### Core Pages

1. **Dashboard Page**
   - Overview of recent documents and messages
   - Quick message access
   - System status and announcements

2. **Messages Page**
   - Send messages via voice command (auto-converted to text) or manual typing
   - Display conversation threads
   - Support for attachments and media

3. **Document Management Pages**
   - Upload interface with drag-and-drop
   - Document categorization and tagging
   - Document list views with filtering
   - Document detail view

4. **Settings Pages**
   - User profile management
   - Interface customization
   - API key management (admin only)

### Reusable Components

1. **MessageInput**
   - Provides a voice command button that converts speech to text and sends the message automatically
   - Also supports manual message typing

2. **DocumentViewer**
   - PDF/document rendering
   - Text highlighting
   - Annotation capabilities
   - Page navigation

3. **ResultItem**
   - Document metadata display
   - Relevance score visualization
   - Source attribution
   - Actionable buttons (save, share)

## State Management

```
┌─────────────────────────────────────────────────┐
│              Application State                  │
└───────────┬─────────────────────────┬───────────┘
            │                         │
            ▼                         ▼
┌───────────────────────┐  ┌───────────────────────┐
│      Auth Context     │  │    Settings Context   │
└───────────────────────┘  └───────────────────────┘
            │                         │
            ▼                         ▼
┌───────────────────────┐  ┌───────────────────────┐
│     User Profile      │  │    User Preferences   │
└───────────────────────┘  └───────────────────────┘

┌───────────────────────┐  
│    Message State      │  
│  (React Query/SWR)    │  
└───────────────────────┘
```

## API Integration

- RESTful API client with interceptors for auth
- WebSocket integration for real-time search status
- File upload handling with progress indicators
- Error handling and retry mechanisms

## Responsive Design

- Mobile-first approach
- Breakpoints for tablet and desktop
- Progressive enhancement for complex features
- Accessibility considerations (WCAG compliance)

## Performance Optimization

- Code splitting and lazy loading
- Image optimization
- Server-side rendering for initial pages
- Memoization of expensive components
- Caching of API responses
