import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuizStats, getAllUsers, getAllQuizzes } from "@/lib/db"
import { Users, FileQuestion, Tag, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Get stats
  let stats = { totalQuizzes: 0, totalUsers: 0, totalQuestions: 0 }
  let recentUsers: any[] = []
  let recentQuizzes: any[] = []

  try {
    stats = await getQuizStats()

    // Get recent users
    const users = await getAllUsers()
    recentUsers = users.slice(0, 5)

    // Get recent quizzes
    const quizzes = await getAllQuizzes()
    recentQuizzes = quizzes.slice(0, 5)
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users on the platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">Quizzes created on the platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Questions across all quizzes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Recently registered users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {user.display_name?.[0] || user.username?.[0] || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.display_name || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      <Link href={`/admin/users/${user.id}`} className="text-xs text-primary">
                        View
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No users found</p>
              )}
            </div>

            <div className="mt-4 text-right">
              <Link href="/admin/users" className="text-sm text-primary">
                View all users
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
            <CardDescription>Recently created quizzes on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{quiz.title}</p>
                      <p className="text-xs text-muted-foreground">by {quiz.user_id.substring(0, 8)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(quiz.created_at).toLocaleDateString()}
                      </div>
                      <Link href={`/admin/quizzes/${quiz.id}`} className="text-xs text-primary">
                        View
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No quizzes found</p>
              )}
            </div>

            <div className="mt-4 text-right">
              <Link href="/admin/quizzes" className="text-sm text-primary">
                View all quizzes
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

