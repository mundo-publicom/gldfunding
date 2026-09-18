import IntlTelInput from '@intl-tel-input/react'
import type { IntlTelInputRef } from '@intl-tel-input/react'
import { useEffect, useId, useRef } from 'react'
import { Field } from './fields'

type Props = {
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
}

/**
 * US-only telephone field. The flag stays on United States, other countries
 * are not in the list, and the number is formatted as the applicant types.
 */
export function PhoneInput({
  label,
  hint,
  error,
  required,
  className,
  value,
  onChange,
  autoComplete = 'tel',
}: Props) {
  const id = useId()
  const telRef = useRef<IntlTelInputRef>(null)

  useEffect(() => {
    const iti = telRef.current?.getInstance()
    if (!iti) return
    void iti.promise.then(() => {
      const selected = telRef.current
        ?.getInput()
        ?.closest('.iti')
        ?.querySelector('.iti__selected-country')
      if (!(selected instanceof HTMLElement)) return
      // Country picking is disabled (US only). Don't announce a "change country" control.
      selected.setAttribute('aria-hidden', 'true')
      selected.removeAttribute('aria-label')
    })
  }, [])

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      htmlFor={id}
    >
      <IntlTelInput
        ref={telRef}
        initialCountry="us"
        onlyCountries={['us']}
        countrySelectorMode="OFF"
        formatAsYouType
        strictMode
        separateDialCode
        containerClass="phone-input"
        loadUtils={() => import('intl-tel-input/utils')}
        value={value}
        onChangeNumber={onChange}
        inputProps={{
          id,
          className: 'input',
          autoComplete,
          inputMode: 'tel',
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined,
        }}
      />
    </Field>
  )
}
