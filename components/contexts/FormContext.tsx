import { createContext, useContext, useState } from 'react'

interface FormContextType {
  dirtyFields: Record<string, boolean>
  setFieldDirty: (id: string, isDirty: boolean) => void
  formData: Record<string, any>
  setFormData: (id: string, data: any) => void
}

export const FormContext = createContext<FormContextType>({
  dirtyFields: {},
  setFieldDirty: () => {},
  formData: {},
  setFormData: () => {},
})

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({})
  const [formData, setFormDataState] = useState<Record<string, any>>({})

  // Form context logic here
}

export const useFormState = () => useContext(FormContext)