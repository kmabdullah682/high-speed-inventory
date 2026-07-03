import express from "express";
import { injectMockDataController } from "../controller/injectData.controller.js";

const router = express.Router();

router.post("/inject-mock-data", injectMockDataController);

export default router;
