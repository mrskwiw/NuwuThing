import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="text-primary">Quiz</span>Squirrel
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Create, share, and challenge friends with fun quizzes on any topic
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/explore">Explore Quizzes</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/create">Create Quiz</Link>
          </Button>
        </div>

        <div className="mt-12 relative w-full max-w-4xl">
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-primary/10 rounded-full blur-xl"></div>
          <div className="relative bg-card border rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video w-full bg-muted flex items-center justify-center">
              <div className="text-4xl">🐿️</div>
              <span className="sr-only">QuizSquirrel Platform Preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

