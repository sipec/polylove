import { PencilIcon, XIcon } from '@heroicons/react/outline'
import { JSONContent } from '@tiptap/core'
import clsx from 'clsx'

import { Lover } from 'common/love/lover'
import DropdownMenu from 'web/components/comments/dropdown-menu'
import { Col } from 'web/components/layout/col'
import { Row } from 'web/components/layout/row'
import { Content } from 'web/components/widgets/editor'
import { updateLover } from 'web/lib/api'
import { EditableBio } from './editable-bio'
import { tryCatch } from 'common/util/try-catch'

export function BioBlock(props: {
  isCurrentUser: boolean
  lover: Lover
  refreshLover: () => void
  edit: boolean
  setEdit: (edit: boolean) => void
}) {
  const { isCurrentUser, refreshLover, lover, edit, setEdit } = props

  return (
    <Col
      className={clsx(
        'bg-canvas-0 flex-grow whitespace-pre-line rounded-md leading-relaxed',
        !edit && 'px-3 py-2'
      )}
    >
      <Row className="w-full">
        {!edit && lover.bio && (
          <Col className="flex w-full flex-grow">
            <Content className="w-full" content={lover.bio as JSONContent} />
          </Col>
        )}
        {edit && (
          <EditableBio
            lover={lover}
            onCancel={lover.bio ? () => setEdit(false) : undefined}
            onSave={() => {
              refreshLover()
              setEdit(false)
            }}
          />
        )}
        {isCurrentUser && !edit && (
          <DropdownMenu
            items={[
              {
                name: 'Edit',
                icon: <PencilIcon className="h-5 w-5" />,
                onClick: () => setEdit(true),
              },
              {
                name: 'Delete',
                icon: <XIcon className="h-5 w-5" />,
                onClick: async () => {
                  const { error } = await tryCatch(updateLover({ bio: null }))
                  if (error) console.error(error)
                  else refreshLover()
                },
              },
            ]}
            closeOnClick
          />
        )}
      </Row>
    </Col>
  )
}
