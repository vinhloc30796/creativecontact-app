import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface FormContextType {
  dirtyFields: Record<string, boolean>
  setFieldDirty: (id: string, isDirty: boolean) => void
  formData: Record<string, any>
  setFormData: (id: string, data: any) => void
  isDirty: boolean
  resetForm: () => void
}

const FormStateContext = createContext<FormContextType | undefined>(undefined)

export function FormStateProvider({ children }: { children: ReactNode }) {
  const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({})
  const [formData, setFormDataState] = useState<Record<string, any>>({})

  const setFieldDirty = useCallback((id: string, isDirty: boolean) => {
    setDirtyFields(prev => ({ ...prev, [id]: isDirty }))
  }, [])

  const setFormData = useCallback((id: string, data: any) => {
    setFormDataState(prev => ({ ...prev, [id]: data }))
  }, [])

  const isDirty = Object.values(dirtyFields).some(Boolean)

  const resetForm = useCallback(() => {
    setDirtyFields({})
    setFormDataState({})
  }, [])

  const value = {
    dirtyFields,
    setFieldDirty,
    formData,
    setFormData,
    isDirty,
    resetForm
  }

  return (
    <FormStateContext.Provider value={value}>
      {children}
    </FormStateContext.Provider>
  )
}

export function useFormState() {
  const context = useContext(FormStateContext)
  if (context === undefined) {
    throw new Error('useFormState must be used within a FormStateProvider')
  }
  return context
}

// Helper hook for individual form fields
export function useFormField(id: string, initialValue: any) {
  const { setFieldDirty, setFormData } = useFormState()
  const [value, setValue] = useState(initialValue)

  const onChange = useCallback((newValue: any) => {
    setValue(newValue)
    const isDirty = newValue !== initialValue
    setFieldDirty(id, isDirty)
    if (isDirty) {
      setFormData(id, newValue)
    }
  }, [id, initialValue, setFieldDirty, setFormData])

  return {
    value,
    onChange,
  }
} 