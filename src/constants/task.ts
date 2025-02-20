import { TaskStatus, TaskPriority, Task, ViewGroupBy } from "@/features/task/taskModel";

export const GROUP_BY_STATUS: ViewGroupBy = "status";
export const GROUP_BY_PRIORITY: ViewGroupBy = "priority";

export const TASK_LOCAL_STORAGE_KEY = "tasks";
export const TABLE_VIEW_LOCAL_STORAGE_KEY = "table-view";
export const KANBAN_VIEW_LOCAL_STORAGE_KEY = "kanban-view";

export const TASK_STATUSES: TaskStatus[] = ["not_started", "in_progress", "completed"];
export const TASK_PRIORITIES: TaskPriority[] = ["none", "low", "medium", "high", "urgent"];

export const MOCK_TASKS: Task[] = [
  {
    "id": 1,
    "title": "Write project proposal",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 2,
    "title": "Fix login page bug",
    "status": "not_started",
    "priority": "none"
  },
  {
    "id": 3,
    "title": "Design homepage layout",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 4,
    "title": "Update API documentation",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 5,
    "title": "Refactor user authentication",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 6,
    "title": "Optimize database queries",
    "status": "not_started",
    "priority": "low"
  },
  {
    "id": 7,
    "title": "Review PR #345",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 8,
    "title": "Implement dark mode",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 9,
    "title": "Schedule team meeting",
    "status": "completed",
    "priority": "low"
  },
  {
    "id": 10,
    "title": "Prepare monthly report",
    "status": "in_progress",
    "priority": "none"
  },
  {
    "id": 11,
    "title": "Fix CSS styling issue",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 12,
    "title": "Set up CI/CD pipeline",
    "status": "not_started",
    "priority": "medium"
  },
  {
    "id": 13,
    "title": "Test new feature deployment",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 14,
    "title": "Debug performance issues",
    "status": "completed",
    "priority": "none"
  },
  {
    "id": 15,
    "title": "Create marketing email template",
    "status": "in_progress",
    "priority": "urgent"
  },
  {
    "id": 16,
    "title": "Write unit tests for authentication",
    "status": "not_started",
    "priority": "medium"
  },
  {
    "id": 17,
    "title": "Optimize frontend rendering",
    "status": "completed",
    "priority": "low"
  },
  {
    "id": 18,
    "title": "Update dependency versions",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 19,
    "title": "Research competitor products",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 20,
    "title": "Draft feature roadmap",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 21,
    "title": "Create onboarding guide",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 22,
    "title": "Prepare client presentation",
    "status": "completed",
    "priority": "low"
  },
  {
    "id": 23,
    "title": "Configure analytics tracking",
    "status": "in_progress",
    "priority": "none"
  },
  {
    "id": 24,
    "title": "Conduct code review session",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 25,
    "title": "Fix mobile responsiveness issues",
    "status": "not_started",
    "priority": "none"
  },
  {
    "id": 26,
    "title": "Improve error handling",
    "status": "completed",
    "priority": "none"
  },
  {
    "id": 27,
    "title": "Set up monitoring alerts",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 28,
    "title": "Design new logo",
    "status": "in_progress",
    "priority": "low"
  },
  {
    "id": 29,
    "title": "Analyze customer feedback",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 30,
    "title": "Write blog post on best practices",
    "status": "not_started",
    "priority": "none"
  },
  {
    "id": 31,
    "title": "Document REST API endpoints",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 32,
    "title": "Refactor checkout flow",
    "status": "not_started",
    "priority": "urgent"
  },
  {
    "id": 33,
    "title": "Optimize image loading",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 34,
    "title": "Update security policies",
    "status": "not_started",
    "priority": "none"
  },
  {
    "id": 35,
    "title": "Develop user profile page",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 36,
    "title": "Fix broken links in footer",
    "status": "in_progress",
    "priority": "none"
  },
  {
    "id": 37,
    "title": "Set up automated email responses",
    "status": "completed",
    "priority": "none"
  },
  {
    "id": 38,
    "title": "Improve site accessibility",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 39,
    "title": "Create A/B test experiment",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 40,
    "title": "Conduct usability testing",
    "status": "not_started",
    "priority": "high"
  },
  {
    "id": 41,
    "title": "Write post-mortem for outage",
    "status": "completed",
    "priority": "none"
  },
  {
    "id": 42,
    "title": "Fix pagination issues",
    "status": "not_started",
    "priority": "high"
  },
  {
    "id": 43,
    "title": "Build dashboard charts",
    "status": "in_progress",
    "priority": "low"
  },
  {
    "id": 44,
    "title": "Write test cases for search functionality",
    "status": "in_progress",
    "priority": "urgent"
  },
  {
    "id": 45,
    "title": "Improve onboarding flow",
    "status": "in_progress",
    "priority": "low"
  },
  {
    "id": 46,
    "title": "Optimize SQL queries",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 47,
    "title": "Deploy new microservice",
    "status": "in_progress",
    "priority": "none"
  },
  {
    "id": 48,
    "title": "Fix UI inconsistencies",
    "status": "not_started",
    "priority": "none"
  },
  {
    "id": 49,
    "title": "Update payment gateway integration",
    "status": "in_progress",
    "priority": "low"
  },
  {
    "id": 50,
    "title": "Investigate slow API response times",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 51,
    "title": "Prepare for product launch",
    "status": "in_progress",
    "priority": "low"
  },
  {
    "id": 52,
    "title": "Write user documentation",
    "status": "completed",
    "priority": "low"
  },
  {
    "id": 53,
    "title": "Update README file",
    "status": "not_started",
    "priority": "medium"
  },
  {
    "id": 54,
    "title": "Fix session expiration bug",
    "status": "in_progress",
    "priority": "urgent"
  },
  {
    "id": 55,
    "title": "Develop chat feature",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 56,
    "title": "Research AI integration",
    "status": "not_started",
    "priority": "low"
  },
  {
    "id": 57,
    "title": "Improve website SEO",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 58,
    "title": "Analyze error logs",
    "status": "in_progress",
    "priority": "urgent"
  },
  {
    "id": 59,
    "title": "Redesign settings page",
    "status": "completed",
    "priority": "low"
  },
  {
    "id": 60,
    "title": "Enhance form validation",
    "status": "in_progress",
    "priority": "low"
  },
  {
    "id": 61,
    "title": "Update email templates",
    "status": "not_started",
    "priority": "low"
  },
  {
    "id": 62,
    "title": "Set up feature flags",
    "status": "not_started",
    "priority": "low"
  },
  {
    "id": 63,
    "title": "Fix typos in UI copy",
    "status": "in_progress",
    "priority": "low"
  },
  {
    "id": 64,
    "title": "Refactor old legacy code",
    "status": "not_started",
    "priority": "high"
  },
  {
    "id": 65,
    "title": "Prepare training slides",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 66,
    "title": "Create FAQ section",
    "status": "completed",
    "priority": "low"
  },
  {
    "id": 67,
    "title": "Fix timezone issues",
    "status": "not_started",
    "priority": "none"
  },
  {
    "id": 68,
    "title": "Add 2FA authentication",
    "status": "not_started",
    "priority": "none"
  },
  {
    "id": 69,
    "title": "Implement search autocomplete",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 70,
    "title": "Improve cache strategy",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 71,
    "title": "Update terms of service",
    "status": "completed",
    "priority": "none"
  },
  {
    "id": 72,
    "title": "Research new frontend framework",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 73,
    "title": "Enhance error messages",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 74,
    "title": "Fix memory leak issue",
    "status": "not_started",
    "priority": "medium"
  },
  {
    "id": 75,
    "title": "Develop new admin panel",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 76,
    "title": "Review customer support tickets",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 77,
    "title": "Run load tests",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 78,
    "title": "Write Cypress tests",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 79,
    "title": "Create interactive tutorial",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 80,
    "title": "Fix API CORS issues",
    "status": "completed",
    "priority": "none"
  },
  {
    "id": 81,
    "title": "Enhance keyboard navigation",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 82,
    "title": "Update user avatars",
    "status": "in_progress",
    "priority": "none"
  },
  {
    "id": 83,
    "title": "Test backup recovery",
    "status": "not_started",
    "priority": "urgent"
  },
  {
    "id": 84,
    "title": "Update mobile app version",
    "status": "not_started",
    "priority": "low"
  },
  {
    "id": 85,
    "title": "Monitor server logs",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 86,
    "title": "Fix infinite scroll bug",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 87,
    "title": "Improve site speed",
    "status": "in_progress",
    "priority": "none"
  },
  {
    "id": 88,
    "title": "Write migration script",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 89,
    "title": "Develop feature toggles",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 90,
    "title": "Refactor modal components",
    "status": "in_progress",
    "priority": "low"
  },
  {
    "id": 91,
    "title": "Conduct A11y audit",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 92,
    "title": "Test WebSocket connections",
    "status": "not_started",
    "priority": "medium"
  },
  {
    "id": 93,
    "title": "Optimize database indexing",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 94,
    "title": "Fix missing translations",
    "status": "in_progress",
    "priority": "urgent"
  },
  {
    "id": 95,
    "title": "Investigate 500 errors",
    "status": "completed",
    "priority": "none"
  },
  {
    "id": 96,
    "title": "Update dark mode styling",
    "status": "completed",
    "priority": "medium"
  },
  {
    "id": 97,
    "title": "Review legal compliance",
    "status": "in_progress",
    "priority": "none"
  },
  {
    "id": 98,
    "title": "Write changelog updates",
    "status": "completed",
    "priority": "none"
  },
  {
    "id": 99,
    "title": "Deploy security patches",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 100,
    "title": "Refactor Redux state",
    "status": "completed",
    "priority": "high"
  },
  {
    "id": 101,
    "title": "Fix sidebar navigation",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 102,
    "title": "Improve touch gestures",
    "status": "in_progress",
    "priority": "medium"
  },
  {
    "id": 103,
    "title": "Update typography guidelines",
    "status": "not_started",
    "priority": "low"
  },
  {
    "id": 104,
    "title": "Test push notifications",
    "status": "not_started",
    "priority": "low"
  },
  {
    "id": 105,
    "title": "Fix dropdown positioning",
    "status": "not_started",
    "priority": "low"
  },
  {
    "id": 106,
    "title": "Develop new analytics dashboard",
    "status": "completed",
    "priority": "urgent"
  },
  {
    "id": 107,
    "title": "Reduce bundle size",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 108,
    "title": "Refactor date parsing functions",
    "status": "in_progress",
    "priority": "urgent"
  },
  {
    "id": 109,
    "title": "Improve modal animations",
    "status": "in_progress",
    "priority": "urgent"
  },
  {
    "id": 110,
    "title": "Run penetration tests",
    "status": "not_started",
    "priority": "high"
  },
  {
    "id": 111,
    "title": "Implement JWT authentication",
    "status": "in_progress",
    "priority": "high"
  },
  {
    "id": 112,
    "title": "Improve logging strategy",
    "status": "in_progress",
    "priority": "none"
  },
  {
    "id": 113,
    "title": "Optimize Redis caching",
    "status": "not_started",
    "priority": "high"
  }
]