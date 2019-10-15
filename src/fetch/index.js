/* eslint no-console: 0 */
import Axios from "axios";
import { Message } from "element-ui";
// import store from "@/store";
// import router from "@/router";
// create an axios instance
const axios = Axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "http://39.100.141.76:3000/mock/670" : "", // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
axios.interceptors.request.use(
  config => {
    if (config.data) {
      Object.keys(config.data).forEach(key => {
        if (config.data[key] === "") {
          delete config.data[key];
        }
      });
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
axios.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code.
   */
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    return new Promise((resolve, reject) => {
      if (response.headers["content-disposition"]) {
        resolve(res);
      } else if (res.code == "4") {
        Message({
          message: res.msg || "error",
          type: "error",
          duration: 5 * 1000
        });

        // store.dispatch("LogOut").then(() => {
        //   router.push("/login");
        // });
        reject(new Error("未登录"));
      } else if (res.code !== "1") {
        Message({
          message: res.msg || "error",
          type: "error",
          duration: 5 * 1000
        });
        reject(res.msg || "error");
      } else {
        resolve(res);
      }
    });
  },
  error => {
    console.log(`err${error}`); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default axios;
/* eslint no-use-before-define: 2 */  // --> ON
