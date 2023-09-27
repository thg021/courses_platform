import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-medium text-sky-600">Courses</h1>
      <UserButton
        afterSignOutUrl="/"
      />
    </div>
  )
}
