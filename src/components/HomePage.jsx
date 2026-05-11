import { useNavigate } from 'react-router-dom'

const TAG_STYLES = {
    beginner: { color: '#7db87d', border: 'rgba(125,184,125,0.4)' },
    worship: { color: '#7aa3cc', border: 'rgba(122,163,204,0.4)' },
    shout: { color: '#cc7a7a', border: 'rgba(204,122,122,0.4)' },
    advanced: { color: '#c8a96e', border: 'rgba(200,169,110,0.4)' },
}

function HomePage({ movements }) {
    const navigate = useNavigate()

    return (
        <div style={{ padding: '2rem', maxWidth: 760, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <p style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#c8a96e',
                    marginBottom: 6,
                }}>
                    Gospel Piano Trainer
                </p>
                <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
                    Move<span style={{ color: '#c8a96e' }}>ment</span>
                </h1>
                <p style={{ marginTop: 10, color: 'rgba(240,236,227,0.4)', fontSize: 14 }}>
                    Pick a movement to practice. Click a card to enter the trainer.
                </p>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: "24px",
            }}>
                {movements.map(m => (
                    <div
                        key={m.id}
                        onClick={() => navigate(`/movements/${m.id}`)}
                        style={{
                            background: '#161618',
                            padding: '1.5rem',
                            position: 'relative',
                            transition: 'background 0.15s ease, border 0.1s ease',
                            borderLeft: '2px solid transparent',
                            border: '0.5px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: 20,
                            fontWeight: 700,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#161618'
                            e.currentTarget.style.borderLeft = '2px solid #c8a96e'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = '#161618'
                            e.currentTarget.style.borderLeft = '0.5px solid rgba(255,255,255,0.08)'
                        }}
                    >
                        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                            {m.name}
                        </div>
                        <div style={{
                            fontSize: 13,
                            color: 'rgba(240,236,227,0.45)',
                            lineHeight: 1.5,
                            marginBottom: 16,
                        }}>
                            {m.description}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {m.tags.map(tag => (
                                <span
                                    key={tag}
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 9,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        padding: '2px 8px',
                                        borderRadius: 10,
                                        color: TAG_STYLES[tag]?.color,
                                        border: `0.5px solid ${TAG_STYLES[tag]?.border}`,
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div style={{
                            position: 'absolute',
                            right: '1.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#c8a96e',
                            fontSize: 18,
                            opacity: 0.4,
                        }}>
                            →
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage