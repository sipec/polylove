import {
  contentSchema,
  combinedLoveUsersSchema,
  baseLoversSchema,
} from 'common/api/zod-types'
import { ChatMessage, PrivateChatMessage } from 'common/chat-message'
import { CompatibilityScore } from 'common/love/compatibility-score'
import { MAX_COMPATIBILITY_QUESTION_LENGTH } from 'common/love/constants'
import { Lover } from 'common/love/lover'
import { Row } from 'common/supabase/utils'
import { PrivateUser, User } from 'common/user'
import { z } from 'zod'
import { LikeData, ShipData } from './love-types'
import { DisplayUser, FullUser } from './user-types'
import { PrivateMessageChannel } from 'common/supabase/private-messages'
import { Notification } from 'common/notifications'

// mqp: very unscientific, just balancing our willingness to accept load
// with user willingness to put up with stale data
export const DEFAULT_CACHE_STRATEGY =
  'public, max-age=5, stale-while-revalidate=10'

type APIGenericSchema = {
  // GET is for retrieval, POST is to mutate something, PUT is idempotent mutation (can be repeated safely)
  method: 'GET' | 'POST' | 'PUT'
  //private APIs can only be called from manifold. undocumented endpoints can change or be deleted at any time!
  visibility: 'public' | 'undocumented' | 'private'
  // whether the endpoint requires authentication
  authed: boolean
  // zod schema for the request body (or for params for GET requests)
  props: z.ZodType
  // note this has to be JSON serializable
  returns?: Record<string, any>
  // Cache-Control header. like, 'max-age=60'
  cache?: string
}

let _apiTypeCheck: { [x: string]: APIGenericSchema }
export const API = (_apiTypeCheck = {
  health: {
    method: 'GET',
    visibility: 'public',
    authed: false,
    props: z.object({}),
  },
  'get-supabase-token': {
    method: 'GET',
    visibility: 'public',
    authed: true,
    props: z.object({}),
    returns: {} as { jwt: string },
  },
  'mark-all-notifs-read': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({}),
  },
  'user/by-id/:id/block': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({ id: z.string() }).strict(),
  },
  'user/by-id/:id/unblock': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({ id: z.string() }).strict(),
  },
  'ban-user': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z
      .object({
        userId: z.string(),
        unban: z.boolean().optional(),
      })
      .strict(),
  },
  'refer-user': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({ referredByUsername: z.string() }).strict(),
  },
  'create-user': {
    // TODO rest
    method: 'POST',
    visibility: 'public',
    authed: true,
    returns: {} as { user: User; privateUser: PrivateUser },
    props: z
      .object({
        deviceToken: z.string().optional(),
        adminToken: z.string().optional(),
        visitedContractIds: z.array(z.string()).optional(),
      })
      .strict(),
  },
  'create-lover': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    returns: {} as Row<'lovers'>,
    props: baseLoversSchema,
  },
  report: {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.any(),
  },
  me: {
    method: 'GET',
    visibility: 'public',
    authed: true,
    cache: DEFAULT_CACHE_STRATEGY,
    props: z.object({}),
    returns: {} as FullUser,
  },
  'me/update': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({
      name: z.string().trim().min(1).optional(),
      username: z.string().trim().min(1).optional(),
      avatarUrl: z.string().optional(),
      bio: z.string().optional(),
      website: z.string().optional(),
      twitterHandle: z.string().optional(),
      discordHandle: z.string().optional(),
      // settings
      optOutBetWarnings: z.boolean().optional(),
      isAdvancedTrader: z.boolean().optional(),
      //internal
      shouldShowWelcome: z.boolean().optional(),
      hasSeenContractFollowModal: z.boolean().optional(),
      hasSeenLoanModal: z.boolean().optional(),
    }),
    returns: {} as FullUser,
  },
  'update-lover': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: combinedLoveUsersSchema,
    returns: {} as any,
  },
  'me/delete': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({
      username: z.string(), // just so you're sure
    }),
  },
  'me/private': {
    method: 'GET',
    visibility: 'public',
    authed: true,
    props: z.object({}),
    returns: {} as PrivateUser,
  },
  'user/:username': {
    method: 'GET',
    visibility: 'public',
    authed: false,
    cache: DEFAULT_CACHE_STRATEGY,
    returns: {} as FullUser,
    props: z.object({ username: z.string() }).strict(),
  },
  'user/:username/lite': {
    method: 'GET',
    visibility: 'public',
    authed: false,
    cache: DEFAULT_CACHE_STRATEGY,
    returns: {} as DisplayUser,
    props: z.object({ username: z.string() }).strict(),
  },
  'user/by-id/:id': {
    method: 'GET',
    visibility: 'public',
    authed: false,
    cache: DEFAULT_CACHE_STRATEGY,
    returns: {} as FullUser,
    props: z.object({ id: z.string() }).strict(),
  },
  'user/by-id/:id/lite': {
    method: 'GET',
    visibility: 'public',
    authed: false,
    cache: DEFAULT_CACHE_STRATEGY,
    returns: {} as DisplayUser,
    props: z.object({ id: z.string() }).strict(),
  },
  'search-users': {
    method: 'GET',
    visibility: 'undocumented',
    authed: false,
    cache: DEFAULT_CACHE_STRATEGY,
    returns: [] as FullUser[],
    props: z
      .object({
        term: z.string(),
        limit: z.coerce.number().gte(0).lte(1000).default(500),
        page: z.coerce.number().gte(0).default(0),
      })
      .strict(),
  },
  'compatible-lovers': {
    method: 'GET',
    visibility: 'private',
    authed: false,
    props: z.object({ userId: z.string() }),
    returns: {} as {
      lover: Lover
      compatibleLovers: Lover[]
      loverCompatibilityScores: {
        [userId: string]: CompatibilityScore
      }
    },
  },
  'remove-pinned-photo': {
    method: 'POST',
    visibility: 'private',
    authed: true,
    returns: { success: true },
    props: z
      .object({
        userId: z.string(),
      })
      .strict(),
  },
  'get-compatibility-questions': {
    method: 'GET',
    visibility: 'public',
    authed: false,
    props: z.object({}),
    returns: {} as {
      status: 'success'
      questions: (Row<'love_questions'> & {
        answer_count: number
        score: number
      })[]
    },
  },
  'like-lover': {
    method: 'POST',
    visibility: 'private',
    authed: true,
    props: z.object({
      targetUserId: z.string(),
      remove: z.boolean().optional(),
    }),
    returns: {} as {
      status: 'success'
    },
  },
  'ship-lovers': {
    method: 'POST',
    visibility: 'private',
    authed: true,
    props: z.object({
      targetUserId1: z.string(),
      targetUserId2: z.string(),
      remove: z.boolean().optional(),
    }),
    returns: {} as {
      status: 'success'
    },
  },
  'get-likes-and-ships': {
    method: 'GET',
    visibility: 'public',
    authed: false,
    props: z
      .object({
        userId: z.string(),
      })
      .strict(),
    returns: {} as {
      status: 'success'
      likesReceived: LikeData[]
      likesGiven: LikeData[]
      ships: ShipData[]
    },
  },
  'has-free-like': {
    method: 'GET',
    visibility: 'private',
    authed: true,
    props: z.object({}).strict(),
    returns: {} as {
      status: 'success'
      hasFreeLike: boolean
    },
  },
  'star-lover': {
    method: 'POST',
    visibility: 'private',
    authed: true,
    props: z.object({
      targetUserId: z.string(),
      remove: z.boolean().optional(),
    }),
    returns: {} as {
      status: 'success'
    },
  },
  'get-lovers': {
    method: 'GET',
    visibility: 'public',
    authed: false,
    props: z.object({}).strict(),
    returns: {} as {
      status: 'success'
      lovers: Lover[]
    },
  },
  'get-lover-answers': {
    method: 'GET',
    visibility: 'public',
    authed: false,
    props: z.object({ userId: z.string() }).strict(),
    returns: {} as {
      status: 'success'
      answers: Row<'love_compatibility_answers'>[]
    },
  },
  'create-comment': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({
      userId: z.string(),
      content: contentSchema,
      replyToCommentId: z.string().optional(),
    }),
    returns: {} as any,
  },
  'hide-comment': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({
      commentId: z.string(),
      hide: z.boolean(),
    }),
    returns: {} as any,
  },
  'create-public-chat-message': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    returns: {} as ChatMessage,
    props: z.object({
      content: contentSchema,
      channelId: z.string(),
    }),
  },
  'get-channel-memberships': {
    method: 'GET',
    visibility: 'undocumented',
    authed: true,
    props: z.object({
      channelId: z.coerce.number().optional(),
      createdTime: z.string().optional(),
      lastUpdatedTime: z.string().optional(),
      limit: z.coerce.number(),
    }),
    returns: {
      channels: [] as PrivateMessageChannel[],
      memberIdsByChannelId: {} as { [channelId: string]: string[] },
    },
  },
  'get-channel-messages': {
    method: 'GET',
    visibility: 'undocumented',
    authed: true,
    props: z.object({
      channelId: z.coerce.number(),
      limit: z.coerce.number(),
      id: z.coerce.number().optional(),
    }),
    returns: [] as PrivateChatMessage[],
  },
  'get-channel-seen-time': {
    method: 'GET',
    visibility: 'undocumented',
    authed: true,
    props: z.object({
      channelIds: z.array(z.coerce.number()),
    }),
    returns: [] as [number, string][],
  },
  'set-channel-seen-time': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    props: z.object({
      channelId: z.coerce.number(),
    }),
  },
  'get-notifications': {
    method: 'GET',
    visibility: 'undocumented',
    authed: true,
    returns: [] as Notification[],
    props: z
      .object({
        after: z.coerce.number().optional(),
        limit: z.coerce.number().gte(0).lte(1000).default(100),
      })
      .strict(),
  'create-private-user-message': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    returns: {} as ChatMessage,
    props: z.object({
      content: contentSchema,
      channelId: z.number(),
    }),
  },
  'create-private-user-message-channel': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    returns: {} as any,
    props: z.object({
      userIds: z.array(z.string()),
    }),
  },
  'update-private-user-message-channel': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    returns: {} as any,
    props: z.object({
      channelId: z.number(),
      notifyAfterTime: z.number(),
    }),
  },
  'leave-private-user-message-channel': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    returns: {} as any,
    props: z.object({
      channelId: z.number(),
    }),
  },
  'create-compatibility-question': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    returns: {} as any,
    props: z.object({
      question: z.string().min(1).max(MAX_COMPATIBILITY_QUESTION_LENGTH),
      options: z.record(z.string(), z.number()),
    }),
  },
  'search-location': {
    method: 'POST', // TODO: should be GET
    visibility: 'public',
    authed: false,
    returns: {} as any,
    props: z.object({
      term: z.string(),
      limit: z.number().optional(),
    }),
  },
  'search-near-city': {
    method: 'POST',
    visibility: 'public',
    authed: false,
    returns: {} as any,
    props: z.object({
      cityId: z.string(),
      radius: z.number().min(1).max(500),
    }),
  },
  searchgiphy: {
    method: 'POST',
    visibility: 'public',
    authed: false,
    returns: {} as any,
    props: z.object({
      term: z.string(),
      limit: z.number().min(1).max(100),
    }),
  },
} as const)

export type APIPath = keyof typeof API
export type APISchema<N extends APIPath> = (typeof API)[N]

export type APIParams<N extends APIPath> = z.input<APISchema<N>['props']>
export type ValidatedAPIParams<N extends APIPath> = z.output<
  APISchema<N>['props']
>

export type APIResponse<N extends APIPath> = APISchema<N> extends {
  returns: Record<string, any>
}
  ? APISchema<N>['returns']
  : void

export type APIResponseOptionalContinue<N extends APIPath> =
  | { continue: () => Promise<void>; result: APIResponse<N> }
  | APIResponse<N>
