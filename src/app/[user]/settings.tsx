import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import {
  Button,
  Container,
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

const UserSettingsPage = () => {
  const router = useRouter()
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const username = session?.user.username
  const [formState, setFormState] = useState<{
    message: string | null
    status: 'idle' | 'sending' | 'error' | 'success'
  }>({ status: 'idle', message: null })

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setFormState({ status: 'sending', message: null })
    const formData = new FormData(e.target as HTMLFormElement)

    const updateRes = await fetch(`/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })

    if (!updateRes.ok) {
      const updateJson = await updateRes.json()
      setFormState({ status: 'error', message: updateJson.message })
      return
    }
    setFormState({ status: 'success', message: null })
    router.reload()
  }

  return (
    <Container>
      <form
        id="user-settings"
        onSubmit={handleSubmit}
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
                defaultValue={session?.user.biography ?? ''}
                rows={3}
              />
            </Field>
          </FieldGroup>
        </fieldset>

        <Button
          type="submit"
          disabled={formState.status === 'sending'}
          color="secondary"
          className="justify-self-end font-normal"
        >
          Save
        </Button>
      </form>
    </Container>
  )
}
export default UserSettingsPage
