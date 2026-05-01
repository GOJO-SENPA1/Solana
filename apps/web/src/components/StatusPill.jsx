const styles = {
  confirmed: {
    background: '#052916',
    color: '#14f195',
    border: '1px solid #14f195',
  },
  pending: {
    background: '#2a1a00',
    color: '#ffb95f',
    border: '1px solid #ffb95f',
  },
  cancelled: {
    background: '#1d1a24',
    color: '#958da1',
    border: '1px solid #4a4455',
  },
}

function StatusPill({ status }) {
  const key = status?.toLowerCase() ?? 'pending'
  const current = styles[key] ?? styles.pending

  return (
    <span
      style={{
        ...current,
        borderRadius: 9999,
        padding: '4px 12px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  )
}

export default StatusPill
