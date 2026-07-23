import { useNavigate } from 'react-router-dom'

function TermsPage() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '2rem', maxWidth: 640, margin: '0 auto' }}>

      <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 6 }}>
        Legal
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: '2rem' }}>Terms & Conditions</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, color: 'rgba(240,236,227,0.6)', fontSize: 14, lineHeight: 1.7 }}>
        <Section title="1. Use of Service">
          Movement is a gospel piano training tool. By creating an account you agree to use it for personal, non-commercial learning purposes only.
        </Section>
        <Section title="2. Your Account">
          You are responsible for keeping your login credentials secure. We are not liable for any loss resulting from unauthorized access to your account.
        </Section>
        <Section title="3. Content">
          All chord progressions, movements, and educational content on this platform are provided for learning purposes. Do not redistribute or resell any content.
        </Section>
        <Section title="4. Privacy">
          We store your email address and display name to provide the service. We do not sell your data to third parties.
        </Section>
        <Section title="5. Changes">
          We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
        </Section>
        <Section title="6. Contact">
          For any questions about these terms, reach out via the website.
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p style={{ fontWeight: 700, color: '#f0ece3', marginBottom: 6 }}>{title}</p>
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  )
}

export default TermsPage