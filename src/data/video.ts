import { SITE } from './site'

/**
 * The GLD Funding overview video.
 *
 * Sourced from the current site (/videos/description.mp4, 2021), re-encoded
 * from 1080p/8.6 MB to 720p/3.4 MB with no visible loss — it is flat vector
 * animation, which compresses hard.
 *
 * Chapters and transcript are derived from the narration's own word timings.
 */
export const OVERVIEW_VIDEO = {
  src: '/videos/description.mp4',
  poster: '/videos/description-poster.webp',
  captions: '/videos/description.en.vtt',
  title: 'How GLD Funding works',
  durationLabel: '1 min 22 sec',
  durationISO: 'PT1M22S',
  width: 1280,
  height: 720,
  uploadDate: '2021-09-23',
  description:
    'A short animated walkthrough: what a merchant cash advance is, why it differs from a bank loan, and the three steps from application to funded.',
  chapters: [
    { at: 4, label: 'When you need capital' },
    { at: 17, label: 'What an advance is' },
    { at: 32, label: 'Why GLD' },
    { at: 44, label: 'Apply' },
    { at: 54, label: 'Approve' },
    { at: 67, label: 'Get funded' },
  ],
  /** Verbatim narration, grouped into paragraphs. Serves WCAG 1.2.3 and GEO. */
  transcript: [
    'As a small business owner, we know how difficult it is to run a business. Whether you are low on cash, needing new equipment, requiring a steady cash flow, or looking to obtain working capital, a merchant cash advance is an easy solution to get working capital for your business.',
    'Unlike traditional bank loans, a merchant cash advance is a purchase of a business’s future receivables. At GLD Funding, we provide quick access to funds in only 24 hours. We utilize your expected future sales to be able to provide you with working capital for your business needs.',
    'Why choose GLD Funding? We offer quick approvals, flexible repayment options, minimal paperwork, and no minimum credit score required. Overall, simple and fast funding.',
    'It’s quick and easy. Fill out an application with your basic information. Once filled out, submit it along with your last three months of your business bank statements.',
    'Our underwriting team will review your application and financial statements to develop a solution specific to your business needs. One of our funding specialists will contact you with an offer. There are no personal guarantees and minimal documents required.',
    'Once the contract is signed, you will receive your funds in your bank account on the same day.',
    'What are you waiting for? Call us today. Follow us on Instagram and Facebook, or visit our website.',
  ],
} as const

/** VideoObject schema — makes the video itself eligible for search results. */
export const videoSchema = (pagePath: string) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: OVERVIEW_VIDEO.title,
  description: OVERVIEW_VIDEO.description,
  thumbnailUrl: `${SITE.domain}${OVERVIEW_VIDEO.poster}`,
  contentUrl: `${SITE.domain}${OVERVIEW_VIDEO.src}`,
  uploadDate: OVERVIEW_VIDEO.uploadDate,
  duration: OVERVIEW_VIDEO.durationISO,
  width: OVERVIEW_VIDEO.width,
  height: OVERVIEW_VIDEO.height,
  transcript: OVERVIEW_VIDEO.transcript.join(' '),
  publisher: { '@id': `${SITE.domain}/#organization` },
  isFamilyFriendly: true,
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SeekToAction',
    target: `${SITE.domain}${pagePath}?t={seek_to_second_number}`,
    'startOffset-input': 'required name=seek_to_second_number',
  },
  hasPart: OVERVIEW_VIDEO.chapters.map((c, i, arr) => ({
    '@type': 'Clip',
    name: c.label,
    startOffset: c.at,
    endOffset: arr[i + 1]?.at ?? 82,
    url: `${SITE.domain}${pagePath}?t=${c.at}`,
  })),
})
