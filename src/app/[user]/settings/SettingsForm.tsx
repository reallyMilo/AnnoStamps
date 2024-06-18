'use client'
import { useFormState, useFormStatus } from 'react-dom'

import {
  Button,
  Description,
  ErrorMessage,
  Field,
  FieldGroup,
  Heading,
  Input,
  InputGroup,
  Label,
  Textarea,
} from '@/components/ui'
import type { UserWithStamps } from '@/lib/prisma/queries'

import { updateUserSettings } from './actions'
export const SettingsForm = ({
  username,
  biography,
}: Pick<UserWithStamps, 'username' | 'biography'>) => {
  const [formState, formAction] = useFormState(updateUserSettings, {
    status: 'idle',
    message: null,
  })
  const { pending } = useFormStatus()

  return (
    <form
      id="user-settings"
      action={formAction}
      className="grid max-w-3xl space-y-8"
    >
      <fieldset>
        <legend>
          <Heading>Profile</Heading>
        </legend>
        <FieldGroup>
          <Field>
            <Label>Username</Label>
            <Description>
              {' '}
              If you wish to change your username please contact us via the
              discord server.{' '}
            </Description>
            <InputGroup>
              <span data-slot="custom-text">annostamps.com/</span>
              <Input
                type="text"
                name="username"
                id="username"
                defaultValue={username ?? ''}
                readOnly={username ? true : false}
                onInvalid={(e) =>
                  e.currentTarget.setCustomValidity(
                    'Select a username containing only alphanumeric characters, dashes (-), and underscores (_).'
                  )
                }
                pattern={`^[a-zA-Z0-9_\\-]+$`}
                title="Select a username containing only alphanumeric characters, dashes (-), and underscores (_)."
                required
              />
            </InputGroup>

            {formState.status === 'error' && (
              <ErrorMessage>{formState.message}</ErrorMessage>
            )}
          </Field>

          <Field>
            <Label>About</Label>
            <Textarea
              id="biography"
              name="biography"
              placeholder="To be displayed on your page banner."
              defaultValue={biography ?? ''}
              rows={3}
            />
          </Field>
        </FieldGroup>
      </fieldset>

      <Button
        type="submit"
        disabled={pending}
        color="secondary"
        className="justify-self-end font-normal"
      >
        Save
      </Button>
    </form>
  )
}
