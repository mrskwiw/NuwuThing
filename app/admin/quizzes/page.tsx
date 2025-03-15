import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllQuizzes, deleteQuiz, updateQuizStatus } from "@/lib/db"
import { Eye, Trash2, CheckCircle, XCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function QuizzesPage() {
  const quizzes = await getAllQuizzes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quiz Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quizzes</CardTitle>
          <CardDescription>Manage quizzes created by users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">{quiz.title}</TableCell>
                      <TableCell>{quiz.user_id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <Badge variant={quiz.is_public ? "default" : "outline"}>
                          {quiz.is_public ? "Public" : "Private"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(quiz.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/quiz/${quiz.id}`} target="_blank">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <form
                            action={async () => {
                              "use server"
                              await updateQuizStatus(quiz.id, !quiz.is_public)
                            }}
                          >
                            <Button variant="ghost" size="icon" type="submit">
                              {quiz.is_public ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              <span className="sr-only">{quiz.is_public ? "Make Private" : "Make Public"}</span>
                            </Button>
                          </form>
                          <form
                            action={async () => {
                              "use server"
                              await deleteQuiz(quiz.id)
                            }}
                          >
                            <Button variant="ghost" size="icon" type="submit">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No quizzes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

