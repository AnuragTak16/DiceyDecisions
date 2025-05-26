import { createFileRoute } from "@tanstack/react-router";
import { RoomView } from "@/app/pages/votingRoom";

export const Route = createFileRoute("/room/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <RoomView roomCode={id} />;
}
