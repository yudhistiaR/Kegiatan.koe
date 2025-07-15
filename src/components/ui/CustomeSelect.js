'use client'
import React from 'react'
import Select from 'react-select'

export default function CustomSelect({ isMulti = false, ...props }) {
  // Custom styles untuk react-select yang meniru class Tailwind
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      color: '#fff',
      width: '100%',
      borderRadius: '0.375rem',
      borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)',
      borderWidth: '1px',
      backgroundColor: 'transparent',
      boxShadow: state.isFocused ? '0 0 0 1px var(--ring)' : 'var(--shadow-sm)',
      padding: '0 0.75rem',
      fontSize: '0.875rem',
      '&:hover': {
        borderColor: state.isFocused ? 'var(--ring)' : 'var(--input)'
      },
      outline: 'none',
      '&:focus': {
        outline: 'none',
        ring: '1px solid var(--ring)'
      },
      cursor: props.isDisabled ? 'not-allowed' : 'default',
      opacity: props.isDisabled ? 0.5 : 1,
      '@media (min-width: 768px)': {
        fontSize: '0.875rem'
      }
    }),
    valueContainer: provided => ({
      ...provided,
      padding: '0.5rem 0'
    }),
    input: provided => ({
      ...provided,
      margin: '0',
      padding: '0',
      fontSize: '1rem',
      color: '#fff',
      '@media (min-width: 768px)': {
        fontSize: '0.875rem'
      }
    }),
    placeholder: provided => ({
      ...provided,
      color: 'var(--muted-foreground)'
    }),
    singleValue: provided => ({
      ...provided,
      color: '#fff',
      fontSize: '1rem',
      '@media (min-width: 768px)': {
        fontSize: '0.875rem'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    menu: provided => ({
      ...provided,
      zIndex: 50,
      borderRadius: '0.375rem',
      overflow: 'hidden',
      backgroundColor: 'var(--background)',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--input)'
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? 'var(--accentColor)'
        : state.isFocused
          ? 'var(--foreground)'
          : 'transparent',
      color: state.isSelected ? 'var(--primary-foreground)' : 'inherit',
      '&:active': {
        backgroundColor: state.isSelected ? 'var(--primary)' : 'var(--accent)'
      }
    }),
    multiValue: provided => ({
      ...provided,
      backgroundColor: 'var(--accentColor)',
      borderRadius: '0.25rem', // rounded
      fontSize: '0.875rem', // text-sm
      overflow: 'hidden',
      margin: '0.125rem'
    }),
    multiValueLabel: provided => ({
      ...provided,
      padding: '0.125rem 0.25rem 0.125rem 0.5rem', // Padding yang seimbang
      fontSize: '0.875rem', // text-sm
      color: '#fff',
      fontWeight: 500
    }),
    multiValueRemove: provided => ({
      ...provided,
      color: 'var(--foreground)',
      opacity: 0.7,
      padding: '0 0.25rem',
      '&:hover': {
        backgroundColor: 'var(--destructive)',
        color: 'var(--destructive-foreground)',
        opacity: 1
      }
    })
  }

  return (
    <Select
      styles={customStyles}
      isMulti={isMulti}
      classNamePrefix="custom-select"
      {...props}
    />
  )
}

// Export komponen terpisah untuk kemudahan penggunaan
export function MultipleSelect(props) {
  return <CustomSelect isMulti={true} {...props} />
}

export function SingleSelect(props) {
  return <CustomSelect isMulti={false} {...props} />
}
