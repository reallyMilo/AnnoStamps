'use client'

import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

import type { UserWithStamps } from '@/lib/prisma/models'

import { uploadAsset } from '@/components/StampForm/uploadAsset'
import { type Asset, fileToAsset } from '@/components/StampForm/useUpload'
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
  Text,
  Textarea,
} from '@/components/ui'
import { useSession } from '@/lib/auth-client'

import { updateUserSettings } from './actions'

const isAsset = (b: Asset | null | string | undefined): b is Asset => {
  return !!b && typeof b === 'object' && 'rawFile' in b
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
  const { data: session, isPending } = useSession()
  const [formState, setFormState] = useState<
    { state: 'error' | 'idle' | 'success' } & Omit<
      Awaited<ReturnType<typeof updateUserSettings>>,
      'status'
    >
  >({
    error: '',
    message: '',
    ok: false,
    state: 'idle',
  })

  const { biography, image, isEmailEnabled, username } = isPending
    ? { biography: null, image: null, isEmailEnabled: true, username: null }
    : session!.user

  const [avatar, setAvatar] = useState<Asset | UserWithStamps['image']>(
    image ?? null,
  )

  const avatarSrc = typeof avatar === 'string' ? avatar : avatar?.url
  const formAction = async (formData: FormData) => {
    if (isAsset(avatar)) {
      const uploadAvatarUrl = await uploadAsset(
        avatar.rawFile,
        avatar.rawFile.type,
        avatar.name,
        'avatar',
      )
      formData.set('image', uploadAvatarUrl)
    } else if (avatar === null) {
      formData.set('image', 'remove')
    }

    const res = await updateUserSettings(formData)
    if (!res.ok) {
      setFormState({ ...res, state: 'error' })
      return
    }
    setFormState({ ...res, state: 'success' })
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
            <InputGroup className="*:data-[slot=icon]:text-green-500 dark:*:data-[slot=icon]:text-green-500">
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
              {formState.state === 'success' && (
                <CheckBadgeIcon data-testid="check-badge-icon" />
              )}
            </InputGroup>

            {formState.state === 'error' && (
              <ErrorMessage>{formState.error}</ErrorMessage>
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
                    state: 'error',
                  })
                  return
                }
                const asset = fileToAsset(files[0])
                setAvatar(asset)
              }}
              type="file"
            />

            <label
              className="flex size-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400"
              htmlFor="avatar"
            >
              {avatar ? (
                <img
                  alt="Uploaded avatar"
                  className="h-full w-full object-cover"
                  src={avatarSrc}
                />
              ) : (
                <>
                  <CloudArrowUpIcon className="size-6 text-gray-500" />
                  <Text>Upload</Text>
                </>
              )}
            </label>
            <Button
              className="cursor-pointer border-0 font-light hover:underline"
              onClick={() => setAvatar(null)}
              outline
            >
              Remove and use AnnoStamps default image
            </Button>
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
