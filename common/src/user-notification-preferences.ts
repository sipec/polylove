import { filterDefined } from './util/array'

export type notification_destination_types = 'email' | 'browser' | 'mobile'
export type notification_preference = keyof notification_preferences
export type notification_preferences = {
  // Watched Markets
  all_comments_on_watched_markets: notification_destination_types[]
  all_answers_on_watched_markets: notification_destination_types[]
  poll_close_on_watched_markets: notification_destination_types[]

  // Comments
  all_replies_to_my_comments_on_watched_markets: notification_destination_types[]
  all_replies_to_my_answers_on_watched_markets: notification_destination_types[]
  all_comments_on_contracts_with_shares_in_on_watched_markets: notification_destination_types[]

  // On users' markets
  your_contract_closed: notification_destination_types[]
  all_comments_on_my_markets: notification_destination_types[]
  all_answers_on_my_markets: notification_destination_types[]
  subsidized_your_market: notification_destination_types[]
  vote_on_your_contract: notification_destination_types[]
  your_poll_closed: notification_destination_types[]
  review_on_your_market: notification_destination_types[]

  // Market updates
  resolutions_on_watched_markets: notification_destination_types[]
  resolutions_on_watched_markets_with_shares_in: notification_destination_types[]
  all_votes_on_watched_markets: notification_destination_types[]
  probability_updates_on_watched_markets: notification_destination_types[]
  bounty_awarded: notification_destination_types[]
  bounty_added: notification_destination_types[]
  bounty_canceled: notification_destination_types[]

  // Balance Changes
  loan_income: notification_destination_types[]
  betting_streaks: notification_destination_types[]
  referral_bonuses: notification_destination_types[]
  unique_bettors_on_your_contract: notification_destination_types[]
  limit_order_fills: notification_destination_types[]
  quest_payout: notification_destination_types[]
  airdrop: notification_destination_types[]
  manifest_airdrop: notification_destination_types[]
  extra_purchased_mana: notification_destination_types[]

  // Leagues
  league_changed: notification_destination_types[]

  // Manifold.love
  new_match: notification_destination_types[]
  new_endorsement: notification_destination_types[]
  new_love_like: notification_destination_types[]
  new_love_ship: notification_destination_types[]

  // User-related
  new_message: notification_destination_types[]
  tagged_user: notification_destination_types[]
  user_liked_your_content: notification_destination_types[]
  on_new_follow: notification_destination_types[]
  contract_from_followed_user: notification_destination_types[]

  // General
  trending_markets: notification_destination_types[]
  profit_loss_updates: notification_destination_types[]
  onboarding_flow: notification_destination_types[]
  thank_you_for_purchases: notification_destination_types[]
  opt_out_all: notification_destination_types[]
  // When adding a new notification preference, use add-new-notification-preference.ts to existing users
}

export const getDefaultNotificationPreferences = (isDev?: boolean) => {
  const constructPref = (
    browserIf: boolean,
    emailIf: boolean,
    mobileIf: boolean
  ) => {
    const browser = browserIf ? 'browser' : undefined
    const email = isDev ? undefined : emailIf ? 'email' : undefined
    const mobile = mobileIf ? 'mobile' : undefined
    return filterDefined([
      browser,
      email,
      mobile,
    ]) as notification_destination_types[]
  }
  const defaults: notification_preferences = {
    // Watched Markets
    all_comments_on_watched_markets: constructPref(false, false, false),
    // Answers
    all_answers_on_watched_markets: constructPref(true, false, false),
    // Comments
    all_replies_to_my_comments_on_watched_markets: constructPref(
      true,
      true,
      true
    ),
    all_replies_to_my_answers_on_watched_markets: constructPref(
      true,
      true,
      true
    ),
    all_comments_on_contracts_with_shares_in_on_watched_markets: constructPref(
      false,
      false,
      false
    ),

    // On users' markets
    your_contract_closed: constructPref(true, true, false), // High priority
    all_comments_on_my_markets: constructPref(true, true, false),
    all_answers_on_my_markets: constructPref(true, true, false),
    subsidized_your_market: constructPref(true, true, false),
    vote_on_your_contract: constructPref(true, true, false),
    your_poll_closed: constructPref(true, true, false),
    review_on_your_market: constructPref(true, false, false),

    // Market updates
    resolutions_on_watched_markets: constructPref(true, true, true),
    all_votes_on_watched_markets: constructPref(false, false, false),
    resolutions_on_watched_markets_with_shares_in: constructPref(
      true,
      true,
      true
    ),
    bounty_awarded: constructPref(true, false, false),
    bounty_added: constructPref(true, false, false),
    bounty_canceled: constructPref(true, false, false),
    poll_close_on_watched_markets: constructPref(true, false, false),

    // Balance Changes
    loan_income: constructPref(true, false, false),
    betting_streaks: constructPref(true, false, true),
    referral_bonuses: constructPref(true, true, false),
    unique_bettors_on_your_contract: constructPref(true, true, false),
    limit_order_fills: constructPref(true, false, false),
    quest_payout: constructPref(true, false, false),
    airdrop: constructPref(true, false, false),
    manifest_airdrop: constructPref(true, false, false),
    extra_purchased_mana: constructPref(true, false, false),

    // Leagues
    league_changed: constructPref(true, false, false),

    // Manifold.love
    new_match: constructPref(true, true, true),
    new_endorsement: constructPref(true, true, true),
    new_love_like: constructPref(true, false, false),
    new_love_ship: constructPref(true, false, false),

    // User-related
    new_message: constructPref(true, true, true),
    tagged_user: constructPref(true, true, true),
    on_new_follow: constructPref(true, true, false),
    contract_from_followed_user: constructPref(true, false, false),
    user_liked_your_content: constructPref(true, false, false),

    // General
    trending_markets: constructPref(false, true, false),
    profit_loss_updates: constructPref(true, true, false),
    probability_updates_on_watched_markets: constructPref(true, false, true),
    thank_you_for_purchases: constructPref(false, false, false),
    onboarding_flow: constructPref(true, true, false),

    opt_out_all: [],
  }
  return defaults
}

export const getNotificationDestinationsForUser = (..._props: any) => {
  // TODO: implement this function
  return {
    sendToEmail: false,
    sendToBrowser: false,
    sendToMobile: false,
    unsubscribeUrl: '',
    urlToManageThisNotification: '',
  }
}
