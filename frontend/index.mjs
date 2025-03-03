import startFrontend from "./src/frontend.mjs";

startFrontend();

process.on("SIGINT", () => {
    process.exit();
});