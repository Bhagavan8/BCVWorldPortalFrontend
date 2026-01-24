import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../../admin/services/AuthService';
import { toast } from 'react-hot-toast';
import { 
    Check, 
    X, 
    Calendar, 
    Clock, 
    User, 
    MoreVertical, 
    Search, 
    Filter,
    IndianRupee,
    FileText,
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';

const MentorshipAdmin = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [mobileActionMenu, setMobileActionMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchTerm]);

    const fetchBookings = async () => {
        try {
            const token = AuthService.getToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const response = await axios.get(`${API_BASE_URL}/api/mentorship/all`, { headers });
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error(`Authentication failed: ${error.response.status}. Please check your permissions.`);
            } else {
                toast.error('Failed to fetch bookings');
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const token = AuthService.getToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            await axios.put(`${API_BASE_URL}/api/mentorship/${id}/status`, null, { 
                params: { status },
                headers 
            });
            toast.success(`Booking ${status.toLowerCase().replace('_', ' ')} successfully`);
            fetchBookings();
            setMobileActionMenu(null);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(`Failed to update booking status`);
        }
    };

    const formatTimeForInput = (timeStr) => {
        if (!timeStr) return '';
        if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
        try {
             // Expects "hh:mm a" e.g. "02:30 PM"
             const [time, modifier] = timeStr.split(' ');
             if (!time || !modifier) return timeStr;
             let [hours, minutes] = time.split(':');
             
             if (modifier.toLowerCase() === 'pm' && hours !== '12') {
                 hours = parseInt(hours, 10) + 12;
             } else if (modifier.toLowerCase() === 'am' && hours === '12') {
                 hours = '00';
             }
             return `${hours.toString().padStart(2, '0')}:${minutes}`;
        } catch (e) {}
        return timeStr;
    };

    const formatTimeForPayload = (timeStr) => {
        if (!timeStr) return '';
        try {
            // Expects "HH:mm" e.g. "14:30"
            const [hours, minutes] = timeStr.split(':');
            let h = parseInt(hours, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12; 
            return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
        } catch (e) {}
        return timeStr;
    };

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }
        } catch(e) {}
        return dateStr;
    };

    const handleReschedule = async () => {
        if (!selectedBooking || !newDate || !newTime) return;
        
        try {
            const token = AuthService.getToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const formattedTime = formatTimeForPayload(newTime);

            await axios.put(`${API_BASE_URL}/api/mentorship/${selectedBooking.id}/reschedule`, null, {
                params: { date: newDate, time: formattedTime },
                headers
            });
            toast.success('Booking rescheduled successfully');
            setShowRescheduleModal(false);
            fetchBookings();
            setMobileActionMenu(null);
        } catch (error) {
            console.error('Error rescheduling:', error);
            toast.error('Failed to reschedule booking');
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesFilter = filter === 'ALL' || b.status === filter;
        const matchesSearch = b.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            b.sessionId?.toString().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'PENDING_VERIFICATION': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatStatus = (status) => {
        return status ? status.replace(/_/g, ' ') : '';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
            }
        } catch (e) {
            console.error("Date parsing error", e);
        }
        return dateString;
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="w-full space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mentorship Bookings</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage session requests and schedules</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200">
                    {['ALL', 'PENDING_VERIFICATION', 'CONFIRMED', 'REJECTED', 'COMPLETED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                                filter === status 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 border-transparent hover:border-slate-200'
                            }`}
                        >
                            {status === 'ALL' ? 'All Bookings' : formatStatus(status)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Session</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Schedule</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                                                        {booking.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{booking.name}</div>
                                                        <div className="text-xs text-slate-500">{booking.email}</div>
                                                        <div className="text-xs text-slate-400">{booking.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-slate-900">Session #{booking.sessionId}</div>
                                                    
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1 text-xs text-slate-700 font-medium">
                                                            <IndianRupee className="w-3 h-3" />
                                                            {booking.amount}
                                                        </div>
                                                        {booking.transactionId && (
                                                            <div className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded w-fit select-all break-all border border-slate-200">
                                                                ID: {booking.transactionId}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {booking.goal && (
                                                        <div className="flex items-center gap-1 text-xs text-slate-500" title={booking.goal}>
                                                            <FileText className="w-3 h-3 shrink-0" />
                                                            <span className="truncate max-w-[200px]">{booking.goal}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        {formatDate(booking.date)}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        {booking.time}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(booking.status)}`}>
                                                    {formatStatus(booking.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {booking.status === 'PENDING_VERIFICATION' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors tooltip-trigger"
                                                                title="Approve"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleStatusChange(booking.id, 'REJECTED')}
                                                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                                title="Reject"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setNewDate(formatDateForInput(booking.date));
                                                            setNewTime(formatTimeForInput(booking.time));
                                                            setShowRescheduleModal(true);
                                                        }}
                                                        className="p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors"
                                                        title="Reschedule"
                                                    >
                                                        <Calendar className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {filteredBookings.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                                        <Search className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500">No bookings found matching your criteria</p>
                                </div>
                            )}
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {paginatedBookings.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                    <p className="text-slate-500">No bookings found</p>
                                </div>
                            ) : (
                                paginatedBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                                                    {booking.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{booking.name}</div>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border mt-1 ${getStatusStyle(booking.status)}`}>
                                                        {formatStatus(booking.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Mobile Actions Dropdown */}
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setMobileActionMenu(mobileActionMenu === booking.id ? null : booking.id)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                                
                                                {mobileActionMenu === booking.id && (
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                                                        {booking.status === 'PENDING_VERIFICATION' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                                                                    className="w-full text-left px-4 py-3 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium"
                                                                >
                                                                    <Check className="w-4 h-4" /> Approve
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleStatusChange(booking.id, 'REJECTED')}
                                                                    className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                                                                >
                                                                    <X className="w-4 h-4" /> Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedBooking(booking);
                                                                setNewDate(formatDateForInput(booking.date));
                                                                setNewTime(formatTimeForInput(booking.time));
                                                                setShowRescheduleModal(true);
                                                                setMobileActionMenu(null);
                                                            }}
                                                            className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-medium"
                                                        >
                                                            <Calendar className="w-4 h-4" /> Reschedule
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Details */}
                                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</div>
                                                <div className="text-sm font-medium text-slate-900">{formatDate(booking.date)}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time</div>
                                                <div className="text-sm font-medium text-slate-900">{booking.time}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session</div>
                                                <div className="text-sm font-medium text-slate-900">#{booking.sessionId}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</div>
                                                <div className="text-sm font-medium text-slate-900 flex items-center gap-1">
                                                    <IndianRupee className="w-3 h-3" />
                                                    {booking.amount}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="flex flex-col gap-2 text-xs text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 flex justify-center"><User className="w-3 h-3" /></span>
                                                {booking.email}
                                            </div>
                                            {booking.transactionId && (
                                                <div className="mt-1">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</div>
                                                    <div className="font-mono text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 break-all select-all">
                                                        {booking.transactionId}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {filteredBookings.length > itemsPerPage && (
                            <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200 pt-4 mt-6 gap-4">
                                <div className="text-sm text-slate-500">
                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> of <span className="font-medium">{filteredBookings.length}</span> results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                                            .map((page, index, array) => (
                                                <React.Fragment key={page}>
                                                    {index > 0 && array[index - 1] !== page - 1 && (
                                                        <span className="px-2 text-slate-400">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                            currentPage === page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-slate-600 hover:bg-slate-50 border border-slate-200'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </React.Fragment>
                                            ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 scale-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Reschedule Session</h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    Update timing for <span className="font-semibold text-slate-900">{selectedBooking?.name}</span>
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowRescheduleModal(false)}
                                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="date" 
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="time" 
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                onClick={() => setShowRescheduleModal(false)}
                                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleReschedule}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all text-sm"
                            >
                                Confirm Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorshipAdmin;