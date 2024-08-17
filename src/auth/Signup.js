import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toastError, toastSuccess } from '../utils/Toast';
import '../styles/signup.css';
import wave from '../assets/wave.png';
import bg from '../assets/bg.svg';
import logo from '../assets/getayna_logo.svg';
import TextField from '@mui/material/TextField';

export default function Signup() {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const register = async (event) => {
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

    const req = await fetch('http://localhost:1337/api/auth/local/register', reqOptions);
    const res = await req.json();

    if (res.error) {
      setMessage(res.error.message);
      toastError(res.error.message);
      return;
    }

    if (res.jwt && res.user) {
      Cookies.set('token', res.jwt, { expires: 7 });
      setMessage('Successful registration.');
      toastSuccess('Registration successful.');
      navigate('/');
    }
  };

  return (
    <>
    {/* <form onSubmit={register}>
      <label htmlFor="username" className="block">Username</label>
      <input type="text" id="username" name="username" className="block" />

      <label htmlFor="email" className="block">Email</label>
      <input type="email" id="email" name="email" className="block mb-2" />

      <label htmlFor="password" className="block">Password</label>
      <input type="password" id="password" name="password" className="block" />

      <button type="submit">Submit</button>

      <div>{ message }</div>
    </form>
    <a href="/login">Already have an account?.Login</a> */}

    <div className='main'>
          <img className="wave" src={wave} />
          <div className="container1">
              <div className="img">
                  <img src={bg} />
              </div>
              <div className="login-content">
                  <form onSubmit={register} >
                      <img src={logo} className='mb-5 ml-4' />
                      <div className="flex mb-2">
                          <div className="i mr-2">
                              <i className="fas fa-user"></i>
                          </div>
                          <div className="div w-full">
                            <TextField
                              label="UserName"
                              name="username"
                              id="username"
                              placeholder="UserName"
                              variant="filled"
                              fullWidth
                            />
                          </div>
                      </div>
                      <div className="flex mb-2">
                          <div className="i mr-2">
                              <i className="fas fa-user"></i>
                          </div>
                          <div className="div w-full">
                            <TextField
                              label="Email"
                              name="email"
                              id="email"
                              placeholder="Email"
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
                      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">SignUp</button>
                      <a href="/login" className='items-center text-center'>Already have an account?.Login</a>
                  </form>
              </div>
          </div>
    </div>
    </>
  );
}
