import express from "express";
import questionablecocktailsHome from "./questionablecocktails/questionablecocktailsHome.mjs";

const router = express.Router();

router.get("/", questionablecocktailsHome.get);

export default router;