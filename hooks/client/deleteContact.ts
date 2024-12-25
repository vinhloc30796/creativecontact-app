import { getQueryClient } from "@/app/providers"
import { useMutation } from "@tanstack/react-query"

const deleteContactApi = async (userId: string, contactId: string) => {
  const response = await fetch(`/api/user/${userId}/contacts/${contactId}`, {
    method: 'DELETE',
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
    mutationFn: ({ userId, contactId }: { userId: string, contactId: string }) => deleteContactApi(userId, contactId),
    onSuccess: () => {
      onSuccess()
      queryClient.invalidateQueries({
        queryKey: ['contacts'],
      })
    },
    onError(error, variables, context) {
      console.error(error)
      onError()
    },

  }, queryClient)
}

export {
  deleteContactApi,
  useDeleteContactMutation
}
