import { Router, Request, Response } from "express";
import { MOCK_APPROVALS_QUEUE, ApprovalItem } from "../data/approvalsQueue.js";
import { ApprovalsQueueSchema } from "../schemas/approvals.schema.js";

export const approvalsRouter = Router();

let currentQueue: ApprovalItem[] = [...MOCK_APPROVALS_QUEUE];

approvalsRouter.get("/", (req: Request, res: Response) => {
  const validated = ApprovalsQueueSchema.parse(currentQueue);
  res.json({
    total: validated.length,
    items: validated
  });
});

approvalsRouter.get("/:id", (req: Request, res: Response) => {
  const item = currentQueue.find((i) => i.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json(item);
});

approvalsRouter.patch("/:id", (req: Request, res: Response) => {
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

approvalsRouter.post("/reset", (req: Request, res: Response) => {
  currentQueue = [...MOCK_APPROVALS_QUEUE];
  res.json({ message: "Queue reset to default seed dataset", total: currentQueue.length });
});
