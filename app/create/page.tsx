"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { QuestionEditor } from "@/components/question-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Plus, Save, Eye, Lock, Globe } from "lucide-react"
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider"
import { createQuiz } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  text: string
  options: QuestionOption[]
  correctAnswer: string
  order: number
}

export default function CreateQuizPage() {
  const { user, isLoading } = useSupabaseAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("details")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      options: [
        { id: "1", text: "", isCorrect: true },
        { id: "2", text: "", isCorrect: false },
      ],
      correctAnswer: "1",
      order: 0,
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname
      router.push(`/login?redirectTo=${encodeURIComponent(currentPath)}`)
    }
  }, [user, isLoading, router])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `${questions.length + 1}`,
        text: "",
        options: [
          { id: "1", text: "", isCorrect: true },
          { id: "2", text: "", isCorrect: false },
        ],
        correctAnswer: "1",
        order: questions.length,
      },
    ])
  }

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions]
    newQuestions[index] = updatedQuestion
    setQuestions(newQuestions)
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a quiz",
        variant: "destructive",
      })
      router.push("/login?redirectTo=/create")
      return
    }

    if (!title) {
      setError("Please provide a title for your quiz")
      setActiveTab("details")
      return
    }

    if (questions.some((q) => !q.text || q.options.some((o) => !o.text))) {
      setError("Please fill in all questions and options")
      setActiveTab("questions")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Format questions for Supabase
      const formattedQuestions = questions.map((q) => ({
        question_text: q.text,
        options: q.options,
        correct_answer: q.correctAnswer,
        order: q.order,
      }))

      // Create the quiz
      const quiz = await createQuiz(
        {
          title,
          description,
          is_public: isPublic,
          user_id: user.id,
        },
        formattedQuestions,
      )

      toast({
        title: "Quiz created!",
        description: "Your quiz has been created successfully",
      })

      router.push(`/quiz/${quiz.id}`)
    } catch (error) {
      console.error("Error creating quiz:", error)
      setError("Failed to create quiz. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to create a quiz</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/login?redirectTo=/create")}>Log in</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create New Quiz</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Quiz Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Set up the general information about your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title for your quiz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your quiz is about"
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="visibility">Visibility</Label>
                  <div className="text-sm text-muted-foreground">Control who can see and take your quiz</div>
                </div>
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} id="visibility" />
                  <span className="text-sm font-medium">{isPublic ? "Public" : "Private"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button onClick={() => setActiveTab("questions")}>
                Continue to Questions
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Questions</CardTitle>
              <CardDescription>Create the questions and answers for your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  questionNumber={index + 1}
                  question={question}
                  onChange={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                />
              ))}

              <Button variant="outline" className="w-full" onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Details
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving Quiz..." : "Save Quiz"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

