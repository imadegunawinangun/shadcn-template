import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md flex justify-center">
        <SignUp appearance={{
          elements: {
            card: "shadow-2xl border border-border/40 rounded-2xl bg-card",
          }
        }} />
      </div>
    </div>
  );
}
