import express from "express";
import env from "../environment.mjs";

import hbs from "express-handlebars";
import routes from "./routes.mjs";

const app = express();

app.set("view engine", "hbs");
app.engine(
    "hbs",
    hbs.engine({
        layoutsDir: env.getPathTo("views/layouts"),
        defaultLayout: "main",
        extname: "hbs"
    })
);

app.set("views", env.getPathTo("views"));

app.use(express.static(env.getPathTo("public")));

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(routes);

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
    res
        .status(code)
        .render("error", context);
});

const startFrontend = () => {
    const port = env.frontend.port || 3001;
    const host = env.frontend.host || "0.0.0.0";
    app.listen(port, host, () => {
        console.log(`Server running at ${host}:${port}`);
    });
};

export default startFrontend;