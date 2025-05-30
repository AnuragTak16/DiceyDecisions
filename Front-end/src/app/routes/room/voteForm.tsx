import { createFileRoute } from "@tanstack/react-router";
import { VotingRoom } from "@/app/pages/voting_room";

export const Route = createFileRoute("/room/voteForm")({
  component: VotingRoom,
});
