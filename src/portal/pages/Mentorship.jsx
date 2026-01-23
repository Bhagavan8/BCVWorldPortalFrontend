import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  Star, 
  ChevronRight, 
  User, 
  Video, 
  MessageSquare,
  ShieldCheck,
  Award,
  ArrowRight,
  Target,
  Zap,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import axios from 'axios';
import AuthService from '../../admin/services/AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';

// Helper for robust Axios requests with retry and timeout
const axiosWithRetry = async (url, options = {}, retries = 3, timeout = 20000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await axios({
        url,
        timeout,
        ...options
      });
      return res;
    } catch (error) {
      // Don't retry if 4xx (client error), except 408 (Timeout) or 429 (Too Many Requests)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
         if (error.response.status !== 408 && error.response.status !== 429) {
            throw error;
         }
      }
      
      if (i === retries) throw error;
      
      const delay = 1000 * Math.pow(2, i);
      console.log(`Request failed, retrying in ${delay}ms... (${url})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const Mentorship = () => {
  // Debug API URL
  React.useEffect(() => {
    console.log("Mentorship Page: API_BASE_URL is", API_BASE_URL);
  }, []);

  const [selectedSession, setSelectedSession] = useState(null);
  const [bookingStep, setBookingStep] = useState(0); // 0: Select, 1: Date/Time, 2: Details, 3: Payment
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', goal: '' });

  // Prefill user data if logged in
  React.useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
        const actualUser = user.user || user.data || user;
        setFormData(prev => ({
            ...prev,
            name: actualUser.name || prev.name,
            email: actualUser.email || prev.email,
            phone: actualUser.mobile || actualUser.phone || prev.phone
        }));
    }
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLegalAccepted, setIsLegalAccepted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, connecting, processing, verified, success
  const [bookedSlots, setBookedSlots] = useState([]); // Slots already taken

  // Mock Data
  const sessions = [
    {
      id: 1,
      title: "1:1 Career Guidance",
      duration: "30 Mins",
      price: 150,
      description: "Personalized roadmap, resume review, and career strategy.",
      features: ["Resume Analysis", "Mock Interview Tips", "Career Roadmap"]
    },
    {
      id: 2,
      title: "Technical Mock Interview",
      duration: "45 Mins",
      price: 150,
      description: "Real-world coding interview simulation with feedback.",
      features: ["DSA Problem Solving", "System Design Basics", "Detailed Feedback"]
    }
  ];

  // Fetch availability when date changes
  React.useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate) return;
      try {
        // Use local date string (YYYY-MM-DD) to avoid UTC shifts
        const offset = selectedDate.getTimezoneOffset();
        const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
        const dateStr = localDate.toISOString().split('T')[0];
        
        console.log("Fetching availability for:", dateStr);

        const res = await axiosWithRetry(`${API_BASE_URL}/api/mentorship/availability?date=${dateStr}`, {
            method: 'GET',
            headers: getAuthHeader()
        });
        
        console.log("Availability Response:", res.data);

        if (res.data && res.data.bookedSlots) {
            setBookedSlots(res.data.bookedSlots);
        }
      } catch (err) {
        console.error("Failed to fetch availability", err);
        // Don't clear booked slots on error to avoid showing them as available
      }
    };
    fetchAvailability();
  }, [selectedDate]);

    // Generate Available Time Slots with 30-min buffer logic
    const getAvailableTimeSlots = () => {
      const allSlots = [
        "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", 
        "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", 
        "6:00 PM", "7:00 PM", "8:00 PM"
      ];
      
      if (!selectedDate) return [];

      const now = new Date();
      const isToday = selectedDate.getDate() === now.getDate() && 
                      selectedDate.getMonth() === now.getMonth() && 
                      selectedDate.getFullYear() === now.getFullYear();

      return allSlots.map(slot => {
        // 1. Check if booked in backend (Case insensitive & trimmed)
        const isBooked = bookedSlots.some(booked => booked.trim().toLowerCase() === slot.trim().toLowerCase());
        
        if (isBooked) {
            return { time: slot, available: false, reason: 'Booked' };
        }

        // 2. Check time buffer (only if today)
        if (isToday) {
           const [time, period] = slot.split(' ');
           let [hours, minutes] = time.split(':');
           hours = parseInt(hours);
           if (period === 'PM' && hours !== 12) hours += 12;
           if (period === 'AM' && hours === 12) hours = 0;
           
           const slotTime = new Date(selectedDate);
           slotTime.setHours(hours, parseInt(minutes), 0);
           
           // Buffer: Allow booking only if slot is > 30 minutes from NOW
           const bufferTime = new Date(now.getTime() + 30 * 60000); 
           
           if (slotTime <= bufferTime) {
               return { time: slot, available: false, reason: 'Past' };
           }
        }
        return { time: slot, available: true };
      });
    };

  // Generate next 7 days
  const getNextDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const handleBookClick = (session) => {
    setSelectedSession(session);
    setBookingStep(1);
    // Smooth scroll to booking section with a slight delay to ensure render
    setTimeout(() => {
        const section = document.getElementById('booking-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
  };

  // Helper to match JobService authentication pattern
  const getAuthHeader = () => {
    const token = AuthService.getToken();
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  };

  const handlePayment = async () => {
    if (!isLegalAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('connecting');

    // 1. Simulate Connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPaymentStatus('processing'); // "Verifying Transaction ID..."
    
    // 2. Simulate Verification Logic (and send to DB)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        const bookingData = {
           ...formData,
           sessionId: selectedSession.id,
           date: selectedDate,
           time: selectedTime,
           transactionId,
           amount: selectedSession.price,
           timestamp: new Date().toISOString(),
           status: 'pending_verification'
        };

        // Send to Backend
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        };
        
        console.log("Mentorship: Sending request to", `${API_BASE_URL}/api/mentorship/book`);
        console.log("Mentorship: Headers:", headers);

        await axios.post(`${API_BASE_URL}/api/mentorship/book`, bookingData, {
            headers: headers
        });

        setPaymentStatus('verified');
        
        // 3. Success Animation Delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsProcessing(false);
        setPaymentStatus('idle');
        setBookingStep(4);
        toast.success("Payment Verified! Booking Confirmed.");

    } catch (error) {
        console.error("Booking Error:", error);
        setIsProcessing(false);
        setPaymentStatus('idle');
        toast.error("Failed to save booking. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <SEO 
        title="1:1 Mentorship | BCVWorld" 
        description="Book a 1:1 mentorship session with industry experts. Career guidance, mock interviews, and more." 
      />

      {/* 1. Hero Section - Clean & Professional */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 mb-6 text-blue-600 font-semibold tracking-wide uppercase text-xs">
               <span className="w-8 h-[1px] bg-blue-600"></span>
               Accelerate Your Career
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1] text-slate-900">
              Master Your Path with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Expert Mentorship</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mb-12 font-light leading-relaxed">
              Get personalized guidance, crack interviews, and build a career you love. 
              Direct access to industry veterans for just <span className="font-semibold text-slate-900">₹150</span>.
            </p>
            <button 
              onClick={() => document.getElementById('sessions').scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-3 text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              Book Your Session <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Benefits Section - Grid Layout (No Cards) */}
      <section className="py-20 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              { icon: <Target className="w-8 h-8" />, title: "Clarity & Direction", desc: "Confused about your next step? Get a clear, actionable roadmap tailored to you." },
              { icon: <Zap className="w-8 h-8" />, title: "Insider Knowledge", desc: "Learn what really happens in interviews and how to stand out from the crowd." },
              { icon: <ShieldCheck className="w-8 h-8" />, title: "Honest Feedback", desc: "Unbiased, constructive feedback on your resume and skills that friends won't give." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform origin-left">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Session Types & Pricing - List Layout (No Cards) */}
      <section id="sessions" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Session</h2>
            <p className="text-slate-500">Simple pricing. Maximum value.</p>
          </div>

          <div className="bg-white border-y border-slate-200 divide-y divide-slate-200">
            {sessions.map((session) => (
              <div key={session.id} className="grid md:grid-cols-12 gap-8 p-8 md:p-12 hover:bg-slate-50/50 transition-colors group">
                {/* Info */}
                <div className="md:col-span-8">
                  <div className="flex items-center gap-3 mb-2">
                     <h3 className="text-2xl font-bold text-slate-900">{session.title}</h3>
                     <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Popular</span>
                  </div>
                  <p className="text-slate-600 mb-6 max-w-xl">{session.description}</p>
                  <div className="flex flex-wrap gap-4 md:gap-8">
                     {session.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-500">
                           <Check className="w-4 h-4 text-green-500" /> {feat}
                        </div>
                     ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                  <div className="mb-1">
                     <span className="text-3xl font-bold text-slate-900">₹{session.price}</span>
                     <span className="text-slate-400 text-sm"> / session</span>
                  </div>
                  <div className="text-sm text-slate-400 mb-6">{session.duration} duration</div>
                  <button 
                    onClick={() => handleBookClick(session)}
                    className="w-full md:w-auto px-8 py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Booking Flow - Clean Steps */}
      {bookingStep > 0 && (
        <section id="booking-section" className="py-24 bg-white border-t border-slate-200 min-h-screen">
          <div className="container mx-auto px-4 max-w-3xl">
            
            {/* Header / Stepper */}
            <div className="mb-12">
               <button 
                 onClick={() => setBookingStep(0)} 
                 className="text-sm text-slate-400 hover:text-slate-900 mb-6 flex items-center gap-1"
               >
                 <ChevronRight className="w-4 h-4 rotate-180" /> Back to Sessions
               </button>
               
               <div className="flex items-end justify-between border-b border-slate-200 pb-6">
                 <div>
                    <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">Step {bookingStep} of 3</span>
                    <h2 className="text-3xl font-bold text-slate-900">
                       {bookingStep === 1 && "Select Date & Time"}
                       {bookingStep === 2 && "Your Details"}
                       {bookingStep === 3 && "Payment"}
                       {bookingStep === 4 && "Confirmed"}
                    </h2>
                 </div>
                 {selectedSession && (
                    <div className="text-right hidden sm:block">
                       <div className="text-sm font-bold text-slate-900">{selectedSession.title}</div>
                       <div className="text-slate-500 text-sm">₹{selectedSession.price} • {selectedSession.duration}</div>
                    </div>
                 )}
               </div>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Date & Time */}
              {bookingStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  {/* Date */}
                  <div>
                    <h4 className="font-bold text-lg mb-6 text-slate-900 flex items-center gap-2">
                       <CalendarIcon className="w-5 h-5 text-slate-400" /> Select Date
                    </h4>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                      {getNextDays().map((date, i) => (
                        <button
                          key={i}
                          onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                          className={`flex-shrink-0 w-20 h-24 flex flex-col items-center justify-center border transition-all ${
                            selectedDate?.toDateString() === date.toDateString() 
                            ? 'bg-slate-900 border-slate-900 text-white' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900'
                          }`}
                        >
                          <span className="text-xs font-medium uppercase tracking-wider mb-1 opacity-70">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-2xl font-bold">{date.getDate()}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <h4 className="font-bold text-lg mb-6 text-slate-900 flex items-center gap-2">
                       <Clock className="w-5 h-5 text-slate-400" /> Select Time
                    </h4>
                    
                    {getAvailableTimeSlots().length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {getAvailableTimeSlots().map((slot, i) => (
                          <button
                            key={i}
                            disabled={!slot.available}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            className={`py-3 px-4 text-sm font-medium border transition-all ${
                              !slot.available 
                              ? 'bg-slate-50 border-transparent text-slate-300 cursor-not-allowed decoration-slate-300 line-through'
                              : selectedTime === slot.time 
                                ? 'bg-slate-900 border-slate-900 text-white' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-50 border border-slate-200 text-center text-slate-500">
                         <p>No available slots for this date.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-8 flex justify-end">
                    <button 
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setBookingStep(2)}
                      className="px-8 py-4 bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Details */}
              {bookingStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="group">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                          <input 
                            type="text" 
                            className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none transition-colors text-lg"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="group">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                          <input 
                            type="email" 
                            className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none transition-colors text-lg"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="group">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                          <input 
                            type="tel" 
                            className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none transition-colors text-lg"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            placeholder="+91 9876543210"
                          />
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="group h-full">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Purpose of Session</label>
                          <textarea 
                            className="w-full h-40 py-3 bg-slate-50 p-4 border border-slate-200 focus:border-slate-900 outline-none transition-colors resize-none"
                            value={formData.goal}
                            onChange={e => setFormData({...formData, goal: e.target.value})}
                            placeholder="Briefly describe what you want to achieve..."
                          ></textarea>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 flex justify-between items-center border-t border-slate-100 mt-8">
                    <button 
                      onClick={() => setBookingStep(1)}
                      className="text-slate-500 font-bold hover:text-slate-900"
                    >
                      Back
                    </button>
                    <button 
                      disabled={!formData.name || !formData.email}
                      onClick={() => setBookingStep(3)}
                      className="px-8 py-4 bg-blue-600 text-white font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors w-full sm:w-auto sm:ml-auto"
                    >
                      Proceed to Pay
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment */}
              {bookingStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="grid md:grid-cols-2 gap-12">
                    {/* QR Section */}
                    <div className="bg-slate-50 p-8 flex flex-col items-center justify-center border border-slate-200">
                        <div className="bg-white p-4 shadow-sm border border-slate-100 mb-6">
                           <img src="/assets/images/payment-qr.jpg" alt="Payment QR Code" className="w-48 h-48 object-contain" />
                        </div>
                        <div className="text-center">
                           <div className="text-4xl font-bold text-slate-900 mb-2">₹{selectedSession?.price}</div>
                           <p className="text-sm text-slate-500">Scan with any UPI App</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="flex flex-col justify-center space-y-8">
                       <div>
                          <h4 className="font-bold text-lg mb-4 text-slate-900">Verify Payment</h4>
                          <p className="text-slate-500 text-sm mb-6">Enter the 12-digit UTR/Transaction ID from your payment app to confirm your booking.</p>
                          
                          <div className="group mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transaction ID</label>
                            <input 
                              type="text" 
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="e.g. 402819345678"
                              className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none transition-colors font-mono text-lg"
                            />
                          </div>

                          <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="pt-1">
                                <input 
                                type="checkbox" 
                                checked={isLegalAccepted}
                                onChange={(e) => setIsLegalAccepted(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                />
                            </div>
                            <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                              I understand that this session is for educational purposes. <span className="font-bold">No refunds</span> once booked.
                            </span>
                          </label>
                       </div>

                       <div className="pt-4 flex gap-4">
                          <button 
                            onClick={() => setBookingStep(2)}
                            className="px-6 py-4 border border-slate-200 text-slate-900 font-bold hover:bg-slate-50"
                          >
                            Back
                          </button>
                          <button 
                            onClick={handlePayment}
                            disabled={isProcessing || !isLegalAccepted || !transactionId}
                            className={`flex-1 py-4 font-bold transition-all flex items-center justify-center gap-2 ${
                                isProcessing ? 'bg-slate-800 cursor-wait' : 'bg-slate-900 hover:bg-blue-600'
                            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                            {isProcessing ? (
                                "Processing..."
                            ) : (
                                "Verify & Book"
                            )}
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Success */}
              {bookingStep === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 max-w-xl mx-auto"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Booking Submitted!</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. 
                    We have received your request. Once verified (5-10 mins), you will receive the meeting link on WhatsApp/Email.
                  </p>
                  
                  <button 
                    onClick={() => { setBookingStep(0); setSelectedSession(null); }}
                    className="px-8 py-3 bg-slate-900 text-white font-bold hover:bg-slate-800"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* 5. How it works - Minimalist Steps */}
      <section className="py-24 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Book a Slot", desc: "Choose a time that works for you from the calendar." },
              { step: "02", title: "Join the Call", desc: "Connect via the Google Meet link sent to your email." },
              { step: "03", title: "Get Results", desc: "Receive actionable feedback and resources after the session." }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-6xl font-bold text-slate-100 mb-4 group-hover:text-blue-50 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Success Stories - Clean Grid */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold mb-16">Real Stories, Real Growth</h2>
          <div className="grid md:grid-cols-3 gap-12 border-t border-slate-800 pt-12">
            {[
              { 
                name: "Priya Sharma", 
                role: "SDE-1 at Amazon", 
                quote: "The mock interview session was a game changer. I realized my approach to DP problems was inefficient. Two weeks later, I cleared the Amazon loop!",
              },
              { 
                name: "Rahul Verma", 
                role: "Frontend Dev at Swiggy", 
                quote: "I was stuck in a service-based company. The career guidance session helped me restructure my resume and portfolio. Highly recommended!",
              },
              { 
                name: "Ananya Gupta", 
                role: "Data Analyst at Flipkart", 
                quote: "Honest feedback is rare. The mentor didn't sugarcoat things, which is exactly what I needed to improve my SQL and Python skills.",
              }
            ].map((story, i) => (
              <div key={i} className="space-y-6">
                <p className="text-slate-300 italic leading-relaxed text-lg">"{story.quote}"</p>
                <div>
                  <h4 className="font-bold text-white">{story.name}</h4>
                  <p className="text-xs text-blue-400 uppercase tracking-wider mt-1">{story.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ - Clean List */}
      <section className="py-24 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">FAQ</h2>
          <div className="space-y-8">
            {[
              { q: "What happens if I miss the session?", a: "We offer one free reschedule if you inform us 24 hours in advance." },
              { q: "Is the payment refundable?", a: "Payments are non-refundable but can be used for future sessions in case of rescheduling." },
              { q: "Do you review resumes?", a: "Yes! In the 1:1 Career Guidance session, we dedicate time to detailed resume reviews." }
            ].map((faq, i) => (
              <div key={i} className="pb-8 border-b border-slate-100 last:border-0">
                <h3 className="font-bold text-lg mb-2 text-slate-900">{faq.q}</h3>
                <p className="text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Legal Footer */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            BCVWorld Mentorship Platform connects users with independent industry experts. We do not guarantee job offers, interview calls, or specific career outcomes. The advice provided during sessions is based on the personal experience of the mentor and should be used for educational purposes only. Payments are processed securely via third-party gateways. Refunds are subject to our cancellation policy (must cancel 24h prior). By booking a session, you agree to our Terms of Service and Privacy Policy. All rights reserved &copy; {new Date().getFullYear()} BCVWorld.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Mentorship;
