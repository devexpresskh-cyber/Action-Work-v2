export type UserRole = 
  | 'Super Admin'
  | 'Administrator'
  | 'Department Manager'
  | 'Team Leader'
  | 'Employee'
  | 'Executive / Viewer';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type PlanStatus = 
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Approved'
  | 'In Progress'
  | 'Submitted for Completion'
  | 'Completed'
  | 'Rejected'
  | 'On Hold';

export type ActivityStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled'
  | 'Under Review'
  | 'Delayed'
  | 'Blocked';

export type ApprovalActionType = 
  | 'Submit for Approval'
  | 'Approve'
  | 'Reject'
  | 'Request Revision'
  | 'Resubmit'
  | 'Submit for Completion'
  | 'Final Approve Completion';

export interface User {
  id: string;
  employeeId?: string;
  name: string;
  nameKhmer?: string;
  email: string;
  password?: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  role: UserRole;
  status?: 'Active' | 'Inactive';
  isActive?: boolean;
  avatar?: string;
  createdAt: string;
}

export type Employee = User;

export interface Department {
  id: string;
  code: string;
  name: string;
  nameKhmer?: string;
  description: string;
  managerId?: string;
  headOfDepartmentId?: string;
  status?: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Objective {
  id: string;
  code: string;
  title: string;
  description: string;
  strategicGoal?: string;
  departmentId?: string;
  ownerId: string;
  kpi?: string;
  targetValue: number;
  currentValue?: number;
  measurementUnit?: string;
  targetUnit?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  category?: 'Operational' | 'Financial' | 'Customer' | 'Growth' | 'Technology';
  status?: 'Not Started' | 'In Progress' | 'Achieved' | 'Behind' | 'Cancelled';
  isActive?: boolean;
  createdAt: string;
}

export interface ActionPlan {
  id: string;
  planNumber: string; // e.g. AP-2026-001
  title: string;
  description: string;
  objectiveId: string;
  departmentId: string;
  ownerId: string;
  supportingEmployeeIds: string[];
  startDate: string;
  dueDate: string;
  priority: PriorityLevel;
  status: PlanStatus;
  kpi: string;
  kpiTarget: number;
  kpiActual: number;
  kpiUnit: string;
  budget: number;
  expectedResult: string;
  actualResult: string;
  completionPercentage: number;
  approvalStatus: 'Draft' | 'Pending Review' | 'Approved' | 'Revision Requested' | 'Rejected' | 'Pending Completion' | 'Completed';
  attachments: Attachment[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface Activity {
  id: string;
  code: string; // e.g. ACT-001
  actionPlanId: string;
  title: string;
  description: string;
  assignedEmployeeId: string;
  teamLeaderId?: string;
  startDate: string;
  dueDate: string;
  priority: PriorityLevel;
  status: ActivityStatus;
  progressPercentage: number;
  weight: number; // For weighted progress calculation
  weightPercentage?: number;
  isMilestone?: boolean;
  deliverableOutput?: string;
  kpiTarget?: string;
  actualResult?: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[]; // Activity IDs that must be completed first
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressUpdate {
  id: string;
  entityType: 'action_plan' | 'activity';
  entityId: string;
  previousPercentage: number;
  newPercentage: number;
  description: string;
  completedWork?: string;
  problemsObstacles?: string;
  nextActions?: string;
  actualKpiResult?: string;
  supportingEvidence?: string;
  updatedById: string;
  createdAt: string;
}

export interface PlanApproval {
  id: string;
  actionPlanId: string;
  stage: string;
  action: ApprovalActionType;
  reviewerId: string;
  reviewerRole: string;
  decision: 'Approved' | 'Rejected' | 'Revision Requested' | 'Submitted';
  comments: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedById: string;
  uploadedAt: string;
  url?: string;
}

export interface Comment {
  id: string;
  entityType: 'action_plan' | 'activity';
  entityId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'approval_request' | 'approved' | 'rejected' | 'progress' | 'deadline' | 'mention';
  entityType?: 'action_plan' | 'activity';
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  entityType?: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

export type AuditLog = ActivityLog;

export interface EmployeeFeedback {
  id: string;
  userId: string;
  userName: string;
  category: 'Navigation & Usability' | 'Mobile Experience' | 'Attendance & Shifts' | 'Performance & Speed' | 'Bug Report' | 'Feature Request';
  rating: number; // 1 to 5
  message: string;
  deviceInfo?: string;
  createdAt: string;
  status: 'New' | 'Reviewed' | 'Implemented';
}

export type Language = 'en' | 'km';

export type ShiftType = 'Morning' | 'Evening' | 'Night' | 'Custom';

export interface WorkShiftConfig {
  id: ShiftType;
  name: string;
  nameKm: string;
  hours: string;
  startTime: string; // '08:00:00'
  endTime: string; // '16:30:00'
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  lateGraceHour: number;
  lateGraceMinute: number;
  fullLabel: string;
  fullLabelKm: string;
  description: string;
  descriptionKm: string;
  icon?: string;
  theme?: string;
  isActive?: boolean;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent' | 'Overtime';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  employeeId?: string;
  departmentId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string | null; // e.g., '08:05:00' or ISO
  checkOutTime: string | null; // e.g., '17:15:00' or ISO
  status: AttendanceStatus;
  shiftType?: ShiftType;
  workShift?: string;
  workingHours: number; // e.g. 8.2
  overtimeHours: number; // e.g. 1.0
  notes?: string;
  location?: string;
  ipAddress?: string;
  checkInMethod: 'Web Portal' | 'Biometric Sync' | 'QR Code' | 'Manual Adjustment';
  verifiedBy?: string;
  createdAt: string;
}

export interface EmployeeAttendanceSummary {
  userId: string;
  employeeName: string;
  employeeId: string;
  departmentId: string;
  departmentName: string;
  position: string;
  totalWorkingDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  leaveDays: number;
  totalWorkingHours: number;
  totalOvertimeHours: number;
  attendanceRate: number; // percentage (e.g. 95.5)
  tasksCompletedThisMonth: number;
  performanceRemarks: string;
}

export interface DepartmentAttendanceSummary {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  averageAttendanceRate: number;
  totalHours: number;
  totalOvertimeHours: number;
  lateCount: number;
  absentCount: number;
}

export interface MonthlyAttendanceReport {
  id: string;
  reportCode: string;
  month: string; // YYYY-MM
  monthLabel: string; // e.g. September 2026
  departmentId: string; // 'all' or specific department
  departmentName: string;
  generatedAt: string;
  generatedById: string;
  generatedByName: string;
  standardWorkingDays: number;
  totalEmployees: number;
  averageAttendanceRate: number;
  totalHoursLogged: number;
  totalOvertimeHours: number;
  totalLateArrivals: number;
  totalAbsences: number;
  departmentSummaries: DepartmentAttendanceSummary[];
  employeeSummaries: EmployeeAttendanceSummary[];
  status: 'Published' | 'Draft';
  autoGenerated: boolean;
}

export type NavTab = 
  | 'employee-hub'
  | 'dashboard'
  | 'attendance'
  | 'action-plans'
  | 'activities'
  | 'progress'
  | 'approvals'
  | 'objectives'
  | 'departments'
  | 'employees'
  | 'calendar-gantt'
  | 'reports'
  | 'audit-logs';

export interface RolePermissionRule {
  allowedRoles: UserRole[];
  description: string;
  category: 'Personal' | 'Operational' | 'Management' | 'Administration';
  minimumRoleLevel: number;
}

export type VoiceCommandIntent = 
  | 'CREATE_PLAN'
  | 'UPDATE_PLAN'
  | 'DELETE_PLAN'
  | 'SEARCH_PLAN'
  | 'QUERY_STATUS'
  | 'CREATE_ACTIVITY'
  | 'UPDATE_ACTIVITY'
  | 'DELETE_ACTIVITY'
  | 'SEARCH_ACTIVITY'
  | 'NAVIGATE'
  | 'HELP'
  | 'AUTHENTICATE'
  | 'UNKNOWN';

export interface ParsedVoiceCommand {
  intent: VoiceCommandIntent;
  planName?: string;
  planNumber?: string;
  activityTitle?: string;
  activityCode?: string;
  assignedTo?: string;
  details?: string;
  departmentName?: string;
  progressPercentage?: number;
  status?: PlanStatus | ActivityStatus;
  priority?: PriorityLevel;
  budget?: number;
  weight?: number;
  dueDate?: string;
  pinCode?: string;
  rawTranscript: string;
  confidence?: number;
}

export interface VoiceCommandExecutionResult {
  success: boolean;
  intent: VoiceCommandIntent;
  spokenFeedback: string;
  displayMessage: string;
  planId?: string;
  planTitle?: string;
  planNumber?: string;
  activityId?: string;
  activityCode?: string;
  activityTitle?: string;
  timestamp: string;
  requiresPin?: boolean;
  requiresConfirmation?: boolean;
  details?: Record<string, any>;
  error?: string;
}

export interface VoiceSessionHistoryItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  transcript: string;
  intent: VoiceCommandIntent;
  success: boolean;
  spokenFeedback: string;
  planId?: string;
  planTitle?: string;
  activityId?: string;
  activityCode?: string;
  activityTitle?: string;
}
