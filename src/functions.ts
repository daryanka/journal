import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import cookie from "js-cookie";
import history from "./history";
import _ from "lodash";

type Methods = "GET" | "PUT" | "PATCH" | "POST" | "DELETE";

export interface ErrorType {
  error: boolean
  message: string
  type?: string
  status_code: number
}

const functions = {
  send: async <T = any>(method: Methods, url: string, data?: any, additionalConfig?: AxiosRequestConfig) => {
    const headers: {
      Authorization?: string
    } = {};

    if (cookie.get("token")) {
      headers.Authorization = `Bearer ${cookie.get("token")}`
    }

    if (process.env.NODE_ENV === "prod") {
      url = `https://api-journal.daryanamin.co.uk${url}`;
    } else {
      url = `http://localhost:8080${url}`;
    }


    const config = _.merge(additionalConfig ? additionalConfig : {}, {
      method: method,
      url: url,
      headers: headers,
      data: data,
      validateStatus: (status: number) => {
        // return status >= 200 && status < 300
        return true
      }
    });

    return await axios.request<T>(config)
  },

  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return functions.send<T>("GET", url, undefined, config)
  },

  post: <T = any>(url: string, data: any, config?: AxiosRequestConfig) => {
    return functions.send<T>("POST", url, data, config)
  },

  patch: <T = any>(url: string, data: object, config?: AxiosRequestConfig) => {
    return functions.send<T>("PATCH", url, data, config)
  },

  put: <T = any>(url: string, data: object, config?: AxiosRequestConfig) => {
    return functions.send<T>("PUT", url, data, config)
  },

  delete: <T = any>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return functions.send<T>("DELETE", url, data, config)
  },

  error: (p: AxiosResponse) => {
    if (p.status >= 300 || p.status < 200) {
      // Error
      if (p.status === 401) {
        // Logout
        functions.pushTo("/logout")
      }

      return p.data as ErrorType
    }
    return null
  },

  pushTo: (url: string) => {
    history.push(url)
  },

  timeToMinutesNumber: (time: string): number => {
    const [hours, minutes] = time.split(":")
    const minutesFromHours = parseInt(hours) * 60
    const minutesInt = parseInt(minutes)

    return minutesFromHours + minutesInt
  },

  minutesToTimeString: (minutes: number): string => {
    let hours = `${Math.floor(minutes / 60)}`
    let minutesString = `${minutes - Math.floor(minutes / 60) * 60}`
    if (minutesString === "0") {
      minutesString = "00"
    }
    if (Math.floor(minutes / 60) < 10) {
      hours = `0${hours}`
    }

    return `${hours}:${minutesString}`
  }
}

export default functions