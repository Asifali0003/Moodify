import React from 'react'

// accepts label and placeholder props
const FormGroup = ({ label, placeholder, type = 'text' ,autoComplete, value, onChange}) => {
  return (
    <div className="form-group">
        <label htmlFor={label}>{label.charAt(0).toUpperCase() + label.slice(1)}</label>
        <input
          value={value}
          onChange={onChange}
          type={type}
          name={label}
          id={label}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
    </div>
  )
}

export default FormGroup