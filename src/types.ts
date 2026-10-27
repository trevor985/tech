export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'systems' | 'web' | 'ai' | 'security' | 'cloud';
  verified: boolean;
  endorsements: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'systems' | 'collaboration' | 'milestone' | 'hackathon' | 'security';
  icon: string;
  unlockedAt: string;
  criteria: string;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  headline: string;
  bio: string;
  location: string;
  github: string;
  reputation: number;
  starsCount: number;
  collaborationsCount: number;
  pairProgrammingHours: number;
  skills: Skill[];
  badges: Badge[];
  isOnline: boolean;
  activeSprintTitle?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  codeSnippet?: string;
  likes: number;
}

export interface Post {
  id: string;
  author: User;
  createdAt: string;
  type: 'milestone' | 'snippet' | 'sprint_update' | 'showcase';
  title: string;
  content: string;
  mediaUrl?: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename: string;
  };
  milestone?: {
    current: number;
    total: number;
    label: string;
    targetDate: string;
  };
  lookingForContributors?: {
    active: boolean;
    roles: string[];
    sprintGoal: string;
    openSeats: number;
  };
  likes: number;
  isLiked: boolean;
  stars: number;
  isStarred: boolean;
  commentsCount: number;
  comments: Comment[];
  tags: string[];
}

export interface SprintMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  targetDate: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  prLink?: string;
}

export interface Sprint {
  id: string;
  title: string;
  repoName: string;
  description: string;
  creator: User;
  contributors: User[];
  tags: string[];
  requiredSkills: string[];
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Hardcore Systems';
  status: 'recruiting' | 'in_progress' | 'completed';
  startDate: string;
  endDate: string;
  milestones: SprintMilestone[];
  openPositions: string[];
  matchScore?: number;
}

export interface Story {
  id: string;
  user: User;
  previewSnippet: string;
  caption: string;
  timeAgo: string;
  isLivePairing: boolean;
}

export type ProjectStage = 'seeking contributors' | 'in progress' | 'completed';

export interface Project {
  id: string;
  title: string;
  repoName: string;
  description: string;
  language: string;
  techStack: string[];
  stage: ProjectStage;
  stars: number;
  isStarred?: boolean;
  forks: number;
  activePRs: number;
  openIssues: number;
  createdAt: string; // ISO date string for 'newest' sort
  lastActiveAt: string; // ISO date string for 'recently active' sort
  author: User;
  contributors: User[];
  coverImage?: string;
  codeSample?: {
    filename: string;
    code: string;
    language: string;
  };
  seekingRoles?: string[];
  readme?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  color: string;
  cursorLine: number;
  cursorCol: number;
  isOnline: boolean;
  currentFile: string;
  status: 'typing' | 'idle' | 'reviewing';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'peer' | 'system';
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  codeSnippet?: {
    code: string;
    language: string;
    filename?: string;
  };
  modelUsed?: string;
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  diffStats: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
  branch: string;
}

export interface PullRequest {
  id: number;
  title: string;
  author: User;
  branchSource: string;
  branchTarget: string;
  status: 'open' | 'merged' | 'closed';
  description: string;
  createdAt: string;
  checksStatus: 'passing' | 'running' | 'failed';
  changedFilesCount: number;
  diffText: string;
  commentsCount: number;
}

