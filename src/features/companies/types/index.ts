import { z } from "zod";

export interface Company {
  _id: string;
  name: string;
  idImage?: string;
  units?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompaniesResponse {
  companies: Company[];
  totalCount: number;
}

export interface CompanyFilters {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface CompanySort {
  field: keyof Company;
  order: 'asc' | 'desc';
}

export const companyFormSchema = z.object({
  name: z.string().min(1, "Company name is required").trim(),
  idImage: z.string().optional(),
  units: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  description: z.string().optional(),
  logo: z.instanceof(File).optional(),
});

export type CompanyFormData = z.infer<typeof companyFormSchema>;

export interface CreateCompanyData extends Omit<CompanyFormData, 'logo'> {
  logo?: File;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  _id: string;
}