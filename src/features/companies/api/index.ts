import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
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
            formData.append(`address[${addressKey}]`, String(addressValue));
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
            formData.append(`address[${addressKey}]`, String(addressValue || ''));
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
    queryKey: queryKeys.companies.list(params),
    queryFn: () => companiesApi.getCompanies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCompany = (companyId: string) => {
  return useQuery({
    queryKey: queryKeys.companies.detail(companyId),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companiesApi.updateCompany,
    onMutate: async (updatedCompany) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.companies.detail(updatedCompany._id) });
      await queryClient.cancelQueries({ queryKey: queryKeys.companies.lists() });

      // Snapshot the previous value
      const previousCompany = queryClient.getQueryData(queryKeys.companies.detail(updatedCompany._id));
      const previousLists = queryClient.getQueriesData({ queryKey: queryKeys.companies.lists() });

      // Optimistically update the company detail
      queryClient.setQueryData(queryKeys.companies.detail(updatedCompany._id), (old: Company | undefined) => {
        if (!old) return old;
        return { ...old, ...updatedCompany };
      });

      // Optimistically update all company lists
      queryClient.setQueriesData({ queryKey: queryKeys.companies.lists() }, (old: { companies?: Company[] } | undefined) => {
        if (!old?.companies) return old;
        return {
          ...old,
          companies: old.companies.map((company: Company) =>
            company._id === updatedCompany._id ? { ...company, ...updatedCompany } : company
          ),
        };
      });

      // Return context for rollback
      return { previousCompany, previousLists };
    },
    onError: (_err, updatedCompany, context) => {
      // Rollback on error
      if (context?.previousCompany) {
        queryClient.setQueryData(
          queryKeys.companies.detail(updatedCompany._id),
          context.previousCompany
        );
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (data) => {
      // Always refetch after error or success
      if (data) {
        queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(data._id) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.lists() });
    },
  });
};

export { companiesApi };
export { useAllCompanies } from '../hooks/use-all-companies';