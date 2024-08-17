import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toastError, toastSuccess } from '../utils/Toast';
import wave from '../assets/wave.png';
import bg from '../assets/bg.svg';
import logo from '../assets/getayna_logo.svg';
import '../styles/login.css'
import TextField from '@mui/material/TextField';

export default function Login() {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.target);
    const jsonData = Object.fromEntries(formData);

    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    };

    const req = await fetch('http://localhost:1337/api/auth/local', reqOptions);
    const res = await req.json();

    if (res.error) {
      setMessage(res.error.message);
      toastError(res.error.message);
      return;
    }

    if (res.jwt && res.user) {
      Cookies.set('token', res.jwt, { expires: 7 });
      setMessage('Login successful.');
      toastSuccess('Login successful.');
      navigate('/');
    }
  };

  return (
    <>
      <div className='main'>
          <img className="wave" src={wave} />
          <div className="container1">
              <div className="img">
                  <img src={bg} />
              </div>
              <div className="login-content">
                  <form onSubmit={login} >
                      <img src={logo} className='mb-5 ml-4' />
                      <div className="flex mb-2">
                          <div className="i mr-2">
                              <i className="fas fa-user"></i>
                          </div>
                          <div className="div w-full">
                            <TextField
                              label="UserName or Email"
                              name="identifier"
                              id="identifier"
                              placeholder="UserName or Email"
                              variant="filled"
                              fullWidth
                            />
                          </div>
                      </div>
                      <div className="flex mb-2">
                          <div className="i mr-2">
                              <i className="fas fa-lock"></i>
                          </div>
                          <div className="div w-full">
                            <TextField
                              label="Password"
                              name="password"
                              id="password"
                              placeholder="Password"
                              variant="filled"
                              fullWidth
                            />
                          </div>
                      </div>
                      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Login</button>
                      <a href="/signup" className='items-center text-center'>Don't have an account?.SignUp</a>
                  </form>
              </div>
          </div>
      </div>
    </>
  );
}
