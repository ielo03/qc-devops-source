import express from "express";
import env from "../environment.mjs";

import routes from "./routes.mjs";

export const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use("/api", routes);

app.use((req, res, next) => {
    const err = new Error("Page Not Found: " + req.url);
    err.code = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const code = err.code || 500;
    const message = err.message || "Internal Server Error";
    const context = {
        code,
        message
    };
    res.send(context);
});

const startBackend = () => {
    const port = env.backend.port || 3002;
    const host = env.backend.host || "0.0.0.0";
    app.listen(port, host, () => {
        console.log(`Server running at ${host}:${port}`);
    });
};

export default startBackend;