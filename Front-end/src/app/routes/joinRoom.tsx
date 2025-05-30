import { createFileRoute } from "@tanstack/react-router";
import { RoomView } from "@/app/pages/createVoting";

export const Route = createFileRoute("/joinRoom")({
  component: RoomView,
});
