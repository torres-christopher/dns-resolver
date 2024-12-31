
# DNS Lookup Application

This is a **DNS Lookup Tool** built using **Node.js** and **Express.js**. It allows users to perform DNS lookups of various domains through both a **frontend interface** and a **RESTful API**, supporting multiple DNS record types and domain notations (text and IP).

---

## Features

- **Frontend Interface**:
  - A user-friendly web page where users can enter a domain name, select a DNS record type (e.g., A, AAAA, CNAME, MX, PTR, TXT), and view the results in a table format.
  
- **RESTful API**:
  - Supports DNS lookups for specific types or all DNS records.
  - Provides meaningful error responses for invalid inputs.

- **Reusable Code**:
  - Core DNS lookup logic is abstracted into a service module (`dnsService.js`) for reuse across API and frontend routes.

- **DNS Record Support**:
  - Supports `A`, `AAAA`, `MX`, `PTR`, `CNAME`, `TXT`, `ANY`, and more.

- **Error Handling**:
  - Handles invalid inputs, unsupported DNS types, and server-side errors gracefully.

---

## Project Structure

```
├── app.js               # Main application setup
├── server.js            # Entry point for the server
├── services
│   └── dnsService.js    # Core DNS lookup logic
├── controllers
│   ├── dnsController.js      # Handles DNS-related API requests
│   ├── internalController.js # Handles frontend DNS requests
│   ├── viewsController.js    # Serves frontend views
│   ├── contactController.js  # Handles email sending for contact us form
├── routes
│   ├── dnsRoutes.js      # Routes for DNS API
│   ├── internalRoutes.js # Routes for frontend DNS usage
│   └── viewRoutes.js     # Routes for serving views
│   └── contactRouts.js   # Routes for sending contact form
├── views
│   ├── _header.pug      # Header template
│   ├── _footer.pug      # Footer template
│   ├── base.pug         # Base layout for Pug templates
│   ├── overview.pug     # Main DNS Lookup page
│   ├── result-page.pug  # Result page for complete lookup
│   ├── about.pug        # About us page
│   ├── contact-us.pug   # Contact us page
│   ├── privacy.pug      # Privacy policy
│   ├── terms.pug        # Terms of service
│   ├── error.pug        # Error page if 404
├── public
│   ├── css
│   │   └── style.css    # CSS for frontend styling
│   ├── js
│   │   └── script.js    # Frontend JavaScript for DNS lookup
│   ├── img              # Public images
├── config.env           # Environment variables
└── package.json         # Project dependencies
```

---

## Installation and Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/dns-lookup.git
   cd dns-lookup
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file**:
   ```plaintext
   NODE_ENV=development
   PORT=3000
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

5. Open your browser and visit:
   - **Frontend**: `http://localhost:3000`
   - **API Example**: `http://localhost:3000/api/v1/dns/lookupType`

---

## Usage

### Frontend

1. Visit `http://localhost:3000`.
2. Enter a **domain name** (e.g., `example.com`).
3. Select a **DNS record type** from the dropdown menu (e.g., `A`, `MX`, etc.).
4. Click `Lookup` to view the results in a table.

### API Endpoints

#### 1. `POST /api/v1/dns/lookupType`

- **Description**: Lookup a specific DNS record type.
- **Request Body**:
  ```json
  {
    "domain": "example.com",
    "type": "A"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "domain": "example.com",
      "type": "A",
      "result": ["93.184.216.34"]
    }
  }
  ```

#### 2. `GET /internal/dns`

- **Description**: Perform a DNS lookup for the frontend.
- **Query Parameters**:
  - `domain`: The domain to lookup.
  - `type`: The DNS record type.
- **Example**:
  ```
  /internal/dns?domain=example.com&type=MX
  ```

---

## Core Modules and Features

### 1. `dnsService.js`

- Abstracts DNS logic using Node.js `dns.promises`.
- Handles:
  - DNS record resolution.
  - IP address checks for `PTR` lookups.
  - Error handling for invalid inputs or unsupported types.

### 2. Frontend Integration

- The `public/script.js` file handles form submissions, sends requests to `/internal/dns`, and dynamically generates a table to display results.

### 3. View Engine

- Uses **Pug** templates for rendering the frontend.
- `base.pug` defines the layout, and `overview.pug` renders the DNS Lookup tool.

---

## Development

### Start in Development Mode

```bash
npm run dev
```

- Uses **nodemon** for automatic server restarts during development.

### Code Linting

```bash
npm run lint
```

- Checks for code quality and adheres to best practices.

---

## Deployment

1. **Prepare for Production**:
   ```bash
   npm run build
   ```

2. **Run in Production Mode**:
   ```bash
   NODE_ENV=production npm start
   ```

---

## Example Workflow

### Frontend

1. **Input Domain and Record Type**:
   - Users input a domain (e.g., `example.com`) and select a record type (e.g., `MX`).

2. **Fetch DNS Records**:
   - The frontend sends a `GET` request to `/internal/dns`.

3. **Display Results**:
   - The results are displayed in a table with keys and values.

### API

1. **Submit POST Request**:
   - The API allows users to programmatically query DNS records by submitting a POST request to `/api/v1/dns/lookupType`.

2. **Handle Errors**:
   - If an invalid domain or unsupported record type is submitted, the API returns an error response.

---

## Example Responses

### Success

```json
{
  "status": "success",
  "data": {
    "domain": "example.com",
    "type": "A",
    "result": ["93.184.216.34"]
  }
}
```

### Error

```json
{
  "status": "fail",
  "message": "Invalid DNS type"
}
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature name"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## License

Not licensed

---

## Contact

For feedback or questions, please contact [chris.k.torres@gmail.com](mailto:chris.k.torres@gmail.com).
