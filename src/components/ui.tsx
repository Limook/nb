import React from 'react'

export const Button = ({ children, variant = 'primary', className = '', style = {}, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline' }) => {
  const baseStyle: React.CSSProperties = {
    padding: '0.75rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    fontSize: '0.95rem',
    border: '1px solid transparent',
    transition: 'all var(--transition-fast)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    ...style
  }
  
  let variantStyle: React.CSSProperties = {}
  if (variant === 'primary') {
    variantStyle = { 
      backgroundColor: 'var(--primary)', 
      color: '#ffffff',
    }
  } else if (variant === 'secondary') {
    variantStyle = { 
      backgroundColor: 'var(--border-color)', 
      color: 'var(--text-primary)',
      boxShadow: 'none'
    }
  } else if (variant === 'danger') {
    variantStyle = { 
      backgroundColor: 'var(--danger)', 
      color: '#ffffff' 
    }
  } else if (variant === 'outline') {
    variantStyle = { 
      backgroundColor: 'transparent', 
      color: 'var(--primary)', 
      border: '1.5px solid var(--primary)',
      boxShadow: 'none'
    }
  }

  return (
    <button 
      style={{ ...baseStyle, ...variantStyle }} 
      className={`btn-${variant} ${className}`} 
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      {...props}
    >
      {children}
    </button>
  )
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className = '', style = {}, ...props }, ref) => {
  return (
    <input 
      ref={ref}
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid transparent',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        transition: 'all var(--transition-fast)',
        ...style
      }}
      className={`input-field ${className}`}
      onFocus={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export const Card = ({ children, className = '', style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => {
  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        ...style
      }} 
      className={className}
    >
      {children}
    </div>
  )
}

export const Badge = ({ children, color = 'primary' }: { children: React.ReactNode, color?: 'primary' | 'success' | 'warning' | 'danger' | 'gray' }) => {
  const colors = {
    primary: { bg: 'var(--primary-light)', text: 'var(--primary)' },
    success: { bg: 'var(--success-bg)', text: 'var(--success-text)' },
    warning: { bg: 'var(--warning-bg)', text: 'var(--warning-text)' },
    danger: { bg: 'var(--danger-bg)', text: 'var(--danger-text)' },
    gray: { bg: 'var(--bg-primary)', text: 'var(--text-secondary)' },
  }

  return (
    <span style={{
      padding: '0.3rem 0.75rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: colors[color].bg,
      color: colors[color].text,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${colors[color].text}15`
    }}>
      {children}
    </span>
  )
}
