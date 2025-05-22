import { createFileRoute } from "@tanstack/react-router";
import { RoomForm } from "../pages/roomForm";

export const Route = createFileRoute("/room")({
  component: RoomForm,
});
