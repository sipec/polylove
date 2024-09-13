import { convertSQLtoTS, tsToMillis } from 'common/supabase/utils'
import { db } from 'web/lib/supabase/db'
import { LoverComment } from 'common/love/love-comment'
import { useLiveUpdates } from 'web/hooks/use-persistent-supabase-polling'

export function useLiveCommentsOnLover(userId: string) {
  const update = async () => {
    const { data, error } = await db
      .from('lover_comments')
      .select('*')
      .eq('on_user_id', userId)
    if (error) {
      console.error(error)
      return
    }
    return data.map((c) =>
      convertSQLtoTS<'lover_comments', LoverComment>(c, {
        created_time: tsToMillis as any,
      })
    )
  }

  return useLiveUpdates(update, {
    frequency: 500,
    keys: [userId],
  })
}
