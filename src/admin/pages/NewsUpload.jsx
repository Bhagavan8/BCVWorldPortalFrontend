import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsService from '../services/NewsService';
import toast from 'react-hot-toast';
import { FaTrash, FaBold, FaTimes, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { BiDisc } from 'react-icons/bi';
import '../assets/css/NewsUpload.css';

const NewsUpload = () => {
    const MAX_IMAGE_SIZE_BYTES = 7 * 1024 * 1024; // 7MB cap for safety
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
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
        const inputEl = e.target;
        const file = inputEl.files && inputEl.files[0];
        if (!file) return;

        // Basic validations
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            toast.error('Please select a JPG, PNG, WEBP, or GIF image');
            inputEl.value = '';
            return;
        }
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            const mb = (MAX_IMAGE_SIZE_BYTES / (1024 * 1024)).toFixed(0);
            toast.error(`Image too large. Please choose a file under ${mb}MB`);
            inputEl.value = '';
            return;
        }

        const loadingToast = toast.loading('Processing image...');
        const toBase64 = (f) => new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('FileReader error'));
                reader.onabort = () => reject(new Error('FileReader aborted'));
                reader.readAsDataURL(f);
            } catch (err) {
                reject(err);
            }
        });

        const loadImage = (src) => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

        const compressDataUrl = async (dataUrl) => {
            try {
                // Skip GIF compression to avoid breaking animations
                if (file.type === 'image/gif') return dataUrl;

                const img = await loadImage(dataUrl);
                const maxWidth = 1280;
                const scale = img.width > maxWidth ? maxWidth / img.width : 1;
                const targetW = Math.round(img.width * scale);
                const targetH = Math.round(img.height * scale);

                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, targetW, targetH);

                const outType = file.type === 'image/png' ? 'image/png' : 'image/webp';
                const quality = file.type === 'image/png' ? 0.92 : 0.82;
                const compressed = canvas.toDataURL(outType, quality);

                // Keep the smaller result
                return compressed.length < dataUrl.length ? compressed : dataUrl;
            } catch {
                return dataUrl;
            }
        };

        try {
            let dataUrl = await toBase64(file);
            dataUrl = await compressDataUrl(dataUrl);
            setImageUrl(dataUrl);
            toast.success('Image attached');
        } catch (error) {
            console.error('Image read failed', error);
            toast.error('Failed to read image. Please try a different file.');
            inputEl.value = '';
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !category || !section) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate content: at least one non-empty paragraph or sub-point
        const hasSomeContent = (paragraphs || []).some(p => {
            const hasText = (p?.text || '').trim().length > 0;
            const hasSub = (p?.subPoints || []).some(sp => (sp?.text || '').trim().length > 0);
            return hasText || hasSub;
        });
        if (!hasSomeContent) {
            toast.error('Please add at least one paragraph or sub-point');
            return;
        }

        setLoading(true);
        try {
            const slugFromTitle = (t) => t
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');

            const normalizePara = (p) => {
              let text = (p?.text || '').trim();
              const subPoints = (p?.subPoints || [])
                .map(sp => {
                  const b = !!sp?.isBold;
                  return {
                    text: (sp?.text || '').trim(),
                    bold: b,
                    isBold: b // compatibility for backends expecting `isBold`
                  };
                })
                .filter(sp => sp.text.length > 0);

              if (!text && subPoints.length === 0) return null;
              if (!text && subPoints.length > 0) text = subPoints[0].text;

              const para = { text };
              if (subPoints.length > 0) para.subPoints = subPoints;
              return para;
            };
            const normalizedContent = (paragraphs || [])
              .map(normalizePara)
              .filter(Boolean)
              .map(p => {
                // Final guard: ensure non-null text
                return { text: (p.text || '').trim(), ...(p.subPoints ? { subPoints: p.subPoints } : {}) };
              })
              .filter(p => p.text.length > 0 || (Array.isArray(p.subPoints) && p.subPoints.length > 0));

            if (normalizedContent.length === 0) {
                toast.error('Please add at least one valid paragraph');
                setLoading(false);
                return;
            }

            const payload = {
                title: (title || '').trim(),
                url: (url && url.trim()) || `/news/${slugFromTitle(title || 'news')}`,
                category: (category || '').trim(),
                section: (section || '').trim(),
                status: (status || 'pending').trim(),
                imageUrl: imageUrl || '',
                content: normalizedContent
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
            const status = error?.response?.status;
            const statusText = error?.response?.statusText;
            let serverMsg = '';
            const data = error?.response?.data;
            if (typeof data === 'string') {
                serverMsg = data.slice(0, 180);
            } else if (data && typeof data === 'object') {
                serverMsg = data.message || data.error || JSON.stringify(data).slice(0, 180);
            } else if (error?.message) {
                serverMsg = error.message;
            }
            const composed = [
                'Failed to upload news',
                status ? `(${status}${statusText ? ' ' + statusText : ''})` : '',
                serverMsg ? `: ${serverMsg}` : ''
            ].join(' ').trim();
            console.error('Upload failed details:', { status, statusText, data });
            toast.error(composed);
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
                                                        <BiDisc />
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
                                className="btn btn-primary news-action-btn d-flex align-items-center"
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
