import { getCookie } from 'cookies-next'
import { useEffect } from 'react'
import { fetcherWithToken } from 'src/libs/swr/fetcher'
import { useRootStore } from 'src/stores'
import useSWRImmutable from 'swr/immutable'

function useUser() {
  const { authStore } = useRootStore()
  const token = getCookie('accessToken')
  const token2 = localStorage.getItem('accessToken')

  const { data: user, isValidating } = useSWRImmutable(
    token
      ? ['v1/auth/token', token]
      : token2
      ? ['v1/auth/token', token2]
      : null,
    fetcherWithToken
  )

  useEffect(() => {
    if (user) {
      authStore.user = user
    }
  }, [user])

  return {
    data: user,
    isLoading: !user,
    isValidating: isValidating,
  }
}
export default useUser
