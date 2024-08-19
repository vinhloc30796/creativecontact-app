type RegistrationConfirmSuccess = {
  success: true;
  email: string;
  userId: string;
};

type RegistrationConfirmError = {
  success: false;
  error: string;
};

export type RegistrationConfirm = RegistrationConfirmSuccess | RegistrationConfirmError;