export type TaskStatus = 'pending' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStoryPoints = 1 | 2 | 3 | 5 | 8 | 13 | 21;

export const TASK_STORY_POINTS: TaskStoryPoints[] = [
  1,
  2,
  3,
  5,
  8,
  13,
  21,
];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: TaskStoryPoints;
  columnId: string;
  position: number;
  parentTaskId: string | null;
  subtasks: Task[];
  createdAt: string;
  updatedAt: string;
}