'use client'

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
  Subheading,
  Text,
  Textarea,
  TextLink,
} from '@/components/ui'
import { CATEGORIES } from '@/lib/constants'
import { CAPITALS_1800, REGIONS_1800 } from '@/lib/constants/1800/data'
import { parseAndSanitizedMarkdown } from '@/lib/markdown'

import { useStampFormContext } from './StampForm'

const presetCategories = Object.values(CATEGORIES)
const presetRegions = Object.values(REGIONS_1800)
const presetCapitals = Object.values(CAPITALS_1800)

export const StampInfoFieldGroup = () => {
  const { stamp } = useStampFormContext()

  const [category, setCategory] = useState(stamp?.category)

  const [previewMarkdown, setPreviewMarkdown] = useState(
    stamp?.markdownDescription ??
      `
    <p>Use markdown to create better links,   
      <a target="_blank" href="https://mod.io/goodmod">
        TheMod
      </a>
    </p>
    `,
  )
  return (
    <FieldGroup>
      <div className="flex space-x-6">
        <Field>
          <Label>Category</Label>
          <Select
            defaultValue={stamp?.category ?? ''}
            id="category"
            name="category"
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option disabled value="">
              Select a category&hellip;
            </option>
            {presetCategories.map((category, idx) => (
              <option
                className="capitalize"
                key={`${category}-${idx}`}
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
            defaultValue={stamp?.region ?? ''}
            id="region"
            name="region"
            required
          >
            <option disabled value="">
              Select a region&hellip;
            </option>
            {presetRegions.map((region, idx) => (
              <option
                className="capitalize"
                key={`${region}-${idx}`}
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
            defaultValue={stamp?.modded.toString() ?? ''}
            id="modded"
            name="modded"
            required
          >
            <option disabled value="">
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
            defaultValue={stamp?.good ?? undefined}
            id="good"
            name="good"
            placeholder="Enter final good in chain"
            required
            type="text"
          />
        </Field>
      )}

      {category === 'island' && (
        <Field>
          <Label>Capital</Label>
          <Select
            defaultValue={stamp?.capital ?? undefined}
            id="capital"
            name="capital"
          >
            <option value="">Not capital</option>
            {presetCapitals.map((capital, idx) => (
              <option
                className="capitalize"
                key={`${capital}-${idx}`}
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
          defaultValue={stamp?.title}
          id="title"
          name="title"
          placeholder="Enter stamp title"
          required
          type="text"
        />
      </Field>
      <Field>
        <Label>Description</Label>
        <Description>
          <Strong>This field now has markdown support! </Strong>

          <TextLink
            href="https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline"
            htmlLink
          >
            Uses Discord markdown style.
          </TextLink>
        </Description>
        <Textarea
          defaultValue={stamp?.unsafeDescription}
          id="description"
          name="unsafeDescription"
          placeholder="Use markdown to create better links, [TheMod](https://mod.io/goodmod)"
          rows={5}
        />
      </Field>
      <Text>Only links are styled currently.</Text>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between">
          <Subheading>Preview </Subheading>
          <Button
            className="font-normal"
            color="secondary"
            onClick={() => {
              const textarea = document.getElementById(
                'description',
              ) as HTMLTextAreaElement

              setPreviewMarkdown(parseAndSanitizedMarkdown(textarea.value))
            }}
          >
            Preview Markdown
          </Button>
        </div>
        <div
          className="stamp-markdown-html-wrapper"
          dangerouslySetInnerHTML={{ __html: previewMarkdown }}
        ></div>
      </div>
    </FieldGroup>
  )
}
