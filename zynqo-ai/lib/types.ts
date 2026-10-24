// Shared TypeScript types for API routes and frontend

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date | string;
  userId: string;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date | string;
}

export interface EventCreateRequest {
  title: string;
  description?: string;
  startTime: Date | string;
  endTime: Date | string;
  location?: string;
  userId: string;
}

export interface EventUpdateRequest {
  title?: string;
  description?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  location?: string;
}

export interface DocumentCreateRequest {
  title: string;
  content: string;
  summary?: string;
  userId: string;
}

export interface DocumentUpdateRequest {
  title?: string;
  content?: string;
  summary?: string;
}

export interface UserCreateRequest {
  email: string;
  name?: string;
  passwordHash?: string;
}

export interface UserUpdateRequest {
  email?: string;
  name?: string;
  passwordHash?: string;
}
