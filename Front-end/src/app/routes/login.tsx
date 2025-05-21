import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/loginPage";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
