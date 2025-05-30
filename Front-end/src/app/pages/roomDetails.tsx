import { useState } from "react";
import { useGetRoomDetailQuery } from "@/api/roomDetails";
import {
  Mail,
  Users,
  KeyRound,
  User2,
  Search,
  Grid3X3,
  List,
  Copy,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useDeleteRoomMutation } from "@/api/deleteApi";

export const ShowRoomsDetails = () => {
  const { data: rooms, isLoading, error } = useGetRoomDetailQuery();
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDelete = async (roomId: string) => {
    try {
      await deleteRoom(roomId).unwrap();
      toast.success("Room deleted successfully");
    } catch (error: any) {
      // Log the error to console
      console.error("Delete failed:", error);

      // Try to extract error message safely
      const errMsg = error?.data?.message || error?.error || "Unknown error";
      toast.error(`Delete failed: ${errMsg}`);
    }
  };

  const filteredRooms = rooms?.filter((room) =>
    [room.title, room.description, room.roomCode].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-medium">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <p className="text-red-600 text-lg font-medium">
            Error loading rooms
          </p>
          <p className="text-slate-500 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Room Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              {rooms?.length || 0} rooms available
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Room List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredRooms?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              No rooms found
            </h3>
            <p className="text-slate-500">Try adjusting your search terms</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <div
                key={room._id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all group overflow-hidden"
              >
                <div className="p-6 pb-4">
                  {/* Title & More */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-slate-800 line-clamp-2">
                      {room.title}
                    </h3>
                    <button
                      onClick={() =>
                        setSelectedRoom(
                          selectedRoom === room._id ? null : room._id
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded-lg"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                    {room.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="h-4 w-4 text-blue-500" />
                      Max {room.maxParticipants}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <KeyRound className="h-4 w-4 text-teal-500" />
                      <span className="font-mono">{room.roomCode}</span>
                      <button
                        onClick={() => handleCopy(room.roomCode, "Room code")}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <User2 className="h-4 w-4 text-slate-400" />
                    <span>Created by {room.creatorId?.name}</span>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() =>
                      navigate({
                        to: "/room/$id",
                        params: { id: room.roomCode },
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Enter Room
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm"
                    title="Remove room"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-200">
            {filteredRooms.map((room) => (
              <div
                key={room._id}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {room.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        <KeyRound className="h-3 w-3" />
                        {room.roomCode}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm mb-3 line-clamp-1">
                      {room.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> Max {room.maxParticipants}
                      </span>
                      <span className="flex items-center gap-1">
                        <User2 className="h-4 w-4" /> {room.creatorId?.userName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />{" "}
                        {room.creatorId?.email || room.creatorIdroomView?.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleCopy(room.inviteLink, "Invite link")}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                      title="Copy invite link"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        navigate({
                          to: "/room/$id",
                          params: { id: room.roomCode },
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      title="Enter room"
                    >
                      <Eye className="h-4 w-4" />
                      Enter
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      disabled={isDeleting}
                      className="p-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg"
                      title="Remove room"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
