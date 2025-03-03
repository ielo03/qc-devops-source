import startBackend from './src/backend.mjs';

startBackend();

process.on("SIGINT", () => {
    process.exit();
});