'use client'
import type { Prisma } from '@prisma/client'
import type { Session } from 'next-auth'

import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

import {
  Button,
  Checkbox,
  CheckboxField,
  CheckboxGroup,
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
      className="justify-self-end font-normal"
      color="secondary"
      disabled={pending}
      type="submit"
    >
      Save
    </Button>
  )
}
type SettingsFormProps = Pick<Prisma.PreferenceGetPayload<true>, 'enabled'> &
  Pick<Session['user'], 'biography' | 'username'>

export const SettingsForm = ({
  biography,
  enabled,
  username,
}: SettingsFormProps) => {
  const { update } = useSession()
  const [formState, setFormState] = useState<
    Awaited<ReturnType<typeof updateUserSettings>>
  >({
    message: null,
    ok: false,
    status: 'idle',
  })
  return (
    <form
      action={async (formData) => {
        const res = await updateUserSettings(formData)
        if (res.ok) {
          await update({ username: formData.get('username') })
        }
        setFormState(res)
      }}
      className="grid max-w-3xl space-y-8"
      id="user-settings"
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
                autoComplete="false"
                defaultValue={username ?? ''}
                name="username"
                onInvalid={(e) =>
                  e.currentTarget.setCustomValidity(
                    'Select a username containing only alphanumeric characters, dashes (-), and underscores (_).',
                  )
                }
                pattern={`^[a-zA-Z0-9_\\-]+$`}
                readOnly={!!username}
                required
                title="Select a username containing only alphanumeric characters, dashes (-), and underscores (_)."
                type="text"
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
              defaultValue={biography ?? ''}
              name="biography"
              placeholder="To be displayed on your page banner."
              rows={3}
            />
          </Field>
        </FieldGroup>
      </Fieldset>
      <Fieldset>
        <Legend>Preferences</Legend>
        <CheckboxGroup>
          <CheckboxField>
            <Checkbox defaultChecked={enabled} name="emailNotifications" />
            <Label>Email Notifications</Label>
            <Description>
              Receive email notifications for new comments on your stamps or
              replies to your existing comments.
            </Description>
          </CheckboxField>
        </CheckboxGroup>
      </Fieldset>
      <SubmitButton />
    </form>
  )
}
