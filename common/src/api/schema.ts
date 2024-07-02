import { contentSchema } from 'common/api/zod-types'
import { ChatMessage } from 'common/chat-message'
import type { ContractComment } from 'common/comment'
import { CompatibilityScore } from 'common/love/compatibility-score'
import { Lover } from 'common/love/lover'
import { Row } from 'common/supabase/utils'
import { PrivateUser, User } from 'common/user'
import { z } from 'zod'
import { LikeData, ShipData } from './love-types'
import { DisplayUser, FullUser } from './user-types'

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
  comment: {
    method: 'POST',
    visibility: 'public',
    authed: true,
    returns: {} as ContractComment,
    props: z
      .object({
        contractId: z.string(),
        content: contentSchema.optional(),
        html: z.string().optional(),
        markdown: z.string().optional(),
        replyToCommentId: z.string().optional(),
        replyToAnswerId: z.string().optional(),
        replyToBetId: z.string().optional(),
      })
      .strict(),
  },
  'hide-comment': {
    method: 'POST',
    visibility: 'public',
    authed: true,
    props: z.object({ commentPath: z.string() }).strict(),
  },
  'pin-comment': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    props: z.object({ commentPath: z.string() }).strict(),
  },
  comments: {
    method: 'GET',
    visibility: 'public',
    authed: false,
    cache: DEFAULT_CACHE_STRATEGY,
    returns: [] as ContractComment[],
    props: z
      .object({
        contractId: z.string().optional(),
        contractSlug: z.string().optional(),
        limit: z.coerce.number().gte(0).lte(1000).default(1000),
        page: z.coerce.number().gte(0).default(0),
        userId: z.string().optional(),
        isPolitics: z.coerce.boolean().optional(),
      })
      .strict(),
  },
  createuser: {
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
  'verify-phone-number': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    returns: {} as { status: string },
    props: z
      .object({
        phoneNumber: z.string(),
        code: z.string(),
      })
      .strict(),
  },
  'request-otp': {
    method: 'GET',
    visibility: 'undocumented',
    authed: true,
    returns: {} as { status: string },
    props: z
      .object({
        phoneNumber: z.string(),
      })
      .strict(),
  },
  'phone-number': {
    method: 'GET',
    visibility: 'undocumented',
    authed: true,
    returns: {} as { number: string },
    props: z.object({}).strict(),
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
  users: {
    method: 'GET',
    visibility: 'public',
    authed: false,
    cache: DEFAULT_CACHE_STRATEGY,
    returns: [] as FullUser[],
    props: z
      .object({
        limit: z.coerce.number().gte(0).lte(1000).default(500),
        before: z.string().optional(),
      })
      .strict(),
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
  react: {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    props: z
      .object({
        contentId: z.string(),
        contentType: z.enum(['comment', 'contract']),
        remove: z.boolean().optional(),
      })
      .strict(),
    returns: { success: true },
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
  post: {
    method: 'POST',
    visibility: 'private',
    authed: true,
    returns: {} as ContractComment,
    props: z
      .object({
        contractId: z.string(),
        betId: z.string().optional(),
        commentId: z.string().optional(),
        content: contentSchema.optional(),
      })
      .strict(),
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
  'request-signup-bonus': {
    method: 'GET',
    visibility: 'undocumented',
    authed: true,
    returns: {} as { bonus: number },
    props: z.object({}),
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
  'update-user-embedding': {
    method: 'POST',
    visibility: 'undocumented',
    authed: true,
    props: z.object({}),
    returns: {} as { success: true },
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
