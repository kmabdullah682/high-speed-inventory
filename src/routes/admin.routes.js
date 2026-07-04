import express from "express";
import { injectMockDataController } from "../controller/injectData.controller.js";
import { getAnalyticsController } from "../controller/analytics.controller.js";

const router = express.Router();

router.post("/inject-mock-data", injectMockDataController);
router.get("/analytics", getAnalyticsController);

export default router;
