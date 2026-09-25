export interface PolicyChunk {
  id: string;
  section: string;
  title: string;
  keywords: string[];
  content: string;
}

export const APPROVAL_POLICY_TEXT = `
# OomniEye Command Centre: Standard Operating Procedure for Asset Review & Approvals (v2.4)

## Section 1: Drone Video & Autonomous Flight Verification
All autonomous perimeter surveillance videos submitted for review must adhere to Level 2 Drone Safety standards. Reviewing operators must verify that the recorded flight altitude does not exceed 50 meters Above Ground Level (AGL) and that thermal imaging sensors remain active across critical high-voltage perimeters (Sector B). If video footage exhibits telemetry dropouts exceeding 3 consecutive seconds or unflagged obstacle avoidance maneuvers, the operator must immediately reject the item with the label "Telemetry Irregularity" and request re-flight logs from the flight controller (Alex HelpAdmin).

## Section 2: Sensor Calibration & Equipment Specification Sign-Off
Sensor calibration documentation and specification PDFs (such as seismic, acoustic, or infrared vibration devices) require proof of certified calibration completed within the preceding 90 calendar days. Operators must cross-check the submitted compliance code against ISO-27001-ENG standards. PDF submissions lacking an accredited laboratory test stamp or presenting incomplete sensitivity curves must be placed into "Requested Changes" state, and Sam HelpAdmin must be notified.

## Section 3: Spatial Zone Mapping & Camera Coverage Layouts
Orthomosaic maps, 360-degree spatial projections, and PTZ camera layout drawings must clearly highlight blind spots and restricted hazard zones. Prior to approving any camera grid adjustment, the operator must confirm minimum 15% overlap between adjacent optical camera viewing cones. Layouts that omit emergency muster points or fence breach zones cannot be approved without written authorization from Lead Surveyor Elena HelpAdmin.

## Section 4: Priority Triage & SLA Escalation Thresholds
Pending approval items are prioritized according to operational risk:
- Priority 1 (P1 - High Urgency): Drone flight anomalies, active breach detection updates, or perimeter security recordings. Review SLA: 4 hours.
- Priority 2 & 3 (P2/P3 - Medium Urgency): Operational checklists, safety manuals, and sensor calibration logs. Review SLA: 24 hours.
- Priority 4 (P4 - Low Urgency): Routine spatial zone updates and architectural site schematics. Review SLA: 72 hours.
Any ticket remaining unreviewed past 48 hours must be escalated to the Shift Operations Director.
`;

export const POLICY_CHUNKS: PolicyChunk[] = [
  {
    id: "sop-sec-1",
    section: "Section 1",
    title: "Drone Video & Autonomous Flight Verification",
    keywords: ["drone", "patrol", "video", "flight", "altitude", "agl", "thermal", "alex", "telemetry", "sector b"],
    content: "All autonomous perimeter surveillance videos must adhere to Level 2 Drone Safety standards. Operators must verify recorded flight altitude does not exceed 50m AGL and thermal imaging sensors remain active across high-voltage Sector B. Telemetry dropouts >3s require immediate rejection with label 'Telemetry Irregularity' and re-flight request."
  },
  {
    id: "sop-sec-2",
    section: "Section 2",
    title: "Sensor Calibration & Equipment Specification Sign-Off",
    keywords: ["sensor", "specs", "pdf", "calibration", "seismic", "infrared", "sam", "iso", "iso-27001-eng", "compliance"],
    content: "Sensor calibration and specification PDFs (seismic, infrared) require proof of certified calibration within 90 days. Operators must verify ISO-27001-ENG compliance. Submissions lacking accredited laboratory test stamps or sensitivity curves must be placed into 'Requested Changes' state."
  },
  {
    id: "sop-sec-3",
    section: "Section 3",
    title: "Spatial Zone Mapping & Camera Coverage Layouts",
    keywords: ["spatial", "zone", "layout", "camera", "map", "image", "360", "elena", "blind spots", "overlap"],
    content: "360-degree spatial projections and camera layout drawings must highlight blind spots and restricted hazard zones. Operators must confirm minimum 15% overlap between adjacent camera viewing cones. Layouts omitting muster points require written sign-off from Elena HelpAdmin."
  },
  {
    id: "sop-sec-4",
    section: "Section 4",
    title: "Priority Triage & SLA Escalation Thresholds",
    keywords: ["sla", "priority", "urgency", "escalation", "hours", "director", "p1", "p2", "p3", "p4", "triage"],
    content: "Priority 1 (P1 High): Drone flights & perimeter breaches (SLA 4 hrs). Priority 2/3 (Medium): Checklists, safety manuals, sensor logs (SLA 24 hrs). Priority 4 (Low): Spatial updates & schematics (SLA 72 hrs). Tickets unreviewed past 48 hours escalate to Shift Operations Director."
  }
];
