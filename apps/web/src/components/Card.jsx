function Card({ children, style, ...props }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--outline-dim)',
        borderRadius: 12,
        padding: 24,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
