import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface DopaEditorProps {
  fileId: string;
  fileName: string;
  onClose: () => void;
}

const DopaEditor: React.FC<DopaEditorProps> = ({
  fileId,
  fileName,
  onClose,
}) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dopaFile", fileId],
    queryFn: async () => {
      const response = await axios.get(`/api/dopa-files/${fileId}`);
      return response.data;
    },
  });

  useEffect(() => {
    if (data) {
      setContent(data.content);
    }
  }, [data]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = useMutation(
    async () => {
      await axios.patch(`/api/dopa-files/${fileId}`, { content });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["dopaFile", fileId]);
      },
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading file</div>;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{fileName}</h2>
        <div>
          <button
            onClick={() => handleSave.mutate()}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={handleContentChange}
        className="flex-1 p-4 resize-none focus:outline-none"
      />
    </div>
  );
};

export default DopaEditor;
