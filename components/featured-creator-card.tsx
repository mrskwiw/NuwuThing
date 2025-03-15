import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FileText, Users } from "lucide-react"

interface FeaturedCreatorCardProps {
  creator: {
    id: string
    username: string
    displayName: string
    avatar: string
    followerCount: number
    quizCount: number
    bio: string
  }
}

export function FeaturedCreatorCard({ creator }: FeaturedCreatorCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src={creator.avatar} alt={creator.displayName} />
            <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <Link href={`/user/${creator.username}`}>
              <h3 className="font-bold text-xl">{creator.displayName}</h3>
              <p className="text-muted-foreground text-sm">@{creator.username}</p>
            </Link>

            <p className="my-2 line-clamp-2">{creator.bio}</p>

            <div className="flex justify-center sm:justify-start gap-4 my-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{creator.followerCount.toLocaleString()} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{creator.quizCount} quizzes</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Follow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

