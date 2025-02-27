import { createSupabaseClient } from 'shared/supabase/init'
import { getUser } from 'shared/utils'
import { APIHandler, APIError } from './helpers/endpoint'

export const createCompatibilityQuestion: APIHandler<
  'create-compatibility-question'
> = async ({ question, options }, auth) => {
  const creator = await getUser(auth.uid)
  if (!creator) throw new APIError(401, 'Your account was not found')

  const db = createSupabaseClient()

  const compatibilityQuestionData = [
    {
      creator_id: creator.id,
      question,
      answer_type: 'compatibility_multiple_choice',
      multiple_choice_options: options,
    },
  ]

  const result = await db
    .from('love_questions')
    .insert(compatibilityQuestionData)
    .select()

  if (result.error) throw new APIError(401, 'Error creating question')

  return { question: result.data[0] }
}
