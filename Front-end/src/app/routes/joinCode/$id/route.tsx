import { createFileRoute } from "@tanstack/react-router";
import { VotingRoom } from "@/app/pages/voting_room";

export const Route = createFileRoute("/joinCode/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <VotingRoom JoinCode={id} />;
}
