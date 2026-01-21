import { useQuery } from '@tanstack/react-query';
import { Employee } from '@/types';

async function fetchEmployees(search?: string): Promise<Employee[]> {
  const params = new URLSearchParams();
  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`/api/employees?${params.toString()}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch employees');
  }

  return response.json();
}

export function useEmployees(search?: string) {
  return useQuery({
    queryKey: ['employees', search],
    queryFn: () => fetchEmployees(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Disable automatic refetch on window focus to prevent unnecessary API calls
  });
}
