import { createFileRoute } from "@tanstack/react-router";
import { Signup } from "../pages/signupPage";

export const Route = createFileRoute("/signup")({
  component: Signup,
});
