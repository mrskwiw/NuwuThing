import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Share2, BookmarkPlus } from "lucide-react"
import { QuizTakingInterface } from "@/components/quiz-taking-interface"
import { getQuizById } from "@/lib/db"
import { notFound } from "next/navigation"

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
  let quiz
  try {
    quiz = await getQuizById(params.id)
    if (!quiz) {
      return notFound()
    }
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return notFound()
  }

  // Count the number of questions
  const questionCount = quiz.questions?.length || 0

  // Format the created date
  const createdDate = new Date(quiz.created_at).toLocaleDateString()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link href="/explore" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Explore
            </Link>
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={quiz.creator?.avatar_url || "/placeholder.svg?height=40&width=40"}
                  alt={quiz.creator?.display_name || "Creator"}
                />
                <AvatarFallback>{quiz.creator?.display_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <Link href={`/user/${quiz.creator?.username || "unknown"}`} className="text-sm hover:underline">
                {quiz.creator?.display_name || "Unknown Creator"}
              </Link>
              <span className="text-muted-foreground text-sm">• {createdDate}</span>
            </div>

            <div className="relative rounded-lg overflow-hidden mb-6">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt={quiz.title}
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">General</Badge>
              <Badge variant="outline">Medium</Badge>
            </div>

            <p className="text-muted-foreground mb-6">{quiz.description || "No description provided."}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{Math.ceil(questionCount / 2)} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>0 plays</span>
              </div>
            </div>
          </div>

          <QuizTakingInterface quizId={quiz.id} questions={quiz.questions} />
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ready to start?</CardTitle>
              <CardDescription>Test your knowledge with this {questionCount}-question quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Questions:</span>
                <span className="font-medium">{questionCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estimated time:</span>
                <span className="font-medium">{Math.ceil(questionCount / 2)} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Difficulty:</span>
                <span className="font-medium">Medium</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full">Start Quiz</Button>
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" className="flex-1">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-6">
            <h3 className="font-semibold mb-4">Similar Quizzes</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Link href={`/quiz/${i}`} key={i} className="block">
                  <div className="flex gap-3 group">
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={`/placeholder.svg?height=80&width=80`}
                        alt="Quiz thumbnail"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {i === 1
                          ? "DC Extended Universe Quiz"
                          : i === 2
                            ? "Star Wars Trivia Challenge"
                            : "Game of Thrones: How Well Do You Know Westeros?"}
                      </h4>
                      <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 1000) + 100} plays</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

