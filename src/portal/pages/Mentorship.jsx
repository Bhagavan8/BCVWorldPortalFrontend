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
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Mentorship = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [bookingStep, setBookingStep] = useState(0); // 0: Select, 1: Date/Time, 2: Details, 3: Payment
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', goal: '' });
  const [isProcessing, setIsProcessing] = useState(false);

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

  const timeSlots = [
    "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"
  ];

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
    // Scroll to booking section
    document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate Payment Gateway
    setTimeout(() => {
      setIsProcessing(false);
      setBookingStep(4); // Success
      toast.success("Booking Confirmed!");
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <SEO 
        title="1:1 Mentorship | BCVWorld" 
        description="Book a 1:1 mentorship session with industry experts. Career guidance, mock interviews, and more." 
      />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-600/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-300 text-sm font-semibold mb-6">
              <span className="mr-2">🚀</span> Accelerate Your Career
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Master Your Path with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Expert Mentorship</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Get personalized guidance, crack interviews, and build a career you love. 
              Direct access to industry veterans for just <span className="text-white font-bold">₹150</span>.
            </p>
            <button 
              onClick={() => document.getElementById('sessions').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Book Your Session
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Benefits Section (What you get) */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why 1:1 Mentorship?</h2>
            <p className="text-slate-600 mt-2">Stop guessing. Start growing.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <Target className="w-6 h-6" />, title: "Clarity & Direction", desc: "Confused about your next step? Get a clear, actionable roadmap tailored to you." },
              { icon: <Zap className="w-6 h-6" />, title: "Insider Knowledge", desc: "Learn what really happens in interviews and how to stand out from the crowd." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Honest Feedback", desc: "Unbiased, constructive feedback on your resume and skills that friends won't give." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Session Types & Pricing */}
      <section id="sessions" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Choose Your Session</h2>
            <p className="text-slate-600 mt-2">Simple pricing. Maximum value.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg hover:border-blue-500 transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                <h3 className="text-2xl font-bold mb-2">{session.title}</h3>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-bold text-blue-600">₹{session.price}</span>
                  <span className="text-slate-500 mb-1">/ {session.duration}</span>
                </div>
                <p className="text-slate-600 mb-6">{session.description}</p>
                <ul className="space-y-3 mb-8">
                  {session.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleBookClick(session)}
                  className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Booking Flow (The functional part) */}
      <section id="booking-section" className={`py-20 bg-slate-50 transition-all duration-500 ${bookingStep > 0 ? 'opacity-100' : 'opacity-50 grayscale pointer-events-none'}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">
                  {bookingStep === 4 ? "Booking Confirmed! 🎉" : "Complete Your Booking"}
                </h3>
                {selectedSession && bookingStep < 4 && (
                  <p className="text-slate-400 text-sm mt-1">
                    {selectedSession.title} • ₹{selectedSession.price}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 1 ? 'bg-blue-600' : 'bg-slate-700'}`}>1</div>
                <div className="w-4 h-0.5 bg-slate-700"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 2 ? 'bg-blue-600' : 'bg-slate-700'}`}>2</div>
                <div className="w-4 h-0.5 bg-slate-700"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 3 ? 'bg-blue-600' : 'bg-slate-700'}`}>3</div>
              </div>
            </div>

            <div className="p-6 md:p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                {bookingStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-600" /> Select Date</h4>
                      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {getNextDays().map((date, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(date)}
                            className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-all ${
                              selectedDate?.toDateString() === date.toDateString() 
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-xs font-medium uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="text-xl font-bold">{date.getDate()}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" /> Select Time</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {timeSlots.map((time, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
                              selectedTime === time 
                              ? 'bg-blue-50 border-blue-500 text-blue-700' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setBookingStep(2)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {bookingStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="font-bold text-lg mb-4">Your Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">What's your main goal?</label>
                        <textarea 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          rows="3"
                          value={formData.goal}
                          onChange={e => setFormData({...formData, goal: e.target.value})}
                          placeholder="e.g. Resume review, Mock interview prep..."
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button 
                        onClick={() => setBookingStep(1)}
                        className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl"
                      >
                        Back
                      </button>
                      <button 
                        disabled={!formData.name || !formData.email}
                        onClick={() => setBookingStep(3)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors"
                      >
                        Proceed to Pay
                      </button>
                    </div>
                  </motion.div>
                )}

                {bookingStep === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 text-center"
                  >
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 max-w-sm mx-auto">
                      <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                      <div className="text-4xl font-bold text-slate-900 mb-4">₹{selectedSession?.price}</div>
                      <div className="space-y-2 text-sm text-slate-600 border-t border-blue-200 pt-4">
                        <div className="flex justify-between">
                          <span>Session</span>
                          <span className="font-medium">{selectedSession?.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full max-w-sm mx-auto py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" /> Pay ₹{selectedSession?.price}
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Secure Payment via Razorpay
                    </p>
                  </motion.div>
                )}

                {bookingStep === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      We've sent a confirmation email to <b>{formData.email}</b> with the meeting link.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl max-w-sm mx-auto mb-8 border border-slate-200">
                      <div className="text-sm text-slate-500">Upcoming Session</div>
                      <div className="font-bold text-slate-900 text-lg mt-1">{selectedDate?.toLocaleDateString()} at {selectedTime}</div>
                    </div>
                    <button 
                      onClick={() => { setBookingStep(0); setSelectedSession(null); }}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
                    >
                      Book Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            {[
              { step: "1", title: "Book a Slot", desc: "Choose a time that works for you from the calendar." },
              { step: "2", title: "Join the Call", desc: "Connect via the Google Meet link sent to your email." },
              { step: "3", title: "Get Results", desc: "Receive actionable feedback and resources after the session." }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
                {i < 2 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">What Mentees Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Priya S.", role: "Software Engineer", text: "The mock interview was a game changer. I realized my weak spots in System Design and fixed them before my actual interview." },
              { name: "Rahul K.", role: "Student", text: "Worth every penny! The roadmap Bhagavan gave me helped me land my first internship at a product startup." }
            ].map((t, i) => (
              <div key={i} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "What happens if I miss the session?", a: "We offer one free reschedule if you inform us 24 hours in advance." },
              { q: "Is the payment refundable?", a: "Payments are non-refundable but can be used for future sessions in case of rescheduling." },
              { q: "Do you review resumes?", a: "Yes! In the 1:1 Career Guidance session, we dedicate time to detailed resume reviews." }
            ].map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors">
                <h3 className="font-bold text-lg mb-2 text-slate-900">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Level Up?</h2>
          <button 
            onClick={() => document.getElementById('sessions').scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1"
          >
            Book Your Session Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Mentorship;
