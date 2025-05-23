import { createFileRoute } from "@tanstack/react-router";
import RoomFront from "../pages/roomFront"; // Adjust the path as needed

export const Route = createFileRoute("/joinRoom")({
  component: RoomFront,
});
