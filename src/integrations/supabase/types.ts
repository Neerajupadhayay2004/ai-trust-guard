export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      detection_rules: {
        Row: {
          created_at: string
          created_by: string | null
          detection_type: Database["public"]["Enums"]["detection_type"]
          enabled: boolean
          id: string
          rule_name: string
          threshold: number
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          detection_type: Database["public"]["Enums"]["detection_type"]
          enabled?: boolean
          id?: string
          rule_name: string
          threshold?: number
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          detection_type?: Database["public"]["Enums"]["detection_type"]
          enabled?: boolean
          id?: string
          rule_name?: string
          threshold?: number
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      flagged_patterns: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          pattern: string
          pattern_type: Database["public"]["Enums"]["detection_type"]
          severity: Database["public"]["Enums"]["risk_level"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          pattern: string
          pattern_type: Database["public"]["Enums"]["detection_type"]
          severity: Database["public"]["Enums"]["risk_level"]
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          pattern?: string
          pattern_type?: Database["public"]["Enums"]["detection_type"]
          severity?: Database["public"]["Enums"]["risk_level"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          cyber_peace_mode: boolean
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cyber_peace_mode?: boolean
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cyber_peace_mode?: boolean
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scan_logs: {
        Row: {
          created_at: string
          cyber_peace_blocked: boolean
          detection_results: Json
          explanation: string | null
          flagged_content: string[] | null
          id: string
          input_text: string
          processing_time_ms: number | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          trust_score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          cyber_peace_blocked?: boolean
          detection_results?: Json
          explanation?: string | null
          flagged_content?: string[] | null
          id?: string
          input_text: string
          processing_time_ms?: number | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          trust_score: number
          user_id: string
        }
        Update: {
          created_at?: string
          cyber_peace_blocked?: boolean
          detection_results?: Json
          explanation?: string | null
          flagged_content?: string[] | null
          id?: string
          input_text?: string
          processing_time_ms?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          trust_score?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      detection_type:
        | "toxicity"
        | "bias"
        | "hallucination"
        | "prompt_injection"
        | "misinformation"
        | "harmful_content"
      risk_level: "safe" | "low" | "medium" | "high" | "critical"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      detection_type: [
        "toxicity",
        "bias",
        "hallucination",
        "prompt_injection",
        "misinformation",
        "harmful_content",
      ],
      risk_level: ["safe", "low", "medium", "high", "critical"],
      user_role: ["user", "admin"],
    },
  },
} as const
