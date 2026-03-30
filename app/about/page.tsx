'use client'

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: '560px',
        margin: '0 auto',
        padding: '96px 24px 48px',
      }}
    >
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#f0f4ff',
          margin: '0 0 28px',
          letterSpacing: '-0.02em',
        }}
      >
        About
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        <p style={{ fontSize: '15px', color: '#8899bb', lineHeight: 1.7, margin: 0 }}>
          <strong style={{ color: '#f0f4ff' }}>Who Are You Voting For?</strong> is an anonymous,
          real-time US election polling site. No login. No tracking. Just your voice.
        </p>
        <p style={{ fontSize: '15px', color: '#8899bb', lineHeight: 1.7, margin: 0 }}>
          Vote on active races and hypothetical matchups to instantly see how others are leaning —
          broken down nationally and by state on an interactive map.
        </p>
        <p style={{ fontSize: '15px', color: '#8899bb', lineHeight: 1.7, margin: 0 }}>
          To prevent double voting, each IP address can cast one vote per election. Only a
          SHA-256 cryptographic hash of your IP is stored — never the raw address — and it is
          never shared or used for any other purpose.
        </p>
        <p style={{ fontSize: '15px', color: '#8899bb', lineHeight: 1.7, margin: 0 }}>
          All data is aggregated. No individual votes are stored or attributable to any person.
        </p>
      </div>

      <div
        style={{
          borderTop: '1px solid #1e2d52',
          paddingTop: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8899bb',
              margin: '0 0 6px',
            }}
          >
            Business Inquiries &amp; Questions
          </p>
          <a
            href="mailto:sfdisorbo@gmail.com"
            style={{
              fontSize: '14px',
              color: '#3b82f6',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            sfdisorbo@gmail.com
          </a>
        </div>

        <div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8899bb',
              margin: '0 0 6px',
            }}
          >
            LinkedIn
          </p>
          <a
            href="https://www.linkedin.com/in/sam-disorbo-b51056220/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '14px',
              color: '#3b82f6',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            linkedin.com/in/sam-disorbo-b51056220
          </a>
        </div>

        <div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8899bb',
              margin: '0 0 6px',
            }}
          >
            GitHub
          </p>
          <a
            href="https://github.com/sdisorbo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '14px',
              color: '#3b82f6',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            github.com/sdisorbo
          </a>
        </div>
      </div>
    </div>
  )
}
