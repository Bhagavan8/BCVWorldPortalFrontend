import React, { useState, useEffect, useCallback } from 'react';
import CommentService from '../services/CommentService';
import toast from 'react-hot-toast';
import { FaSearch, FaTrash, FaCopy } from 'react-icons/fa';

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchComments();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await CommentService.getAllComments(currentPage, 10, searchTerm);
      setComments(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalComments(data.totalElements || 0);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error(error.response?.data?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await CommentService.deleteComment(id);
        toast.success('Comment deleted successfully');
        fetchComments();
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const handleCopyJobId = (jobId) => {
    navigator.clipboard.writeText(jobId);
    toast.success('Job ID copied to clipboard');
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="content-wrapper p-4">
      <div className="card shadow-sm border-0 rounded-4 h-auto">
        <div className="card-header bg-white py-4 px-4 border-bottom border-light">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h5 className="mb-0 fw-bold text-dark">Comments Management</h5>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-light border-end-0 text-secondary">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>
        </div>

        <div className="card-body p-0">
          <div className="px-4 py-3 border-bottom border-light bg-light text-primary fw-semibold">
            <i className="bi bi-chat-left-text me-2"></i>User Comments
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-5 text-muted">No comments found.</div>
          ) : (
            <div className="table-responsive">
               <table className="table table-hover mb-0 align-middle">
                 <thead className="bg-light">
                   <tr>
                     <th scope="col" className="py-3 ps-4 border-bottom-0 text-muted small text-uppercase">Comment Details</th>
                     <th scope="col" className="py-3 pe-4 border-bottom-0 text-end text-muted small text-uppercase">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded p-2 me-3 text-center" style={{ minWidth: '40px' }}>
                            <span className="fw-bold text-primary">#{comment.jobId}</span>
                          </div>
                          <div>
                            <h6 className="mb-1 text-dark text-truncate" style={{ maxWidth: '300px' }}>{comment.content}</h6>
                            <small className="text-muted">
                              by <span className="fw-semibold">{comment.userName}</span> • {getTimeAgo(comment.createdAt)}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle text-end">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleCopyJobId(comment.jobId)}
                          title="Copy Job ID"
                        >
                          <FaCopy />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(comment.id)}
                          title="Delete Comment"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top border-light py-3">
            <div className="d-flex justify-content-end align-items-center gap-2">
               <button 
                  className="btn btn-outline-secondary btn-sm" 
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <i className="bi bi-chevron-left me-1"></i> Previous
                </button>
                <span className="text-muted small">Page {currentPage + 1}</span>
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next <i className="bi bi-chevron-right ms-1"></i>
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsManagement;
