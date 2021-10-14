<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
    <v-spacer />
    <v-btn
      v-if="!user.signedIn"
      @click="handleLogin"
    >
      Sign-in
    </v-btn>
    <div
      v-if="user.signedIn"
      @click="handleLogout"
    >
      <v-badge
        avatar
      >
        <v-avatar size="40">
          <v-img
            :src="`${user.Image}`"
          />
        </v-avatar>
      </v-badge>
      <v-badge
        class="pl-2"
      >
        <v-btn
          class="white--text"
          depressed
        >
          {{ user.Name }}
        </v-btn>
      </v-badge>
    </div>
  </v-app-bar>
</template>
<script>
import VueCookies from 'vue-cookies'

export default {
  name: 'DefaultBar',
  data: () => ({
    user: {
      signedIn: false,
      Name: null,
      Email: null,
      Image: null,
    }
  }),
  computed: {
    drawer: {
      get () {
        return this.$store.getters['app/getDrawer']
      },
      set (value) {
        return this.$store.commit('app/setDrawer', value)
      }
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      if(VueCookies.isKey('userName'))
      {
        this.user.signedIn = true
        this.user.Name = VueCookies.get('userName')
        this.user.Image = VueCookies.get('userImage')
        this.user.Email = VueCookies.get('userEmail')
      }
    },
    handleLogout() {
      this.user.signedIn = false;
      VueCookies.remove('userName')
    },
    async handleLogin() {
      try {
        const GoogleUser = await this.$gAuth.signIn();
        if (!GoogleUser.isSignedIn()) throw new Error('로그인에 실패했습니다.');

        console.log(GoogleUser)

        this.user.signedIn = GoogleUser.isSignedIn();
        this.user.Name = GoogleUser.getBasicProfile().getName();
        this.user.Image = GoogleUser.getBasicProfile().getImageUrl();
        this.user.Email = GoogleUser.getBasicProfile().getEmail();

        VueCookies.set('userName', this.user.Name)
        VueCookies.set('userImage', this.user.Image)
        VueCookies.set('userEmail', this.user.Email)
      } catch (e) {
        console.error(e);
      }
    },
  },
}
</script>
<style lang="">

</style>
