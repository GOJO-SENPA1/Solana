const baseStyle = {
  borderRadius: 4,
  padding: '14px 24px',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: 16,
  lineHeight: 1,
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

const variants = {
  primary: {
    background: 'var(--primary)',
    color: '#fff',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--primary-light)',
    border: '1px solid var(--primary)',
  },
}

function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  onMouseEnter,
  onMouseLeave,
  style,
  ...props
}) {
  return (
    <button
      className="focusable"
      style={{
        ...baseStyle,
        ...(variants[variant] ?? variants.primary),
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
      onMouseEnter={(event) => {
        if (variant === 'primary') {
          event.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.5)'
        } else {
          event.currentTarget.style.background = 'rgba(124,58,237,0.1)'
        }
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.boxShadow = 'none'
        if (variant === 'ghost') {
          event.currentTarget.style.background = 'transparent'
        }
        onMouseLeave?.(event)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
