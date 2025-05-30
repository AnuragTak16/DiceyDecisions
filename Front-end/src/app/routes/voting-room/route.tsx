import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/voting-room")({
  component: Outlet,
});
