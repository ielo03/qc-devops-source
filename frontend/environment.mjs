import path from "path";
import {fileURLToPath} from "url";
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const getPathTo = pathFromRoot => path.join(__dirname, pathFromRoot);

const frontend = {
    port: parseInt(process.env.FRONTEND_PORT),
    host: process.env.FRONTEND_HOST,
};

const genai = {
    geminiAPIKey: process.env.GEMINI_API_KEY
}

const environment = {
    frontend,
    genai,
    __dirname,
    getPathTo
};

export default environment;