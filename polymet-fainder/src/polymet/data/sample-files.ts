export interface FileResult {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  modified: Date;
  matches?: string[];
}

export const SAMPLE_FILES: FileResult[] = [
  {
    id: "file1",
    name: "quarterly-report-q2-2023.docx",
    path: "/Users/johndoe/Documents/Work/Reports/",
    type: "Microsoft Word Document",
    size: 2456000,
    modified: new Date(2023, 5, 15),
    matches: [
      "...contains 'quarterly results' on page 5...",
      "...mentions 'financial projections' in section 3...",
    ],
  },
  {
    id: "file2",
    name: "vacation-photo-italy.jpg",
    path: "/Users/johndoe/Pictures/Vacation/",
    type: "image/jpeg",
    size: 4500000,
    modified: new Date(2023, 7, 22),
  },
  {
    id: "file3",
    name: "project-roadmap.xlsx",
    path: "/Users/johndoe/Documents/Work/Planning/",
    type: "Microsoft Excel Spreadsheet",
    size: 1820000,
    modified: new Date(2023, 6, 10),
    matches: [
      "...contains 'Q3 milestones' in cell B15...",
      "...mentions 'development timeline' in sheet 2...",
    ],
  },
  {
    id: "file4",
    name: "family-reunion.mp4",
    path: "/Users/johndoe/Videos/Family/",
    type: "video/mp4",
    size: 256000000,
    modified: new Date(2023, 4, 5),
  },
  {
    id: "file5",
    name: "resume-2023.pdf",
    path: "/Users/johndoe/Documents/Personal/",
    type: "Adobe PDF Document",
    size: 890000,
    modified: new Date(2023, 8, 1),
    matches: [
      "...contains 'work experience' on page 1...",
      "...mentions 'skills' on page 2...",
    ],
  },
  {
    id: "file6",
    name: "presentation-client.pptx",
    path: "/Users/johndoe/Documents/Work/Presentations/",
    type: "Microsoft PowerPoint Presentation",
    size: 5600000,
    modified: new Date(2023, 6, 28),
  },
  {
    id: "file7",
    name: "budget-2023.xlsx",
    path: "/Users/johndoe/Documents/Finance/",
    type: "Microsoft Excel Spreadsheet",
    size: 1200000,
    modified: new Date(2023, 0, 15),
    matches: [
      "...contains 'annual expenses' in sheet 1...",
      "...mentions 'savings goals' in cell D25...",
    ],
  },
  {
    id: "file8",
    name: "project-source.zip",
    path: "/Users/johndoe/Downloads/",
    type: "ZIP Archive",
    size: 15600000,
    modified: new Date(2023, 7, 5),
  },
  {
    id: "file9",
    name: "meeting-notes.txt",
    path: "/Users/johndoe/Documents/Work/Meetings/",
    type: "Text Document",
    size: 45000,
    modified: new Date(2023, 8, 10),
    matches: [
      "...contains 'action items' in line 15...",
      "...mentions 'follow-up tasks' near the end...",
    ],
  },
  {
    id: "file10",
    name: "app.js",
    path: "/Users/johndoe/Projects/WebApp/src/",
    type: "JavaScript File",
    size: 25000,
    modified: new Date(2023, 8, 12),
    matches: [
      "...contains 'function searchFiles' in line 42...",
      "...mentions 'file filtering' in comments...",
    ],
  },
  {
    id: "file11",
    name: "logo-design.ai",
    path: "/Users/johndoe/Documents/Design/",
    type: "Adobe Illustrator Document",
    size: 8500000,
    modified: new Date(2023, 5, 20),
  },
  {
    id: "file12",
    name: "database-backup.sql",
    path: "/Users/johndoe/Projects/Database/",
    type: "SQL File",
    size: 35000000,
    modified: new Date(2023, 8, 5),
  },
  {
    id: "file13",
    name: "favorite-song.mp3",
    path: "/Users/johndoe/Music/",
    type: "audio/mp3",
    size: 8500000,
    modified: new Date(2023, 4, 12),
  },
  {
    id: "file14",
    name: "system-config.json",
    path: "/Users/johndoe/Projects/Config/",
    type: "JSON File",
    size: 12000,
    modified: new Date(2023, 7, 28),
    matches: [
      "...contains 'search settings' in line 8...",
      "...mentions 'file indexing' in configuration...",
    ],
  },
  {
    id: "file15",
    name: "user-manual.pdf",
    path: "/Users/johndoe/Documents/Products/",
    type: "Adobe PDF Document",
    size: 4500000,
    modified: new Date(2023, 6, 15),
  },
  {
    id: "file16",
    name: "website-mockup.psd",
    path: "/Users/johndoe/Documents/Design/Website/",
    type: "Adobe Photoshop Document",
    size: 25000000,
    modified: new Date(2023, 5, 5),
  },
  {
    id: "file17",
    name: "contract-2023.docx",
    path: "/Users/johndoe/Documents/Legal/",
    type: "Microsoft Word Document",
    size: 350000,
    modified: new Date(2023, 2, 20),
    matches: [
      "...contains 'terms and conditions' on page 3...",
      "...mentions 'payment schedule' in section 5...",
    ],
  },
  {
    id: "file18",
    name: "profile-picture.png",
    path: "/Users/johndoe/Pictures/Profile/",
    type: "image/png",
    size: 2500000,
    modified: new Date(2023, 3, 10),
  },
  {
    id: "file19",
    name: "server-logs.txt",
    path: "/Users/johndoe/Projects/Server/logs/",
    type: "Text Document",
    size: 8500000,
    modified: new Date(2023, 8, 15),
    matches: [
      "...contains 'error' in multiple lines...",
      "...mentions 'file access' in log entries...",
    ],
  },
  {
    id: "file20",
    name: "recipe-collection.pdf",
    path: "/Users/johndoe/Documents/Recipes/",
    type: "Adobe PDF Document",
    size: 15000000,
    modified: new Date(2023, 1, 5),
  },
];

export const SAMPLE_PRESETS = [
  {
    id: "preset1",
    name: "Find Recent Documents",
    description: "Searches for documents modified in the last week",
    blocks: [
      { id: "b1", type: "file-type", value: "document", options: {} },
      {
        id: "b2",
        type: "date",
        value: "2023-06-01",
        options: { operator: "after" },
      },
    ],

    lastUsed: new Date(Date.now() - 86400000), // yesterday
    tags: ["documents", "recent"],
  },
  {
    id: "preset2",
    name: "Large Media Files",
    description: "Find media files larger than 100MB",
    blocks: [
      { id: "b1", type: "file-type", value: "image", options: {} },
      { id: "b2", type: "file-type", value: "video", options: {} },
      {
        id: "b3",
        type: "size",
        value: "100",
        options: { operator: "greater", unit: "mb" },
      },
    ],

    lastUsed: new Date(Date.now() - 604800000), // 1 week ago
    tags: ["media", "cleanup"],
  },
  {
    id: "preset3",
    name: "Project Source Code",
    blocks: [
      {
        id: "b1",
        type: "path",
        value: "/Users/johndoe/Projects",
        options: { includeSubfolders: true },
      },
      { id: "b2", type: "file-type", value: "code", options: {} },
      {
        id: "b3",
        type: "text",
        value: "function",
        options: { caseSensitive: false },
      },
    ],

    tags: ["code", "development"],
  },
  {
    id: "preset4",
    name: "Financial Documents",
    description: "Find all financial reports and budgets",
    blocks: [
      {
        id: "b1",
        type: "text",
        value: "budget",
        options: { wholeWord: false },
      },
      {
        id: "b2",
        type: "text",
        value: "financial",
        options: { wholeWord: false },
      },
      {
        id: "b3",
        type: "text",
        value: "report",
        options: { wholeWord: false },
      },
    ],

    lastUsed: new Date(Date.now() - 1209600000), // 2 weeks ago
    tags: ["finance", "reports"],
  },
  {
    id: "preset5",
    name: "Design Assets",
    description: "Locate all design files",
    blocks: [
      { id: "b1", type: "file-type", value: "image", options: {} },
      {
        id: "b2",
        type: "path",
        value: "/Users/johndoe/Documents/Design",
        options: { includeSubfolders: true },
      },
    ],

    tags: ["design", "assets"],
  },
];
