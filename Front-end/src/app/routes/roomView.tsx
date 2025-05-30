import { createFileRoute } from "@tanstack/react-router";
import { RoomView } from "../pages/createVoting";

export const Route = createFileRoute("/roomView")({
  component: RoomView,
});
