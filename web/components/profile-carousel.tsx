import { useState } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Router from 'next/router'

import { buildArray } from 'common/util/array'
import { Carousel } from 'web/components/widgets/carousel'
import { MODAL_CLASS, Modal } from 'web/components/layout/modal'
import { User } from 'common/user'
import { Col } from 'web/components/layout/col'
import { SignUpButton } from './nav/love-sidebar'
import { Lover } from 'common/love/lover'
import { useAdmin } from 'web/hooks/use-admin'
import { Button } from 'web/components/buttons/button'
import { updateLover } from 'web/lib/api'
import { AddPhotosWidget } from './widgets/add-photos'
import { Row } from 'web/components/layout/row'
import { useUser } from 'web/hooks/use-user'
import { PlusIcon } from '@heroicons/react/solid'
import { api } from 'web/lib/api'

export default function ProfileCarousel(props: { lover: Lover }) {
  const { lover } = props
  const photoNums = lover.photo_urls ? lover.photo_urls.length : 0

  const [lightboxUrl, setLightboxUrl] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [editPhotosOpen, setEditPhotosOpen] = useState(false)

  const isAdmin = useAdmin()
  const currentUser = useUser()
  const isCurrentUser = currentUser?.id === lover.user_id

  if (!currentUser && lover.visibility !== 'public') {
    return (
      <Carousel>
        {lover.pinned_url && (
          <div className="h-80 w-[250px] flex-none snap-start">
            <Image
              priority={true}
              src={lover.pinned_url}
              height={360}
              width={240}
              sizes="(max-width: 640px) 100vw, 240px"
              alt=""
              className="h-full cursor-pointer rounded object-cover"
            />
          </div>
        )}
        {photoNums > 0 && (
          <Col className="bg-canvas-100 dark:bg-canvas-0 text-ink-500 relative h-80 w-[250px] flex-none items-center rounded text-6xl ">
            <Col className=" m-auto items-center gap-1">
              <div className="select-none font-semibold">+{photoNums}</div>
              <SignUpButton
                text="Sign up to see"
                size="xs"
                color="none"
                className="dark:text-ink-500 hover:text-primary-500 hover:underline"
              />
            </Col>
          </Col>
        )}
      </Carousel>
    )
  }
  return (
    <>
      <div className="flex gap-2 self-end">
        {isAdmin && (
          <Button
            size="sm"
            color="red"
            onClick={() => {
              console.log('deleting')
              api('remove-pinned-photo', { userId: lover.user_id }).then(() =>
                Router.back()
              )
            }}
          >
            Admin: Delete pinned photo
          </Button>
        )}
        {isCurrentUser && (
          <Button
            onClick={() => setEditPhotosOpen(true)}
            color="gray-outline"
            size="sm"
          >
            Edit photos
          </Button>
        )}
      </div>
      <Carousel>
        {buildArray(lover.pinned_url, lover.photo_urls).map((url, i) => {
          return (
            <div key={url} className="h-80 w-[250px] flex-none snap-start">
              <Image
                priority={i < 3}
                src={url}
                height={360}
                width={240}
                sizes="(max-width: 640px) 100vw, 240px"
                alt=""
                className="h-full cursor-pointer rounded object-cover"
                onClick={() => {
                  setLightboxUrl(url)
                  setLightboxOpen(true)
                }}
              />
            </div>
          )
        })}
        {isCurrentUser && (lover.photo_urls?.length ?? 0) > 1 && (
          <button
            className="bg-ink-200 text-ink-0 group flex h-80 w-[250px] flex-none cursor-pointer snap-start items-center justify-center rounded ease-in-out"
            onClick={() => setEditPhotosOpen(true)}
          >
            <PlusIcon className="w-20 transition-all group-hover:w-24" />
          </button>
        )}
      </Carousel>
      <Modal open={lightboxOpen} setOpen={setLightboxOpen}>
        <Image src={lightboxUrl} width={1000} height={1000} alt="" />
      </Modal>
      {isCurrentUser && (
        <EditPhotosDialog
          user={currentUser}
          lover={lover}
          open={editPhotosOpen}
          setOpen={setEditPhotosOpen}
        />
      )}
    </>
  )
}

const EditPhotosDialog = (props: {
  user: User
  lover: Lover
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  const { user, lover, open, setOpen } = props
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [pinnedUrl, setPinnedUrl] = useState<string | null>(lover.pinned_url)
  const [photoUrls, setPhotoUrls] = useState<string[] | null>(lover.photo_urls ?? [])


  const submit = async () => {
    setIsSubmitting(true)
    await updateLover(({ pinned_url: pinnedUrl ?? undefined, photo_urls: photoUrls ?? undefined }))
    setIsSubmitting(false)
    setOpen(false)
    window.location.reload()
  }

  return (
    <>
      <Modal open={open} setOpen={setOpen}>
        <Col className={clsx(MODAL_CLASS)}>
          <AddPhotosWidget
            user={user}
            photo_urls={photoUrls}
            pinned_url={pinnedUrl}
            setPhotoUrls={(urls) => setPhotoUrls(urls)}
            setPinnedUrl={(url) => setPinnedUrl(url)}
          />
          <Row className="gap-4 self-end">
            <Button color="gray-outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="self-end"
              onClick={submit}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Save
            </Button>
          </Row>
        </Col>
      </Modal>
    </>
  )
}
