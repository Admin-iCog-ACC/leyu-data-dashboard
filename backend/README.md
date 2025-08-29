# Database Environment Setup

This project uses a PostgreSQL database. You can configure the database connection using environment variables, typically set in a `.env` file.

## Required Environment Variables

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
