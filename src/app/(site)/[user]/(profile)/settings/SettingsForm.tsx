'use client'

import { CheckBadgeIcon } from '@heroicons/react/20/solid'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useActionState, useState } from 'react'

import { uploadAsset } from '@/components/StampForm/uploadAsset'
import { type Asset, useUpload } from '@/components/StampForm/useUpload'
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
import { type Session } from '@/lib/auth-client'

import { updateUserSettings } from './actions'

const isAsset = (b: Asset | null | object | string | undefined): b is Asset => {
  return !!b && typeof b === 'object' && 'rawFile' in b
}

export const SettingsForm = ({
  biography,
  image,
  isEmailEnabled,
  username,
}: Pick<
  Session['user'],
  'biography' | 'image' | 'isEmailEnabled' | 'username'
>) => {
  const currentAvatar = image ? { url: image } : { url: null }
  const [avatar, setAvatar] = useState<(Asset | typeof currentAvatar)[]>([
    currentAvatar,
  ])

  const { error, handleChange } = useUpload<(typeof avatar)[0]>(
    avatar,
    setAvatar,
    1,
  )
  const [formState, formAction, isPending] = useActionState<
    Awaited<ReturnType<typeof updateUserSettings>>,
    FormData
  >(
    async (prevState, formData) => {
      if (isAsset(avatar[0])) {
        try {
          const uploadAvatarUrl = await uploadAsset(
            avatar[0].rawFile,
            avatar[0].rawFile.type,
            avatar[0].name,
            'avatar',
          )
          formData.set('image', uploadAvatarUrl)
        } catch {
          return {
            data: prevState.data,
            error: 'Upload failed',
            ok: false,
            state: 'error',
          }
        }
      } else if (avatar[0].url === null) {
        formData.set('image', 'remove')
      }

      const res = await updateUserSettings(formData)
      if (!res.ok) {
        return { ...res, data: prevState.data }
      }
      return res
    },
    {
      data: { biography, isEmailEnabled, username },
      ok: false,
      state: 'idle',
    },
  )

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
                defaultValue={formState.data?.username ?? ''}
                name="username"
                onInvalid={(e) =>
                  e.currentTarget.setCustomValidity(
                    'Select a username containing only alphanumeric characters, dashes (-), and underscores (_).',
                  )
                }
                pattern={`^[a-zA-Z0-9_\\-]+$`}
                readOnly={!!formState.data?.username}
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
            {error === 'size' && (
              <ErrorMessage>File size greater then 1 MB.</ErrorMessage>
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
              onChange={handleChange}
              type="file"
            />

            <label
              className="flex size-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400"
              htmlFor="avatar"
            >
              {avatar[0]?.url ? (
                <img
                  alt="Uploaded avatar"
                  className="h-full w-full object-cover"
                  src={avatar[0].url}
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
              onClick={() => setAvatar([{ url: null }])}
              outline
              type="button"
            >
              Remove and use AnnoStamps default image
            </Button>
          </Field>
          <Field>
            <Label>About</Label>
            <Textarea
              defaultValue={formState.data?.biography ?? ''}
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
            <input
              defaultChecked={formState.data?.isEmailEnabled ?? true}
              name="emailNotifications"
              type="checkbox"
            />
            {/* <Checkbox
              defaultChecked={formState.data?.isEmailEnabled ?? true}
              name="emailNotifications"
            /> */}
            <Label>Email Notifications</Label>
            <Description>
              Receive email notifications for new comments on your stamps or
              replies to your existing comments.
            </Description>
          </CheckboxField>
        </CheckboxGroup>
      </Fieldset>
      <Button
        className="justify-self-end font-normal"
        color="secondary"
        disabled={isPending}
        type="submit"
      >
        Save
      </Button>
    </form>
  )
}
