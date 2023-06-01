import Image from 'next/image'

import Layout from '@/components/Layout/Layout'

const HowTo = () => {
  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-5 py-12">
        <h1 className="pb-2 text-3xl font-bold">
          How to use stamps in Anno 1800
        </h1>
        <p className="pb-10">
          Stamps allow for creating blueprints of a layout that can be reused.
          <br />
          Stamps are created in game and generate a file that can then be shared
          with others.
        </p>
        <h3 className="pb-5 text-xl font-bold">How to create a stamp</h3>
        <p className="font-bold">Create the stamp in game.</p>
        <p className="py-5">The stamp menu is shown in the screenshot below.</p>
        <Image
          src="/stamp-button.jpg"
          width={800}
          height={600}
          alt="Stamp button"
        />
        <p className="py-5">
          With this tool you can highlight the area to create a stamp.
        </p>
        <Image
          src="/stamp-highlight.jpg"
          width={800}
          height={600}
          alt="Stamp highlight"
        />
        <p className="py-5">
          Stamps are grouped in folders. Clicking on the stamp folder in the
          stamp menu will display a menu above it with a list of stamps in that
          folder. Rightlicking the stamp or the stamp folder will display a menu
          allowing you to rename the folder/stamp and set an icon.
        </p>
        <Image
          src="/stamp-name.jpg"
          width={800}
          height={600}
          alt="Stamp folder"
          style={{ height: 'auto' }}
        />
        <p className="pt-5 font-bold">Locate the stamp file in Windows</p>
        <p className="py-5">
          Your stamps directory is located in the Windows user
          &apos;Documents&apos; folder, by default:{' '}
          <span className="italic">
            &apos;C:/Users/[username]/Documents/Anno 1800/stamps&apos;
          </span>
        </p>
        <p className="py-5">
          Stamps will be organised by region and then sub categorised within a
          folder that can contain multiple stamps.
        </p>
        <Image
          src="/stamp-folder-path.jpg"
          width={800}
          height={600}
          alt="Stamp folder"
        />
        <h3 className="pb-5 pt-10 text-xl font-bold">
          How to use a downloaded stamp
        </h3>
        <p className="font-bold">Download the stamp</p>
        <p>
          Navigate to the &apos;All stamps&apos; page and select the stamp
          you&apos;d like to use. From the stamp page click the download button.
        </p>
        <Image
          src="/stamp-download.png"
          width={600}
          height={300}
          alt="Download stamp"
        />

        <p className="text-sm italic">
          The downloaded stamp file can be re-named to your preference.
        </p>

        <p className="py-5 font-bold">
          Place the stamp file in your stamps directory
        </p>
        <p className="pb-2">
          Your stamps directory is located in the Windows user
          &apos;Documents&apos; folder, by default:{' '}
          <span className="italic">
            &apos;C:/Users/[username]/Documents/Anno 1800/stamps&apos;
          </span>
        </p>
        <p className="pb-5">
          Stamps are organised by the region they are associated with so you
          will need to place the stamp file in the relevant region folder.
          Stamps can also be further sub categorised inside the region folder
          with a folder containing multiple stamps.
        </p>
        <Image
          src="/stamp-folder-path.jpg"
          width={800}
          height={600}
          alt="Stamp folder"
        />
      </div>
    </Layout>
  )
}

export default HowTo
