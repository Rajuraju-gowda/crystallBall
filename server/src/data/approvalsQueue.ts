export interface ApprovalItem {
  id: string;
  title: string;
  type: "Folder" | "Video" | "Pdf" | "Image";
  submittedBy: string;
  date: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Changes Requested";
  path: string;
  description: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  priorityTag: "P1" | "P2" | "P3" | "P4";
  location?: string;
  metadata?: Record<string, string>;
}

export const MOCK_APPROVALS_QUEUE: ApprovalItem[] = [
  {
    id: "appr-001",
    title: "Site Patrol Onboarding & Checklists",
    type: "Folder",
    submittedBy: "Sam HelpAdmin",
    date: "Sep 18",
    status: "Pending Review",
    path: "My Site Patrol > My Site Patrol Card",
    description: "Standard operating procedures, emergency drill routes, and daily technician check-in checklists for regional deployment.",
    urgency: "MEDIUM",
    priorityTag: "P2",
    location: "Sector A - Operations Center",
    metadata: {
      itemsInside: "8 documents",
      authorRole: "Senior Safety Officer"
    }
  },
  {
    id: "appr-002",
    title: "Level 2 Drone Patrol Video Demo",
    type: "Video",
    submittedBy: "Alex HelpAdmin",
    date: "Sep 18",
    status: "Pending Review",
    path: "Drawing-Videos > Drawing-Videos Card",
    description: "Autonomous perimeter drone patrol footage validating thermal obstacle detection along high-voltage perimeter Sector B.",
    urgency: "HIGH",
    priorityTag: "P1",
    location: "Sector B - High Voltage Perimeter",
    metadata: {
      duration: "04:32",
      flightAltitude: "45m AGL",
      thermalSensorsActive: "true"
    }
  },
  {
    id: "appr-003",
    title: "Safety Equipment & Sensor Specs",
    type: "Pdf",
    submittedBy: "Sam HelpAdmin",
    date: "Sep 18",
    status: "Pending Review",
    path: "Site Recordings > Site Recordings",
    description: "Calibration logs, technical data sheets, and seismic/infrared vibration sensor threshold certifications.",
    urgency: "MEDIUM",
    priorityTag: "P3",
    location: "Sector C - Sensor Array Grid",
    metadata: {
      totalPages: "14 pages",
      complianceCode: "ISO-27001-ENG"
    }
  },
  {
    id: "appr-004",
    title: "360° Spatial Zone Layout & Camera Map",
    type: "Image",
    submittedBy: "Elena HelpAdmin",
    date: "Sep 18",
    status: "Pending Review",
    path: "Site Recordings > Site Recordings",
    description: "High-resolution orthomosaic spatial layout mapping blind spots, pan-tilt-zoom camera overlaps, and access gates across Substation 4.",
    urgency: "LOW",
    priorityTag: "P4",
    location: "Substation 4 - Main Yard",
    metadata: {
      resolution: "8192x4096",
      projection: "Equirectangular Orthomosaic"
    }
  }
];
