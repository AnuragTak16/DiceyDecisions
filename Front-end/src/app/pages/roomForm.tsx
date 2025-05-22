import { useState } from "react";

interface RoomFormProps {
  onSubmit: (roomData: {
    title: string;
    description: string;
    maxParticipants?: number;
  }) => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Create the payload
    const roomData = {
      title,
      description,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
    };

    if (onSubmit) {
      onSubmit(roomData);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setMaxParticipants("");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create a Decision Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Room Title*</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Dinner Spot?"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Max Participants</label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};
