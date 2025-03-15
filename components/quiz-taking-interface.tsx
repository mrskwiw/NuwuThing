"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import type { Question } from "@/lib/db"

interface QuizTakingInterfaceProps {
  quizId: string
  questions?: Question[]
}

export function QuizTakingInterface({ quizId, questions = [] }: QuizTakingInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsSubmitted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: value,
    })
  }

  const calculateScore = () => {
    let score = 0
    Object.keys(selectedAnswers).forEach((questionIndex) => {
      const index = Number.parseInt(questionIndex)
      if (questions[index] && selectedAnswers[index] === questions[index].correct_answer) {
        score++
      }
    })
    return score
  }

  // If there are no questions, show a message
  if (!questions || questions.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6 text-center">
          <p className="py-8 text-muted-foreground">This quiz doesn't have any questions yet.</p>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100

  if (isSubmitted) {
    const score = calculateScore()
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-4">
              <Check className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
            <p className="text-muted-foreground mb-6">
              You scored {score} out of {questions.length}
            </p>
            <div className="mb-8">
              <div className="relative h-24 w-24 mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round((score / questions.length) * 100)}%</span>
                </div>
                <svg className="h-24 w-24" viewBox="0 0 100 100">
                  <circle
                    className="text-muted-foreground/20"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary"
                    strokeWidth="10"
                    strokeDasharray={Math.round((score / questions.length) * 251.2)}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setCurrentQuestion(0)
                  setSelectedAnswers({})
                  setIsSubmitted(false)
                }}
              >
                Try Again
              </Button>
              <Button variant="outline">Share Results</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestionData = questions[currentQuestion]
  const options = currentQuestionData?.options || []

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{currentQuestionData?.question_text || "No question text"}</h2>

          <RadioGroup
            value={selectedAnswers[currentQuestion] || ""}
            onValueChange={handleAnswerSelect}
            className="space-y-3"
          >
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-normal">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestion]}>
            {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
            {currentQuestion < questions.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

