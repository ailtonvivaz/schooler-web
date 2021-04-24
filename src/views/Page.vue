<template>
  <v-container>
    <v-card v-if="user">
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
import axios from "axios";
import { namespace } from "vuex-class";
import User from "@/models/user.model";
const Auth = namespace("Auth");

@Component
export default class Page extends Vue {
  @Auth.State
  public loggedIn!: boolean;

  @Auth.State
  public user!: User | null;

  mouted(): void {
    if (this.user) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.user.token}`;
    } else {
      this.$router.replace({ name: "login" });
    }
  }
}
</script>
