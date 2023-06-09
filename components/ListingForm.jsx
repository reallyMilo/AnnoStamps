import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import * as Yup from 'yup'

import ImageUpload from '@/components/ImageUpload'
import Input from '@/components/Auth/Input'
import StampUpload from '@/components/StampUpload'

import SelectField from './Select'
const ListingSchema = Yup.object().shape({
  stampTitle: Yup.string().max(50).trim().required('Required'),
  stampDescription: Yup.string().max(300).trim().required('Required'),
  stampCategory: Yup.string().trim().required('Required'),
  stampRegion: Yup.string().trim().required('Required'),
  stampModded: Yup.string().trim().required('Required'),
})

const ListingForm = ({
  initialValues = null,
  redirectPath = '',
  buttonText = 'Submit',
  session,
  onSubmit = () => null,
}) => {
  const router = useRouter()

  const [disabled, setDisabled] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? '')
  const [stampUrl, setStampUrl] = useState(initialValues?.stamp ?? '')

  const upload = async (image) => {
    if (!image) return

    let toastId
    try {
      setDisabled(true)
      toastId = toast.loading('Uploading...')
      const { data } = await axios.post('/api/image-upload', { image })
      setImageUrl(data?.url)
      toast.success('Successfully uploaded', { id: toastId })
    } catch (e) {
      toast.error('Unable to upload', { id: toastId })
      setImageUrl('')
    } finally {
      setDisabled(false)
    }
  }
  const uploadStamp = async (stamp) => {
    if (!stamp) return

    let toastId
    try {
      setDisabled(true)
      toastId = toast.loading('Uploading...')
      const { data } = await axios.post('/api/stamp-upload', { stamp })
      setStampUrl(data?.url)
      toast.success('Successfully uploaded', { id: toastId })
    } catch (e) {
      toast.error('Unable to upload', { id: toastId })
      setStampUrl('')
    } finally {
      setDisabled(false)
    }
  }

  const handleOnSubmit = async (values = null) => {
    let toastId
    if (imageUrl && stampUrl) {
      try {
        setDisabled(true)
        toastId = toast.loading('Submitting...')
        // Submit data
        if (typeof onSubmit === 'function') {
          await onSubmit({
            ...values,
            stampScreenshot: imageUrl,
            stampFile: stampUrl,
          })
        }
        toast.success('Successfully submitted', { id: toastId })
        // Redirect user
        if (redirectPath) {
          router.push(redirectPath)
        }
      } catch (e) {
        toast.error('Unable to submit', { id: toastId })
        setDisabled(false)
      }
    } else {
      alert('Screenshot and Stamp file are required')
    }
  }

  const { stampScreenshot, stampFile, ...initialFormValues } =
    initialValues ?? {
      stampScreenshot: '',
      stampFile: '',
      stampTitle: '',
      stampDescription: '',
      stampCategory: '',
      stampRegion: '',
      stampModded: '',
    }

  return (
    <div>
      <div className="mb-10 grid grid-cols-2 gap-10">
        <div>
          <ImageUpload
            initialImage={{
              src: stampScreenshot,
              alt: initialFormValues.title,
            }}
            onChangePicture={upload}
          />
        </div>
        <div>
          <StampUpload
            initialImage={{ src: stampFile, alt: initialFormValues.title }}
            onChangePicture={uploadStamp}
          />
        </div>
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={ListingSchema}
        validateOnBlur={false}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-8">
            <div className="flex w-full space-x-4">
              <div>
                <label htmlFor="stampCategory">Category</label>
                <br />
                <SelectField lable="Region" as="select" name="stampCategory">
                  <option value="">-Select-</option>
                  <option value="Housing">Housing</option>
                  <option value="Production Chain">Production Chain</option>
                  <option value="Farm">Farm</option>
                  <option value="Cosmetic">Cosmetic/Beauty Build</option>
                  <option value="General">General</option>
                </SelectField>
              </div>
              <div>
                <label htmlFor="stampRegion">Region</label>
                <br />
                <SelectField lable="Region" as="select" name="stampRegion">
                  <option value="">-Select-</option>
                  <option value="Old World">Old World</option>
                  <option value="New World">New World</option>
                  <option value="Cape Trelawney">Cape Trelawney</option>
                  <option value="Arctic">Arctic</option>
                  <option value="Enbesa">Enbesa</option>
                </SelectField>
              </div>
              <div>
                <label htmlFor="stampModded">Uses Mods</label>
                <br />
                <SelectField lable="Mods" as="select" name="stampModded">
                  <option value="">-Select-</option>
                  <option value="TRUE">Yes</option>
                  <option value="FALSE">No</option>
                </SelectField>
              </div>
              <div>
                {session ? (
                  <Input
                    name="username"
                    type="text"
                    label="Username"
                    value={session}
                    disabled={true}
                    rows={5}
                  />
                ) : (
                  <>
                    <p className="mb-2 text-red-500">
                      <ExclamationCircleIcon className="mr-1 inline-block h-5 w-5" />
                      Username not set
                    </p>
                    <Link
                      href="/account"
                      className="rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
                    >
                      Set Username
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Input
                name="stampTitle"
                type="text"
                label="Title"
                placeholder="The title of your stamp"
                disabled={disabled}
              />

              <Input
                name="stampDescription"
                type="textarea"
                label="Description"
                placeholder="Add a description for your stamp"
                disabled={disabled}
                rows={5}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={disabled || !isValid}
                className="rounded-md bg-yellow-600 px-6 py-2 text-white transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-700"
              >
                {isSubmitting ? 'Submitting...' : buttonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

ListingForm.propTypes = {
  initialValues: PropTypes.shape({
    stampFile: PropTypes.string,
    stampScreenshot: PropTypes.string,
    stampTitle: PropTypes.string,
    stampDescription: PropTypes.string,
    stampCategory: PropTypes.string,
    stampRegion: PropTypes.string,
  }),
  redirectPath: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
}

export default ListingForm
