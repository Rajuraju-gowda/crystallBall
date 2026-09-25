import { Router } from "express";
import { MOCK_APPROVALS_QUEUE } from "../data/approvalsQueue.js";
import { ApprovalsQueueSchema } from "../schemas/approvals.schema.js";
export const approvalsRouter = Router();
let currentQueue = [...MOCK_APPROVALS_QUEUE];
approvalsRouter.get("/", (req, res) => {
    const validated = ApprovalsQueueSchema.parse(currentQueue);
    res.json({
        total: validated.length,
        items: validated
    });
});
approvalsRouter.get("/:id", (req, res) => {
    const item = currentQueue.find((i) => i.id === req.params.id);
    if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
    }
    res.json(item);
});
approvalsRouter.patch("/:id", (req, res) => {
    const { status } = req.body;
    const index = currentQueue.findIndex((i) => i.id === req.params.id);
    if (index === -1) {
        res.status(404).json({ error: "Item not found" });
        return;
    }
    currentQueue[index] = {
        ...currentQueue[index],
        status: status || currentQueue[index].status
    };
    res.json({
        message: "Approval status updated",
        item: currentQueue[index]
    });
});
approvalsRouter.post("/reset", (req, res) => {
    currentQueue = [...MOCK_APPROVALS_QUEUE];
    res.json({ message: "Queue reset to default seed dataset", total: currentQueue.length });
});
