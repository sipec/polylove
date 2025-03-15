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
          visibility: string
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
          visibility?: string
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
          visibility?: string
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
        Args: {
          lat1: number
          lon1: number
          lat2: number
          lon2: number
        }
        Returns: number
      }
      can_access_private_messages: {
        Args: {
          channel_id: number
          user_id: string
        }
        Returns: boolean
      }
      firebase_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_average_rating: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      get_compatibility_questions_with_answer_count: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      get_love_question_answers_and_lovers: {
        Args: {
          p_question_id: number
        }
        Returns: Record<string, unknown>[]
      }
      is_admin:
        | {
            Args: Record<PropertyKey, never>
            Returns: boolean
          }
        | {
            Args: {
              user_id: string
            }
            Returns: boolean
          }
      millis_interval: {
        Args: {
          start_millis: number
          end_millis: number
        }
        Returns: unknown
      }
      millis_to_ts: {
        Args: {
          millis: number
        }
        Returns: string
      }
      random_alphanumeric: {
        Args: {
          length: number
        }
        Returns: string
      }
      to_jsonb: {
        Args: {
          '': Json
        }
        Returns: Json
      }
      ts_to_millis:
        | {
            Args: {
              ts: string
            }
            Returns: number
          }
        | {
            Args: {
              ts: string
            }
            Returns: number
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never
