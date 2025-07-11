# TouchPay Docs Server

A RESTful API server for managing API documentation built with Node.js, Express, and MongoDB.

## Features

- CRUD operations for API documentation
- Search functionality across API titles, methods, and endpoints
- Sidebar navigation structure
- MongoDB integration for data persistence
- CORS enabled for cross-origin requests

## API Endpoints

### GET /api/docs
Get all API documentation with optional search parameter
- Query params: `search` (optional) - search across api_title, method, endpoint

### GET /api/docs/sidebar
Get structured sidebar navigation data grouped by title and subtitle

### GET /api/docs/:id
Get specific API documentation by ID

### POST /api/docs
Create new API documentation
- Body: ApiDoc object with required fields

### PUT /api/docs/:id
Update existing API documentation
- Body: Updated ApiDoc object

### DELETE /api/docs/:id
Delete API documentation by ID

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/thefrozenberry/touchpay-docs-server.git
cd touchpay-docs-server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your environment variables

4. Start the server:
```bash
npm start
```

## Development

- The server runs on port 5000 by default
- MongoDB connection is required
- CORS is enabled for all origins

## Deployment

See deployment instructions in the deployment guide.

## License

ISC 