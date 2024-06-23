# 🍲Food Fusion
The idea behind this project was to create a simple API to utilize knowledge in CI and testing, as well as to test the capabilities of NestJS.

## 🛠️ Technologies Used
- NodeJS - Minimum version 18.18
- Typescript
- NestJS
- PostgreSQL
- Docker
- Prisma
- Jest
- Github Actions - For continuous integration(CI)


## 🚀 Installation
1. Clone the repository

2. Install dependencies
   ```bash
    npm install
   ```

3. Set up the database with Docker
    Ensure you have Docker installed and running on your machine. You will need to configure Docker for the PostgreSQL database. You will need to configure database for tests too.

4. Create the `.env` file
   Create `.env` file with database credentials. Example:
    ```
    DATABASE_URL=postgresql://username:password@localhost:5432/database_name     
    ```
5. Create the `.env.local` file to database for  tests
    Create `.env.local` file with database for tests credendials
    Example:
        ```
        DATABASE_URL=postgresql://username_test:password_test@localhost:5433/database_name_test     
        ```

6. Run database migrations
    ```
    npx prisma migrate dev
    ```


## 🎯 Running the Appliocation
1. Start the application
    ```bash
    npm run start
    ```
2. Start the application in development mode
    ```bash
    npm run start:dev
    ```

## 🧪 Testing
- To run all tests, use the following command:
    ```bash
    npm run test
    ```

- To run integration tests, use the following command:
    ```bash
    npm run test:integration
    ```

## 📬 Contact
**[LinkedIn](https://www.linkedin.com/in/guilhermenied01/)**

**[Github](https://github.com/GuilhermeNied)**teste