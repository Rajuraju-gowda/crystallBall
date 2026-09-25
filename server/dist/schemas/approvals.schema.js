import { z } from "zod";
export const ApprovalItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["Folder", "Video", "Pdf", "Image"]),
    submittedBy: z.string(),
    date: z.string(),
    status: z.enum(["Pending Review", "Approved", "Rejected", "Changes Requested"]),
    path: z.string(),
    description: z.string(),
    urgency: z.enum(["HIGH", "MEDIUM", "LOW"]),
    priorityTag: z.enum(["P1", "P2", "P3", "P4"]),
    location: z.string().optional(),
    metadata: z.record(z.string()).optional()
});
export const ApprovalsQueueSchema = z.array(ApprovalItemSchema);
