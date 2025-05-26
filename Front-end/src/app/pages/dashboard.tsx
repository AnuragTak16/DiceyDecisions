// After successful POST /joinRoom

import { useState } from "react";
import { Dice3, Users, BookText, ChevronRight } from "lucide-react";
import { useCreateRoomMutation } from "../../api/roomhandler";
import { useJoinRoomMutation } from "../../api/joinRoom";
import { useNavigate } from "@tanstack/react-router";
import { useGetCreatedRoomsQuery } from "../../api/creator-room";

export const DashBoardPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [roomTitle, setRoomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const [createRoom] = useCreateRoomMutation();
  const [joinRoom] = useJoinRoomMutation();
  const { data: createdRooms = [] } = useGetCreatedRoomsQuery();

  const navigate = useNavigate();

  // here we check the button length
  const hasCreatedRooms = createdRooms.length > 0;
  console.log("hasCreatedRooms : ", hasCreatedRooms);

  const handleCreateRoom = async () => {
    console.log("Creating room with:", {
      roomTitle,
      description,
      maxParticipants,
    });
    try {
      const response = await createRoom({
        title: roomTitle,
        description,
        maxParticipants,
      }).unwrap();
      // await refetch();
      navigate({ to: "/createdRoom" });

      console.log("Room created:", response);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const handleJoinRoom = async () => {
    console.log("Joining room with:", { roomCode });

    if (!roomCode.trim()) {
      console.warn("Room code is required");
      return;
    }

    try {
      const response = await joinRoom({ roomCode }).unwrap();
      console.log("Room joined:", response);
      navigate({ to: `/room/${roomCode}` });
    } catch (err) {
      console.error("Error joining room:", err);
      alert("Failed to join room. Please check the code or try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900">
      <header className="container mx-auto pt-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dice3 className="text-yellow-300" size={32} />
            <h1 className="text-3xl font-bold text-white">DiceyDecisions</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stop Wasting Time <span className="text-yellow-300">Deciding</span>
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Groups of friends, roommates, or coworkers often waste time deciding
            simple things. DiceyDecisions makes group decisions fun with secret
            voting and game-style tiebreakers!
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {hasCreatedRooms && (
              <button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2
            "
                onClick={() => {
                  navigate({ to: "/createdRoom" });
                }}
              >
                Your Available Rooms
                <ChevronRight size={20} />
              </button>
            )}
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium text-lg flex items-center justify-center gap-2">
              Play Fun Games
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-indigo-900/70 backdrop-blur-sm rounded-xl shadow-xl p-6 max-w-4xl mx-auto mt-12">
          <div className="flex border-b border-indigo-700 mb-6">
            <button
              className={`px-4 py-3 font-medium text-lg ${activeTab === "create" ? "text-yellow-300 border-b-2 border-yellow-300" : "text-indigo-200 hover:text-white"}`}
              onClick={() => setActiveTab("create")}
            >
              Create Room
            </button>
            <button
              className={`px-4 py-3 font-medium text-lg ${activeTab === "join" ? "text-yellow-300 border-b-2 border-yellow-300" : "text-indigo-200 hover:text-white"}`}
              onClick={() => setActiveTab("join")}
            >
              Join Room
            </button>
          </div>

          {activeTab === "create" ? (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-white mb-4">
                Create a Decision Room
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-indigo-200 mb-2">
                    Room Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-indigo-800/50 border border-indigo-600 rounded-lg px-4 py-2 text-white"
                    placeholder="e.g., Where should we eat tonight?"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-indigo-200 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    className="w-full bg-indigo-800/50 border border-indigo-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Add details about this decision..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-indigo-200 mb-2">
                    Max Participants (Optional)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-indigo-800/50 border border-indigo-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Leave blank for unlimited"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
                >
                  Create Room
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join a Decision Room
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-indigo-200 mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    className="w-full bg-indigo-800/50 border border-indigo-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter the 6-digit room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleJoinRoom}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
                >
                  Join Room
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="bg-indigo-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="text-yellow-300" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Group Decisions
            </h3>
            <p className="text-indigo-200">
              Invite friends to join your room and vote on options. No more
              endless debates!
            </p>
          </div>

          <div className="bg-indigo-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="bg-indigo-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Dice3 className="text-yellow-300" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Fun Tiebreakers
            </h3>
            <p className="text-indigo-200">
              Break ties with animated dice rolls, spinners, or coin flips for a
              fun finale!
            </p>
          </div>

          <div className="bg-indigo-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="bg-indigo-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookText className="text-yellow-300" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Decision History
            </h3>
            <p className="text-indigo-200">
              Keep track of past decisions and see how they were made. Perfect
              for settling disputes!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
