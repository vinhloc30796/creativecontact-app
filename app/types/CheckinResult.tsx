// File: app/types/CheckinResult.tsx

import { UUID } from "crypto";
import {RegistrationStatus} from "@/app/types/RegistrationStatus";

// Define the CheckinResult interface
export interface CheckinResult {
    success: boolean;
    data?: {
      id: UUID;
      status: RegistrationStatus;
      name: string;
      email: string;
      phone: string;
    };
    error?: string;
  }