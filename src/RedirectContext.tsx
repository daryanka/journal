import React, {createContext, FC, useContext, useState} from "react";

interface contextType {
  routerRedirect: null | string
  setRouterRedirect: React.Dispatch<React.SetStateAction<string | null>>
}

const RedirectContext = createContext<any>(null)

const RedirectContextProvider: FC = (props) => {
  const [routerRedirect, setRouterRedirect] = useState<null | string>(null)
  console.log("redirect route", routerRedirect)

  return(
    <RedirectContext.Provider value={{routerRedirect, setRouterRedirect}}>
      {props.children}
    </RedirectContext.Provider>
  )
}

export default RedirectContextProvider

export const useGetRedirectURL = () => {
  const data = useContext(RedirectContext) as contextType
  return data.routerRedirect
}

export const useSetRedirectURL = () => {
  const {setRouterRedirect} = useContext(RedirectContext) as contextType
  return setRouterRedirect
}