function Input({ label, leftSlot, helperText, style, inputStyle, ...props }) {
  return (
    <label style={{ display: 'grid', gap: 8, ...style }}>
      {label ? (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: 'var(--outline)',
          }}
        >
          {label}
        </span>
      ) : null}
      <div
        style={{
          background: 'var(--bg-low)',
          border: '1px solid var(--outline-dim)',
          borderRadius: 4,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {leftSlot ? <span className="mono-label muted">{leftSlot}</span> : null}
        <input
          className="focusable"
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: 'var(--on-surface)',
            fontFamily: props['data-mono'] ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
            fontSize: 16,
            outline: 'none',
            ...inputStyle,
          }}
          {...props}
        />
      </div>
      {helperText ? <span className="mono-label muted">{helperText}</span> : null}
    </label>
  )
}

export default Input
