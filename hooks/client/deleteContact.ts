import { getQueryClient } from "@/app/providers"
import { useMutation } from "@tanstack/react-query"
import { on } from "events"

const deleteContactApi = async (contactId: string) => {
  const response = await fetch(`/api/user/contacts`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contactId }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(`${response.status}-${response.statusText}: ${data.error}`)
  }
  return data
}
const useDeleteContactMutation = (
  onSuccess: () => void = () => { },
  onError: () => void = () => { },
) => {
  const queryClient = getQueryClient()
  return useMutation({
    mutationFn: deleteContactApi,
    onSuccess: () => {
      onSuccess()
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      })
    },
    onError(error, variables, context) {
      console.error('Error deleting contact:', error)
      onError()
    },

  }, queryClient)
}

export {
  deleteContactApi,
  useDeleteContactMutation
}
