import React, { useState, useEffect } from 'react';
import MessageService from '../services/MessageService';
import toast from 'react-hot-toast';

const MessagesSuggestions = () => {
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  
  const [messagePage, setMessagePage] = useState(0);
  const [suggestionPage, setSuggestionPage] = useState(0);
  
  const [totalMessagePages, setTotalMessagePages] = useState(1);
  const [totalSuggestionPages, setTotalSuggestionPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, [messagePage]);

  useEffect(() => {
    fetchSuggestions();
  }, [suggestionPage]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const data = await MessageService.getMessages(messagePage);
      setMessages(data.content || []);
      setTotalMessagePages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const data = await MessageService.getSuggestions(suggestionPage);
      setSuggestions(data.content || []);
      setTotalSuggestionPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      toast.error(error.response?.data?.message || 'Failed to load suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="content-wrapper p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0 fw-bold text-dark">Messages & Suggestions</h4>
      </div>

      <div className="row g-4">
        {/* Contact Messages Column */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-white py-3 px-4 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-primary">
                <i className="bi bi-envelope me-2"></i>Contact Messages
              </h5>
            </div>
            <div className="card-body p-0">
              {loadingMessages ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-5 text-muted">No messages found.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {messages.map((msg) => (
                    <div key={msg.id} className="list-group-item px-4 py-3 border-light">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                          {msg.isNew && <span className="badge bg-primary bg-opacity-10 text-primary me-2 rounded-pill">New</span>}
                          <span className="fw-semibold text-dark">{msg.subject}</span>
                        </div>
                        <small className="text-muted text-nowrap ms-2">{formatDate(msg.createdAt)}</small>
                      </div>
                      <p className="text-dark mt-2 mb-2" style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="d-flex align-items-center text-secondary small">
                          <i className="bi bi-person me-1"></i>
                          {msg.name} <span className="text-muted ms-1">({msg.email})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Pagination for Messages */}
            <div className="card-footer bg-white border-top border-light py-3">
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  disabled={messagePage === 0}
                  onClick={() => setMessagePage(p => p - 1)}
                >
                  <i className="bi bi-chevron-left me-1"></i> Previous
                </button>
                <span className="text-muted small">Page {messagePage + 1}</span>
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  disabled={messagePage >= totalMessagePages - 1}
                  onClick={() => setMessagePage(p => p + 1)}
                >
                  Next <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Column */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-white py-3 px-4 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-success">
                <i className="bi bi-lightbulb me-2"></i>Suggestions
              </h5>
            </div>
            <div className="card-body p-0">
              {loadingSuggestions ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-5 text-muted">No suggestions found.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {suggestions.map((sug) => (
                    <div key={sug.id} className="list-group-item px-4 py-3 border-light">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                          {sug.helpRequired && <span className="badge bg-info text-white me-2 rounded-pill">{sug.helpRequired}</span>}
                          {sug.agreed === 1 && <span className="badge bg-success text-white me-2 rounded-pill">Agreed</span>}
                          <span className="fw-semibold text-dark">{sug.jobType}</span>
                        </div>
                        <small className="text-muted text-nowrap ms-2">{formatDate(sug.createdDate || sug.createdAt || sug.date)}</small>
                      </div>
                      <p className="text-dark mt-2 mb-2" style={{ whiteSpace: 'pre-wrap' }}>{sug.suggestion}</p>
                      <div className="d-flex flex-wrap gap-3 align-items-center mt-2 small text-secondary">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-envelope me-1"></i>
                          {sug.email}
                        </div>
                        {sug.whatsapp && (
                          <div className="d-flex align-items-center">
                            <i className="bi bi-whatsapp me-1 text-success"></i>
                            {sug.whatsapp}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Pagination for Suggestions */}
            <div className="card-footer bg-white border-top border-light py-3">
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  disabled={suggestionPage === 0}
                  onClick={() => setSuggestionPage(p => p - 1)}
                >
                  <i className="bi bi-chevron-left me-1"></i> Previous
                </button>
                <span className="text-muted small">Page {suggestionPage + 1}</span>
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  disabled={suggestionPage >= totalSuggestionPages - 1}
                  onClick={() => setSuggestionPage(p => p + 1)}
                >
                  Next <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesSuggestions;
