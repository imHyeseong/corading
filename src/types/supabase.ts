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
      coins: {
        Row: {
          id: number
          status: boolean
          symbol: string
        }
        Insert: {
          id?: number
          status?: boolean
          symbol: string
        }
        Update: {
          id?: number
          status?: boolean
          symbol?: string
        }
        Relationships: []
      }
      markets: {
        Row: {
          country: string
          id: number
          market: string
          status: boolean
        }
        Insert: {
          country: string
          id?: number
          market: string
          status?: boolean
        }
        Update: {
          country?: string
          id?: number
          market?: string
          status?: boolean
        }
        Relationships: []
      }
      tx_gimp: {
        Row: {
          coin: string
          created_at: string
          entry_tether: number
          exit_tether: number | null
          id: number
          intl_market: string
          kor_market: string
          qty: number
          user_id: number
        }
        Insert: {
          coin: string
          created_at?: string
          entry_tether: number
          exit_tether?: number | null
          id?: number
          intl_market: string
          kor_market: string
          qty: number
          user_id: number
        }
        Update: {
          coin?: string
          created_at?: string
          entry_tether?: number
          exit_tether?: number | null
          id?: number
          intl_market?: string
          kor_market?: string
          qty?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tx_gimp_coin_fkey"
            columns: ["coin"]
            isOneToOne: false
            referencedRelation: "coins"
            referencedColumns: ["symbol"]
          },
          {
            foreignKeyName: "tx_gimp_intl_market_fkey"
            columns: ["intl_market"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["market"]
          },
          {
            foreignKeyName: "tx_gimp_kor_market_fkey"
            columns: ["kor_market"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["market"]
          },
          {
            foreignKeyName: "tx_gimp_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api: {
        Row: {
          access: string
          created_at: string
          expire_at: string | null
          id: number
          market: string
          secret: string
          uid: string | null
          user_id: number
        }
        Insert: {
          access: string
          created_at?: string
          expire_at?: string | null
          id?: number
          market: string
          secret: string
          uid?: string | null
          user_id: number
        }
        Update: {
          access?: string
          created_at?: string
          expire_at?: string | null
          id?: number
          market?: string
          secret?: string
          uid?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_api_market_fkey"
            columns: ["market"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["market"]
          },
          {
            foreignKeyName: "user_api_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
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
