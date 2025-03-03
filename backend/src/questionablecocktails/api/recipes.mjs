import env from "../../../environment.mjs";
import mysql from "mysql2/promise";

const get = async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: env.db.host,
            port: env.db.port,
            user: env.db.user,
            password: env.db.password,
            database: env.db.database,
        });
        console.log("Successfully connected to the DB");

        // Optional: Test retrieving data from the recipes table
        const [rows] = await connection.execute('SELECT * FROM recipes');
        console.log(rows);

        return res.status(200).json(rows);
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
};

export default {
    get
};