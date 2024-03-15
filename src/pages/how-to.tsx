import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import stampButton from '../../public/stamp-button.jpg'
import stampHighlight from '../../public/stamp-highlight.jpg'
import stampFolder from '../../public/stamp-name.jpg'
import stampPath from '../../public/stamp-folder-path.jpg'
import stampPage from '../../public/stamp-download.png'

const HowTo = () => {
  return (
    <Container className="prose">
      <h1>How to use stamps in Anno 1800</h1>
      <p>
        Stamps allow for creating blueprints of a layout that can be reused.
        Stamps are created in game and generate a file that can then be shared
        with others. For a detailed guide, check the{' '}
        <a href="https://anno1800.fandom.com/wiki/Stamps">wiki.</a>
      </p>

      <h2>How to create a stamp</h2>
      <div className="grid-rows grid gap-x-3 md:grid-flow-col md:grid-rows-2">
        <p className="col-span-2">
          The stamp menu is located in the game bar at the bottom of your
          screen. With this tool you can highlight the area to create a stamp.
        </p>
        <p className="col-span-2">
          Stamps are grouped in folders. Clicking on the stamp folder in the
          stamp menu will display a menu above it with a list of stamps in that
          folder. Right clicking the stamp or the stamp folder will display a
          menu allowing you to rename the folder/stamp and set an icon.
        </p>

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

      <h3>Locate the stamp file in Windows</h3>
      <span className="italic">
        C:/Users/[username]/Documents/Anno 1800/stamps/[region]
      </span>
      <div className="md:flex">
        <p>
          Your stamps directory is located in the Windows user Documents folder.
          Stamps will be organized by region and then sub categorized within a
          folder that can contain multiple stamps.
        </p>
        <Image
          src={stampPath}
          alt="The windows folder path where stamps are saved on your computer by default."
        />
      </div>

      <h3 id="#download-guide">How to download a stamp</h3>
      <div className="grid grid-flow-col grid-rows-1">
        <div>
          <p>
            Navigate to the <Link href="/">All stamps page</Link> and select the
            stamp you&apos;d like to use. From the stamp page click the download
            button.
          </p>
          <p className="font-bold">
            The downloaded stamp will be a .zip file. You will need to unzip the
            folder by right click on the file and selecting extract. If that is
            unavailable download{' '}
            <a className="font-bold" href="https://www.7-zip.org/">
              7zip.
            </a>
          </p>
          <p className="text-sm italic">
            The downloaded stamp file can be re-named to your preference.
          </p>
        </div>
        <Image
          src={stampPage}
          alt="Visiting a stamp page to click the download button to retrieve a stamp."
        />
      </div>

      <h3>Place the stamp file in your stamps directory</h3>

      <span className="italic">
        C:/Users/[username]/Documents/Anno 1800/stamps/[region]
      </span>
      <p className="font-bold">
        Stamp files will not work if they are not placed in the right region!
        You may need to create the region folder if missing.
      </p>
      <ul>
        <li>Enbesa</li>
        <li>The Arctic </li>
        <li>The New World</li>
        <li>The Old World</li>
      </ul>
    </Container>
  )
}

export default HowTo
