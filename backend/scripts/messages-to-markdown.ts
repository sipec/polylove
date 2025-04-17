import { runScript } from 'run-script'
import { type Row } from 'common/supabase/utils'
import { tiptapToMarkdown } from 'common/util/tiptap-to-markdown'
// import { bulkUpdate } from 'shared/supabase/utils'

runScript(async ({ pg }) => {
  const messages = await pg.manyOrNone<Row<'private_user_messages'>>(
    `select * from private_user_messages`
  )

  messages.map((message) => {
    message.content = tiptapToMarkdown(message.content as any)
  })

  console.log(messages.slice(0, 10))

  // await bulkUpdate(
  //   pg,
  //   'private_user_messages',
  //   'id' as any,
  //   messages.map((m) => ({
  //     id: m.id as any,
  //     content: m.content as any,
  //   }))
  // )
})
