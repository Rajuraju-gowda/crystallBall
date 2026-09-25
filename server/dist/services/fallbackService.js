import { MOCK_APPROVALS_QUEUE } from "../data/approvalsQueue.js";
import { ragService } from "./ragService.js";
export class FallbackService {
    static generateSummaryFallback(items = MOCK_APPROVALS_QUEUE, reason = "Deterministic fallback generated due to AI service timeout or unconfigured LLM API.") {
        const priorityWeight = { P1: 4, P2: 3, P3: 2, P4: 1 };
        const sorted = [...items].sort((a, b) => {
            return (priorityWeight[b.priorityTag] || 0) - (priorityWeight[a.priorityTag] || 0);
        });
        const highCount = sorted.filter((i) => i.urgency === "HIGH" || i.priorityTag === "P1").length;
        const overallUrgency = highCount > 0 ? "HIGH" : "MEDIUM";
        const mappedItems = sorted.map((item) => {
            let recommendedAction = "APPROVE";
            let urgencyReason = `Routine operational queue review for ${item.type}.`;
            if (item.priorityTag === "P1") {
                recommendedAction = "REQUEST_CHANGES";
                urgencyReason = "Autonomous drone perimeter footage requires flight telemetry check before clearance.";
            }
            else if (item.priorityTag === "P2") {
                recommendedAction = "APPROVE";
                urgencyReason = "Core site safety checklist and technician sign-offs require standard verification.";
            }
            else if (item.priorityTag === "P3") {
                recommendedAction = "REQUEST_CHANGES";
                urgencyReason = "ISO-27001-ENG sensor calibration validity must be checked against 90-day window.";
            }
            else {
                recommendedAction = "APPROVE";
                urgencyReason = "Substation 4 camera coverage and blind spot map review.";
            }
            return {
                id: item.id,
                title: item.title,
                priority: item.priorityTag,
                urgencyReason,
                recommendedAction
            };
        });
        return {
            greeting: "Control Room Briefing: Live Queue Status",
            overallUrgency,
            totalPending: items.length,
            briefingText: `There are currently ${items.length} approval items pending in the control room queue. Priority attention is required for ${sorted[0]?.title}, submitted by ${sorted[0]?.submittedBy}, which involves autonomous drone flight logs. Remaining items include ${items.length - 1} standard documentation and spatial mapping requests.`,
            items: mappedItems,
            suggestedFocus: `${sorted[0]?.title} (${sorted[0]?.priorityTag}) requires initial review to prevent perimeter inspection delays.`,
            isFallback: true,
            reason
        };
    }
    static generateGreetingFallback(operatorName = "Operator", items = MOCK_APPROVALS_QUEUE, reason = "Generated via rule template") {
        const pendingCount = items.length;
        const highUrgent = items.find((i) => i.urgency === "HIGH");
        const priorityHighlight = highUrgent
            ? `1 high-urgency drone inspection pending from ${highUrgent.submittedBy}`
            : "All items at normal operational priority";
        const greeting = `Welcome to OomniEye Command Centre, ${operatorName}. You have ${pendingCount} pending approvals requiring review today, including ${priorityHighlight.toLowerCase()}.`;
        return {
            greeting,
            pendingCount,
            priorityHighlight,
            isFallback: true,
            reason
        };
    }
    static generateHelpFallback(question, reason = "Deterministic SOP policy retrieval") {
        const matches = ragService.search(question, 2);
        const topMatch = matches[0];
        if (!topMatch || topMatch.score === 0) {
            return {
                answer: "The current OomniEye SOP v2.4 does not contain explicit rules regarding this exact query. As per Section 4, please escalate any unaddressed compliance questions to the Shift Operations Director.",
                citations: [
                    {
                        chunkId: "sop-sec-4",
                        section: "Section 4",
                        title: "Priority Triage & SLA Escalation Thresholds"
                    }
                ],
                confidence: "LOW",
                isFallback: true,
                reason
            };
        }
        return {
            answer: `According to ${topMatch.chunk.section} (${topMatch.chunk.title}): ${topMatch.chunk.content}`,
            citations: [
                {
                    chunkId: topMatch.chunk.id,
                    section: topMatch.chunk.section,
                    title: topMatch.chunk.title,
                    quote: topMatch.chunk.content.slice(0, 150) + "..."
                }
            ],
            confidence: topMatch.score >= 3 ? "HIGH" : "MEDIUM",
            matchedKeywords: topMatch.matchedKeywords,
            isFallback: true,
            reason
        };
    }
    static generateTeachFallback(step = 1, targetItem, reason = "Deterministic SOP step engine") {
        const item = targetItem || MOCK_APPROVALS_QUEUE[0];
        const stepsConfig = [
            {
                step: 1,
                title: "Metadata & Provenance Verification",
                instruction: `First, verify the submission provenance for "${item.title}". Check that the submitter (${item.submittedBy}) holds valid authorization for this facility zone (${item.location || "Sector A"}).`,
                tips: [
                    "Check the submission timestamp (Sep 18).",
                    "Ensure user profile role matches author permissions."
                ],
                nextPrompt: "Have you confirmed the submitter credentials?",
                quickOptions: ["Submitter credentials confirmed", "What if credentials are missing?", "Skip to Step 2"]
            },
            {
                step: 2,
                title: "Content & Telemetry Inspection",
                instruction: `Next, inspect the actual payload (${item.type}). For videos and sensors, verify that telemetry parameters adhere to Level 2 Drone Safety standards (<50m AGL, active thermal sensors).`,
                tips: [
                    "Check for continuous sensor signals without dropouts >3s.",
                    "Verify asset tags match OomniEye Digital Twin asset IDs."
                ],
                nextPrompt: "Did the asset content pass your visual and telemetry inspection?",
                quickOptions: ["Telemetry looks clean", "Found irregular telemetry", "Need policy check"]
            },
            {
                step: 3,
                title: "Compliance & Risk Classification",
                instruction: `Confirm compliance codes. For PDFs, cross-check against ISO-27001-ENG and ensure calibration is within 90 days. For spatial maps, verify at least 15% camera cone overlap.`,
                tips: [
                    "P1 items have a 4-hour SLA.",
                    "P2/P3 items have a 24-hour review SLA."
                ],
                nextPrompt: "Does this submission meet compliance criteria?",
                quickOptions: ["Compliance criteria met", "Missing calibration certificate", "Escalate to Director"]
            },
            {
                step: 4,
                title: "Decision Execution & Audit Trail",
                instruction: `You are ready to execute your decision. Choose 'Approve' to release to production, 'Request Changes' with specific notes for the submitter, or 'Reject' with a mandatory violation code.`,
                tips: [
                    "All decisions are permanently recorded in the OomniEye audit log.",
                    "Rejections require an explanatory note."
                ],
                nextPrompt: "Select an action to conclude this review walkthrough.",
                quickOptions: ["Approve Item", "Request Changes", "Reject Item", "Restart Tutorial"]
            }
        ];
        const current = stepsConfig[Math.min(Math.max(step - 1, 0), stepsConfig.length - 1)];
        return {
            step: current.step,
            totalSteps: 4,
            stepTitle: current.title,
            instruction: current.instruction,
            tips: current.tips,
            nextPrompt: current.nextPrompt,
            quickOptions: current.quickOptions,
            isFallback: true,
            reason
        };
    }
    static generateTalkResponse(userQuestion) {
        const q = userQuestion.toLowerCase();
        const items = MOCK_APPROVALS_QUEUE;
        if (q.includes("first") || q.includes("priority") || q.includes("urgent") || q.includes("attention")) {
            const p1 = items.find((i) => i.priorityTag === "P1");
            return `Based on operational risk assessment, you should review "${p1?.title}" first. It is a Level 2 Drone Patrol Video Demo submitted by ${p1?.submittedBy}. Autonomous flight footage carries high safety liability and has an urgent 4-hour review SLA.`;
        }
        if (q.includes("sam") || q.includes("who submitted")) {
            const samItems = items.filter((i) => i.submittedBy.includes("Sam"));
            return `Sam HelpAdmin has submitted ${samItems.length} items: "${samItems.map((i) => i.title).join('" and "')}". Both relate to facility safety standards and sensor calibration.`;
        }
        if (q.includes("alex") || q.includes("drone")) {
            const droneItem = items.find((i) => i.type === "Video");
            return `Alex HelpAdmin submitted the Level 2 Drone Patrol Video Demo on Sep 18. It tests autonomous thermal obstacle detection along Sector B high-voltage perimeter lines.`;
        }
        if (q.includes("elena") || q.includes("camera") || q.includes("spatial")) {
            const elenaItem = items.find((i) => i.submittedBy.includes("Elena"));
            return `Elena HelpAdmin submitted the 360° Spatial Zone Layout & Camera Map covering Substation 4. This is categorized as Low Priority (P4) with a 72-hour review SLA.`;
        }
        return `I am monitoring the 4 items currently pending in the OomniEye Approvals queue: 1) Drone Patrol Video (Alex), 2) Site Patrol Checklists (Sam), 3) Safety Equipment Specs (Sam), and 4) 360 Spatial Map (Elena). You can ask me to evaluate urgency, explain SOP rules, or guide you through a review decision.`;
    }
}
