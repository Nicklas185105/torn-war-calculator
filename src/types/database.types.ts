export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      factions: {
        Row: {
          created_at: string | null
          faction_id: string
          id: number
          leader_id: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          faction_id: string
          id?: number
          leader_id?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          faction_id?: string
          id?: number
          leader_id?: string | null
          name?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: number
          subscription_id: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          subscription_id?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          subscription_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          ends: string
          faction_id: string
          id: number
          payment: number
        }
        Insert: {
          ends: string
          faction_id: string
          id?: number
          payment: number
        }
        Update: {
          ends?: string
          faction_id?: string
          id?: number
          payment?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_faction_id_fkey"
            columns: ["faction_id"]
            isOneToOne: false
            referencedRelation: "factions"
            referencedColumns: ["faction_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          api_key: string | null
          clerk_id: string
          created_at: string | null
          faction_id: string | null
          is_admin: boolean
          name: string | null
          role: string
          torn_user_id: string
          user_id: string
        }
        Insert: {
          api_key?: string | null
          clerk_id: string
          created_at?: string | null
          faction_id?: string | null
          is_admin?: boolean
          name?: string | null
          role?: string
          torn_user_id: string
          user_id?: string
        }
        Update: {
          api_key?: string | null
          clerk_id?: string
          created_at?: string | null
          faction_id?: string | null
          is_admin?: boolean
          name?: string | null
          role?: string
          torn_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      war_reports: {
        Row: {
          created_at: string
          data: Json
          faction_id: string
          id: number
          war_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          faction_id: string
          id?: number
          war_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          faction_id?: string
          id?: number
          war_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "war_reports_faction_id_fkey"
            columns: ["faction_id"]
            isOneToOne: false
            referencedRelation: "factions"
            referencedColumns: ["faction_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
