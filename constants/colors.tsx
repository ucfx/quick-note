import { NoteColor } from "@/types/note";

export const COLORS: NoteColor[] = [
    { label: "Default", value: "#FFFFFF" }, 
    { label: "Red", value: "#FF4C4C" }, 
    { label: "Orange", value: "#FF9F40" }, 
    { label: "Yellow", value: "#FFD93D" },
    { label: "Green", value: "#4CAF50" },
    { label: "Blue", value: "#4F86F7" }, 
    { label: "Purple", value: "#9C27B0" },
    { label: "Pink", value: "#FF66B2" }, 
] as const;