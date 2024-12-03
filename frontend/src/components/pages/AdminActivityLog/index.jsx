import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminActivityLog.css';

const AdminActivityLog = () => {
    const [users, setUsers] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/admin/activity-log', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 200) {
                    setUsers(response.data.users);
                    setActivityLogs(response.data.activityLogs);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching activity logs:', error);
                navigate('/login');
            }
        };

        fetchData();
    }, [navigate]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.email.includes(searchTerm) &&
        (filter === 'all' || user.isVerified === (filter === 'verified'))
    );

    const filteredActivityLogs = activityLogs.filter(log =>
        log.activity.includes(searchTerm)
    );

    return (
        <div className="background-image">
            <div className="container mt-5">
                <h2>Admin Activity Log</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select className="form-control mt-3" value={filter} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>
                </div>
                <div className="mb-5">
                    <h3>User List</h3>
                    <ul className="list-group">
                        {filteredUsers.map(user => (
                            <li key={user._id} className="list-group-item">
                                {user.full_name} ({user.email}) - {user.isVerified ? 'Verified' : 'Unverified'}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Activity Logs</h3>
                    <ul className="list-group">
                        {filteredActivityLogs.map(log => (
                            <li key={log._id} className="list-group-item">
                                {log.activity} (at {new Date(log.timestamp).toLocaleString()})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminActivityLog;
