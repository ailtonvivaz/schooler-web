<template>
  <v-container v-if="user">
    <v-card>
      <v-card-title>
        {{ user.name }}
      </v-card-title>
      <v-card-text>
        {{ user.major }}
      </v-card-text>
    </v-card>
    <router-view class="pt-8"></router-view>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import User from "@/models/user.model";
const Auth = namespace("Auth");

@Component
export default class Page extends Vue {
  @Auth.State
  public loggedIn!: boolean;

  @Auth.State
  public user!: User;

  beforeMount(): void {
    if (!this.user) {
      this.$router.replace({ name: "login" });
    }
  }
}
</script>
