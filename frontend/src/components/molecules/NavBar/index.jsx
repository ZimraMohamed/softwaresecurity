import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const NavBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.toLowerCase() === 'admin') {
            navigate('/admin-login');
        }
    };

    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand">SafeSign</a>
                <form className="d-flex" role="search" onSubmit={handleSearch}>
                    <input 
                        className="form-control me-2" 
                        type="search" 
                        placeholder="Search" 
                        aria-label="Search" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                   <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </nav>
    );
};

export default NavBar;
