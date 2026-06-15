export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          attendees: number
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          end_time: string
          event_date: string
          event_type: string
          id: string
          notes: string | null
          quoted_price: number | null
          rejection_reason: string | null
          salon_id: string
          selected_services: Json
          start_time: string
          status: string
          total_price: number | null
          user_id: string
        }
        Insert: {
          attendees: number
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          end_time: string
          event_date: string
          event_type: string
          id?: string
          notes?: string | null
          quoted_price?: number | null
          rejection_reason?: string | null
          salon_id: string
          selected_services?: Json
          start_time: string
          status?: string
          total_price?: number | null
          user_id: string
        }
        Update: {
          attendees?: number
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          end_time?: string
          event_date?: string
          event_type?: string
          id?: string
          notes?: string | null
          quoted_price?: number | null
          rejection_reason?: string | null
          salon_id?: string
          selected_services?: Json
          start_time?: string
          status?: string
          total_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salones"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_availability_blocks: {
        Row: {
          created_at: string
          date: string
          id: string
          reason: string | null
          salon_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          reason?: string | null
          salon_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          reason?: string | null
          salon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_availability_blocks_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salones"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_services: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number | null
          salon_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price?: number | null
          salon_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number | null
          salon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_services_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salones"
            referencedColumns: ["id"]
          },
        ]
      }
      salones: {
        Row: {
          address: string
          amenities: string[]
          availability_status: string
          capacity: number
          created_at: string
          description: string | null
          event_types: string[]
          host_id: string | null
          id: string
          images: string[]
          is_featured: boolean
          is_verified: boolean
          location: string
          name: string
          price_max: number | null
          price_min: number | null
          price_per_hour: number | null
          price_type: string
          rating_count: number | null
          rating_value: number | null
          rent_time_hours: number
        }
        Insert: {
          address: string
          amenities?: string[]
          availability_status?: string
          capacity: number
          created_at?: string
          description?: string | null
          event_types?: string[]
          host_id?: string | null
          id?: string
          images?: string[]
          is_featured?: boolean
          is_verified?: boolean
          location: string
          name: string
          price_max?: number | null
          price_min?: number | null
          price_per_hour?: number | null
          price_type?: string
          rating_count?: number | null
          rating_value?: number | null
          rent_time_hours?: number
        }
        Update: {
          address?: string
          amenities?: string[]
          availability_status?: string
          capacity?: number
          created_at?: string
          description?: string | null
          event_types?: string[]
          host_id?: string | null
          id?: string
          images?: string[]
          is_featured?: boolean
          is_verified?: boolean
          location?: string
          name?: string
          price_max?: number | null
          price_min?: number | null
          price_per_hour?: number | null
          price_type?: string
          rating_count?: number | null
          rating_value?: number | null
          rent_time_hours?: number
        }
        Relationships: []
      }
      salon_subscriptions: {
        Row: {
          amount_monthly: number
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          host_id: string
          id: string
          mercadopago_subscription_id: string | null
          plan_id: string
          started_at: string | null
          status: string
        }
        Insert: {
          amount_monthly?: number
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          host_id: string
          id?: string
          mercadopago_subscription_id?: string | null
          plan_id?: string
          started_at?: string | null
          status: string
        }
        Update: {
          amount_monthly?: number
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          host_id?: string
          id?: string
          mercadopago_subscription_id?: string | null
          plan_id?: string
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

