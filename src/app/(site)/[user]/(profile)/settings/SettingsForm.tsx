'use client'

import type { Session } from 'next-auth'

import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

import { uploadAsset } from '@/components/StampForm/uploadAsset'
import { type Asset, fileToAsset } from '@/components/StampForm/useUpload'
import {
  Avatar,
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

const isAsset = (b: Asset | string): b is Asset => {
  return (b as Asset).rawFile !== undefined
}

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

export const SettingsForm = () => {
  const { data, status, update } = useSession<true>()
  const [formState, setFormState] = useState<
    Awaited<ReturnType<typeof updateUserSettings>>
  >({
    message: null,
    ok: false,
    status: 'idle',
  })

  const { biography, image, preferences, username } =
    status === 'loading'
      ? {
          biography: '',
          image: null,
          preferences: [],
          username: '',
        }
      : data.user

  const [avatar, setAvatar] = useState<Asset | Session['user']['image']>(image)
  const isEmailEnabled =
    preferences.length === 0 ? true : preferences[0].enabled

  const avatarSrc = typeof avatar === 'string' ? avatar : avatar?.url
  const formAction = async (formData: FormData) => {
    if (avatar && isAsset(avatar)) {
      const uploadAvatar = await uploadAsset(
        avatar.rawFile,
        avatar.rawFile.type,
        avatar.name,
        'avatar',
      )
    }

    const res = await updateUserSettings(formData)
    if (res.ok) {
      await update({ username: formData.get('username') })
    }
    setFormState(res)
  }

  return (
    <form
      action={formAction}
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
          <Field className="space-y-2">
            <Label>Avatar</Label>
            <input
              accept=".png, .jpg, .jpeg, .webp"
              formNoValidate
              hidden
              id="avatar"
              multiple
              name="avatar"
              onChange={(e) => {
                const files = e.currentTarget.files

                if (!files || !files[0].size) {
                  return
                }

                if (files[0].size > 1028 * 1028) {
                  setFormState({
                    message: 'avatar upload bigger then 1 mb',
                    ok: false,
                    status: 'error',
                  })
                  return
                }
                const asset = fileToAsset(files[0])
                setAvatar(asset)
              }}
              type="file"
            />

            <label
              className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400"
              htmlFor="avatar"
            >
              {avatar ? (
                <img
                  alt="Uploaded avatar"
                  className="h-full w-full object-cover"
                  src={avatarSrc}
                />
              ) : (
                <CloudArrowUpIcon className="size-6 text-gray-500" />
              )}
            </label>
            <Description>128x128</Description>
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
            <Checkbox
              defaultChecked={isEmailEnabled}
              name="emailNotifications"
            />
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
