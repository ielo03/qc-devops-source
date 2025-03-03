import path from "path";
import {fileURLToPath} from "url";
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const getPathTo = pathFromRoot => path.join(__dirname, pathFromRoot);

const backend = {
    port: parseInt(process.env.BACKEND_PORT),
    host: process.env.BACKEND_HOST,
};

const db = {
    host: process.env.DB_HOST || process.env.MYSQL_HOST,
    port: process.env.DB_PORT || process.env.MYSQL_PORT,
    user: process.env.DB_USER || process.env.MYSQL_USER,
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
    database: process.env.DB_DATABASE || process.env.MYSQL_DATABASE,
};

const genai = {
    geminiAPIKey: process.env.GEMINI_API_KEY
}

const environment = {
    backend,
    db,
    genai,
    __dirname,
    getPathTo
};

export default environment;