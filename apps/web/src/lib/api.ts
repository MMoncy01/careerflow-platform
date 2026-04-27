const API_URL = import.meta.env.VITE_API_URL as string;

export type User = {
  id: string;
  email: string;
  name?: string | null;
};

export type ApplicationStatus =
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;

  location?: string | null;
  jobUrl?: string | null;
  source?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  resumeVersion?: string | null;
  jobDescription?: string | null;

  notes?: string | null;
  appliedAt?: string | null;
  followUpDate?: string | null;
  lastActivityAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  weeklyApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  needsFollowUp: JobApplication[];
  staleApplications: JobApplication[];
  recentApplications: JobApplication[];
};

export type InterviewType =
  | 'HR'
  | 'TECHNICAL'
  | 'BEHAVIORAL'
  | 'MANAGERIAL'
  | 'FINAL'
  | 'OTHER';

export type InterviewResult =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'PASSED'
  | 'REJECTED'
  | 'CANCELLED';

export type Interview = {
  id: string;
  title?: string | null;
  type: InterviewType;
  round: number;
  scheduledAt: string;
  result: InterviewResult;
  notes?: string | null;
  nextRoundAt?: string | null;
  createdAt: string;
  updatedAt: string;
  applicationId?: string | null;
  application?: {
    id: string;
    company: string;
    role: string;
    status: ApplicationStatus;
  } | null;
};

export type InterviewStats = {
  total: number;
  scheduled: number;
  completed: number;
  passed: number;
  rejected: number;
  cancelled: number;
  upcoming: Interview[];
};

export type AiJobAnalysis = {
  summary: string;
  atsKeywords: string[];
  keySkills: string[];
  toolsAndTechnologies: string[];
  responsibilities: string[];
  qualifications: string[];
  resumeTips: string[];
  skillGaps: string[];
  followUpEmail: string;
  recruiterMessage: string;
  interviewQuestions: string[];
  projectTalkingPoints: string[];
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}

export async function register(data: {
  email: string;
  name?: string;
  password: string;
}) {
  return request<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: { email: string; password: string }) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function refresh() {
  return request<AuthResponse>('/auth/refresh', { method: 'POST' });
}

export async function logout() {
  return request<{ ok: boolean }>('/auth/logout', { method: 'POST' });
}

export async function me() {
  return request<User>('/auth/me');
}

export async function listApplications(status?: string, search?: string) {
  const params = new URLSearchParams();

  if (status) params.set('status', status);
  if (search) params.set('search', search);

  const query = params.toString() ? `?${params.toString()}` : '';
  return request<JobApplication[]>(`/applications${query}`);
}

export async function createApplication(data: Partial<JobApplication>) {
  return request<JobApplication>('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateApplication(id: string, data: Partial<JobApplication>) {
  return request<JobApplication>(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteApplication(id: string) {
  return request<{ deleted: boolean }>(`/applications/${id}`, {
    method: 'DELETE',
  });
}

export async function getApplicationStats() {
  return request<DashboardStats>('/applications/stats');
}

export async function analyzeJobDescription(jobDescription: string) {
  return request<AiJobAnalysis>('/ai/analyze-job', {
    method: 'POST',
    body: JSON.stringify({ jobDescription }),
  });
}

export async function listInterviews(result?: string) {
  const query = result ? `?result=${result}` : '';
  return request<Interview[]>(`/interviews${query}`);
}

export async function createInterview(data: Partial<Interview>) {
  return request<Interview>('/interviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInterview(id: string, data: Partial<Interview>) {
  return request<Interview>(`/interviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteInterview(id: string) {
  return request<{ deleted: boolean }>(`/interviews/${id}`, {
    method: 'DELETE',
  });
}

export async function getInterviewStats() {
  return request<InterviewStats>('/interviews/stats');
}

export async function listUpcomingInterviews() {
  return request<Interview[]>('/interviews/upcoming');
}