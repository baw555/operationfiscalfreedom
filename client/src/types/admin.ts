import type {
  User as SchemaUser,
  AffiliateApplication as SchemaAffiliateApplication,
  HelpRequest as SchemaHelpRequest,
  PrivateDoctorRequest as SchemaPrivateDoctorRequest,
  WebsiteApplication as SchemaWebsiteApplication,
  GeneralContact as SchemaGeneralContact,
} from "@shared/schema";

export type User = SchemaUser;
export type AffiliateApplication = SchemaAffiliateApplication;
export type HelpRequest = SchemaHelpRequest;
export type PrivateDoctorRequest = SchemaPrivateDoctorRequest;
export type WebsiteApplication = SchemaWebsiteApplication;
export type GeneralContact = SchemaGeneralContact;

export type LeadStatus = "new" | "contacted" | "in_progress" | "closed";

export type AdminLead = {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  status: string;
  type?: string;
  companyName?: string;
  businessName?: string;
  helpType?: string;
  description?: string;
  message?: string;
  notes?: string | null;
  assignedTo?: number | null;
  createdAt?: Date | string;
  [key: string]: any;
};
