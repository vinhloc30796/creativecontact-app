import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form'
import { FormProvider } from 'react-hook-form';

interface FormWrapperProps {
  children: React.ReactNode;
  form: UseFormReturn<any>;
}

const FormWrapper = ({ children, form }: FormWrapperProps) => (
  <FormProvider {...form}>
    <Form {...form}>
      {children}
    </Form>
  </FormProvider>
);

export { FormWrapper }