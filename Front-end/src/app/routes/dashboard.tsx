import { createFileRoute } from "@tanstack/react-router";
import { DashBoardPage } from "../pages/dashboard";

export const Route = createFileRoute("/dashboard")({
  component: DashBoardPage,
});
