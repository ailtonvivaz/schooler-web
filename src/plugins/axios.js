"use strict";

import Vue from "vue";
import axios from "axios";
import router from "../router";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: process.env.baseURL || process.env.apiUrl || "",
  timeout: 20 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

axios.interceptors.request.use(
  function(request) {
    console.log("req intercepted");
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      request.headers = {
        Authorization: `Bearer ${user.token}`,
      };
    }
    return request;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    console.log("resp intercepted");
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      localStorage.removeItem("user");
      router.replace({ name: "login" });
    }
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
