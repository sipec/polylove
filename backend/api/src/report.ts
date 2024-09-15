import { APIError, APIHandler } from './helpers/endpoint'
import { createSupabaseClient } from 'shared/supabase/init'

// abusable: people can report the wrong person, that didn't write the comment
// but in practice we check it manually and nothing bad happens to them automatically
export const report: APIHandler<'report'> = async (body, auth) => {
  const {
    contentOwnerId,
    contentType,
    contentId,
    description,
    parentId,
    parentType,
  } = body

  const db = createSupabaseClient()

  const result = await db.from('reports').insert({
    user_id: auth.uid,
    content_owner_id: contentOwnerId,
    content_type: contentType,
    content_id: contentId,
    description,
    parent_id: parentId,
    parent_type: parentType,
  })

  if (result.error) {
    throw new APIError(500, 'Failed to create report: ' + result.error.message)
  }

  return { success: true }
}
