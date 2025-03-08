import {
  CreateEmailRequestOptions,
  Resend,
  type CreateEmailOptions,
} from 'resend'
import { log } from 'shared/utils'

/*
 * typically: { subject: string, to: string | string[] } & ({ text: string } | { react: ReactNode })
 */
export const sendEmail = async (
  payload: CreateEmailOptions,
  options?: CreateEmailRequestOptions
) => {
  const { data, error } = await resend.emails.send(
    { replyTo: 'love@sincl.ai', ...payload },
    options
  )

  if (error) {
    log.error(
      `Failed to send email to ${payload.to} with subject ${payload.subject}`
    )
    log.error(error)
    return null
  }

  log(`Sent email to ${payload.to} with subject ${payload.subject}`)
  return data
}

const initResend = () => {
  const apiKey = process.env.RESEND_KEY as string
  return new Resend(apiKey)
}

const resend = initResend()
