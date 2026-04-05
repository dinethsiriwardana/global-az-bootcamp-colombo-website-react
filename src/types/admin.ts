export type RegistrationStatus = "pending" | "approved" | "rejected" | string;

export type AdminFilterStatus = "pending" | "approved" | "rejected" | "confirmed";

export type AdminAction = "approved" | "rejected";

export interface AdminRegistration {
  registration_id: string;
  name: string;
  email: string;
  phone_number: string;
  profession: string;
  status: RegistrationStatus;
  is_confirmed?: boolean;
}
