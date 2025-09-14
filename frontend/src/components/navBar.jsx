import { Link } from "react-router-dom"
import { useAuth } from "../components/AuthContext"


const navBar = () => {
  const { logout } = useAuth();
  return (
    <>
    <hr />
    <Link to={"/home"}>home</Link>{" "}
    <Link to={"register"}>register</Link>
    <button onClick={logout}>logout</button>
    <hr />
    </>
  )
}

export default navBar