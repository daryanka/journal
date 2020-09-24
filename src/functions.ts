import axios, {AxiosResponse} from "axios";
import cookie from "js-cookie";
import history from "./history";
import _ from "lodash";
import store, {RootState} from "./store";

type Methods = "GET" | "PUT" | "PATCH" | "POST" | "DELETE";

interface ErrorType {
  error: boolean
  message: string
  type?: string
  status_code: number
}

const functions = {
  send: (method: Methods, url: string, data?: object, additionalConfig?: object) => {
    const headers: {
      Authorization?: string
    } = {};

    if (cookie.get("token")) {
      headers.Authorization = `Bearer ${cookie.get("token")}`
    }

    url = `http://localhost:8080${url}`;


    const config = _.merge(additionalConfig ? additionalConfig : {}, {
      method: method,
      url: url,
      headers: headers,
      data: data,
      validateStatus: (status: number) => {
        return true // Never return error
      }
    });

    return axios(config);
    // try {
    //   return await axios(config);
    // } catch (err) {
    //   if (err.response.status === 401) {
    //     cookie.remove("token");
    //     history.replace("/login")
    //   }
    //   return err;
    // }
  },

  get: (url: string, config?: object) => {
    return functions.send("GET", url, undefined, config)
  },

  post: (url: string, data: object) => {
    return functions.send("POST", url, data)
  },

  patch: (url: string, data: object) => {
    return functions.send("PATCH", url, data)
  },

  delete: (url: string, data?: object) => {
    return functions.send("DELETE", url, data)
  },

  error: (p: AxiosResponse) => {
    if (p.status >= 300 || p.status < 200) {
      // Error
      return p.data as ErrorType
    }

    return null
  },

  pushTo: (url: string) => {
    history.push(url)
  },

  isLoggedIn: (): boolean => {
    const state = store.getState() as RootState;
    return state.auth.loggedIn
  },
}

export default functions