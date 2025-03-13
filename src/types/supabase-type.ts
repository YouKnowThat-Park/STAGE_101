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
      actor: {
        Row: {
          affiliation: string
          created_at: string
          id: string
          name: string
          theaters_id: number
        }
        Insert: {
          affiliation: string
          created_at?: string
          id: string
          name: string
          theaters_id: number
        }
        Update: {
          affiliation?: string
          created_at?: string
          id?: string
          name?: string
          theaters_id?: number
        }
        Relationships: []
      }
      admin: {
        Row: {
          created_at: string
          id: string
          theater_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          theater_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          theater_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cart: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
          point: number
          quantity: number
          shop_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          name: string
          point: number
          quantity: number
          shop_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          point?: number
          quantity?: number
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shop"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_history: {
        Row: {
          created_at: string
          id: string
          payment_key: string
          quantity: number
          status: boolean
          total_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_key?: string
          quantity: number
          status?: boolean
          total_price: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_key?: string
          quantity?: number
          status?: boolean
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      concession_menu: {
        Row: {
          category: string
          concession_id: number
          created_at: string
          description: string | null
          id: string
          image_url: string
          name: string
          price: number
        }
        Insert: {
          category: string
          concession_id: number
          created_at?: string
          description?: string | null
          id: string
          image_url: string
          name: string
          price: number
        }
        Update: {
          category?: string
          concession_id?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      concession_stand: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          image_url: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          theater_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          message: string
          theater_id?: string | null
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          theater_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_key: string
          payment_method: string
          point_earned: number | null
          reservation_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_key: string
          payment_method: string
          point_earned?: number | null
          reservation_id?: string
          status: string
          user_id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_key?: string
          payment_method?: string
          point_earned?: number | null
          reservation_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      qna: {
        Row: {
          created_at: string
          id: string
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qna_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_sessions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          qr_token: string
          reservation_id: string
          theater_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          qr_token?: string
          reservation_id?: string
          theater_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          qr_token?: string
          reservation_id?: string
          theater_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_sessions_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string
          id: string
          seat_number: string
          status: string
          theater_id: string
          total_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          seat_number: string
          status: string
          theater_id?: string
          total_price: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          seat_number?: string
          status?: string
          theater_id?: string
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          dislike_count: number | null
          id: string
          like_count: number | null
          theater_id: string
          type: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          dislike_count?: number | null
          id?: string
          like_count?: number | null
          theater_id?: string
          type: string
          user_id?: string
        }
        Update: {
          comment?: string
          created_at?: string
          dislike_count?: number | null
          id?: string
          like_count?: number | null
          theater_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rooftop_bar: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          image_url: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      rooftop_menu: {
        Row: {
          bar_id: number
          category: string
          created_at: string
          id: string
          image_url: string
          name: string
          price: number
        }
        Insert: {
          bar_id: number
          category: string
          created_at?: string
          id: string
          image_url: string
          name: string
          price: number
        }
        Update: {
          bar_id?: number
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      shop: {
        Row: {
          description: string
          edition: boolean | null
          id: string
          image_url: string
          name: string
          point: number
        }
        Insert: {
          description: string
          edition?: boolean | null
          id?: string
          image_url: string
          name: string
          point: number
        }
        Update: {
          description?: string
          edition?: boolean | null
          id?: string
          image_url?: string
          name?: string
          point?: number
        }
        Relationships: []
      }
      theaters: {
        Row: {
          created_at: string
          day_of_week: string
          description: string
          id: string
          image_url: Json
          main_img: string
          name: string
          price: number
          screening_date: string
          show_time: string
          status: boolean
          total_time: number
          type: string
          video_url: Json
        }
        Insert: {
          created_at?: string
          day_of_week: string
          description: string
          id?: string
          image_url: Json
          main_img: string
          name: string
          price: number
          screening_date: string
          show_time: string
          status: boolean
          total_time: number
          type: string
          video_url: Json
        }
        Update: {
          created_at?: string
          day_of_week?: string
          description?: string
          id?: string
          image_url?: Json
          main_img?: string
          name?: string
          price?: number
          screening_date?: string
          show_time?: string
          status?: boolean
          total_time?: number
          type?: string
          video_url?: Json
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          nickname: string
          phone: string
          point: number | null
          profile_img: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          nickname: string
          phone: string
          point?: number | null
          profile_img?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          nickname?: string
          phone?: string
          point?: number | null
          profile_img?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_cart_quantity: {
        Args: {
          p_user_id: string
          p_shop_id: string
        }
        Returns: undefined
      }
      insert_payment_if_not_exists: {
        Args: {
          p_id: string
          p_user_id: string
          p_reservation_id: string
          p_amount: number
          p_status: string
          p_payment_key: string
          p_payment_method: string
        }
        Returns: undefined
      }
      process_reservation: {
        Args: {
          seat_numbers: string[]
          theater_id: string
          user_id: string
          total_price: number
        }
        Returns: undefined
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
