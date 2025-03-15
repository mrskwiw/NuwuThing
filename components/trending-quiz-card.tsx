import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Award } from "lucide-react"

interface TrendingQuizCardProps {
  quiz: {
    id: string
    title: string
    creator: string
    creatorAvatar: string
    category: string
    questionCount: number
    completionCount: number
    averageScore: number
    thumbnailUrl: string
  }
}

export function TrendingQuizCard({ quiz }: TrendingQuizCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/quiz/${quiz.id}`} className="block">
        <div className="relative h-40">
          <Image
            src={quiz.thumbnailUrl || "/placeholder.svg?height=200&width=300"}
            alt={quiz.title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2">{quiz.category}</Badge>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/quiz/${quiz.id}`} className="block">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{quiz.title}</h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={quiz.creatorAvatar} alt={quiz.creator} />
            <AvatarFallback>{quiz.creator[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <Link href={`/user/${quiz.creator}`} className="text-sm hover:underline">
            {quiz.creator}
          </Link>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{quiz.completionCount.toLocaleString()} plays</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>
              Avg: {quiz.averageScore}/{quiz.questionCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

