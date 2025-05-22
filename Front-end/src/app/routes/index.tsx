import { createFileRoute } from "@tanstack/react-router";
import { DiceyDecisionsHome } from "../pages/homePage";

export const Route = createFileRoute("/")({
  component: DiceyDecisionsHome,
});
