// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag'
export const state = () => ({
/**
 * you can use this properties for check authorization
 * 
*/
  authorization: {
    loggedIn: false,
    user: null,
  },
})

export const mutations = {
/**
 * set user properties in state
 * 
*/
  SET_USER(state, user) {
    state.authorization = {
      loggedIn: true,
      user,
    }
  },
  /**
   * remove user properties in state 
   * 
  */
  REMOVE_USER(state) {
    state.authorization = {
      loggedIn: false,
      user: null,
    }
  },
}

export const actions = {
/**
 * we try to fetch user on first time browser was loaded in server side
 * 
*/
  async nuxtServerInit({dispatch},{ app, }) {
    /**
     * we try to check if token was still exists in cookie
     * 
     * 
    */

    const hasToken = !!app.$apolloHelpers.getToken()
    if (hasToken) {
      await dispatch('GET_USER_LOGIN')
    }
  },
  /**
   * fetch user from apollo server
   * 
   * 
   * 
  */
  async GET_USER_LOGIN({ commit }) {
    /**
     * you can also change user user format as you want
     * 
    */
    const queryUser = gql`
      query me {
        me {
          userId
          accessLevel
          code
          fullName
          code
          photoUrl
          personalId
          email
          isActive
          isValid
        }
      }
    `
    const { data } = await this.app.apolloProvider.clients.defaultClient.query({
      query: queryUser,
      variables: {},
    })
    commit('SET_USER', data.me)
    return data
  },
}
