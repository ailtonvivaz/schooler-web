<template>
  <v-container fluid fill-height class="background">
    <v-row justify="center">
      <v-col cols="10" sm="8" md="6" lg="4">
        <v-card outlined class="mx-auto" max-width="500" :loading="loading">
          <v-container class="pa-md-4 mx-lg-auto">
            <v-card-title>
              <p class="display-1 text--primary">Login</p>
            </v-card-title>
            <v-col>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  label="Usuário"
                  v-model="username"
                  outlined
                  prepend-inner-icon="mdi-account-circle-outline"
                  :rules="usernameRules"
                  :disabled="loading"
                ></v-text-field>
                <v-text-field
                  label="Senha"
                  v-model="password"
                  outlined
                  prepend-inner-icon="mdi-lock-outline"
                  :append-icon="
                    passwordIsShown ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                  "
                  @click:append="() => (passwordIsShown = !passwordIsShown)"
                  :type="passwordIsShown ? 'text' : 'password'"
                  :rules="passwordRules"
                  :disabled="loading"
                ></v-text-field>
              </v-form>
            </v-col>
            <v-card-text>
              <div class="text--secondary">
                <p>
                  Esse site não é oficial
                </p>
              </div>
            </v-card-text>
            <v-card-text>
              <v-alert type="error" dense v-if="hasError">
                Usuário ou senha inválidos!
              </v-alert>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="deep-purple accent-4"
                @click="validate"
                :disabled="loading"
              >
                Entrar
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import AuthModel from "@/models/auth.model";
const Auth = namespace("Auth");

type Rule = boolean | string;

@Component
export default class Login extends Vue {
  private username = "";
  private password = "";
  private passwordIsShown = false;
  private valid = true;
  private hasError = false;

  @Auth.State("loggingIn")
  public loading!: boolean;

  usernameRules = [
    function(v: string): Rule {
      return !!v || "É necessário informar o usuário";
    },
  ];
  passwordRules = [
    function(v: string): Rule {
      return !!v || "É necessário informar a senha";
    },
  ];

  get loginIsValid(): boolean {
    return this.username != "" && this.password != "" && !this.loading;
  }

  get form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  beforeCreate(): void {
    const userData = localStorage.getItem("user");
    if (userData) {
      this.$router.replace({ name: "dashboard" });
    }
  }

  validate(): void {
    if (this.form.validate()) {
      this.login({
        username: this.username,
        password: this.password,
      })
        .then(() => {
          console.log("success");
          this.$router.push({ name: "dashbord" });
        })
        .catch(() => {
          this.hasError = true;
        });
    }
  }

  @Auth.Action
  private login!: (auth: AuthModel) => Promise<boolean>;
}
</script>

<style scoped>
.background {
  background-color: DarkMagenta;
}
</style>
