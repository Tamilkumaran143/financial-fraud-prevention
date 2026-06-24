# Homomorphic Encryption Workbench for Secure Collaborative Data Analysis in Financial Fraud Prevention

## Overview

This project is a full-stack secure data analysis platform for collaborative fraud prevention in financial services. It includes a React 19 frontend built with Vite and a Node.js Express backend with JWT authentication, encrypted transaction storage, fraud detection, PDF reporting, and MySQL database support.

## Backend Setup

1. Create the database manually in MySQL Workbench.
2. Execute the SQL schema file located at the repository root:
   ```bash
   mysql -u <DB_USER> -p < mysql-workbench-schema.sql
   ```
3. Navigate to the server folder:
   ```bash
   cd server
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file based on `.env.example` and update `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
6. Start the backend:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Environment Variables

Use `.env.example` as a template:

```text
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=fraud_workbench

JWT_SECRET=your_jwt_secret
```

## Project Structure

- `client/` - React frontend
- `server/` - Express backend
- `mysql-workbench-schema.sql` - Manual MySQL schema definition

## Notes

- Only `DB_USER` and `DB_PASSWORD` need to be changed in `.env` to run locally.
- The backend stores uploaded CSV files in `server/uploads`.
- Fraud detection rules are simulated with Base64 encryption.
