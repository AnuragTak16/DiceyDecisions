import { createFileRoute } from "@tanstack/react-router";
import { ShowRoomsDetails } from "@/app/pages/roomDetails";

export const Route = createFileRoute("/createdRoom")({
  component: ShowRoomsDetails,
});
