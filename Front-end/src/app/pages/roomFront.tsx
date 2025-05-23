// import { useState, useEffect } from "react";
// import {
//   Users,
//   Plus,
//   Dice1,
//   RotateCcw,
//   Coins,
//   Share2,
//   Copy,
//   Vote,
//   Eye,
//   Clock,
//   Trophy,
// } from "lucide-react";

// export const RoomFront = () => {
//   const [currentView, setCurrentView] = useState("home"); // home, create, join, room, results
//   const [currentUser] = useState({ id: "user-1", name: "John Doe" });
//   const [currentRoom, setCurrentRoom] = useState(null);
//   const [rooms, setRooms] = useState<
//     {
//       id: string;
//       title: string;
//       description: string;
//       creatorId: string;
//       createdAt: Date;
//       isOpen: boolean;
//       code: string;
//       maxParticipants: number;
//       status: string;
//     }[]
//   >([]);
//   const [participants, setParticipants] = useState([]);
//   const [options, setOptions] = useState([]);
//   const [votes, setVotes] = useState([]);
//   const [showTiebreaker, setShowTiebreaker] = useState(false);
//   const [tiebreakerResult, setTiebreakerResult] = useState(null);

//   // Sample data for demonstration
//   useEffect(() => {
//     setRooms([
//       {
//         id: "room-1",
//         title: "Dinner Spot?",
//         description: "Where should we eat tonight?",
//         creatorId: "user-1",
//         createdAt: new Date("2024-01-15"),
//         isOpen: true,
//         code: "ABC123",
//         maxParticipants: 10,
//         status: "collecting", // collecting, voting, completed
//       },
//       {
//         id: "room-2",
//         title: "Movie Night",
//         description: "What should we watch?",
//         creatorId: "user-2",
//         createdAt: new Date("2024-01-14"),
//         isOpen: false,
//         code: "XYZ789",
//         maxParticipants: 5,
//         status: "completed",
//       },
//     ]);
//   }, []);

//   // const CreateRoomForm = () => {
//   //   const [formData, setFormData] = useState({
//   //     title: "",
//   //     description: "",
//   //     maxParticipants: "",
//   //   });

//   //   const handleSubmit = (e) => {
//   //     e.preventDefault();
//   //     const newRoom = {
//   //       id: `room-${Date.now()}`,
//   //       ...formData,
//   //       creatorId: currentUser.id,
//   //       createdAt: new Date(),
//   //       isOpen: true,
//   //       code: Math.random().toString(36).substring(2, 8).toUpperCase(),
//   //       status: "collecting",
//   //       maxParticipants: formData.maxParticipants || 10,
//   //     };
//   //     setRooms([...rooms, newRoom]);
//   //     setCurrentRoom(newRoom);
//   //     setCurrentView("room");
//   //   };

//   //   return (
//   //     <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
//   //       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//   //         Create Decision Room
//   //       </h2>
//   //       <div className="space-y-4">
//   //         <div>
//   //           <label className="block text-sm font-medium text-gray-700 mb-2">
//   //             Room Title *
//   //           </label>
//   //           <input
//   //             type="text"
//   //             required
//   //             placeholder="e.g., Dinner Spot?"
//   //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //             value={formData.title}
//   //             onChange={(e) =>
//   //               setFormData({ ...formData, title: e.target.value })
//   //             }
//   //           />
//   //         </div>

//   //         <div>
//   //           <label className="block text-sm font-medium text-gray-700 mb-2">
//   //             Description (optional)
//   //           </label>
//   //           <textarea
//   //             placeholder="Add more context..."
//   //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
//   //             value={formData.description}
//   //             onChange={(e) =>
//   //               setFormData({ ...formData, description: e.target.value })
//   //             }
//   //           />
//   //         </div>

//   //         <div>
//   //           <label className="block text-sm font-medium text-gray-700 mb-2">
//   //             Max Participants (optional)
//   //           </label>
//   //           <input
//   //             type="number"
//   //             min="2"
//   //             max="50"
//   //             placeholder="10"
//   //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//   //             value={formData.maxParticipants}
//   //             onChange={(e) =>
//   //               setFormData({ ...formData, maxParticipants: e.target.value })
//   //             }
//   //           />
//   //         </div>

//   //         <div className="flex space-x-3 pt-4">
//   //           <button
//   //             type="button"
//   //             onClick={() => setCurrentView("home")}
//   //             className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//   //           >
//   //             Cancel
//   //           </button>
//   //           <button
//   //             type="submit"
//   //             className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//   //           >
//   //             Create Room
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   // const JoinRoomForm = () => {
//   //   const [roomCode, setRoomCode] = useState("");

//   //   const handleJoin = (e) => {
//   //     e.preventDefault();
//   //     const room = rooms.find((r) => r.code === roomCode.toUpperCase());
//   //     if (room) {
//   //       setCurrentRoom(room);
//   //       setCurrentView("room");
//   //     } else {
//   //       alert("Room not found!");
//   //     }
//   //   };

//   //   return (
//   //     <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
//   //       <h2 className="text-2xl font-bold text-gray-800 mb-6">Join Room</h2>
//   //       <form onSubmit={handleJoin} className="space-y-4">
//   //         <div>
//   //           <label className="block text-sm font-medium text-gray-700 mb-2">
//   //             Room Code
//   //           </label>
//   //           <input
//   //             type="text"
//   //             required
//   //             placeholder="Enter 6-digit code"
//   //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
//   //             value={roomCode}
//   //             onChange={(e) => setRoomCode(e.target.value)}
//   //             maxLength="6"
//   //           />
//   //         </div>

//   //         <div className="flex space-x-3 pt-4">
//   //           <button
//   //             type="button"
//   //             onClick={() => setCurrentView("home")}
//   //             className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//   //           >
//   //             Cancel
//   //           </button>
//   //           <button
//   //             type="submit"
//   //             className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//   //           >
//   //             Join Room
//   //           </button>
//   //         </div>
//   //       </form>
//   //     </div>
//   //   );
//   // };

//   const RoomView = () => {
//     const [newOption, setNewOption] = useState("");
//     const [userOptions, setUserOptions] = useState([
//       "Dominos",
//       "Subway",
//       "Cook at home",
//     ]);
//     const [selectedVote, setSelectedVote] = useState(null);
//     const [hasVoted, setHasVoted] = useState(false);

//     // Sample participants
//     const sampleParticipants = [
//       { id: "user-1", name: "John Doe", joinedAt: new Date() },
//       { id: "user-2", name: "Jane Smith", joinedAt: new Date() },
//       { id: "user-3", name: "Mike Johnson", joinedAt: new Date() },
//       { id: "user-4", name: "Sarah Wilson", joinedAt: new Date() },
//     ];

//     const addOption = (e) => {
//       e.preventDefault();
//       if (newOption.trim()) {
//         setUserOptions([...userOptions, newOption.trim()]);
//         setNewOption("");
//       }
//     };

//     const submitVote = () => {
//       if (selectedVote !== null) {
//         setHasVoted(true);
//         // In real app, submit vote to backend
//       }
//     };

//     const startVoting = () => {
//       setCurrentRoom({ ...currentRoom, status: "voting" });
//     };

//     const endVoting = () => {
//       setCurrentRoom({ ...currentRoom, status: "completed" });
//       setCurrentView("results");
//     };

//     const copyRoomCode = () => {
//       navigator.clipboard.writeText(currentRoom.code);
//       alert("Room code copied!");
//     };

//     const shareLink = () => {
//       const link = `${window.location.origin}/join/${currentRoom.code}`;
//       navigator.clipboard.writeText(link);
//       alert("Invite link copied!");
//     };

//     return (
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
//         {/* Room Header */}
//         <div className="border-b p-6">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">
//                 {currentRoom.title}
//               </h1>
//               {currentRoom.description && (
//                 <p className="text-gray-600 mt-2">{currentRoom.description}</p>
//               )}
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={copyRoomCode}
//                 className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
//               >
//                 <Copy size={16} />
//                 <span className="font-mono">{currentRoom.code}</span>
//               </button>
//               <button
//                 onClick={shareLink}
//                 className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
//               >
//                 <Share2 size={16} />
//                 <span>Share</span>
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4 text-sm text-gray-500">
//             <span className="flex items-center space-x-1">
//               <Users size={16} />
//               <span>{sampleParticipants.length} participants</span>
//             </span>
//             <span className="flex items-center space-x-1">
//               <Clock size={16} />
//               <span>Status: {currentRoom.status}</span>
//             </span>
//           </div>
//         </div>

//         <div className="flex">
//           {/* Main Content */}
//           <div className="flex-1 p-6">
//             {currentRoom.status === "collecting" && (
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-xl font-semibold mb-4">Submit Options</h3>
//                   <form onSubmit={addOption} className="flex space-x-2 mb-4">
//                     <input
//                       type="text"
//                       placeholder="Add an option..."
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={newOption}
//                       onChange={(e) => setNewOption(e.target.value)}
//                     />
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                       <Plus size={16} />
//                     </button>
//                   </form>
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-3">Current Options</h4>
//                   <div className="space-y-2">
//                     {userOptions.map((option, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
//                       >
//                         <span>{option}</span>
//                         <button className="text-red-500 hover:text-red-700">
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {currentRoom.creatorId === currentUser.id && (
//                   <button
//                     onClick={startVoting}
//                     className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
//                   >
//                     Start Voting
//                   </button>
//                 )}
//               </div>
//             )}

//             {currentRoom.status === "voting" && (
//               <div className="space-y-6">
//                 <h3 className="text-xl font-semibold">Cast Your Vote</h3>
//                 {!hasVoted ? (
//                   <div className="space-y-3">
//                     {userOptions.map((option, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedVote(index)}
//                         className={`w-full p-4 text-left rounded-md border-2 transition-colors ${
//                           selectedVote === index
//                             ? "border-blue-500 bg-blue-50"
//                             : "border-gray-200 hover:border-gray-300"
//                         }`}
//                       >
//                         {option}
//                       </button>
//                     ))}
//                     <button
//                       onClick={submitVote}
//                       disabled={selectedVote === null}
//                       className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
//                     >
//                       Submit Vote
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <Vote size={48} className="mx-auto text-green-500 mb-4" />
//                     <p className="text-lg text-green-600 font-medium">
//                       Vote submitted!
//                     </p>
//                     <p className="text-gray-500">
//                       Waiting for others to vote...
//                     </p>
//                   </div>
//                 )}

//                 {currentRoom.creatorId === currentUser.id && (
//                   <button
//                     onClick={endVoting}
//                     className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
//                   >
//                     End Voting & Show Results
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Participants Sidebar */}
//           <div className="w-80 border-l p-6">
//             <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
//               <Users size={20} />
//               <span>Participants ({sampleParticipants.length})</span>
//             </h3>
//             <div className="space-y-3">
//               {sampleParticipants.map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md"
//                 >
//                   <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
//                     {participant.name.charAt(0)}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-800">
//                       {participant.name}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Joined {participant.joinedAt.toLocaleTimeString()}
//                     </p>
//                   </div>
//                   {currentRoom && participant.id === currentRoom.creatorId && (
//                     <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
//                       Creator
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const ResultsView = () => {
//     const results = [
//       { option: "Dominos", votes: 3 },
//       { option: "Subway", votes: 3 },
//       { option: "Cook at home", votes: 1 },
//     ];

//     const maxVotes = Math.max(...results.map((r) => r.votes));
//     const winners = results.filter((r) => r.votes === maxVotes);
//     const hasTie = winners.length > 1;

//     const handleTiebreaker = (method) => {
//       setShowTiebreaker(true);
//       setTimeout(() => {
//         const randomWinner =
//           winners[Math.floor(Math.random() * winners.length)];
//         setTiebreakerResult(randomWinner);
//         setShowTiebreaker(false);
//       }, 2000);
//     };

//     return (
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         <div className="text-center mb-8">
//           <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
//           <h2 className="text-3xl font-bold text-gray-800">Results</h2>
//           <p className="text-gray-600">{currentRoom.title}</p>
//         </div>

//         <div className="space-y-4 mb-8">
//           {results.map((result, index) => (
//             <div
//               key={index}
//               className="flex items-center space-x-4 p-4 border rounded-lg"
//             >
//               <div className="flex-1">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="font-medium">{result.option}</span>
//                   <span className="text-gray-600">{result.votes} votes</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-600 h-2 rounded-full"
//                     style={{ width: `${(result.votes / 7) * 100}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {hasTie && !tiebreakerResult && (
//           <div className="text-center space-y-4">
//             <p className="text-lg font-medium text-orange-600">
//               It's a tie! Choose a tiebreaker:
//             </p>
//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={() => handleTiebreaker("dice")}
//                 className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//               >
//                 <Dice1 size={20} />
//                 <span>Dice Roll</span>
//               </button>
//               <button
//                 onClick={() => handleTiebreaker("spinner")}
//                 className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//               >
//                 <RotateCcw size={20} />
//                 <span>Spinner</span>
//               </button>
//               <button
//                 onClick={() => handleTiebreaker("coin")}
//                 className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
//               >
//                 <Coins size={20} />
//                 <span>Coin Flip</span>
//               </button>
//             </div>
//           </div>
//         )}

//         {showTiebreaker && (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-lg">Breaking the tie...</p>
//           </div>
//         )}

//         {tiebreakerResult && (
//           <div className="text-center py-8 bg-green-50 rounded-lg">
//             <Trophy size={48} className="mx-auto text-green-500 mb-4" />
//             <h3 className="text-2xl font-bold text-green-700 mb-2">Winner!</h3>
//             <p className="text-xl">{tiebreakerResult.option}</p>
//           </div>
//         )}

//         <div className="flex justify-center mt-8">
//           <button
//             onClick={() => setCurrentView("home")}
//             className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const PastDecisions = () => {
//     return (
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//           Past Decisions
//         </h2>
//         <div className="space-y-4">
//           {rooms
//             .filter((room) => room.status === "completed")
//             .map((room) => (
//               <div
//                 key={room.id}
//                 className="border rounded-lg p-4 hover:bg-gray-50"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-semibold text-lg">{room.title}</h3>
//                     <p className="text-gray-600 text-sm">{room.description}</p>
//                     <p className="text-gray-500 text-xs mt-2">
//                       Created {room.createdAt.toLocaleDateString()}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setCurrentRoom(room);
//                       setCurrentView("results");
//                     }}
//                     className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
//                   >
//                     <Eye size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     );
//   };

//   const HomeView = () => {
//     return (
//       <div className="max-w-4xl mx-auto space-y-8">
//         <div className="text-center">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">
//             Decision Room
//           </h1>
//           <p className="text-xl text-gray-600">
//             Make group decisions together, anonymously
//           </p>
//         </div>

//         {/* <div className="grid md:grid-cols-2 gap-6">
//           <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Plus size={32} className="text-blue-600" />
//             </div>
//             <h3 className="text-xl font-semibold mb-3">Create Room</h3>
//             <p className="text-gray-600 mb-6">
//               Start a new decision room and invite others to participate
//             </p>
//             <button
//               onClick={() => setCurrentView("create")}
//               className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Create New Room
//             </button>
//           </div> */}

//         {/* <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Users size={32} className="text-green-600" />
//             </div>
//             <h3 className="text-xl font-semibold mb-3">Join Room</h3>
//             <p className="text-gray-600 mb-6">
//               Enter a room code to join an existing decision room
//             </p>
//             <button
//               onClick={() => setCurrentView("join")}
//               className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//             >
//               Join Existing Room
//             </button>
//           </div>
//         </div> */}

//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold">Recent Rooms</h3>
//             <button
//               onClick={() => setCurrentView("past")}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               View All
//             </button>
//           </div>
//           <div className="space-y-3">
//             {rooms.slice(0, 3).map((room) => (
//               <div
//                 key={room.id}
//                 className="flex items-center justify-between p-3 border rounded-md"
//               >
//                 <div>
//                   <p className="font-medium">{room.title}</p>
//                   <p className="text-sm text-gray-500">
//                     {room.createdAt.toLocaleDateString()} • Status:{" "}
//                     {room.status}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setCurrentRoom(room);
//                     setCurrentView(
//                       room.status === "completed" ? "results" : "room"
//                     );
//                   }}
//                   className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//                 >
//                   {room.status === "completed" ? "View Results" : "Open"}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       {currentView === "home" && <HomeView />}
//       {currentView === "create" && <CreateRoomForm />}
//       {currentView === "join" && <JoinRoomForm />}
//       {currentView === "room" && <RoomView />}
//       {currentView === "results" && <ResultsView />}
//       {currentView === "past" && <PastDecisions />}
//     </div>
//   );
// };
