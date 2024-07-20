'use client'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

import {
  Button,
  Description,
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
  Input,
  InputGroup,
  Label,
  Legend,
  Textarea,
} from '@/components/ui'

import { updateUserSettings } from './actions'

const SubmitButton = () => {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      color="secondary"
      className="justify-self-end font-normal"
    >
      Save
    </Button>
  )
}
export const SettingsForm = () => {
  const router = useRouter()
  const { data: session, status } = useSession<true>()

  const [formState, setFormState] = useState<
    Awaited<ReturnType<typeof updateUserSettings>>
  >({
    status: 'idle',
    message: null,
  })

  if (status === 'loading') return null

  const { username, biography } = session.user

  return (
    <form
      id="user-settings"
      action={async (formData) => {
        const { status, message } = await updateUserSettings(formData)
        if (status === 'success') {
          //FIXME: update from useSession not documented
          // no longer works as expected with only database
          // https://authjs.dev/reference/nextjs/react#updatesession
          router.refresh()
        }
        setFormState({ status, message })
      }}
      className="grid max-w-3xl space-y-8"
    >
      <Fieldset>
        <Legend>Profile</Legend>
        <FieldGroup>
          <Field>
            <Label>Username</Label>
            <Description>
              {' '}
              If you wish to change your username please contact us via the
              discord server.{' '}
            </Description>
            <InputGroup className="[&>[data-slot=icon]]:text-green-500 dark:[&>[data-slot=icon]]:text-green-500">
              <span data-slot="custom-text">annostamps.com/</span>
              <Input
                type="text"
                name="username"
                defaultValue={username ?? ''}
                readOnly={!!username}
                autoComplete="false"
                onInvalid={(e) =>
                  e.currentTarget.setCustomValidity(
                    'Select a username containing only alphanumeric characters, dashes (-), and underscores (_).',
                  )
                }
                pattern={`^[a-zA-Z0-9_\\-]+$`}
                title="Select a username containing only alphanumeric characters, dashes (-), and underscores (_)."
                required
              />
              {formState.status === 'success' && (
                <CheckBadgeIcon data-testid="check-badge-icon" />
              )}
            </InputGroup>

            {formState.status === 'error' && (
              <ErrorMessage>{formState.message}</ErrorMessage>
            )}
          </Field>

          <Field>
            <Label>About</Label>
            <Textarea
              name="biography"
              placeholder="To be displayed on your page banner."
              defaultValue={biography ?? ''}
              rows={3}
            />
          </Field>
        </FieldGroup>
      </Fieldset>
      <SubmitButton />
    </form>
  )
}
