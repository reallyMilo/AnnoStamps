import type { Metadata } from 'next'

import { Container, Heading, Strong, Subheading, Text } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Privacy | AnnoStamps',
}
const Privacy = () => {
  return (
    <Container className="prose space-y-2">
      <Heading>Privacy Policy</Heading>

      <Subheading>Anno Stamps Privacy Policy</Subheading>
      <Text>
        This Privacy Policy describes how your personal information is
        collected, used, and shared when you visit https://annostamps.com , or
        any of our product demo subdomains, (the “Site”).
      </Text>
      <Subheading level={3}>PERSONAL INFORMATION WE COLLECT</Subheading>
      <Text>
        When you visit the Site, we automatically collect certain information
        about your device, including information about your web browser, IP
        address, time zone, and some of the cookies that are installed on your
        device. Additionally, as you browse the Site, we collect information
        about the individual web pages or products that you view, what websites
        or search terms referred you to the Site, and information about how you
        interact with the Site. We refer to this automatically-collected
        information as “Device Information.”
      </Text>
      <Text>
        <Strong>
          We collect Device Information using the following technologies:
        </Strong>
      </Text>
      <ul className="list-inside list-disc text-midnight dark:text-white">
        <li>
          “Cookies” are data files that are placed on your device or computer
          and often include an anonymous unique identifier. For more information
          about cookies, and how to disable cookies, visit
          http://www.allaboutcookies.org.
        </li>
        <li>
          “Log files” track actions occurring on the Site, and collect data
          including your IP address, browser type, Internet service provider,
          referring/exit pages, and date/time stamps.
        </li>
        <li>
          “Web beacons,” “tags,” and “pixels” are electronic files used to
          record information about how you browse the Site.{' '}
        </li>
      </ul>

      <Text>
        Additionally when you subscribe to our newsletter we collect your name
        and email address.
      </Text>
      <Subheading level={3}>
        HOW DO WE USE YOUR PERSONAL INFORMATION?
      </Subheading>
      <Text>
        We use your name and email address to communicate with you and to
        provide you with information or advertising relating to our products or
        services.
      </Text>
      <Text>
        We use the Device Information that we collect to help us screen for
        potential risk to the Site (in particular, your IP address), and more
        generally to improve and optimize our Site (for example, by generating
        analytics about how our customers browse and interact with the Site, and
        to assess the success of our marketing and advertising campaigns).
      </Text>
      <Subheading level={3}>SHARING YOUR PERSONAL INFORMATION</Subheading>
      <Text>
        We share your Personal Information with third parties, such as Google
        Analytics, to help us use your Personal Information, as described above.
        &nbsp;We use Google Analytics to help us understand how our customers
        use the Site–you can read more about how Google uses your Personal
        Information here:
        &nbsp;https://www.google.com/intl/en/policies/privacy/. You can also
        opt-out of Google Analytics here:
        https://tools.google.com/dlpage/gaoptout.
      </Text>
      <Text>
        Finally, we may also share your Personal Information to comply with
        applicable laws and regulations, to respond to a subpoena, search
        warrant or other lawful request for information we receive, or to
        otherwise protect our rights.
      </Text>
      <Text>
        As described above, we use your Personal Information to provide you with
        targeted advertisements or marketing communications we believe may be of
        interest to you. For more information about how targeted advertising
        works, you can visit the Network Advertising Initiative’s (“NAI”)
        educational page at
        http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.
      </Text>
      <Text>You can opt out of targeted advertising by:</Text>
      <ul className="list-inside list-disc text-midnight dark:text-white">
        <li>FACEBOOK – https://www.facebook.com/settings/?tab=ads</li>
        <li>GOOGLE – https://www.google.com/settings/ads/anonymous</li>
        <li>
          TWITTER –
          https://help.twitter.com/en/safety-and-security/privacy-controls-for-tailored-ads
        </li>
      </ul>

      <Subheading level={3}>DO NOT TRACK</Subheading>
      <Text>
        Please note that we do not alter our Site’s data collection and use
        practices when we see a Do Not Track signal from your browser.
      </Text>
      <Subheading level={3}>YOUR RIGHTS</Subheading>
      <Text>
        If you are a European resident, you have the right to access personal
        information we hold about you and to ask that this information be
        corrected, updated, or deleted. If you would like to exercise this
        right, please contact us through the contact information below.
      </Text>
      <Text>
        Additionally, if you are a European resident we note that we are
        processing your information in order to pursue our legitimate business
        interests listed above. Additionally, please note that your information
        will be transferred outside of Europe, including to Canada and the
        United States.
      </Text>
      <Subheading level={3}>DATA RETENTION</Subheading>
      <Text>
        When you subscribe to our newsletter through the Site, we will maintain
        your information for our records unless and until you ask us to delete
        this information.
      </Text>
      <Subheading level={3}>CHANGES</Subheading>
      <Text>
        We may update this privacy policy from time to time in order to reflect,
        for example, changes to our practices or for other operational, legal or
        regulatory reasons.
      </Text>
      <Subheading level={3}>CONTACT US</Subheading>
      <Text>
        For more information about our privacy practices, if you have questions,
        would like to update or remove your personal information, or if you
        would like to make a complaint, please contact us by e-mail at
        annostampsite@gmail.com.&nbsp;
      </Text>
    </Container>
  )
}

export default Privacy
