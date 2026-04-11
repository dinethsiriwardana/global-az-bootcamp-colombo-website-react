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
  organization?: string;
  designation?: string;
  food_preference?: string;
  tshirt_size?: string;
  id_number?: string;
  current_year_of_study?: string;
  linkedin_url?: string;
  expectations?: string;
  event_title?: string;
  registered_at?: string;
  is_confirmed?: boolean;
}
