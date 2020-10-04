import React, {FC, useState} from "react";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dayjs from "dayjs";
import functions from "../../functions";

interface linkType {
  to: string
  title: string
}

const NavBar: FC = () => {
  const [navOpen, setNavOpen] = useState(false)
  const today = dayjs().format("YYYY-MM-DD");
  const isAuth = useSelector((state: RootState) => state.auth.loggedIn)
  const publicLinks: linkType[] = [
    {
      to: "/",
      title: "Login"
    },
    {
      to: "/register",
      title: "Register"
    }
  ];

  const privateLinks: linkType[] = [
    {
      to: `/day/${today}`,
      title: "Today"
    },
    {
      to: "/logout",
      title: "Logout"
    }
  ]

  const renderLinks = (links: linkType[]) => {
    return links.map(l => {
      return (
        <Link className={"item"} key={`link-${l.title}`} to={l.to}>{l.title}</Link>
      )
    })
  }

  return (
    <nav>
      <h2 onClick={() => functions.pushTo("/")}>Journal</h2>
      <div className={"links-wrapper"}>
        {isAuth ? renderLinks(privateLinks) : renderLinks(publicLinks)}
      </div>
      <button onClick={() => setNavOpen(!navOpen)} className={`hamburger hamburger--emphatic ${navOpen ? "is-active" : ""}`} type="button">
        <span className="hamburger-box">
          <span className="hamburger-inner"/>
        </span>
      </button>
    </nav>
  )
}

export default NavBar