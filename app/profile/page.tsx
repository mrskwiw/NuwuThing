"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Settings, Users, FileText, Trophy, Star, Clock } from "lucide-react"
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("created")
  const { user, isLoading } = useSupabaseAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirectTo=/profile")
    }
  }, [user, isLoading, router])

  // Mock user data
  const userData = {
    username: "quizmaster",
    displayName: "Quiz Master",
    bio: "Creating fun and educational quizzes since 2020. Teacher by day, quiz enthusiast by night!",
    avatar: "/placeholder.svg?height=150&width=150",
    coverImage: "/placeholder.svg?height=300&width=1200",
    followerCount: 1243,
    followingCount: 85,
    quizCount: 32,
    joinDate: "January 2020",
    badges: ["Top Creator", "Quiz Expert", "Trending"],
  }

  // Mock quizzes data
  const createdQuizzes = [
    {
      id: "1",
      title: "World Geography Challenge",
      category: "Education",
      plays: 2456,
      likes: 342,
      createdAt: "2023-10-10T14:48:00.000Z",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "2",
      title: "90s Music Trivia",
      category: "Entertainment",
      plays: 1876,
      likes: 245,
      createdAt: "2023-09-15T10:30:00.000Z",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "3",
      title: "Science Facts Quiz",
      category: "Education",
      plays: 3210,
      likes: 512,
      createdAt: "2023-08-22T09:15:00.000Z",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
    },
  ]

  const completedQuizzes = [
    {
      id: "4",
      title: "Marvel Cinematic Universe Trivia",
      creator: "marvelFan42",
      score: "8/10",
      completedAt: "2023-10-12T16:30:00.000Z",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
    },
    {
      id: "5",
      title: "History of Ancient Rome",
      creator: "historyBuff",
      score: "9/10",
      completedAt: "2023-10-05T14:20:00.000Z",
      thumbnailUrl: "/placeholder.svg?height=120&width=200",
    },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-48 w-full rounded-lg bg-muted animate-pulse mb-8"></div>
        <div className="h-32 w-32 rounded-full bg-muted animate-pulse mb-8 ml-8"></div>
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-4"></div>
        <div className="h-4 w-64 bg-muted rounded animate-pulse mb-8"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your profile</p>
            <Button onClick={() => router.push("/login?redirectTo=/profile")}>Log in</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <div className="h-48 w-full rounded-lg overflow-hidden bg-muted">
          <Image src={userData.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
        </div>

        <div className="absolute -bottom-16 left-8 rounded-full border-4 border-background">
          <Avatar className="h-32 w-32">
            <AvatarImage src={userData.avatar} alt={userData.displayName} />
            <AvatarFallback>{userData.displayName[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-16 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{userData.displayName}</h1>
            <p className="text-muted-foreground">@{userData.username}</p>
          </div>

          <div className="flex gap-3">
            <Button>Follow</Button>
            <Button variant="outline">Message</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {userData.badges.map((badge) => (
            <Badge key={badge} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>

        <p className="mt-4 text-muted-foreground">{userData.bio}</p>

        <div className="flex flex-wrap gap-6 mt-6 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              <strong>{userData.followerCount}</strong> followers
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              <strong>{userData.followingCount}</strong> following
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>
              <strong>{userData.quizCount}</strong> quizzes
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Joined {userData.joinDate}</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">Created Quizzes</TabsTrigger>
          <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="created" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdQuizzes.map((quiz) => (
              <Card key={quiz.id} className="overflow-hidden">
                <Link href={`/quiz/${quiz.id}`} className="block">
                  <div className="relative h-40">
                    <Image
                      src={quiz.thumbnailUrl || "/placeholder.svg"}
                      alt={quiz.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2">{quiz.category}</Badge>
                  </div>
                </Link>

                <CardContent className="p-4">
                  <Link href={`/quiz/${quiz.id}`} className="block">
                    <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">{quiz.title}</h3>
                  </Link>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{quiz.plays.toLocaleString()} plays</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{quiz.likes} likes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="flex flex-col items-center justify-center p-6 border-dashed">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Create a new quiz</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Share your knowledge with the community</p>
              <Button asChild>
                <Link href="/create">Create Quiz</Link>
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedQuizzes.map((quiz) => (
              <Card key={quiz.id} className="overflow-hidden">
                <Link href={`/quiz/${quiz.id}`} className="block">
                  <div className="relative h-40">
                    <Image
                      src={quiz.thumbnailUrl || "/placeholder.svg"}
                      alt={quiz.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-3xl font-bold">{quiz.score.split("/")[0]}</div>
                        <div className="text-sm">out of {quiz.score.split("/")[1]}</div>
                      </div>
                    </div>
                  </div>
                </Link>

                <CardContent className="p-4">
                  <Link href={`/quiz/${quiz.id}`} className="block">
                    <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">{quiz.title}</h3>
                  </Link>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>By {quiz.creator}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>{quiz.score}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

