"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2, Plus, GripVertical, Image } from "lucide-react"

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

interface QuestionEditorProps {
  questionNumber: number
  question: Question
  onChange: (question: Question) => void
}

export function QuestionEditor({ questionNumber, question, onChange }: QuestionEditorProps) {
  const [questionText, setQuestionText] = useState(question.text)
  const [options, setOptions] = useState(question.options)
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer)

  useEffect(() => {
    onChange({
      ...question,
      text: questionText,
      options,
      correctAnswer,
    })
  }, [questionText, options, correctAnswer])

  const addOption = () => {
    const newOption = {
      id: `${options.length + 1}`,
      text: "",
      isCorrect: false,
    }
    setOptions([...options, newOption])
  }

  const removeOption = (optionId: string) => {
    if (options.length <= 2) return // Maintain at least 2 options

    const newOptions = options.filter((option) => option.id !== optionId)
    setOptions(newOptions)

    // If we're removing the correct answer, set the first option as correct
    if (correctAnswer === optionId) {
      setCorrectAnswer(newOptions[0].id)
      setOptions(
        newOptions.map((option, idx) => ({
          ...option,
          isCorrect: idx === 0,
        })),
      )
    }
  }

  const setCorrectAnswerOption = (optionId: string) => {
    setCorrectAnswer(optionId)
    setOptions(
      options.map((option) => ({
        ...option,
        isCorrect: option.id === optionId,
      })),
    )
  }

  const updateOptionText = (optionId: string, text: string) => {
    setOptions(options.map((option) => (option.id === optionId ? { ...option, text } : option)))
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
            {questionNumber}
          </div>
          <Input
            placeholder="Enter your question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon" title="Add image">
            <Image className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 pl-10">
          <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswerOption}>
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Input
                  placeholder={`Option ${option.id}`}
                  value={option.text}
                  onChange={(e) => updateOptionText(option.id, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(option.id)}
                  disabled={options.length <= 2}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </RadioGroup>

          <Button variant="outline" size="sm" onClick={addOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

