import { onError } from '@apollo/client/link/error'
// import promiseToObservable from '~/helper/apollo-link'
/**
 * please visit https://github.com/nuxt-community/apollo-module/issues/315
 * for more information about the apollo client issue
 *
 * on this setup i user apollo-server-express as backend infrastructure
 * and all error was extends from apollo error handling https://www.apollographql.com/docs/apollo-server/data/errors/
 */
export default function ({ redirect, app, store, error: nuxtError }) {
  const httpEndpoint = 'http://localhost:4000/graphql'

  const link = onError(
    ({ graphQLErrors, networkError = {}, operation, forward }) => {
      if (graphQLErrors) {
        if (
          graphQLErrors &&
          graphQLErrors[0].extensions.code === 'UNAUTHENTICATED'
        ) {
          app.$cookies.remove('apollo-token')
          store.commit('REMOVE_USER', null)
          redirect('/login')
        }
        if (graphQLErrors && graphQLErrors[0].extensions.code === 'FORBIDDEN') {
          return nuxtError({
            message: graphQLErrors[0].message,
            statusCode: 403,
          })
        }

        if (
          graphQLErrors &&
          graphQLErrors[0].extensions.code === 'INTERNAL_SERVER_ERROR'
        ) {
          return nuxtError({
            message: graphQLErrors[0].message,
            statusCode: 500,
          })
        }
      }

      // eslint-disable-next-line no-console
      if (networkError) console.error(`[Network error]: ${networkError}`)
    }
  )

  return {
    link,
    httpEndpoint,
  }
}
