export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Menu = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  line_user_id: string;
  role: "user" | "assistant";
  message: string;
  created_at: string;
};

export type UnansweredQuestion = {
  id: string;
  question: string;
  line_user_id: string;
  category: string | null;
  confidence: "high" | "medium" | "low" | null;
  status: "pending" | "resolved";
  memo: string | null;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  status: "draft" | "sent";
  created_at: string;
  sent_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      faqs: {
        Row: Faq;
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Faq>;
        Relationships: [];
      };
      menus: {
        Row: Menu;
        Insert: {
          id?: string;
          name: string;
          price: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Menu>;
        Relationships: [];
      };
      conversations: {
        Row: Conversation;
        Insert: {
          id?: string;
          line_user_id: string;
          role: "user" | "assistant";
          message: string;
          created_at?: string;
        };
        Update: Partial<Conversation>;
        Relationships: [];
      };
      unanswered_questions: {
        Row: UnansweredQuestion;
        Insert: {
          id?: string;
          question: string;
          line_user_id: string;
          category?: string | null;
          confidence?: "high" | "medium" | "low" | null;
          status?: "pending" | "resolved";
          memo?: string | null;
          created_at?: string;
        };
        Update: Partial<UnansweredQuestion>;
        Relationships: [];
      };
      announcements: {
        Row: Announcement;
        Insert: {
          id?: string;
          title: string;
          body: string;
          status?: "draft" | "sent";
          created_at?: string;
          sent_at?: string | null;
        };
        Update: Partial<Announcement>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
