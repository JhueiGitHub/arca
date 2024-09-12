// /root/app/hooks/useNotes.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Note } from '@/app/types/Note';
import debounce from 'lodash/debounce';

interface SaveLog {
  timestamp: number;
  type: string;
  details: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [saveLogs, setSaveLogs] = useState<SaveLog[]>([]);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    setDebugLogs(prevLogs => [...prevLogs, `${new Date().toISOString()} - ${message}`]);
    console.log(message); // Also log to console for immediate feedback
  };

  const fetchNotes = useCallback(async () => {
    try {
      addDebugLog('Fetching notes from API');
      const response = await axios.get('/api/obsidian');
      addDebugLog(`Fetched ${response.data.length} notes`);
      setNotes(response.data);
      // If there's no current note set, set the first note as current
      if (!currentNote && response.data.length > 0) {
        setCurrentNote(response.data[0]);
        addDebugLog(`Set first note as current: ${response.data[0].id}`);
      }
      return response.data;
    } catch (error) {
      addDebugLog(`Failed to fetch notes: ${error}`);
      console.error('Failed to fetch notes:', error);
      return [];
    }
  }, [currentNote]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (note: Partial<Note>) => {
    try {
      addDebugLog(`Creating new note: ${JSON.stringify(note)}`);
      const response = await axios.post('/api/obsidian', note);
      addDebugLog(`Note created with id: ${response.data.id}`);
      setNotes(prevNotes => [...prevNotes, response.data]);
      setCurrentNote(response.data);
      addSaveLog('create', `Note created: ${response.data.id}`);
    } catch (error) {
      addDebugLog(`Failed to create note: ${error}`);
      console.error('Failed to create note:', error);
    }
  };

  const debouncedSave = useCallback(
    debounce(async (noteToSave: Partial<Note> & { id: string }) => {
      try {
        addDebugLog(`Saving note: ${noteToSave.id}`);
        const response = await axios.patch(`/api/obsidian/${noteToSave.id}`, noteToSave);
        addDebugLog(`Note saved: ${response.data.id}`);
        setNotes(prevNotes => prevNotes.map(note => note.id === noteToSave.id ? response.data : note));
        setCurrentNote(response.data);
        addSaveLog('update', `Note updated: ${response.data.id}`);
      } catch (error) {
        addDebugLog(`Failed to update note: ${error}`);
        console.error('Failed to update note:', error);
      }
    }, 1000),
    []
  );

  const updateNote = (updatedNote: Partial<Note> & { id: string }) => {
    addDebugLog(`Updating note locally: ${updatedNote.id}`);
    setCurrentNote(prev => prev ? { ...prev, ...updatedNote } : null);
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === updatedNote.id ? { ...note, ...updatedNote } : note
    ));
    debouncedSave(updatedNote);
  };

  const deleteNote = async (noteId: string) => {
    try {
      addDebugLog(`Deleting note: ${noteId}`);
      await axios.delete(`/api/obsidian/${noteId}`);
      addDebugLog(`Note deleted: ${noteId}`);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
      }
      addSaveLog('delete', `Note deleted: ${noteId}`);
    } catch (error) {
      addDebugLog(`Failed to delete note: ${error}`);
      console.error('Failed to delete note:', error);
    }
  };

  const addSaveLog = (type: string, details: string) => {
    setSaveLogs(prevLogs => [...prevLogs, { timestamp: Date.now(), type, details }]);
  };

  return {
    notes,
    currentNote,
    setCurrentNote,
    createNote,
    updateNote,
    deleteNote,
    saveLogs,
    debugLogs,
    fetchNotes,
  };
};