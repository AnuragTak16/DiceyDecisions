import { useGetRoomDetailQuery } from "@/api/roomDetails";
import { Mail, Users, Link as LinkIcon, KeyRound, User2 } from "lucide-react";

export const ShowRoomsDetails = () => {
  const { data: rooms, isLoading, error } = useGetRoomDetailQuery();

  if (isLoading)
    return (
      <p className="text-center text-gray-600 text-lg">Loading rooms...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 text-lg">Error loading rooms</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-10">
        Available Rooms
      </h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {rooms?.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">
              {room.title}
            </h2>
            <p className="text-gray-700 mb-3">{room.description}</p>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-500" />
                Code: <span className="font-medium">{room.roomCode}</span>
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Max Participants: {room.maxParticipants}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Invite Link: {room.inviteLink}
              </p>
              <p className="flex items-center gap-2">
                <User2 className="w-4 h-4 text-indigo-500" />
                Created by: {room.creatorId?.userName}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                {room.creatorId?.email}
              </p>
            </div>

            <div className="mt-4">
              <a
                href={room.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                <LinkIcon className="w-4 h-4" />
                Join Room
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
