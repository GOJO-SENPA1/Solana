function ProgressStepper({ steps, currentStep }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
      {steps.map((step, index) => {
        const position = index + 1
        const isCompleted = position < currentStep
        const isActive = position === currentStep

        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
              <div
                className="mono-label"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9999,
                  border: `1px solid ${isCompleted ? 'var(--green)' : isActive ? 'var(--primary)' : 'var(--outline-dim)'}`,
                  color: isCompleted ? 'var(--green)' : isActive ? 'var(--primary-light)' : 'var(--outline-dim)',
                  display: 'grid',
                  placeItems: 'center',
                  background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
                }}
              >
                {position}
              </div>
              <span
                className="mono-label"
                style={{ color: isActive ? 'var(--primary-light)' : 'var(--outline)', fontSize: 12 }}
              >
                {step}
              </span>
            </div>
            {position < steps.length ? (
              <div
                style={{
                  height: 1,
                  flex: 1,
                  margin: '0 12px 20px',
                  background: isCompleted ? 'var(--green)' : 'var(--outline-dim)',
                }}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default ProgressStepper
