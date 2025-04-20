import { runScript } from 'run-script'
import { type Row } from 'common/supabase/utils'
import { tiptapToMarkdown } from 'common/util/tiptap-to-markdown'
import { chunk } from 'lodash'
import { type SupabaseTransaction } from 'shared/supabase/init'
import { pgp } from 'shared/supabase/init'

runScript(async ({ pg }) => {
  const messages = await pg.manyOrNone<Row<'private_user_messages'>>(
    `select * from private_user_messages`
  )

  const updates = messages.map((m) => ({
    id: m.id,
    content: tiptapToMarkdown(m.content as any),
  }))

  await pg.tx(async (tx) => {
    await tx.none(
      `alter table private_user_messages
      drop column content,
      add column content text not null default ''`
    )

    for (const c of chunk(updates, 1000)) {
      console.log('updating chunk')
      await bulkUpdate(tx, c)
    }

    await tx.none(
      `alter table private_user_messages
      alter column content drop default`
    )

    const values = await tx.many(
      `select * from private_user_messages
      limit 10`
    )

    console.log(values)

    throw new Error(`don't commit`)
  })
})

const bulkUpdate = (
  tx: SupabaseTransaction,
  updates: { id: number; content: string }[]
) => {
  const values = updates
    .map((u) => pgp.as.format('($(id), $(content))', u))
    .join(',')

  return tx.none(
    `update private_user_messages p set content = v.content
    from (values ${values}) as v(id, content)
    where p.id = v.id`
  )
}
