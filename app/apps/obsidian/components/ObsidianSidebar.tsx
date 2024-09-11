// /root/app/apps/obsidian/components/ObsidianSidebar.tsx

import React from 'react';
import { File, Folder, Tree } from "@/components/magicui/file-tree";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface NoteItem {
  id: string;
  name: string;
  isFolder: boolean;
  parentId: string | null;
  children?: NoteItem[];
  content?: string;
  createdAt: number;
  updatedAt: number;
}

const colorScheme = [
  'var(--light-teal)',
  'var(--deep-teal)',
  'var(--deep-blue)',
  'var(--light-blue)',
  'var(--blue-lilac)',
  'var(--deep-blue-lilac)',
  'var(--deep-pink-lilac)',
  'var(--pink-lilac)',
  'var(--rose)',
];

const ObsidianSidebar: React.FC = () => {
  const { data: treeElements } = useQuery<NoteItem[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await axios.get('/api/obsidian');
      console.log('API response:', response.data);
      return response.data;
    },
  });

  const renderItems = (items: NoteItem[] | undefined, depth: number = 0) => {
    if (!items) return null;

    return items.map((item) => {
      const colorIndex = depth % colorScheme.length;
      const style = {
        backgroundColor: item.isFolder ? colorScheme[colorIndex] : 'transparent',
        color: item.isFolder ? 'white' : 'inherit',
        borderRadius: '4px',
        padding: '2px 4px',
      };

      if (item.isFolder) {
        return (
          <Folder key={item.id} element={item.name} value={item.id} className="custom-folder" style={style}>
            {renderItems(item.children, depth + 1)}
          </Folder>
        );
      } else {
        return (
          <File key={item.id} value={item.id} className="custom-file" style={style}>
            <p>{item.name}</p>
          </File>
        );
      }
    });
  };

  return (
    <div className="obsidian-sidebar h-full w-64 bg-gray-900 text-white">
      <Tree
        className="p-2 overflow-hidden rounded-md bg-gray-900"
        initialExpandedItems={[]} // You may want to store and retrieve this from local storage
      >
        {renderItems(treeElements)}
      </Tree>
    </div>
  );
};

export default ObsidianSidebar;