<template>
  <div>
    <v-container class="mt-5 mb-10">
      <v-row justify="center" align="center">
        <v-col cols="12" lg="6" md="6" sm="6" >
          <v-card>
            <v-card-title>
              Login 
            </v-card-title>
            <v-card-text>
              <pre>{{error}}</pre>
              <v-text-field v-model="credentials.email" label="email" type="email" ></v-text-field>
              <v-text-field v-model="credentials.password" label="Password" type="password" ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="loading" @click.prevent="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-named-as-default
import gql from 'graphql-tag'
export default {
  name: 'LoginPage',
  auth:'guest',
  data() {
    return {
      credentials: {
        email: null,
        password:null
      },
      error:null,
      loading:false
    }
  },
  methods: {
    async login() {
      const credentials = this.credentials
      this.loading =true
      const authenticateUserGql = gql`
        mutation login($input: InputLogin!) {
          login(input: $input) {
            token
            refreshToken
          }
        }
      `
      try {
        const res = await this.$apollo.mutate({
          mutation: authenticateUserGql,
          variables: { input: { ...credentials } },
        })
   
          await this.$apolloHelpers.onLogin(res.data.login.token)
          await this.$store.dispatch("GET_USER_LOGIN")
          this.$router.push("/")
       
      } catch (e) {
        this.error=e.graphQLErrors[0]
      }
      this.loading=false
    },
 
  },
}
</script>

<style lang="scss" scoped></style>
