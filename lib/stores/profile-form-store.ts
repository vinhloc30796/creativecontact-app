import { create } from 'zustand'

interface FormData {
  basic?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    location?: string;
  };
  about?: {
    about?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    instagramHandle?: string;
    facebookHandle?: string;
  };
  professional?: {
    industries?: string[];
    experience?: string;
  };
}

interface ProfileFormState {
  dirtyFields: Record<string, boolean>;
  formData: FormData;
  setFieldDirty: (id: string, isDirty: boolean) => void;
  setFormData: (id: string, data: any) => void;
  resetForm: () => void;
}

export const useProfileFormStore = create<ProfileFormState>((set) => ({
  dirtyFields: {},
  formData: {},
  setFieldDirty: (id, isDirty) => 
    set((state) => ({
      dirtyFields: {
        ...state.dirtyFields,
        [id]: isDirty,
      },
    })),
  setFormData: (id, data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [id]: data,
      },
    })),
  resetForm: () => set({ dirtyFields: {}, formData: {} }),
}));

// Helper function to check if any field is dirty
export const isFormDirty = (state: ProfileFormState) => 
  Object.values(state.dirtyFields).some(Boolean); 