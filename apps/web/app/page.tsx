import { Button } from "@workspace/ui/components/button"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <div className="flex gap-2 mt-4">
            <Button asChild>
              <a href="/login">Login Page</a>
            </Button>
            <Button variant="outline">Button</Button>
          </div>
        </div>
        <div className="text-muted-foreground font-mono text-xs mt-4">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
