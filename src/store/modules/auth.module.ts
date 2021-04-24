import User from "@/models/user.model";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";
import AuthModel from "@/models/auth.model";

const userData = localStorage.getItem("user");

@Module({ namespaced: true })
class Auth extends VuexModule {
  public loggingIn = false;
  public loggedIn: boolean = userData ? true : false;
  public user?: User = userData ? JSON.parse(userData) : null;

  @Mutation
  public loggingInStart(): void {
    this.loggingIn = true;
    this.loggedIn = false;
    this.user = undefined;
  }

  @Mutation
  public loginSuccess(user: User): void {
    this.loggingIn = false;
    this.loggedIn = true;
    this.user = user;
  }

  @Mutation
  public loginFailure(): void {
    this.loggingIn = false;
    this.loggedIn = false;
    this.user = undefined;
  }

  @Mutation
  public loginFinish(): void {
    this.loggedIn = false;
    this.user = undefined;
  }

  @Action
  public async login(auth: AuthModel): Promise<void> {
    console.log(auth);
    this.context.commit("loggingInStart");
    return axios
      .post("https://trbuhwp12h.execute-api.sa-east-1.amazonaws.com/connect", {
        username: auth.username,
        password: auth.password,
      })
      .then((res) => {
        const user: User = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        this.context.commit("loginSuccess", user);
        return Promise.resolve();
      })
      .catch((error) => {
        this.context.commit("loginFailure");
        console.log(error);
        return Promise.reject(error);
      });
  }

  @Action
  public logout(): void {
    localStorage.removeItem("user");
    this.context.commit("loginFinish");
  }
}
export default Auth;
