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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      funeral_plans: {
        Row: {
          balance: number
          created_at: string
          dependants_count: number
          id: string
          member_id: string | null
          monthly_amount: number
          plan_name: string
          status: string
        }
        Insert: {
          balance?: number
          created_at?: string
          dependants_count?: number
          id?: string
          member_id?: string | null
          monthly_amount?: number
          plan_name: string
          status?: string
        }
        Update: {
          balance?: number
          created_at?: string
          dependants_count?: number
          id?: string
          member_id?: string | null
          monthly_amount?: number
          plan_name?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "funeral_plans_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          first_names: string | null
          id: string
          id_number: string | null
          initials: string | null
          member_number: string | null
          municipality: string | null
          notes: string | null
          phone: string | null
          province: string | null
          route_id: string | null
          route_taxi_line: string | null
          status: string
          surname: string
          updated_at: string
          vehicle_count: number
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_names?: string | null
          id?: string
          id_number?: string | null
          initials?: string | null
          member_number?: string | null
          municipality?: string | null
          notes?: string | null
          phone?: string | null
          province?: string | null
          route_id?: string | null
          route_taxi_line?: string | null
          status?: string
          surname: string
          updated_at?: string
          vehicle_count?: number
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_names?: string | null
          id?: string
          id_number?: string | null
          initials?: string | null
          member_number?: string | null
          municipality?: string | null
          notes?: string | null
          phone?: string | null
          province?: string | null
          route_id?: string | null
          route_taxi_line?: string | null
          status?: string
          surname?: string
          updated_at?: string
          vehicle_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "members_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          member_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          received_by: string | null
          reference_number: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          member_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_type?: string
          received_by?: string | null
          reference_number?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          member_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payment_type?: string
          received_by?: string | null
          reference_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      penalties: {
        Row: {
          amount: number
          amount_paid: number
          created_at: string
          id: string
          member_id: string | null
          reason: string
          status: string
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          amount_paid?: number
          created_at?: string
          id?: string
          member_id?: string | null
          reason: string
          status?: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          amount_paid?: number
          created_at?: string
          id?: string
          member_id?: string | null
          reason?: string
          status?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "penalties_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "penalties_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          amount: number
          created_at: string
          id: string
          member_id: string | null
          payment_id: string | null
          payment_method: string
          payment_type: string
          receipt_date: string
          receipt_number: string
          received_from: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          member_id?: string | null
          payment_id?: string | null
          payment_method?: string
          payment_type?: string
          receipt_date?: string
          receipt_number: string
          received_from?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          member_id?: string | null
          payment_id?: string | null
          payment_method?: string
          payment_type?: string
          receipt_date?: string
          receipt_number?: string
          received_from?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          created_at: string
          destination: string | null
          fee_amount: number
          id: string
          is_active: boolean
          origin: string | null
          route_code: string | null
          route_name: string
        }
        Insert: {
          created_at?: string
          destination?: string | null
          fee_amount?: number
          id?: string
          is_active?: boolean
          origin?: string | null
          route_code?: string | null
          route_name: string
        }
        Update: {
          created_at?: string
          destination?: string | null
          fee_amount?: number
          id?: string
          is_active?: boolean
          origin?: string | null
          route_code?: string | null
          route_name?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string
          id: string
          make: string | null
          member_id: string | null
          model: string | null
          permit_number: string | null
          registration_number: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          make?: string | null
          member_id?: string | null
          model?: string | null
          permit_number?: string | null
          registration_number: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          make?: string | null
          member_id?: string | null
          model?: string | null
          permit_number?: string | null
          registration_number?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
