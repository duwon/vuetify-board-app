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
      rounded
      large
      @click="handleLogin"
    >
      Sign-in
    </v-btn>
    <v-menu
      v-if="user.signedIn"
      offset-y
    >
      <template v-slot:activator="{ attrs, on }">
        <span
          style="cursor: pointer"
          v-bind="attrs"
          v-on="on"
        >
          <v-chip
            link
          >
            <v-badge
              dot
              bottom
              color="green"
              offset-y="10"
              offset-x="10"
            >
              <v-avatar size="40">
                <v-img
                  :src="`${user.Image}`"
                />
              </v-avatar>
            </v-badge>
            <span class="ml-3">{{ user.Name }}</span>
          </v-chip>
        </span>
      </template>
      <v-list
        width="250"
        class="py-0"
      >
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-img
              :src="`${user.Image}`"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.Name }}</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item
          v-for="(menu, i) in menus"
          :key="i"
          link
          @click="menuSelect(menu.to)"
        >
          <v-list-item-icon>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{ menu.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import VueCookies from 'vue-cookies'

export default {
  name: 'DefaultBar',
  data: () => ({
    menus: [
      // { title: "Profile", icon: "mdi-account", to: 'Profile' },
      // { title: "Change Password", icon: "mdi-key", to: 'Change Password' },
      { title: "Setting", icon: "mdi-cog", to: 'Setting' },
      { title: "Logout", icon: "mdi-logout", to: 'handleLogout' },
    ],
  }),
  computed: {
    drawer: {
      get () {
        return this.$store.getters['app/getDrawer']
      },
      set (value) {
        return this.$store.commit('app/setDrawer', value)
      }
    },
    user: {
      get () {
        return this.$store.getters['account/getInfo']
      },
      set (value) {
        return this.$store.commit('account/setInfo', value)
      }
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    menuSelect(func) {
      switch (func) {
      case 'handleLogout':
        this.handleLogout()
        break;
      case 'Setting':
        console.log('Setting Select')
        break;
      default:
        break;
      }
    },
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
