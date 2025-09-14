 import './styles/Login.css'
 import axios from 'axios'
 import { useState } from 'react'
 import { useNavigate, useLocation } from 'react-router-dom'
 import { useAuth } from '../components/AuthContext'

 const Login = () => {
   const [cc, setCC] = useState('')
   const [password, setPassword] = useState('')
   const navigate = useNavigate()
   const location = useLocation()

    const { login, loading, error,  clearError } = useAuth();
    const from = location.state?.from?.pathname || '/';

   const handlesutmit = async (e) => {
     e.preventDefault()
    //  setLoading(true)
    //  setError(null)
    clearError();

    const result = await login(cc, password)
    if(result.success){
      navigate('/home')
    }




   }
 

   return (
     <>
     <div className="padre">
         <div className="card">
           <h2 className="title">
             <span className="subtitle">Iniciar Sesión</span>
           </h2>

            {/* {error && (
             <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
               {error}
             </div>
           )} */}
          
          <form onSubmit={handlesutmit}> <div className="form-group">
             <input
               type="text"
               pattern='[0-9]*'
               onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
               placeholder="ingrese su Cedula"
               className="form-input"
               value={cc}
               onChange={(e) => setCC(e.target.value)}
               required
               disabled={loading}
             />
           </div>
          
           <div className="form-group">
             <input
               type="password"
               placeholder="ingrese su  contraseña"
               className="form-input"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               disabled={loading}
             />
           </div>
          
           <div className="form-button">
           <button className="button" type='submit' disabled={loading}>
            {loading ? 'Ingresando...': 'Ingresar'}
           </button>
           </div>
           </form>
           <div className="message">
               <p>solo <strong>administradores</strong> pueden crear los   <strong>usuarios</strong></p>
           </div>
         </div>
       </div>
     </>
   )
 }


 export default Login;
