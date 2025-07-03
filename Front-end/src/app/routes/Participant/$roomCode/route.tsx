import { createFileRoute } from "@tanstack/react-router";
import { RoomView } from "@/app/pages/createVoting";

export const Route = createFileRoute("/Participant/$roomCode")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomCode } = Route.useParams();
  return <RoomView roomCode={roomCode} />;
}
