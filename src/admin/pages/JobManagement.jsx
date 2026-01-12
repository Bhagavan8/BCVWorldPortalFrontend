import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaSearch, 
  FaEdit, 
  FaTrash,
  FaEye
} from 'react-icons/fa';
import AuthService from '../services/AuthService';
import './JobManagement.css';

const JobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    // Check auth via AuthService
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/admin/auth');
      return;
    }
    setUser(currentUser);
    
    fetchJobs();
  }, [currentPage, searchTerm]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = AuthService.getToken();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';

      const response = await axios.get(`${API_BASE_URL}/api/admin/jobs/management`, {
        params: {
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
          search: searchTerm
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.content) {
        setJobs(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setJobs(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch jobs";
      toast.error(`Error: ${errorMessage}`);
      setJobs([]); 
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (id) => {
    try {
      const token = AuthService.getToken();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
      await axios.delete(`${API_BASE_URL}/api/admin/jobs/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="d-flex flex-column gap-2 text-dark">
        <div className="fw-medium text-dark">Are you sure you want to delete this job?</div>
        <div className="d-flex gap-2 justify-content-end mt-2">
          <button 
            className="btn btn-sm btn-light border text-dark"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete(id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 4000,
      position: 'top-center',
      style: {
        minWidth: '300px',
        padding: '16px',
        borderRadius: '8px',
        background: '#fff',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    });
  };

  const handleEdit = (id) => {
    navigate(`/admin/jobs-edit/${id}`);
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white py-4 px-4 border-bottom border-light d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0 fw-bold text-dark text-nowrap">Job Listings</h5>
          </div>
          <div className="d-flex align-items-center gap-2 justify-content-end w-100 w-md-auto">
             <div className="input-group search-bar m-0 flex-nowrap align-items-center" style={{ height: '40px' }}>
                <span className="input-group-text bg-white border-end-0 ps-3" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <FaSearch className="text-secondary" />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-white border-start-0 m-0" 
                  placeholder="Search jobs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: '100%' }}
                />
              </div>
              <button 
                className="btn btn-primary px-4 fw-medium shadow-sm d-flex align-items-center gap-2 justify-content-center m-0" 
                style={{whiteSpace: 'nowrap', height: '40px'}}
                onClick={() => navigate('/admin/jobs-upload')}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Post Job</span>
              </button>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle custom-table">
              <thead className="bg-light bg-opacity-50">
                <tr>
                  <th className="ps-4 py-3 text-primary">Job Title</th>
                  <th className="py-3 text-primary">Company</th>
                  <th className="py-3 text-primary">Posted Date</th>
                  <th className="py-3 text-primary">Deadline</th>
                  <th className="py-3 text-primary text-center">Views</th>
                  <th className="py-3 text-primary text-center">Status</th>
                  <th className="text-end pe-4 py-3 text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                        <div className="spinner-border text-primary mb-2" role="status"></div>
                        <p className="mb-0">Loading jobs...</p>
                    </td>
                  </tr>
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                        <div className="py-4">
                            <i className="bi bi-inbox fs-1 text-light-emphasis d-block mb-2"></i>
                            No jobs found
                        </div>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="job-row">
                      <td className="ps-4" data-label="Job Title">
                        <div className="fw-bold text-dark">{job.jobTitle}</div>
                        <div className="text-muted small d-md-none">{job.companyName}</div>
                      </td>
                      <td className="text-secondary fw-medium" data-label="Company">{job.companyName}</td>
                      <td className="text-secondary small" data-label="Posted Date">
                        <i className="bi bi-calendar3 me-1"></i>
                        {new Date(job.postedDate).toLocaleDateString()}
                      </td>
                      <td className="text-secondary small" data-label="Deadline">
                        {job.lastDate 
                          ? <><i className="bi bi-hourglass-split me-1"></i>{new Date(job.lastDate).toLocaleDateString()}</>
                          : <span className="text-muted fst-italic">No deadline</span>}
                      </td>
                      <td className="text-center" data-label="Views">
                        <span className="badge bg-light text-dark border rounded-pill px-3">
                            {job.viewCount || 0}
                        </span>
                      </td>
                      <td className="text-center" data-label="Status">
                        <span className={`badge rounded-pill px-3 py-2 ${
                          (job.isActive === true || job.isActive === 'true') ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'
                        }`}>
                          <span className="d-flex align-items-center gap-1">
                            <span className={`d-inline-block rounded-circle ${(job.isActive === true || job.isActive === 'true') ? 'bg-success' : 'bg-danger'}`} style={{width: '6px', height: '6px'}}></span>
                            {(job.isActive === true || job.isActive === 'true') ? 'Active' : 'Inactive'}
                          </span>
                        </span>
                      </td>
                      <td className="text-end pe-4" data-label="Actions">
                        <div className="d-flex gap-2 justify-content-end">
                          <button 
                            className="btn btn-icon btn-light text-primary shadow-sm"
                            onClick={() => handleEdit(job.id)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-icon btn-light text-danger shadow-sm"
                            onClick={() => handleDelete(job.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
            <div className="card-footer bg-white py-3">
              <nav>
                <ul className="pagination justify-content-center mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
        )}
      </div>
    </div>
  );
};

export default JobManagement;
