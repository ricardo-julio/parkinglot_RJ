import { createContext, useState, useEffect, useContext, children, use } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext();
// export const UseContext = () => {
//   const context = useContext(AuthContext);
//   if(!context){
//     throw new Error('useAuth must be used within a AuthContextProvider')
//   }
//   return context;
// }

export const Authprovider = ({children})=>{
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  // configuramos token con axios
  useEffect( () =>{
    if (token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      console.log('tpken encontrado isAuthenticated',isAuthenticated);
    }else{
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      console.log('tpken no encontrado isAuthenticated',isAuthenticated);
    }
    setLoading(false);
  }, [token])

  //  miramos si el token es valido
   useEffect(()=>{
     const verifyToken = async()=>{
       if(token){
         try {
           const response = await axios.get('http://127.0.0.1:5000/auth/validate')
         setUser(response.data.user); // si no muestra menseaje le quitamos ese .user
         isAuthenticated(true)
         } catch (error) {
           console.error('token invalido ', error.response.data.message);
           logout();
         }finally{
           setLoading(false);
         }
       }
     }
     verifyToken();
   },[])

  // el login
  const login = async(cc, password) =>{
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {cc, password})
      const {token: newToken, refreshToken, user: userdata} = response.data
      
      if(newToken){
        localStorage.setItem('token', newToken);
        if(refreshToken){
          localStorage.setItem('refreshToken', refreshToken);
        }
        setToken(newToken);
        setUser(userdata);
        setIsAuthenticated(true);
        return {success: true, message: 'Login successful'}
      }else{
        throw new Error('no se ha recibido el token del servidor ')
      }
    } catch (error) {
      const errorMensage = error.response?.data?.message || 'credenciales incorrectas por favor revise su cedula y contraseña'
      setError(errorMensage);
      console.error('error delogin ', error )
      return {success: false, message: errorMensage}
    }finally{
      setLoading(false);
    }
  }

//funtion logout
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  setToken(null);
  setUser(null);
  setIsAuthenticated(false);
  setError(null);

  delete axios.defaults.headers.common['Authorization'];
  navigate('/');
}

//funcion para la renovacion de token
const refresAcesshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  try {
    if(!refreshToken){
    throw new Error('no se ha recibido el refresh token del servidor ')
  }
  const response = await axios.post('http://127.0.0.1:5000/auth/refresh', {refreshToken})
  const{token: newToken, refreshToken: newRefreshToken} = response.data;
  localStorage.setItem('token', newToken);
  if(newRefreshToken){
    localStorage.setItem('refreshToken', newRefreshToken);
  }
  setToken(newToken);
  console.log('token renovado automaticamente');
  return newToken;
  } catch (error) {
    console.error('error de renovacion de token ', error)
    logout();
    return null
  }
}

const clearError = () => setError(null);

const getUser = () =>{ return user;
}

const hasRole = (role) => {
  return user?.role === role;
}

const value = {
  user,
  token,
  isAuthenticated,
  loading,
  error,
  login,
  logout,
  refresAcesshToken,
  clearError,
  getUser,
  hasRole,
}
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth= ()=>{
  return useContext(AuthContext)
}