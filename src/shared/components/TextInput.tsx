'use client'

interface TextInputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  minLength?: number
  maxLength?: number
  showCounter?: boolean
  error?: string
  id?: string
  className?: string
  textareaClassName?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
}

export function TextInput({
  label,
  value,
  onChange,
  minLength = 0,
  maxLength,
  showCounter = true,
  error,
  id = 'text-input',
  className = '',
  textareaClassName = '',
  placeholder,
  disabled,
  required,
  rows,
}: TextInputProps) {
  const currentLength = value.length
  const hasMinLength = currentLength >= minLength
  const isNearMax = maxLength && currentLength > maxLength * 0.9

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (!maxLength || text.length <= maxLength) {
      onChange(text)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-describedby={showCounter ? `${id}-feedback` : undefined}
        aria-invalid={!!error}
        className={`w-full min-h-32 p-3 border card-border rounded-lg resize-y btn-focus text-sm ${textareaClassName}`}
      />
      {showCounter && (
        <div
          className="flex items-center justify-between mt-2 text-xs"
          id={`${id}-feedback`}
        >
          <span
            className={
              error || (!hasMinLength && currentLength > 0)
                ? 'text-destructive'
                : 'text-success'
            }
          >
            {error || (hasMinLength ? '✓ Pronto' : `Mínimo ${minLength} caracteres`)}
          </span>
          {maxLength && (
            <span
              className={
                isNearMax && currentLength > maxLength
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              }
            >
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
