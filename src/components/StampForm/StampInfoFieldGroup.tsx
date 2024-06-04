import { marked } from 'marked'
import { useState } from 'react'

import {
  Button,
  Description,
  Field,
  FieldGroup,
  Input,
  Label,
  Select,
  Strong,
  Textarea,
  TextLink,
} from '@/components/ui'
import { CATEGORIES } from '@/lib/constants'
import { CAPITALS_1800, REGIONS_1800 } from '@/lib/constants/1800/data'

import { StampMarkdownHTML } from '../StampMarkdownHTML'
import { useStampFormContext } from './StampForm'

const presetCategories = Object.values(CATEGORIES)
const presetRegions = Object.values(REGIONS_1800)
const presetCapitals = Object.values(CAPITALS_1800)

export const StampInfoFieldGroup = () => {
  const { stamp } = useStampFormContext()

  const [category, setCategory] = useState(stamp?.category)

  const [previewMarkdown, setPreviewMarkdown] = useState<
    string | Promise<string>
  >('')

  return (
    <FieldGroup>
      <div className="flex space-x-6">
        <Field>
          <Label>Category</Label>
          <Select
            id="category"
            name="category"
            defaultValue={stamp?.category ?? ''}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category&hellip;
            </option>
            {presetCategories.map((category, idx) => (
              <option
                key={`${category}-${idx}`}
                className="capitalize"
                value={category}
              >
                {' '}
                {category}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label>Region</Label>
          <Select
            id="region"
            name="region"
            defaultValue={stamp?.region ?? ''}
            required
          >
            <option value="" disabled>
              Select a region&hellip;
            </option>
            {presetRegions.map((region, idx) => (
              <option
                key={`${region}-${idx}`}
                className="capitalize"
                value={region}
              >
                {' '}
                {region}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label>Mods</Label>
          <Select
            id="modded"
            name="modded"
            defaultValue={stamp?.modded.toString() ?? ''}
            required
          >
            <option value="" disabled>
              Has mods&hellip;
            </option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </Field>
      </div>

      {category === 'production' && (
        <Field>
          <Label>Enter Good</Label>
          <Input
            id="good"
            name="good"
            type="text"
            placeholder="Enter final good in chain"
            defaultValue={stamp?.good ?? undefined}
            required
          />
        </Field>
      )}

      {category === 'island' && (
        <Field>
          <Label>Capital</Label>
          <Select
            id="capital"
            name="capital"
            defaultValue={stamp?.capital ?? undefined}
          >
            <option value="">Not capital</option>
            {presetCapitals.map((capital, idx) => (
              <option
                key={`${capital}-${idx}`}
                className="capitalize"
                value={capital}
              >
                {' '}
                {capital}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field>
        <Label>Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Enter stamp title"
          defaultValue={stamp?.title}
          required
        />
      </Field>
      <Field>
        <Label>Description</Label>
        <Description>
          <Strong>This field now has markdown support! </Strong>
          Only links are styled currently.{' '}
          <TextLink
            htmlLink
            href="https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline"
          >
            Uses Discord markdown style.
          </TextLink>
        </Description>
        <Textarea
          id="description"
          name="description"
          placeholder="Use markdown to create better links, [TheMod](https://mod.io/goodmod)"
          defaultValue={stamp?.description}
          rows={5}
        />
      </Field>
      <div className="flex justify-end">
        <Button
          className="font-normal"
          color="secondary"
          onClick={() => {
            const textarea = document.getElementById(
              'description'
            ) as HTMLTextAreaElement

            setPreviewMarkdown(marked.parse(textarea?.value ?? ''))
          }}
        >
          Preview
        </Button>
      </div>
      {previewMarkdown ? (
        <StampMarkdownHTML description={previewMarkdown as string} />
      ) : (
        <div></div>
      )}
    </FieldGroup>
  )
}
