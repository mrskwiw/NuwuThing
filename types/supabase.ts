export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          email: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          email?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          options: Json
          correct_answer: string
          order: number
          created_at: string | null
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          options: Json
          correct_answer: string
          order: number
          created_at?: string | null
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          options?: Json
          correct_answer?: string
          order?: number
          created_at?: string | null
        }
      }
      quizzes: {
        Row: {
          id: string
          title: string
          description: string | null
          is_public: boolean | null
          created_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          is_public?: boolean | null
          created_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          is_public?: boolean | null
          created_at?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Quiz = Database["public"]["Tables"]["quizzes"]["Row"]
export type Question = Database["public"]["Tables"]["questions"]["Row"]

export type QuizWithQuestions = Quiz & {
  questions: Question[]
}

