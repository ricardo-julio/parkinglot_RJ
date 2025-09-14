import { useAuth } from "../components/AuthContext"
import { useLocation, Navigate } from "react-router-dom"
import { useEffect } from "react"

const ProtectedRoutes = ({children}) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
      return <div style={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         height: '100vh',
         fontSize: '2rem'
      }}>Cargando...</div>
    }

    useEffect(() => {
      console.log('useEffect- isAuthenticated',isAuthenticated);
      console.log('useEffect- location',location);
    }, [isAuthenticated, location]);

    if (!isAuthenticated) {
      return <Navigate to="/" state={{ from: location }} replace/>;
    }
    console.log('usuario autenticado, mostrando:', location.pathname)
  return children
  
}

export default ProtectedRoutes