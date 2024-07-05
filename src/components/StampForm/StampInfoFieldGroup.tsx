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
    `
  )
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

          <TextLink
            htmlLink
            href="https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline"
          >
            Uses Discord markdown style.
          </TextLink>
        </Description>
        <Textarea
          id="description"
          name="unsafeDescription"
          placeholder="Use markdown to create better links, [TheMod](https://mod.io/goodmod)"
          defaultValue={stamp?.unsafeDescription}
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
                'description'
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
