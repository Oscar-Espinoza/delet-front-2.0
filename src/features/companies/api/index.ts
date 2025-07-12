import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { 
  Company, 
  CompaniesResponse, 
  CompanyFilters, 
  CompanySort, 
  CreateCompanyData,
  UpdateCompanyData 
} from '../types';

interface GetCompaniesParams {
  page: number;
  limit: number;
  filters?: CompanyFilters;
  sort?: CompanySort;
  select?: string[];
  isAdmin?: boolean;
}

// API functions
const companiesApi = {
  getCompanies: async (params: GetCompaniesParams): Promise<CompaniesResponse> => {
    const { isAdmin, ...requestBody } = params;
    const adminPath = isAdmin ? '/superadmin' : '';
    
    return apiClient.post(`/api/companies${adminPath}/search`, requestBody);
  },

  createCompany: async (data: CreateCompanyData): Promise<Company> => {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'address' && value) {
        // Handle nested address object
        Object.entries(value).forEach(([addressKey, addressValue]) => {
          if (addressValue) {
            formData.append(`address[${addressKey}]`, addressValue);
          }
        });
      } else if (key === 'logo' && value instanceof File) {
        formData.append('logo', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return apiClient.postFormData('/api/companies/create', formData);
  },

  updateCompany: async ({ _id, ...data }: UpdateCompanyData): Promise<Company> => {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'address' && value) {
        // Handle nested address object
        Object.entries(value).forEach(([addressKey, addressValue]) => {
          if (addressValue !== undefined) {
            formData.append(`address[${addressKey}]`, addressValue || '');
          }
        });
      } else if (key === 'logo' && value instanceof File) {
        formData.append('logo', value);
      } else if (value !== undefined) {
        formData.append(key, String(value || ''));
      }
    });

    return apiClient.patchFormData(`/api/companies/update/${_id}`, formData);
  },

  getCompany: async (companyId: string): Promise<Company> => {
    return apiClient.get(`/api/companies/get/${companyId}`);
  },
};

// React Query hooks
export const useCompanies = (params: GetCompaniesParams) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApi.getCompanies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompany = (companyId: string) => {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companiesApi.getCompany(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesApi.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesApi.updateCompany,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', data._id] });
    },
  });
};

export { companiesApi };
export { useAllCompanies } from '../hooks/use-all-companies';