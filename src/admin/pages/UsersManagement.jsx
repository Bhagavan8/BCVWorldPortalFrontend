import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FaSearch, 
  FaEdit, 
  FaTrash,
  FaUserCog,
  FaCheck,
  FaBan,
  FaUsers
} from 'react-icons/fa';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import './UsersManagement.css';

const UsersManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(0); // Spring Boot uses 0-based indexing
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    // Display 10 items per page
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, statusFilter, roleFilter]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await UserService.getAllUsers(
                currentPage, 
                ITEMS_PER_PAGE, 
                searchTerm, 
                statusFilter, 
                roleFilter
            );
            
            // Assuming standard Spring Boot Page<User> response
            if (response.data && response.data.content) {
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalUsers(response.data.totalElements);
            } else if (Array.isArray(response.data)) {
                // Fallback if endpoint returns just a list
                setUsers(response.data);
                setTotalUsers(response.data.length);
                setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, statusFilter, roleFilter]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await UserService.deleteUser(userId);
                toast.success('User deleted successfully');
                fetchUsers(); // Refresh list
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await UserService.updateUserStatus(userId, newStatus);
            toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update user status');
        }
    };

    const getStatusBadge = (status) => {
        const statusLower = (status || 'inactive').toLowerCase();
        if (statusLower === 'active') return <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Active</span>;
        return <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3">Inactive</span>;
    };

    const getRoleBadge = (role) => {
        const roleLower = (role || 'user').toLowerCase();
        switch(roleLower) {
            case 'admin': return <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill">Admin</span>;
            case 'employer': return <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">Employer</span>;
            default: return <span className="badge bg-info bg-opacity-10 text-info rounded-pill">User</span>;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-GB', { month: 'short' });
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const renderPaginationItems = () => {
        const items = [];
        const windowSize = 5; // numeric buttons around current (desktop)
        const half = Math.floor(windowSize / 2);
        const firstPage = 0;
        const lastPage = Math.max(totalPages - 1, 0);

        const pushPage = (p) => {
            items.push(
                <li key={p} className={`page-item ${currentPage === p ? 'active' : ''}`}>
                    <button
                        className={`page-link rounded-circle border-0 d-flex align-items-center justify-content-center ${currentPage === p ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-secondary'}`}
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => handlePageChange(p)}
                        aria-current={currentPage === p ? 'page' : undefined}
                    >
                        {p + 1}
                    </button>
                </li>
            );
        };

        const pushEllipsis = (k) => {
            items.push(
                <li key={k} className="page-item disabled">
                    <span className="page-link border-0 bg-transparent text-muted">…</span>
                </li>
            );
        };

        let start = Math.max(currentPage - half, firstPage + 1);
        let end = Math.min(currentPage + half, lastPage - 1);

        if (currentPage <= half + 1) {
            start = 1;
            end = Math.min(windowSize, lastPage - 1);
        } else if (currentPage >= lastPage - (half + 1)) {
            end = lastPage - 1;
            start = Math.max(end - (windowSize - 1), 1);
        }

        pushPage(firstPage);
        if (start > firstPage + 1) pushEllipsis('start-ellipsis');
        for (let p = start; p <= end; p++) pushPage(p);
        if (end < lastPage - 1) pushEllipsis('end-ellipsis');
        if (lastPage > firstPage) pushPage(lastPage);

        return items;
    };

    return (
        <div className="content-wrapper p-4">
      <div className="card shadow-sm border-0 rounded-4 h-auto" style={{ height: 'auto' }}>
        <div className="card-header bg-white py-4 px-4 border-bottom border-light">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <FaUsers className="fs-5 text-primary" />
                                <h5 className="mb-0 fw-bold text-primary text-nowrap">All Users</h5>
                            </div>
                            <span className="badge bg-primary rounded-pill px-3 py-2 shadow-sm">{totalUsers} Users</span>
                        </div>
                        
                        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center flex-grow-1 justify-content-end">
                            <div className="input-group" style={{maxWidth: '300px'}}>
                                <span className="input-group-text bg-light border-end-0 text-secondary">
                                    <FaSearch />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 bg-light" 
                                    placeholder="Search by name, email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div style={{minWidth: '150px'}}>
                                <select 
                                    className="form-select bg-light border-0" 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div style={{minWidth: '150px'}}>
                                <select 
                                    className="form-select bg-light border-0" 
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive" style={{ overflowY: 'visible', overflowX: 'auto', minHeight: 'auto', maxHeight: 'none', height: 'auto' }}>
                        <table className="table table-hover align-middle mb-0 custom-table">
                            <thead className="bg-light text-secondary">
                                <tr>
                                    <th className="ps-4 text-uppercase small fw-bold">Full Name</th>
                                    <th className="text-uppercase small fw-bold">Email</th>
                                    <th className="text-uppercase small fw-bold">Mobile</th>
                                    <th className="text-uppercase small fw-bold">DOB</th>
                                    <th className="text-uppercase small fw-bold">Role</th>
                                    <th className="text-uppercase small fw-bold">Status</th>
                                    <th className="text-end pe-4 text-uppercase small fw-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            No users found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td className="ps-4" data-label="Full Name">
                                                <div className="d-flex align-items-center">
                                                    <div className="user-avatar-small me-3">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{user.name}</div>
                                                        <small className="text-muted d-block d-md-none">{user.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Email">{user.email}</td>
                                            <td data-label="Mobile">{user.mobile || user.phone || 'N/A'}</td>
                                            <td data-label="DOB">{formatDate(user.dob)}</td>
                                            <td data-label="Role">{getRoleBadge(user.role)}</td>
                                            <td data-label="Status">{getStatusBadge(user.status)}</td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button 
                                                        className="btn btn-light btn-icon text-danger" 
                                                        title="Delete User"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    {user.status === 'active' ? (
                                                        <button 
                                                            className="btn btn-light btn-icon text-warning" 
                                                            title="Deactivate User"
                                                            onClick={() => handleStatusChange(user.id, 'inactive')}
                                                        >
                                                            <FaBan />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="btn btn-light btn-icon text-success" 
                                                            title="Activate User"
                                                            onClick={() => handleStatusChange(user.id, 'active')}
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center py-4 border-top border-light">
                            <nav aria-label="Users table pages" className="w-100 d-flex flex-column align-items-center gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <ul className="pagination mb-0 gap-2 align-items-center d-none d-sm-flex">
                                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                            <button
                                                className={`page-link border-0 d-flex align-items-center justify-content-center px-2 rounded-pill ${currentPage === 0 ? 'bg-light text-muted' : 'bg-transparent text-primary'}`}
                                                style={{ height: '35px' }}
                                                onClick={() => handlePageChange(0)}
                                                disabled={currentPage === 0}
                                                aria-label="First"
                                            >
                                                «
                                            </button>
                                        </li>
                                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                            <button
                                                className={`page-link border-0 d-flex align-items-center justify-content-center px-3 rounded-pill fw-semibold ${currentPage === 0 ? 'bg-light text-muted' : 'bg-transparent text-primary'}`}
                                                style={{ height: '35px' }}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 0}
                                                aria-label="Previous"
                                            >
                                                Prev
                                            </button>
                                        </li>
                                        {renderPaginationItems()}
                                        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                            <button
                                                className={`page-link border-0 d-flex align-items-center justify-content-center px-3 rounded-pill fw-semibold ${currentPage === totalPages - 1 ? 'bg-light text-muted' : 'bg-transparent text-primary'}`}
                                                style={{ height: '35px' }}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages - 1}
                                                aria-label="Next"
                                            >
                                                Next
                                            </button>
                                        </li>
                                        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                            <button
                                                className={`page-link border-0 d-flex align-items-center justify-content-center px-2 rounded-pill ${currentPage === totalPages - 1 ? 'bg-light text-muted' : 'bg-transparent text-primary'}`}
                                                style={{ height: '35px' }}
                                                onClick={() => handlePageChange(totalPages - 1)}
                                                disabled={currentPage === totalPages - 1}
                                                aria-label="Last"
                                            >
                                                »
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="d-flex d-sm-none align-items-center text-secondary small">
                                        <button
                                            className="btn btn-sm btn-light me-2"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            aria-label="Previous"
                                        >
                                            <BiChevronLeft />
                                        </button>
                                        <span>Page {currentPage + 1} of {totalPages}</span>
                                        <button
                                            className="btn btn-sm btn-light ms-2"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages - 1}
                                            aria-label="Next"
                                        >
                                            <BiChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
