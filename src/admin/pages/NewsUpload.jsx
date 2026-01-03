import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsService from '../services/NewsService';
import toast from 'react-hot-toast';
import { FaTrash, FaBold, FaTimes, FaPlus, FaInfoCircle } from 'react-icons/fa';
import '../assets/css/NewsUpload.css';

const NewsUpload = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('');
    const [section, setSection] = useState('');
    const [status, setStatus] = useState('pending');
    const [imageUrl, setImageUrl] = useState('');
    const [paragraphs, setParagraphs] = useState([]);
    
    // Bulk Text State
    const [bulkText, setBulkText] = useState('');

    // --- Handlers ---

    const handleAddParagraph = () => {
        setParagraphs([...paragraphs, { text: '', subPoints: [] }]);
    };

    const handleRemoveParagraph = (index) => {
        const newParagraphs = [...paragraphs];
        newParagraphs.splice(index, 1);
        setParagraphs(newParagraphs);
    };

    const handleParagraphChange = (index, value) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[index].text = value;
        setParagraphs(newParagraphs);
    };

    const handleAddSubPoint = (pIndex) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[pIndex].subPoints.push({ text: '', isBold: false });
        setParagraphs(newParagraphs);
    };

    const handleRemoveSubPoint = (pIndex, sIndex) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[pIndex].subPoints.splice(sIndex, 1);
        setParagraphs(newParagraphs);
    };

    const handleSubPointChange = (pIndex, sIndex, value) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[pIndex].subPoints[sIndex].text = value;
        setParagraphs(newParagraphs);
    };

    const toggleSubPointBold = (pIndex, sIndex) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[pIndex].subPoints[sIndex].isBold = !newParagraphs[pIndex].subPoints[sIndex].isBold;
        setParagraphs(newParagraphs);
    };

    const handleBulkSplit = () => {
        if (!bulkText.trim()) return;
        const sentences = bulkText.split('.').map(s => s.trim()).filter(s => s.length > 0);
        const newParagraphs = sentences.map(s => ({ text: s + '.', subPoints: [] }));
        setParagraphs([...paragraphs, ...newParagraphs]);
        setBulkText('');
        toast.success(`Added ${newParagraphs.length} paragraphs`);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const loadingToast = toast.loading('Uploading image...');
            const res = await NewsService.uploadNewsImage(file);
            toast.dismiss(loadingToast);
            
            // Assuming response contains the URL in `url` or `secure_url`
            const uploadedUrl = res.data.url || res.data.secure_url || res.data; 
            setImageUrl(uploadedUrl);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Image upload failed', error);
            toast.error('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !category || !section) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title,
                url,
                category,
                section,
                status,
                imageUrl,
                content: paragraphs // Backend should handle this structure
            };

            await NewsService.createNews(payload);
            toast.success('News uploaded successfully!');
            
            // Reset form
            setTitle('');
            setUrl('');
            setCategory('');
            setSection('');
            setStatus('pending');
            setImageUrl('');
            setParagraphs([]);
            setBulkText('');
            
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload news');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-header bg-white py-4 px-4 border-bottom border-light">
                    <h5 className="mb-0 fw-bold text-dark">Upload News Article</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label fw-medium">Title <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                            />
                        </div>

                        {/* URL */}
                        <div className="mb-3">
                            <label className="form-label fw-medium">URL</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="https://example.com"
                                value={url} 
                                onChange={(e) => setUrl(e.target.value)} 
                            />
                        </div>

                        {/* Category & Section */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Category <span className="text-danger">*</span></label>
                                <select 
                                    className="form-select" 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="general">General News</option>
                                    <option value="local">Local</option>
                                    <option value="national">National</option>
                                    <option value="international">International</option>
                                    <option value="sports">Sports</option>
                                    <option value="technology">Technology</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="tips">Tips & Tricks</option>
                                    <option value="stories">Story Telling</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Section <span className="text-danger">*</span></label>
                                <select 
                                    className="form-select" 
                                    value={section} 
                                    onChange={(e) => setSection(e.target.value)} 
                                    required
                                >
                                    <option value="">Select section</option>
                                    <option value="general">General News</option>
                                    <option value="featured">Featured News</option>
                                    <option value="breaking">Breaking News</option>
                                    <option value="recent">Recent News</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="tips">Tips & Tricks</option>
                                    <option value="stories">Story Telling</option>
                                </select>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="mb-4">
                            <label className="form-label fw-medium d-block">Content</label>
                            
                            {/* Paragraphs List */}
                            <div className="vstack gap-3 mb-3">
                                {paragraphs.map((p, pIndex) => (
                                    <div key={pIndex} className="paragraph-item">
                                        <div className="d-flex gap-2 mb-2">
                                            <textarea 
                                                className="form-control" 
                                                rows="3" 
                                                placeholder={`Paragraph ${pIndex + 1}`}
                                                value={p.text}
                                                onChange={(e) => handleParagraphChange(pIndex, e.target.value)}
                                            ></textarea>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-danger align-self-start"
                                                onClick={() => handleRemoveParagraph(pIndex)}
                                                title="Remove Paragraph"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        {/* Sub-points */}
                                        <div className="subpoints-container">
                                            {p.subPoints.map((sp, sIndex) => (
                                                <div key={sIndex} className="input-group mb-2 subpoint-item">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-dot"></i>
                                                    </span>
                                                    <input 
                                                        type="text" 
                                                        className={`form-control ${sp.isBold ? 'fw-bold' : ''}`}
                                                        placeholder="Sub-point"
                                                        value={sp.text}
                                                        onChange={(e) => handleSubPointChange(pIndex, sIndex, e.target.value)}
                                                    />
                                                    <button 
                                                        className={`btn ${sp.isBold ? 'btn-dark' : 'btn-outline-dark'}`} 
                                                        type="button"
                                                        onClick={() => toggleSubPointBold(pIndex, sIndex)}
                                                        title="Toggle Bold"
                                                    >
                                                        <FaBold />
                                                    </button>
                                                    <button 
                                                        className="btn btn-outline-danger" 
                                                        type="button"
                                                        onClick={() => handleRemoveSubPoint(pIndex, sIndex)}
                                                        title="Remove Sub-point"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-light text-primary border-0"
                                                onClick={() => handleAddSubPoint(pIndex)}
                                            >
                                                <FaPlus className="me-1" /> Add Sub-point
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                type="button" 
                                className="btn btn-secondary btn-sm"
                                onClick={handleAddParagraph}
                            >
                                <FaPlus className="me-1" /> Add Paragraph
                            </button>

                            {/* Bulk Text Splitter */}
                            <div className="mt-4 p-3 bg-light rounded-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Bulk Text Tool</label>
                                <textarea 
                                    className="form-control mb-2" 
                                    rows="3" 
                                    placeholder="Paste long text here to automatically split by periods (.) into paragraphs"
                                    value={bulkText}
                                    onChange={(e) => setBulkText(e.target.value)}
                                ></textarea>
                                <button 
                                    type="button" 
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={handleBulkSplit}
                                    disabled={!bulkText}
                                >
                                    Split into Paragraphs
                                </button>
                            </div>
                        </div>

                        {/* Image & Status */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Upload Image</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {imageUrl && (
                                    <div className="mt-2">
                                        <small className="text-success d-block mb-1">Image selected:</small>
                                        <img src={imageUrl} alt="Preview" className="img-thumbnail" style={{ maxHeight: '100px' }} />
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-medium">Approval Status</label>
                                <select 
                                    className="form-select" 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    <option value="pending">Pending Approval</option>
                                    <option value="approved">Approved</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex justify-content-end gap-3 align-items-center">
                            <button 
                                type="button" 
                                className="btn btn-light news-action-btn" 
                                onClick={() => navigate('/admin/dashboard')}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary news-action-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload News'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewsUpload;
