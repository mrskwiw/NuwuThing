import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingQuizCard } from "@/components/trending-quiz-card"
import { FeaturedCreatorCard } from "@/components/featured-creator-card"
import { HeroSection } from "@/components/hero-section"
import { QuizCategorySelector } from "@/components/quiz-category-selector"
import { getQuizzes } from "@/lib/db"

export default async function HomePage() {
  // Fetch trending quizzes from Supabase
  let trendingQuizzes = []
  try {
    trendingQuizzes = await getQuizzes(6)
  } catch (error) {
    console.error("Error fetching quizzes:", error)
  }

  // Mock data for featured creators (would be fetched from Supabase in a real app)
  const featuredCreators = [
    {
      id: "1",
      username: "quizMaster",
      displayName: "Quiz Master",
      avatar: "/placeholder.svg?height=80&width=80",
      followerCount: 12500,
      quizCount: 47,
      bio: "Creating the most challenging trivia since 2020",
    },
    {
      id: "2",
      username: "historyBuff",
      displayName: "History Buff",
      avatar: "/placeholder.svg?height=80&width=80",
      followerCount: 8700,
      quizCount: 32,
      bio: "History teacher making learning fun through quizzes",
    },
  ]

  const categories = [
    { id: "entertainment", name: "Entertainment", icon: "Film" },
    { id: "education", name: "Education", icon: "GraduationCap" },
    { id: "sports", name: "Sports", icon: "Sports" },
    { id: "science", name: "Science", icon: "Flask" },
    { id: "technology", name: "Technology", icon: "Cpu" },
    { id: "history", name: "History", icon: "Landmark" },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <QuizCategorySelector categories={categories} />

        <section className="my-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending Quizzes</h2>
            <Link href="/explore" className="text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingQuizzes.length > 0 ? (
              trendingQuizzes.map((quiz) => (
                <TrendingQuizCard
                  key={quiz.id}
                  quiz={{
                    id: quiz.id,
                    title: quiz.title,
                    creator: quiz.creator?.username || "Unknown",
                    creatorAvatar: quiz.creator?.avatar_url || "/placeholder.svg?height=40&width=40",
                    category: "General", // We would need a categories table for this
                    questionCount: 10, // We would need to count questions for this
                    completionCount: 0, // We would need a quiz_attempts table for this
                    averageScore: 0, // We would need a quiz_attempts table for this
                    thumbnailUrl: "/placeholder.svg?height=200&width=300", // Add thumbnail_url to quizzes table
                  }}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-muted-foreground">
                No quizzes found. Be the first to create one!
              </div>
            )}
          </div>
        </section>

        <section className="my-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Creators</h2>
            <Link href="/creators" className="text-primary hover:underline">
              Discover more
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCreators.map((creator) => (
              <FeaturedCreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </section>

        <section className="my-10 bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Create Your Own Quiz</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Share your knowledge, challenge friends, or test your audience with custom quizzes that are easy to create
            and fun to share.
          </p>
          <Button size="lg" asChild>
            <Link href="/create">Start Creating</Link>
          </Button>
        </section>
      </div>
    </main>
  )
}

