"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query"
import {
  getUserProperties,
  getProperty,
  addProperty,
  addPropertiesBulk,
  updateProperty,
  deleteProperty,
  type Property,
  type AddPropertyInput,
  type UpdatePropertyInput,
} from "@/app/actions/properties"

export const propertiesKeys = {
  all: ["properties"] as const,
  lists: () => [...propertiesKeys.all, "list"] as const,
  list: (filters?: { search?: string; status?: string }) =>
    [...propertiesKeys.lists(), filters] as const,
  details: () => [...propertiesKeys.all, "detail"] as const,
  detail: (id: string) => [...propertiesKeys.details(), id] as const,
}

export function useProperties() {
  return useQuery({
    queryKey: propertiesKeys.lists(),
    queryFn: async () => {
      const result = await getUserProperties()
      if (result.error) throw new Error(result.error)
      return result.properties ?? []
    },
  })
}

export function useProperty(id: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: propertiesKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) return null
      const result = await getProperty(id)
      if (result.error) throw new Error(result.error)
      return result.property
    },
    enabled: Boolean(id) && (options?.enabled !== false),
  })
}

export function useAddProperty(
  options?: Omit<
    UseMutationOptions<
      { success: boolean; error: string | null },
      Error,
      AddPropertyInput
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addProperty,
    onSuccess: (data) => {
      if (data.success) {
        void queryClient.invalidateQueries({ queryKey: propertiesKeys.all })
      }
    },
    ...options,
  })
}

export function useAddPropertiesBulk(
  options?: Omit<
    UseMutationOptions<
      { success: number; failed: number; errors: string[] },
      Error,
      AddPropertyInput[]
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addPropertiesBulk,
    onSuccess: (data) => {
      if (data.success > 0) {
        void queryClient.invalidateQueries({ queryKey: propertiesKeys.all })
      }
    },
    ...options,
  })
}

export function useUpdateProperty(
  options?: Omit<
    UseMutationOptions<
      { success: boolean; error: string | null },
      Error,
      { id: string; updates: UpdatePropertyInput }
    >,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }) => updateProperty(id, updates),
    onSuccess: (data, variables) => {
      if (data.success) {
        void queryClient.invalidateQueries({ queryKey: propertiesKeys.all })
        void queryClient.invalidateQueries({ queryKey: propertiesKeys.detail(variables.id) })
      }
    },
    ...options,
  })
}

export function useDeleteProperty(
  options?: Omit<
    UseMutationOptions<{ success: boolean; error: string | null }, Error, string>,
    "mutationFn"
  >
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: (data, id) => {
      if (data.success) {
        void queryClient.invalidateQueries({ queryKey: propertiesKeys.all })
        void queryClient.invalidateQueries({ queryKey: propertiesKeys.detail(id) })
      }
    },
    ...options,
  })
}

export type { Property, AddPropertyInput, UpdatePropertyInput }
