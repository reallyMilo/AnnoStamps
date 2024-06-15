import Image from 'next/image'

import { Container, Heading, Subheading, Text, TextLink } from '@/components/ui'

import stampButton from '../../../public/stamp-button.jpg'
import stampPage from '../../../public/stamp-download.png'
import stampPath from '../../../public/stamp-folder-path.jpg'
import stampHighlight from '../../../public/stamp-highlight.jpg'
import stampFolder from '../../../public/stamp-name.jpg'

const HowTo = () => {
  return (
    <Container className="prose">
      <Heading>How to use stamps in Anno 1800</Heading>
      <Text>
        Stamps allow for creating blueprints of a layout that can be reused.
        Stamps are created in game and generate a file that can then be shared
        with others. For a detailed guide, check the{' '}
        <TextLink
          target="_blank"
          htmlLink
          href="https://anno1800.fandom.com/wiki/Stamps"
        >
          wiki.
        </TextLink>
      </Text>

      <Subheading>How to create a stamp</Subheading>
      <div className="grid-rows grid gap-x-3 md:grid-flow-col md:grid-rows-2">
        <Text className="col-span-2">
          The stamp menu is located in the game bar at the bottom of your
          screen. With this tool you can highlight the area to create a stamp.
        </Text>
        <Text className="col-span-2">
          Stamps are grouped in folders. Clicking on the stamp folder in the
          stamp menu will display a menu above it with a list of stamps in that
          folder. Right clicking the stamp or the stamp folder will display a
          menu allowing you to rename the folder/stamp and set an icon.
        </Text>

        <div className="col-span-3 md:row-span-2">
          <Image
            src={stampButton}
            alt="Location of the stamp tool icon in the menu at the bottom of the screen."
          />
          <Image
            src={stampHighlight}
            alt="Highlighting of buildings for the creation of the stamp."
          />
          <Image
            src={stampFolder}
            alt="Accessing created stamps with the ability to rename and organize in folders."
          />
        </div>
      </div>

      <Subheading level={3}>Locate the stamp file in Windows</Subheading>
      <Subheading level={5} className="italic">
        C:/Users/[username]/Documents/Anno 1800/stamps/[region]
      </Subheading>
      <div className="md:grid md:grid-cols-3">
        <Text>
          Your stamps directory is located in the Windows user Documents folder.
          Stamps will be organized by region and then sub categorized within a
          folder that can contain multiple stamps.
        </Text>
        <Image
          className="col-span-2"
          src={stampPath}
          alt="The windows folder path where stamps are saved on your computer by default."
        />
      </div>

      <Subheading level={3}>How to download a stamp</Subheading>
      <div className="grid grid-flow-col grid-rows-1">
        <div>
          <Text>
            Navigate to the <TextLink href="/">All stamps page</TextLink> and
            select the stamp you&apos;d like to use. From the stamp page click
            the download button.
          </Text>
          <Text className="font-bold">
            The downloaded stamp will be a .zip file. You will need to unzip the
            folder by right click on the file and selecting extract. If that is
            unavailable download{' '}
            <TextLink
              target="_blank"
              className="font-bold"
              href="https://www.7-zip.org/"
            >
              7zip.
            </TextLink>
          </Text>
          <Text className="text-sm italic">
            The downloaded stamp file can be re-named to your preference.
          </Text>
        </div>
        <Image
          src={stampPage}
          alt="Visiting a stamp page to click the download button to retrieve a stamp."
        />
      </div>

      <Subheading level={3}>
        Place the stamp file in your stamps directory
      </Subheading>

      <Subheading level={5} className="italic">
        C:/Users/[username]/Documents/Anno 1800/stamps/[region]
      </Subheading>
      <Text className="font-bold">
        Stamp files will not work if they are not placed in the right region!
        You may need to create the region folder if missing.
      </Text>
      <ul className="text-midnight dark:text-white">
        <li>Enbesa</li>
        <li>The Arctic </li>
        <li>The New World</li>
        <li>The Old World / Cape Trelawney</li>
      </ul>
    </Container>
  )
}

export default HowTo
