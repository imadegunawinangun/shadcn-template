import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Placeholder for onboarding logic
  // For now, just redirect to dashboard
  redirect("/dashboard");

  return null;
}
