import { createFileRoute } from "@tanstack/react-router";
import { RoomView } from "@/app/pages/votingRoom";

export const Route = createFileRoute("/roomView")({
  component: RoomView,
});
