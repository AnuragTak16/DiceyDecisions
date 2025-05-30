// import React, { useState } from "react";
// import type { CreateVotePayload } from "@/Type/vote";
// import { useCreateVoteMutation } from "@/api/create-vote";

// export const RoomView = () => {
//   const [title, setTitle] = useState("");
//   const [roomId, setRoomId] = useState("");
//   const [options, setOptions] = useState<string[]>(["", ""]);
//   const [allowCustomOptions, setAllowCustomOptions] = useState(false);

//   const [createVote, { isLoading, isSuccess, error }] = useCreateVoteMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload: CreateVotePayload = {
//       title,
//       roomId,
//       options: options.filter(Boolean),
//       allowCustomOptions,
//     };

//     try {
//       await createVote(payload).unwrap();
//       alert("Vote created successfully!");
//     } catch (err) {
//       console.error("Failed to create vote", err);
//     }
//   };

//   const handleOptionChange = (index: number, value: string) => {
//     const newOptions = [...options];
//     newOptions[index] = value;
//     setOptions(newOptions);
//   };

//   const addOption = () => setOptions([...options, ""]);

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Vote Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         required
//       />
//       <input
//         type="text"
//         placeholder="Room ID"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//         required
//       />

//       {options.map((opt, idx) => (
//         <input
//           key={idx}
//           type="text"
//           placeholder={`Option ${idx + 1}`}
//           value={opt}
//           onChange={(e) => handleOptionChange(idx, e.target.value)}
//           required
//         />
//       ))}

//       <button type="button" onClick={addOption}>
//         Add Option
//       </button>

//       <label>
//         <input
//           type="checkbox"
//           checked={allowCustomOptions}
//           onChange={(e) => setAllowCustomOptions(e.target.checked)}
//         />
//         Allow Custom Options
//       </label>

//       <button type="submit" disabled={isLoading}>
//         {isLoading ? "Creating..." : "Create Vote"}
//       </button>

//       {isSuccess && <p>Vote created successfully!</p>}
//       {error && <p style={{ color: "red" }}>Failed to create vote.</p>}
//     </form>
//   );
// };
