import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Profile() {
    // const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // logout();
        navigate('/login');
    };

    return (<><div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 h-10 rounded-full flex items-center justify-center p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
            </div>
        </div>
        <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
                <a  className="justify-between">
                    Profile
                    <span className="badge">New</span>
                </a>
            </li>
            <li><a>Settings</a></li>
            <li>
                <button onClick={handleLogout}>Logout</button>
            </li>
        </ul>
    </div>
   
    </>
);
}
