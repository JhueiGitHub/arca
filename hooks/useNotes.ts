// hooks/useNotes.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, update, remove } from "firebase/database";
import { useUser } from "@clerk/nextjs";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export const useNotes = () => {
  const { user } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());
  const pendingChangesRef = useRef<{
    [id: string]: { title: string; content: string };
  }>({});

  const saveNote = useCallback(
    async (id: string, title: string, content: string) => {
      if (!user) return;

      const noteRef = ref(db, `notes/${user.id}/${id}`);
      await update(noteRef, { title, content, updatedAt: Date.now() });
      lastSaveTimeRef.current = Date.now();
      delete pendingChangesRef.current[id];
    },
    [user]
  );

  const createNote = useCallback(
    async (title: string, content: string) => {
      if (!user) return;

      const newNoteRef = push(ref(db, `notes/${user.id}`));
      const newNote: Omit<Note, "id"> = {
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await update(newNoteRef, newNote);
      const createdNote = { id: newNoteRef.key as string, ...newNote };
      setCurrentNote(createdNote);
    },
    [user]
  );

  const updateNote = useCallback(
    (id: string, title: string, content: string) => {
      if (!user) return;

      setCurrentNote((prev) =>
        prev && prev.id === id ? { ...prev, title, content } : prev
      );
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === id ? { ...note, title, content } : note
        )
      );

      pendingChangesRef.current[id] = { title, content };

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      if (Date.now() - lastSaveTimeRef.current > 5000) {
        saveNote(id, title, content);
      } else {
        updateTimeoutRef.current = setTimeout(() => {
          Object.entries(pendingChangesRef.current).forEach(
            ([noteId, changes]) => {
              saveNote(noteId, changes.title, changes.content);
            }
          );
        }, 2000);
      }
    },
    [user, saveNote]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!user) return;

      const noteRef = ref(db, `notes/${user.id}/${id}`);
      await remove(noteRef);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      setCurrentNote((prev) => (prev && prev.id === id ? null : prev));
    },
    [user]
  );

  useEffect(() => {
    if (!user) return;

    const notesRef = ref(db, `notes/${user.id}`);

    const unsubscribe = onValue(notesRef, (snapshot) => {
      const notesData: Note[] = [];
      snapshot.forEach((childSnapshot) => {
        notesData.push({
          id: childSnapshot.key as string,
          ...childSnapshot.val(),
        } as Note);
      });
      setNotes(notesData);

      // FIXME: This was the problematic part. It was resetting the current note.
      // if (notesData.length === 0) {
      //   createNote("Welcome to Onyx", "This is your first note in Onyx!");
      // } else if (!currentNote) {
      //   setCurrentNote(notesData[0]);
      // }

      // NEW: Only set the current note if there isn't one already
      if (notesData.length > 0 && !currentNote) {
        setCurrentNote(notesData[0]);
      }

      // NEW: If there are no notes, create a welcome note
      if (notesData.length === 0) {
        createNote("Welcome to Onyx", "This is your first note in Onyx!");
      }

      // NEW: Update the current note if it exists in the new data
      if (currentNote) {
        const updatedCurrentNote = notesData.find(
          (note) => note.id === currentNote.id
        );
        if (updatedCurrentNote) {
          setCurrentNote(updatedCurrentNote);
        }
      }
    });

    return () => {
      unsubscribe();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      Object.entries(pendingChangesRef.current).forEach(([id, changes]) => {
        saveNote(id, changes.title, changes.content);
      });
    };
  }, [user, createNote, saveNote, currentNote]); // Added currentNote to dependencies

  return {
    notes,
    currentNote,
    setCurrentNote,
    createNote,
    updateNote,
    deleteNote,
  };
};
