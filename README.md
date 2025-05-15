# Enterprise Support Ticketing System

A modern, feature-rich ticketing system for enterprise support teams.

## Features

- **Ticket Management**: Create, view, edit, and track support tickets
- **Status Tracking**: Monitor ticket status (Open, In Progress, Resolved, Closed)
- **Priority Levels**: Critical, High, Medium, Low priority classification
- **Real-time Messaging**: Built-in messaging system for ticket discussions
- **Advanced Filtering**: Filter tickets by status, priority, assignee, tags
- **Pagination**: Handle large volumes of tickets efficiently
## Docker Setup

### Build the Docker Image
```bash
docker build -t enterprise-ticketing .
```

### Run the Container
```bash
docker run -d -p 3000:3000 \
  -e API_URL=http://your-api-url \
  -e WS_URL=ws://your-websocket-url \
  --name ticketing-app \
  enterprise-ticketing
```

### Environment Variables
- `API_URL`: URL for the backend API
- `WS_URL`: URL for WebSocket connections

### Development Mode
```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=development \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name ticketing-dev \
  enterprise-ticketing
```

### Production Build
```bash
docker run -d -p 80:80 \
  --name ticketing-prod \
  enterprise-ticketing
```