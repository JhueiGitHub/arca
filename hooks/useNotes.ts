// /hooks/useNotes.ts

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Note {
  id: string;
  name: string;
  isFolder: false;
  parentId: string | null;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export const useNotes = () => {
  const queryClient = useQueryClient();
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await axios.get('/api/obsidian');
      return response.data.filter((item: any) => !item.isFolder);
    },
  });

  useEffect(() => {
    if (!isLoading && notes && notes.length === 0) {
      createInitialNote();
    } else if (!isLoading && notes && notes.length > 0 && !currentNote) {
      setCurrentNote(notes[0]);
    }
  }, [isLoading, notes]);

  const createInitialNote = async () => {
    const initialNote = {
      name: 'Welcome to Obsidian',
      content: 'This is your first note. Start writing!',
      isFolder: false,
      parentId: null,
    };
    const response = await axios.post('/api/obsidian', initialNote);
    queryClient.invalidateQueries(['notes']);
    setCurrentNote(response.data);
  };

  const createNoteMutation = useMutation({
    mutationFn: (newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => 
      axios.post('/api/obsidian', { ...newNote, isFolder: false }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (updatedNote: Note) => 
      axios.patch(`/api/obsidian/${updatedNote.id}`, updatedNote),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/obsidian/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });

  const createNote = (
    name: string,
    content: string,
    parentId: string | null = null
  ) => {
    createNoteMutation.mutate({ name, content, parentId, isFolder: false });
  };

  const updateNote = (note: Note) => {
    updateNoteMutation.mutate(note);
  };

  const deleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  return {
    notes,
    currentNote,
    setCurrentNote,
    createNote,
    updateNote,
    deleteNote,
  };
};
