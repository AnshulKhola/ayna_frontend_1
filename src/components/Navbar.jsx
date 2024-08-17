import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../assets/getayna_logo.svg';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const checkAuthStatus = () => {
        const token = Cookies.get('token');
        setIsAuthenticated(!!token);
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);
    
    const logoutUser = () => {
        Cookies.remove('token');
        checkAuthStatus();
        navigate('/login');
    };

    return (
        <div>
            <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4] h-[73px]">
                <div className="flex items-center">
                    <a href="/"><img src={logo} alt="logo" className="w-28 object-contain" /></a>
                </div>

                {/* <div className="flex items-center">
                    {!isAuthenticated ? (
                        <>
                            <a href="/login" className="font-inter font-medium bg-[#32be8f] text-white px-4 py-2 rounded-md mr-3">Login</a>
                            <a href="/signup" className="font-inter font-medium bg-[#32be8f] text-white px-4 py-2 rounded-md">Register</a>
                        </>
                    ) : (
                        <>
                            <a href="/" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md mr-3">Home</a>
                            <a href="#" onClick={logoutUser} className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Logout</a>
                        </>
                    )}
                </div> */}
            </header>
        </div>
    );
};

export default Navbar;
