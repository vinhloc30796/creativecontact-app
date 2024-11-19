import { Button } from "@/components/ui/button"
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv"
import Link from "next/link"

export default function NotFound() {
  return (
    <BackgroundDiv className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"># Page Not Found</h1>
      <Button variant={"link"} asChild>
        <Link href="/">Go back to the home page</Link>
      </Button>
    </BackgroundDiv>
  )
}
