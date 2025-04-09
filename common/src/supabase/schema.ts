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
      love_answers: {
        Row: {
          created_time: string
          creator_id: string
          free_response: string | null
          id: number
          integer: number | null
          multiple_choice: number | null
          question_id: number
        }
        Insert: {
          created_time?: string
          creator_id: string
          free_response?: string | null
          id?: never
          integer?: number | null
          multiple_choice?: number | null
          question_id: number
        }
        Update: {
          created_time?: string
          creator_id?: string
          free_response?: string | null
          id?: never
          integer?: number | null
          multiple_choice?: number | null
          question_id?: number
        }
        Relationships: []
      }
      love_compatibility_answers: {
        Row: {
          created_time: string
          creator_id: string
          explanation: string | null
          id: number
          importance: number
          multiple_choice: number
          pref_choices: number[]
          question_id: number
        }
        Insert: {
          created_time?: string
          creator_id: string
          explanation?: string | null
          id?: never
          importance: number
          multiple_choice: number
          pref_choices: number[]
          question_id: number
        }
        Update: {
          created_time?: string
          creator_id?: string
          explanation?: string | null
          id?: never
          importance?: number
          multiple_choice?: number
          pref_choices?: number[]
          question_id?: number
        }
        Relationships: []
      }
      love_likes: {
        Row: {
          created_time: string
          creator_id: string
          like_id: string
          target_id: string
        }
        Insert: {
          created_time?: string
          creator_id: string
          like_id?: string
          target_id: string
        }
        Update: {
          created_time?: string
          creator_id?: string
          like_id?: string
          target_id?: string
        }
        Relationships: []
      }
      love_questions: {
        Row: {
          answer_type: string
          created_time: string
          creator_id: string
          id: number
          importance_score: number
          multiple_choice_options: Json | null
          question: string
        }
        Insert: {
          answer_type?: string
          created_time?: string
          creator_id: string
          id?: never
          importance_score?: number
          multiple_choice_options?: Json | null
          question: string
        }
        Update: {
          answer_type?: string
          created_time?: string
          creator_id?: string
          id?: never
          importance_score?: number
          multiple_choice_options?: Json | null
          question?: string
        }
        Relationships: []
      }
      love_ships: {
        Row: {
          created_time: string
          creator_id: string
          ship_id: string
          target1_id: string
          target2_id: string
        }
        Insert: {
          created_time?: string
          creator_id: string
          ship_id?: string
          target1_id: string
          target2_id: string
        }
        Update: {
          created_time?: string
          creator_id?: string
          ship_id?: string
          target1_id?: string
          target2_id?: string
        }
        Relationships: []
      }
      love_stars: {
        Row: {
          created_time: string
          creator_id: string
          star_id: string
          target_id: string
        }
        Insert: {
          created_time?: string
          creator_id: string
          star_id?: string
          target_id: string
        }
        Update: {
          created_time?: string
          creator_id?: string
          star_id?: string
          target_id?: string
        }
        Relationships: []
      }
      love_waitlist: {
        Row: {
          created_time: string
          email: string
          id: number
        }
        Insert: {
          created_time?: string
          email: string
          id?: never
        }
        Update: {
          created_time?: string
          email?: string
          id?: never
        }
        Relationships: []
      }
      lover_comments: {
        Row: {
          content: Json
          created_time: string
          hidden: boolean
          id: number
          on_user_id: string
          reply_to_comment_id: number | null
          user_avatar_url: string
          user_id: string
          user_name: string
          user_username: string
        }
        Insert: {
          content: Json
          created_time?: string
          hidden?: boolean
          id?: never
          on_user_id: string
          reply_to_comment_id?: number | null
          user_avatar_url: string
          user_id: string
          user_name: string
          user_username: string
        }
        Update: {
          content?: Json
          created_time?: string
          hidden?: boolean
          id?: never
          on_user_id?: string
          reply_to_comment_id?: number | null
          user_avatar_url?: string
          user_id?: string
          user_name?: string
          user_username?: string
        }
        Relationships: []
      }
      lovers: {
        Row: {
          age: number
          bio: Json | null
          born_in_location: string | null
          city: string
          city_latitude: number | null
          city_longitude: number | null
          comments_enabled: boolean
          company: string | null
          country: string | null
          created_time: string
          drinks_per_month: number | null
          education_level: string | null
          ethnicity: string[] | null
          gender: string
          geodb_city_id: string | null
          has_kids: number | null
          height_in_inches: number | null
          id: number
          is_smoker: boolean | null
          is_vegetarian_or_vegan: boolean | null
          last_online_time: string
          looking_for_matches: boolean
          messaging_status: string
          occupation: string | null
          occupation_title: string | null
          photo_urls: string[] | null
          pinned_url: string | null
          political_beliefs: string[] | null
          pref_age_max: number
          pref_age_min: number
          pref_gender: string[]
          pref_relation_styles: string[]
          referred_by_username: string | null
          region_code: string | null
          religious_belief_strength: number | null
          religious_beliefs: string | null
          twitter: string | null
          university: string | null
          user_id: string
          visibility: Database['public']['Enums']['lover_visibility']
          wants_kids_strength: number
          website: string | null
        }
        Insert: {
          age?: number
          bio?: Json | null
          born_in_location?: string | null
          city: string
          city_latitude?: number | null
          city_longitude?: number | null
          comments_enabled?: boolean
          company?: string | null
          country?: string | null
          created_time?: string
          drinks_per_month?: number | null
          education_level?: string | null
          ethnicity?: string[] | null
          gender: string
          geodb_city_id?: string | null
          has_kids?: number | null
          height_in_inches?: number | null
          id?: never
          is_smoker?: boolean | null
          is_vegetarian_or_vegan?: boolean | null
          last_online_time?: string
          looking_for_matches?: boolean
          messaging_status?: string
          occupation?: string | null
          occupation_title?: string | null
          photo_urls?: string[] | null
          pinned_url?: string | null
          political_beliefs?: string[] | null
          pref_age_max?: number
          pref_age_min?: number
          pref_gender: string[]
          pref_relation_styles: string[]
          referred_by_username?: string | null
          region_code?: string | null
          religious_belief_strength?: number | null
          religious_beliefs?: string | null
          twitter?: string | null
          university?: string | null
          user_id: string
          visibility?: Database['public']['Enums']['lover_visibility']
          wants_kids_strength?: number
          website?: string | null
        }
        Update: {
          age?: number
          bio?: Json | null
          born_in_location?: string | null
          city?: string
          city_latitude?: number | null
          city_longitude?: number | null
          comments_enabled?: boolean
          company?: string | null
          country?: string | null
          created_time?: string
          drinks_per_month?: number | null
          education_level?: string | null
          ethnicity?: string[] | null
          gender?: string
          geodb_city_id?: string | null
          has_kids?: number | null
          height_in_inches?: number | null
          id?: never
          is_smoker?: boolean | null
          is_vegetarian_or_vegan?: boolean | null
          last_online_time?: string
          looking_for_matches?: boolean
          messaging_status?: string
          occupation?: string | null
          occupation_title?: string | null
          photo_urls?: string[] | null
          pinned_url?: string | null
          political_beliefs?: string[] | null
          pref_age_max?: number
          pref_age_min?: number
          pref_gender?: string[]
          pref_relation_styles?: string[]
          referred_by_username?: string | null
          region_code?: string | null
          religious_belief_strength?: number | null
          religious_beliefs?: string | null
          twitter?: string | null
          university?: string | null
          user_id?: string
          visibility?: Database['public']['Enums']['lover_visibility']
          wants_kids_strength?: number
          website?: string | null
        }
        Relationships: []
      }
      private_user_message_channel_members: {
        Row: {
          channel_id: number
          created_time: string
          id: number
          notify_after_time: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          channel_id: number
          created_time?: string
          id?: never
          notify_after_time?: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          channel_id?: number
          created_time?: string
          id?: never
          notify_after_time?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'channel_id_fkey'
            columns: ['channel_id']
            isOneToOne: false
            referencedRelation: 'private_user_message_channels'
            referencedColumns: ['id']
          }
        ]
      }
      private_user_message_channels: {
        Row: {
          created_time: string
          id: number
          last_updated_time: string
          title: string | null
        }
        Insert: {
          created_time?: string
          id?: never
          last_updated_time?: string
          title?: string | null
        }
        Update: {
          created_time?: string
          id?: never
          last_updated_time?: string
          title?: string | null
        }
        Relationships: []
      }
      private_user_messages: {
        Row: {
          channel_id: number
          content: Json
          created_time: string
          id: number
          old_id: number | null
          user_id: string
          visibility: string
        }
        Insert: {
          channel_id: number
          content: Json
          created_time?: string
          id?: never
          old_id?: number | null
          user_id: string
          visibility?: string
        }
        Update: {
          channel_id?: number
          content?: Json
          created_time?: string
          id?: never
          old_id?: number | null
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: 'private_user_messages_channel_id_fkey'
            columns: ['channel_id']
            isOneToOne: false
            referencedRelation: 'private_user_message_channels'
            referencedColumns: ['id']
          }
        ]
      }
      private_user_seen_message_channels: {
        Row: {
          channel_id: number
          created_time: string
          id: number
          user_id: string
        }
        Insert: {
          channel_id: number
          created_time?: string
          id?: never
          user_id: string
        }
        Update: {
          channel_id?: number
          created_time?: string
          id?: never
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'channel_id_fkey'
            columns: ['channel_id']
            isOneToOne: false
            referencedRelation: 'private_user_message_channels'
            referencedColumns: ['id']
          }
        ]
      }
      private_users: {
        Row: {
          data: Json
          id: string
        }
        Insert: {
          data: Json
          id: string
        }
        Update: {
          data?: Json
          id?: string
        }
        Relationships: []
      }
      temp_users: {
        Row: {
          created_time: string | null
          id: string | null
          name: string | null
          private_user_data: Json | null
          user_data: Json | null
          username: string | null
        }
        Insert: {
          created_time?: string | null
          id?: string | null
          name?: string | null
          private_user_data?: Json | null
          user_data?: Json | null
          username?: string | null
        }
        Update: {
          created_time?: string | null
          id?: string | null
          name?: string | null
          private_user_data?: Json | null
          user_data?: Json | null
          username?: string | null
        }
        Relationships: []
      }
      user_events: {
        Row: {
          ad_id: string | null
          comment_id: string | null
          contract_id: string | null
          data: Json
          id: number
          name: string
          ts: string
          user_id: string | null
        }
        Insert: {
          ad_id?: string | null
          comment_id?: string | null
          contract_id?: string | null
          data: Json
          id?: never
          name: string
          ts?: string
          user_id?: string | null
        }
        Update: {
          ad_id?: string | null
          comment_id?: string | null
          contract_id?: string | null
          data?: Json
          id?: never
          name?: string
          ts?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          data: Json
          notification_id: string
          user_id: string
        }
        Insert: {
          data: Json
          notification_id: string
          user_id: string
        }
        Update: {
          data?: Json
          notification_id?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_time: string
          data: Json
          id: string
          name: string
          name_username_vector: unknown | null
          username: string
        }
        Insert: {
          created_time?: string
          data: Json
          id?: string
          name: string
          name_username_vector?: unknown | null
          username: string
        }
        Update: {
          created_time?: string
          data?: Json
          id?: string
          name?: string
          name_username_vector?: unknown | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_earth_distance_km: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      can_access_private_messages: {
        Args: { channel_id: number; user_id: string }
        Returns: boolean
      }
      firebase_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_average_rating: {
        Args: { user_id: string }
        Returns: number
      }
      get_compatibility_questions_with_answer_count: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      get_love_question_answers_and_lovers: {
        Args: { p_question_id: number }
        Returns: Record<string, unknown>[]
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      millis_interval: {
        Args: { start_millis: number; end_millis: number }
        Returns: unknown
      }
      millis_to_ts: {
        Args: { millis: number }
        Returns: string
      }
      random_alphanumeric: {
        Args: { length: number }
        Returns: string
      }
      to_jsonb: {
        Args: { '': Json }
        Returns: Json
      }
      ts_to_millis: {
        Args: { ts: string } | { ts: string }
        Returns: number
      }
    }
    Enums: {
      lover_visibility: 'public' | 'member'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      lover_visibility: ['public', 'member'],
    },
  },
} as const
