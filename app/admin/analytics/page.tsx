import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuizStats } from "@/lib/db"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const stats = await getQuizStats()

  // Mock data for charts
  const quizCreationData = [
    { name: "Jan", count: 4 },
    { name: "Feb", count: 7 },
    { name: "Mar", count: 5 },
    { name: "Apr", count: 10 },
    { name: "May", count: 8 },
    { name: "Jun", count: 12 },
  ]

  const userRegistrationData = [
    { name: "Jan", count: 10 },
    { name: "Feb", count: 15 },
    { name: "Mar", count: 12 },
    { name: "Apr", count: 20 },
    { name: "May", count: 18 },
    { name: "Jun", count: 25 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts quizCreationData={quizCreationData} userRegistrationData={userRegistrationData} />
    </div>
  )
}

