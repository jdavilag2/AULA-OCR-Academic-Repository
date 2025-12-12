export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          description: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_by?: string
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          subject_id: string
          user_id: string
          title: string
          description: string
          image_url: string
          extracted_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          user_id: string
          title: string
          description?: string
          image_url: string
          extracted_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          user_id?: string
          title?: string
          description?: string
          image_url?: string
          extracted_text?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
