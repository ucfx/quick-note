export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  tags: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  // tasks: Task[];
}

// export interface Task {
//   id: string;
//   content: string;
//   completed: boolean;
//   note_id: string;
// }

export type NoteColor = { label: string; value: string };