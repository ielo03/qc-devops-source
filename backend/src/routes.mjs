import express from "express";
import questionablecocktailsAPIHandler from "./questionablecocktails/questionablecocktailsAPIHandler.mjs";

const router = express.Router();

router.all("/:path(*)", questionablecocktailsAPIHandler);

export default router;