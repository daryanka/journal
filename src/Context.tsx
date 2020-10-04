import React, {createContext, FC, useContext, useState} from "react";

interface contextType {
  routerRedirect: null | string
  setRouterRedirect: React.Dispatch<React.SetStateAction<string | null>>
}

const UserContext = createContext<any>(null)

const UserContextProvider: FC = (props) => {
  const [routerRedirect, setRouterRedirect] = useState<null | string>(null)

  return(
    <UserContext.Provider value={{routerRedirect, setRouterRedirect}}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContextProvider

export const useRouterRedirect = () => {
  const data = useContext(UserContext) as contextType
  return data.routerRedirect
}

export const useRouterRedirectSetURL = () => {
  const {setRouterRedirect} = useContext(UserContext) as contextType
  return (url: string) => {
    setRouterRedirect(url)
  }
}