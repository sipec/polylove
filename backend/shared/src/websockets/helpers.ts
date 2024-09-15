import { broadcast } from './server'
import { User } from 'common/user'

export function broadcastUpdatedPrivateUser(userId: string) {
  // don't send private user info because it's private and anyone can listen
  broadcast(`private-user/${userId}`, {})
}

export function broadcastUpdatedUser(user: Partial<User> & { id: string }) {
  broadcast(`user/${user.id}`, { user })
}
