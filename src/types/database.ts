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
      chat_threads: {
        Row: {
          id: string
          tenant_id: string
          student_id: string
          created_at: string
          last_message_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          student_id: string
          created_at?: string
          last_message_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          student_id?: string
          created_at?: string
          last_message_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_threads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_threads_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          media_type: string | null
          media_url: string | null
          pinned: boolean | null
          published_at: string | null
          tenant_id: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          pinned?: boolean | null
          published_at?: string | null
          tenant_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          pinned?: boolean | null
          published_at?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      badges_earned: {
        Row: {
          badge_key: string
          earned_at: string
          id: string
          metadata: Json
          tenant_id: string
          user_id: string
        }
        Insert: {
          badge_key: string
          earned_at?: string
          id?: string
          metadata?: Json
          tenant_id: string
          user_id: string
        }
        Update: {
          badge_key?: string
          earned_at?: string
          id?: string
          metadata?: Json
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_earned_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "badges_earned_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anamneses: {
        Row: {
          activity_level: string | null
          allergies: string | null
          conditions: string | null
          created_at: string
          family_history: string | null
          goals: string | null
          has_bone_or_joint_problem: boolean | null
          has_chest_pain: boolean | null
          has_dizziness: boolean | null
          has_heart_condition: boolean | null
          id: string
          injuries: string | null
          is_pregnant: boolean | null
          medications: string | null
          notes: string | null
          reviewed_at: string | null
          signed_at: string | null
          smoker: boolean | null
          student_id: string
          surgeries: string | null
          takes_blood_pressure_meds: boolean | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          activity_level?: string | null
          allergies?: string | null
          conditions?: string | null
          created_at?: string
          family_history?: string | null
          goals?: string | null
          has_bone_or_joint_problem?: boolean | null
          has_chest_pain?: boolean | null
          has_dizziness?: boolean | null
          has_heart_condition?: boolean | null
          id?: string
          injuries?: string | null
          is_pregnant?: boolean | null
          medications?: string | null
          notes?: string | null
          reviewed_at?: string | null
          signed_at?: string | null
          smoker?: boolean | null
          student_id: string
          surgeries?: string | null
          takes_blood_pressure_meds?: boolean | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          activity_level?: string | null
          allergies?: string | null
          conditions?: string | null
          created_at?: string
          family_history?: string | null
          goals?: string | null
          has_bone_or_joint_problem?: boolean | null
          has_chest_pain?: boolean | null
          has_dizziness?: boolean | null
          has_heart_condition?: boolean | null
          id?: string
          injuries?: string | null
          is_pregnant?: boolean | null
          medications?: string | null
          notes?: string | null
          reviewed_at?: string | null
          signed_at?: string | null
          smoker?: boolean | null
          student_id?: string
          surgeries?: string | null
          takes_blood_pressure_meds?: boolean | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          arm_cm: number | null
          body_fat_pct: number | null
          calf_cm: number | null
          chest_cm: number | null
          created_at: string
          height_cm: number | null
          hip_cm: number | null
          id: string
          measured_at: string
          measured_by: string | null
          muscle_pct: number | null
          notes: string | null
          student_id: string
          tenant_id: string
          thigh_cm: number | null
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          arm_cm?: number | null
          body_fat_pct?: number | null
          calf_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          height_cm?: number | null
          hip_cm?: number | null
          id?: string
          measured_at?: string
          measured_by?: string | null
          muscle_pct?: number | null
          notes?: string | null
          student_id: string
          tenant_id: string
          thigh_cm?: number | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          arm_cm?: number | null
          body_fat_pct?: number | null
          calf_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          height_cm?: number | null
          hip_cm?: number | null
          id?: string
          measured_at?: string
          measured_by?: string | null
          muscle_pct?: number | null
          notes?: string | null
          student_id?: string
          tenant_id?: string
          thigh_cm?: number | null
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          pose: string | null
          storage_path: string
          student_id: string
          taken_at: string
          tenant_id: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          pose?: string | null
          storage_path: string
          student_id: string
          taken_at?: string
          tenant_id: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          pose?: string | null
          storage_path?: string
          student_id?: string
          taken_at?: string
          tenant_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      community_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reaction: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reaction?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          accepted_at: string
          context: string
          id: string
          ip: string | null
          policy_version: string
          tenant_id: string | null
          terms_version: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          context: string
          id?: string
          ip?: string | null
          policy_version: string
          tenant_id?: string | null
          terms_version: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          context?: string
          id?: string
          ip?: string | null
          policy_version?: string
          tenant_id?: string | null
          terms_version?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_logs: {
        Row: {
          created_at: string | null
          id: string
          load_kg: number | null
          reps_done: number | null
          set_number: number | null
          workout_item_id: string | null
          workout_log_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          load_kg?: number | null
          reps_done?: number | null
          set_number?: number | null
          workout_item_id?: string | null
          workout_log_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          load_kg?: number | null
          reps_done?: number | null
          set_number?: number | null
          workout_item_id?: string | null
          workout_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_workout_item_id_fkey"
            columns: ["workout_item_id"]
            isOneToOne: false
            referencedRelation: "workout_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string | null
          equipment: string | null
          id: string
          instructions: string | null
          is_owner_video: boolean | null
          muscle_group: string | null
          name: string
          tenant_id: string | null
          thumbnail_url: string | null
          video_source: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          is_owner_video?: boolean | null
          muscle_group?: string | null
          name: string
          tenant_id?: string | null
          thumbnail_url?: string | null
          video_source?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          is_owner_video?: boolean | null
          muscle_group?: string | null
          name?: string
          tenant_id?: string | null
          thumbnail_url?: string | null
          video_source?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          created_at: string | null
          email: string | null
          expires_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          tenant_id: string | null
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          tenant_id?: string | null
          token?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          tenant_id?: string | null
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invites_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_events: {
        Row: {
          amount_cents: number | null
          created_at: string
          event_type: string
          id: string
          provider: string
          provider_event_id: string
          raw: Json
          status: string | null
          subscription_id: string | null
          tenant_id: string | null
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          event_type: string
          id?: string
          provider?: string
          provider_event_id: string
          raw: Json
          status?: string | null
          subscription_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          event_type?: string
          id?: string
          provider?: string
          provider_event_id?: string
          raw?: Json
          status?: string | null
          subscription_id?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          last_used_at: string
          p256dh: string
          tenant_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          last_used_at?: string
          p256dh: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          last_used_at?: string
          p256dh?: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean | null
          created_at: string | null
          cta_label: string | null
          description: string | null
          display_order: number | null
          features: string[] | null
          highlight: boolean | null
          id: string
          name: string
          price_label: string | null
          tagline: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          cta_label?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          highlight?: boolean | null
          id?: string
          name: string
          price_label?: string | null
          tagline?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          cta_label?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          highlight?: boolean | null
          id?: string
          name?: string
          price_label?: string | null
          tagline?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plans_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean | null
          asaas_customer_id: string | null
          avatar_url: string | null
          birthdate: string | null
          created_at: string | null
          current_plan_id: string | null
          email: string | null
          full_name: string
          goal: string | null
          id: string
          joined_at: string | null
          observations: string | null
          phone: string | null
          referral_code: string | null
          role: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          asaas_customer_id?: string | null
          avatar_url?: string | null
          birthdate?: string | null
          created_at?: string | null
          current_plan_id?: string | null
          email?: string | null
          full_name: string
          goal?: string | null
          id: string
          joined_at?: string | null
          observations?: string | null
          phone?: string | null
          referral_code?: string | null
          role: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          asaas_customer_id?: string | null
          avatar_url?: string | null
          birthdate?: string | null
          created_at?: string | null
          current_plan_id?: string | null
          email?: string | null
          full_name?: string
          goal?: string | null
          id?: string
          joined_at?: string | null
          observations?: string | null
          phone?: string | null
          referral_code?: string | null
          role?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_plan_id_fkey"
            columns: ["current_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          referred_id: string | null
          referrer_id: string | null
          reward_label: string | null
          rewarded_at: string | null
          status: string
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          referred_id?: string | null
          referrer_id?: string | null
          reward_label?: string | null
          rewarded_at?: string | null
          status?: string
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          referred_id?: string | null
          referrer_id?: string | null
          reward_label?: string | null
          rewarded_at?: string | null
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          id: string
          plan_id: string | null
          provider: string
          provider_subscription_id: string | null
          started_at: string | null
          status: string
          student_id: string
          tenant_id: string
          updated_at: string
          value_cents: number
        }
        Insert: {
          billing_cycle?: string
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string | null
          provider?: string
          provider_subscription_id?: string | null
          started_at?: string | null
          status?: string
          student_id: string
          tenant_id: string
          updated_at?: string
          value_cents: number
        }
        Update: {
          billing_cycle?: string
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_id?: string | null
          provider?: string
          provider_subscription_id?: string | null
          started_at?: string | null
          status?: string
          student_id?: string
          tenant_id?: string
          updated_at?: string
          value_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          active: boolean | null
          banner_url: string | null
          bio: string | null
          brand_color: string | null
          brand_color_dark: string | null
          city: string | null
          consultation_pitch: string | null
          consultation_price: string | null
          created_at: string | null
          cref: string | null
          custom_domain: string | null
          id: string
          instagram_handle: string | null
          logo_url: string | null
          name: string
          slug: string
          tagline: string | null
          updated_at: string | null
          whatsapp_number: string
        }
        Insert: {
          active?: boolean | null
          banner_url?: string | null
          bio?: string | null
          brand_color?: string | null
          brand_color_dark?: string | null
          city?: string | null
          consultation_pitch?: string | null
          consultation_price?: string | null
          created_at?: string | null
          cref?: string | null
          custom_domain?: string | null
          id?: string
          instagram_handle?: string | null
          logo_url?: string | null
          name: string
          slug: string
          tagline?: string | null
          updated_at?: string | null
          whatsapp_number: string
        }
        Update: {
          active?: boolean | null
          banner_url?: string | null
          bio?: string | null
          brand_color?: string | null
          brand_color_dark?: string | null
          city?: string | null
          consultation_pitch?: string | null
          consultation_price?: string | null
          created_at?: string | null
          cref?: string | null
          custom_domain?: string | null
          id?: string
          instagram_handle?: string | null
          logo_url?: string | null
          name?: string
          slug?: string
          tagline?: string | null
          updated_at?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          content: string
          created_at: string | null
          featured: boolean | null
          id: string
          rating: number | null
          tenant_id: string | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          content: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          rating?: number | null
          tenant_id?: string | null
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          content?: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          rating?: number | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_items: {
        Row: {
          created_at: string | null
          exercise_id: string | null
          id: string
          load_suggestion: string | null
          mode: string
          notes: string | null
          position: number
          reps: string
          rest_seconds: number | null
          sets: number
          workout_id: string | null
        }
        Insert: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          load_suggestion?: string | null
          mode?: string
          notes?: string | null
          position: number
          reps: string
          rest_seconds?: number | null
          sets: number
          workout_id?: string | null
        }
        Update: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          load_suggestion?: string | null
          mode?: string
          notes?: string | null
          position?: number
          reps?: string
          rest_seconds?: number | null
          sets?: number
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_items_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_items_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_logs: {
        Row: {
          completed_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          rpe: number | null
          started_at: string | null
          student_id: string | null
          tenant_id: string | null
          workout_id: string | null
        }
        Insert: {
          completed_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          rpe?: number | null
          started_at?: string | null
          student_id?: string | null
          tenant_id?: string | null
          workout_id?: string | null
        }
        Update: {
          completed_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          rpe?: number | null
          started_at?: string | null
          student_id?: string | null
          tenant_id?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          scheduled_days: number[] | null
          student_id: string | null
          tenant_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          scheduled_days?: number[] | null
          student_id?: string | null
          tenant_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          scheduled_days?: number[] | null
          student_id?: string | null
          tenant_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workouts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_role: { Args: never; Returns: string }
      auth_tenant_id: { Args: never; Returns: string }
      consume_invite: {
        Args: { p_name: string; p_token: string }
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
    Enums: {},
  },
} as const

// ── Local convenience aliases (preserved across regenerations) ────────────────
export type Tenant = Tables<"tenants">
export type Profile = Tables<"profiles">
export type Exercise = Tables<"exercises">
export type Workout = Tables<"workouts">
export type WorkoutItem = Tables<"workout_items">
export type WorkoutLog = Tables<"workout_logs">
export type ExerciseLog = Tables<"exercise_logs">
export type CommunityPost = Tables<"community_posts">
export type CommunityReaction = Tables<"community_reactions">
export type CommunityComment = Tables<"community_comments">
export type Testimonial = Tables<"testimonials">
export type Invite = Tables<"invites">
export type Plan = Tables<"plans">
export type Referral = Tables<"referrals">
export type Consent = Tables<"consents">
export type Anamnese = Tables<"anamneses">
export type Assessment = Tables<"assessments">
export type ProgressPhoto = Tables<"progress_photos">
export type BadgeEarned = Tables<"badges_earned">
export type Subscription = Tables<"subscriptions">
export type PaymentEvent = Tables<"payment_events">
export type PushSubscription = Tables<"push_subscriptions">
export type ChatThread = Tables<"chat_threads">
export type ChatMessage = Tables<"chat_messages">
