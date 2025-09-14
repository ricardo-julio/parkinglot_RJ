import { Outlet } from "react-router-dom"
import NavBar from "./navBar"


const layaoutNav = () => {
  return (
    <div>
        <NavBar />
        <Outlet />
    </div>
  )
}

export default layaoutNav