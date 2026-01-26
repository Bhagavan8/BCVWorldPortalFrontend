import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ChevronDown,
  User, 
  Video, 
  ShieldCheck,
  ArrowRight,
  Target,
  Zap,
  Check
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import axios from 'axios';
import AuthService from '../../admin/services/AuthService';
import { API_BASE_URL } from '../../utils/config';

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

const getAuthHeader = () => {
  const token = AuthService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
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
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
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

        await axiosWithRetry(`${API_BASE_URL}/api/mentorship/book`, {
            method: 'POST',
            data: bookingData,
            headers: headers
        });

        // 3. Success Animation Delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsProcessing(false);
        setBookingStep(4);
        toast.success("Payment Verified! Booking Confirmed.");

    } catch (error) {
        console.error("Booking Error:", error);
        setIsProcessing(false);
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

      {/* 3. Meet Your Mentor - Human Connection */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                 {/* Placeholder for mentor image, using generic avatar if no image */}
                 <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
                    <User className="w-16 h-16" />
                 </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">Hi, I’m CV 👋</h2>
                 <p className="text-slate-600 leading-relaxed text-lg mb-6">
                    I’ve helped <span className="font-bold text-slate-900">students</span> crack interviews at top product companies and startups. 
                    I’ve been on both sides of the table — candidate and interviewer.
                 </p>
                 <p className="text-slate-600 leading-relaxed text-lg">
                    In our session, you won’t get theory. You’ll get <span className="font-bold text-slate-900">real, practical advice</span> that actually works.
                 </p>
                 
                 <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                    {["7+ years industry experience", "Expert Interviewer", "Senior Software Engineer"].map((tag, i) => (
                       <span key={i} className="bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-medium text-slate-700 shadow-sm">
                          {tag}
                       </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Who is this for? - Segmentation */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-3xl">
           <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Is This Mentorship Right for You?</h2>
           <div className="space-y-4">
              {[
                 "Preparing for product-based company interviews",
                 "Confused about DSA/System Design roadmap",
                 "Resume not getting shortlisted",
                 "Switching from service → product company",
                 "Final year or 0-3 years experience"
              ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                       <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-lg text-slate-700 font-medium">{item}</span>
                 </div>
              ))}
           </div>
           <p className="text-center text-slate-500 mt-10 font-medium">
              If you said <span className="text-blue-600 font-bold">"yes"</span> to even one, this session will save you months of trial and error.
           </p>
        </div>
      </section>

      {/* 5. Sessions pricing - Urgency Added */}
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
                  <div className="mb-6">
                     <span className="text-3xl font-bold text-slate-900">₹{session.price}</span>
                     <span className="text-slate-400 text-sm"> / session</span>
                  </div>

                  <button 
                    onClick={() => handleBookClick(session)}
                    className="w-full md:w-auto px-8 py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Book Now
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2 w-full md:w-auto">Takes only 2 minutes to book</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. What you’ll walk away with - Outcome */}
      <section className="py-20 bg-slate-900 text-white">
         <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">What You’ll Walk Away With</h2>
               <p className="text-slate-400">Users don’t buy “30 mins”. They buy results.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                  { icon: <Target className="w-6 h-6" />, title: "Clear Roadmap", desc: "Step-by-step plan tailored to your goal." },
                  { icon: <CheckCircle className="w-6 h-6" />, title: "Resume Fixes", desc: "Changes you can apply immediately." },
                  { icon: <Zap className="w-6 h-6" />, title: "Interview Secrets", desc: "Mistakes you didn't know you were making." },
                  { icon: <Video className="w-6 h-6" />, title: "Action Plan", desc: "Recording + notes after session." }
               ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                     <div className="text-blue-400 mb-4">{item.icon}</div>
                     <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                     <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. Before vs After - Psychological */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Before vs After Mentorship</h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
               <div className="bg-slate-50 p-8 md:border-r border-slate-200">
                  <h3 className="text-xl font-bold text-slate-500 mb-6 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-slate-400"></span> Before
                  </h3>
                  <ul className="space-y-4">
                     {["Random YouTube prep", "100s of problems, no clarity", "Rejections & frustration", "Guessing resume changes"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-500">
                           <span className="text-slate-400">✕</span> {item}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="bg-blue-50/50 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                  <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2 relative z-10">
                     <span className="w-2 h-2 rounded-full bg-blue-600"></span> After
                  </h3>
                  <ul className="space-y-4 relative z-10">
                     {["Clear, focused roadmap", "Focused top 20 patterns", "Confident interviews", "Exact fixes that work"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-800 font-medium">
                           <Check className="w-5 h-5 text-blue-600" /> {item}
                        </li>
                     ))}
                  </ul>
               </div>
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
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">Phone Number <FaWhatsapp className="text-green-500 text-lg" /></label>
                          <input 
                            type="tel" 
                            className="w-full py-3 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none transition-colors text-lg"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            placeholder="+91 9876543210"
                          />
                          <p className="text-xs text-red-500 mt-2 font-medium">
                             * Please ensure your details are correct. We will send the meeting link to this email/number.
                          </p>
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

                  <div className="pt-8 flex items-center gap-4 border-t border-slate-100 mt-8">
                    <button 
                      onClick={() => setBookingStep(1)}
                      className="text-slate-500 font-bold hover:text-slate-900 shrink-0"
                    >
                      Back
                    </button>
                    <button 
                      disabled={!formData.name || !formData.email || !formData.phone || !formData.goal}
                      onClick={() => setBookingStep(3)}
                      className="px-8 py-4 bg-blue-600 text-white font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors flex-1 sm:w-auto sm:flex-none sm:ml-auto"
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
                           <p className="text-xs text-green-600 font-medium mt-2 flex items-center justify-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> 100% Secure Payment
                           </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="flex flex-col justify-center space-y-8">
                       <div>
                          <h4 className="font-bold text-lg mb-4 text-slate-900">Verify Payment</h4>
                          <p className="text-slate-500 text-sm mb-6">Enter the 12-digit UTR/Transaction ID from your payment app to confirm your booking.</p>
                          <a 
                             href="https://wa.me/917013765836" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100 flex items-start gap-3 hover:bg-green-100 transition-colors cursor-pointer group/whatsapp"
                          >
                             <FaWhatsapp className="text-green-600 text-xl mt-1 shrink-0 group-hover/whatsapp:scale-110 transition-transform" />
                             <div className="text-sm text-green-800">
                               <p className="font-bold mb-1 underline decoration-green-800/30 underline-offset-2">Send Payment Screenshot</p>
                               <p>Click here to send screenshot to: <span className="font-bold">+91 7013765836</span></p>
                             </div>
                          </a>
                          
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

      {/* 9. FAQ - Accordion Style */}
      <section className="py-24 border-t border-slate-100 bg-slate-50/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "What happens if I miss the session?", a: "We offer one free reschedule if you inform us 24 hours in advance." },
              { q: "Is the payment refundable?", a: "Payments are non-refundable but can be used for future sessions in case of rescheduling." },
              { q: "Do you review resumes?", a: "Yes! In the 1:1 Career Guidance session, we dedicate time to detailed resume reviews." },
              { q: "How do I join the session?", a: "You'll receive a Google Meet link via email and WhatsApp 10 minutes before the session." },
              { q: "Can I record the session?", a: "Yes! We also provide a recording and summary notes after the session." },
              { q: "Do you provide referrals?", a: "Yes, if your profile matches an opening in my network, I will happily refer you." },
              { q: "What if I'm a complete beginner?", a: "No problem! We'll start from scratch and build a roadmap that suits your current level." }
            ].map((faq, i) => (
              <div 
                key={i} 
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${openFaqIndex === i ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-blue-300'}`}
              >
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`font-bold text-lg ${openFaqIndex === i ? 'text-blue-700' : 'text-slate-900'}`}>{faq.q}</span>
                  {openFaqIndex === i ? (
                     <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                     <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Friendly Legal */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-sm text-slate-500 leading-relaxed">
            Mentorship sessions are for learning and guidance purposes. While we share proven strategies, outcomes depend on your effort and preparation. 
            Payments are secure and sessions can be rescheduled with prior notice. We’re here to genuinely help you grow 🚀
          </p>
        </div>
      </section>
    </div>
  );
};

export default Mentorship;
