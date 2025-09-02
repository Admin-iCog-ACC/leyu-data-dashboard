
# FastAPI Docker Setup

This project uses FastAPI and Docker for deployment. The API runs on port 8000 by default.

## Running with Docker Compose

1. Build and start the service:
	```pwsh
	docker-compose up --build
	```

2. Access the API at: [http://localhost:8000](http://localhost:8000)
	- Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Environment Variables

Create a `.env` file in your project root with the following variables:

```
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

- `POSTGRES_USER`: The PostgreSQL username (default: `user`)
- `POSTGRES_PASSWORD`: The PostgreSQL password (default: `password`)
- `POSTGRES_DB`: The database name (default: `db`)
- `POSTGRES_HOST`: The database host (default: `localhost`)
- `POSTGRES_PORT`: The database port (default: `5432`)

## Example `.env` file

```
POSTGRES_USER=admin
POSTGRES_PASSWORD=secretpassword
POSTGRES_DB=mydatabase
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

## Usage

The application will automatically read these variables to connect to the database. Make sure your PostgreSQL server is running and accessible with the credentials provided.

---

**Note:** Never commit your real `.env` file with sensitive credentials to version control.
