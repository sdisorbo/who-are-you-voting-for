export const metadata = {
  title: 'About — Who Are You Voting For?',
}

export default function AboutPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h1>

      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
        <p>
          <strong className="text-gray-900 dark:text-white">Who Are You Voting For?</strong> is an anonymous,
          real-time US election polling site. No login. No tracking. Just your voice.
        </p>
        <p>
          Vote on active races and hypothetical matchups to instantly see how others are leaning —
          broken down nationally and by state on an interactive map.
        </p>
        <p>
          To prevent double voting, each IP address can cast one vote per election. Only a
          cryptographic hash of your IP is stored — never the raw address — and it is never shared
          or used for any other purpose.
        </p>
        <p>
          All data is aggregated. No individual votes are stored or attributable to any person.
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">Business Inquiries &amp; Questions</p>
          <a href="mailto:sfdisorbo@gmail.com" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            sfdisorbo@gmail.com
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">LinkedIn</p>
          <a href="https://www.linkedin.com/in/sam-disorbo-b51056220/" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            linkedin.com/in/sam-disorbo-b51056220
          </a>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">GitHub</p>
          <a href="https://github.com/sdisorbo" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            github.com/sdisorbo
          </a>
        </div>
      </div>
    </div>
  )
}
