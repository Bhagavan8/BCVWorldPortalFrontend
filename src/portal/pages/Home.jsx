import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  BiRocket, BiBriefcase, BiUserVoice, BiBookContent, BiTrendingUp, 
  BiCheckCircle, BiHeadphone, BiCheckDouble, BiUser, BiBook, 
  BiTime, BiTachometer, BiBell, BiShield, BiChat, BiDevices, 
  BiMap, BiPhone, BiEnvelope, BiChevronRight, BiChevronDown, BiStar
} from 'react-icons/bi';
import SEO from '../components/SEO';
import { API_BASE_URL } from '../../utils/config';


export default function Home() {
  const [activeTab, setActiveTab] = useState('career');
  const [activeFaq, setActiveFaq] = useState(0);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize AOS dynamically
    const initAOS = async () => {
      try {
        const AOS = await import('aos');
        await import('aos/dist/aos.css');
        // Handle both ES module default export and CommonJS
        const aosInstance = AOS.default || AOS;
        aosInstance.init({
          duration: 800,
          once: true,
          offset: 50,
          disable: 'mobile'
        });
      } catch (error) {
        console.warn('AOS initialization failed:', error);
      }
    };
    
    initAOS();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use relative path - Vite proxy will handle the rest
      await axios.post(`${API_BASE_URL}/api/contact`, formData);
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: "How does BCVWorld's job referral process work?",
      answer: "Our job referral process involves three simple steps: First, submit your profile and preferences through our platform. Second, our team matches your profile with available opportunities in our partner companies. Finally, we facilitate direct referrals to increase your chances of landing interviews. Our network includes top companies across various industries."
    },
    {
      question: "What's included in the 1:1 career mentoring sessions?",
      answer: "Our 1:1 career mentoring sessions are personalized consultations with industry experts. Sessions typically cover career path planning, skill development strategies, resume review, interview preparation, and specific guidance for your target roles. Each session is tailored to your unique career goals and challenges."
    },
    {
      question: "How can I access the study resources and learning materials?",
      answer: "Once you register on our platform, you'll have 24/7 access to our comprehensive library of study materials through your personalized dashboard. Resources include technical guides, practice problems, video tutorials, and structured learning paths. We regularly update content to keep pace with industry trends."
    },
    {
      question: "What types of investment planning services do you offer?",
      answer: "Our investment planning services include personalized portfolio strategies, risk assessment, diversification guidance, and regular market insights. We help professionals make informed decisions about their investments while focusing on long-term wealth creation and financial security."
    },
    {
      question: "How long does it typically take to see results from your services?",
      answer: "Results vary based on individual circumstances and goals. However, many clients report positive outcomes within 2-3 months of consistent engagement with our services. This includes successful job placements, career transitions, skill improvements, and investment returns."
    },
    {
      question: "Do you offer any free resources or trial sessions?",
      answer: "Yes! We offer free initial consultations to understand your needs and goals. Additionally, you can access basic study materials and career resources through our platform. This helps you experience our services before making any commitments."
    }
  ];

  return (
    <div className="pt-20">
      <SEO 
        title="Home" 
        description="Unlock your career potential with BCVWORLD's comprehensive services - job referrals, mentoring, and financial planning."
        keywords="career growth, job referrals, mentoring, financial planning, resume building, bcvworld, jobs, career guidance"
      />
      
      {/* Hero Section */}
      <section id="hero" className="py-12 md:py-20 lg:py-24 hero-bg-custom relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Hero Content */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <BiRocket className="mr-2 text-lg" />
                Accelerating Your Career Growth
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Complete <br/>
                Career Growth <br/>
                <span className="text-blue-600">Partner</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Unlock your career potential with BCVWorld's comprehensive services - from job referrals
                and 1:1 mentoring to resume building and financial planning. We're here to guide your
                professional journey every step of the way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#features" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl text-center">
                  Explore Services
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full lg:w-1/2 relative">
              <img 
                src="/images/illustration-1.webp" 
                alt="Career Growth Illustration" 
                className="w-full h-auto drop-shadow-2xl animate-float"
                style={{ aspectRatio: '637/490' }}
                width="637"
                height="490"
                srcSet="/images/illustration-1.webp 637w"
                sizes="(max-width: 1024px) 100vw, 50vw"
                decoding="sync"
                fetchPriority="high"
              />
              <div className="absolute -bottom-6 -left-6 md:bottom-6 md:left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-xs hidden sm:block">
                <p className="text-sm font-medium text-gray-800 mb-0">
                  <span className="text-blue-600 font-bold">50+ professionals</span> enhanced their careers through our platform
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row - Redesigned */}
          <div className="mt-20 md:mt-28" data-aos="fade-up" data-aos-delay="500">
             <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-gray-50">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:justify-between items-start lg:items-center gap-8 lg:gap-4">
                  {[
                    { icon: BiBriefcase, count: "100+ Referrals", label: "Job Opportunities" },
                    { icon: BiUserVoice, count: "50+ Sessions", label: "1:1 Career Guidance" },
                    { icon: BiBookContent, count: "200+ Resources", label: "Study Materials" },
                    { icon: BiTrendingUp, count: "100+ Plans", label: "Investment Guidance" }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center gap-5 w-full lg:w-auto">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                        <stat.icon />
                      </div>
                      <div>
                        <span className="text-xl font-bold text-gray-900 leading-none mb-2">{stat.count}</span>
                        <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="w-full lg:w-5/12" data-aos="fade-up" data-aos-delay="200">
              <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase">WHY CHOOSE US</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">Your Trusted Partner in Career Development</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At BCVWorld, we're committed to empowering professionals with comprehensive
                career solutions. Our expertise spans across multiple domains, ensuring your success in today's
                competitive job market.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <ul className="space-y-3">
                  {[
                    "Personalized Job Referrals",
                    "1:1 Career Mentoring",
                    "Resume Building Services"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <BiCheckCircle className="text-blue-600 mr-2 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3">
                  {[
                    "Study Resources Library",
                    "Investment Planning",
                    "Career Growth Workshops"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <BiCheckCircle className="text-blue-600 mr-2 flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <BiUser className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Career Support</h3>
                      <p className="text-sm text-gray-500">Expert Team</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <BiHeadphone className="text-xl" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Need Guidance?</p>
                      <p className="text-sm font-bold text-blue-600">Book a Free Consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-6/12" data-aos="zoom-out" data-aos-delay="300">
              <div className="relative">
                <img 
                  src="/images/Career-Guidance-Session.webp" 
                  alt="Session" 
                  className="rounded-2xl shadow-2xl w-full" 
                  width="800" 
                  height="600" 
                  srcSet="/images/Career-Guidance-Session.webp 800w"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  loading="lazy" 
                  decoding="async" 
                  fetchPriority="low" 
                />
                <div className="absolute bottom-8 right-8 bg-white p-6 rounded-xl shadow-xl animate-bounce-slow hidden md:block">
                  <h3 className="text-3xl font-bold text-blue-600 mb-1">50+ <span className="text-gray-900 text-lg font-normal">Success</span></h3>
                  <p className="text-gray-500 text-sm">Stories in career enhancement</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Tabs Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Empowering your career journey with comprehensive solutions for professional growth</p>
          </div>

          <div className="flex justify-center mb-12" data-aos="fade-up" data-aos-delay="100">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl">
              {['career', 'learning', 'investment'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition capitalize ${
                    activeTab === tab 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {tab === 'career' ? 'Career Growth' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl" data-aos="fade-up" data-aos-delay="200">
            {activeTab === 'career' && (
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Accelerate Your Career Growth</h3>
                  <p className="text-gray-600 italic mb-6">Take your career to new heights with our personalized job referrals and expert guidance.</p>
                  <ul className="space-y-4">
                    {[
                      "Direct job referrals to top companies through our extensive network",
                      "Professional resume building and optimization services",
                      "1:1 career mentoring sessions with industry experts"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <BiCheckDouble className="text-blue-600 text-xl mr-3 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full lg:w-1/2 order-1 lg:order-2">
                  <img 
                    src="/images/Career-Growth-Illustration.webp" 
                    alt="Career Growth" 
                    className="w-full h-auto" 
                    width="637" 
                    height="490" 
                    loading="lazy" 
                    decoding="async" 
                    srcSet="/images/Career-Growth-Illustration.webp 637w"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}

            {activeTab === 'learning' && (
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Learning Resources</h3>
                  <p className="text-gray-600 italic mb-6">Access curated study materials and resources to enhance your skills and knowledge.</p>
                  <ul className="space-y-4 mb-8">
                    {[
                      "Extensive library of technical and professional development resources",
                      "Structured learning paths for different career trajectories",
                      "Regular workshops and webinars on emerging technologies",
                      "Practice materials and mock interviews for job preparation"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <BiCheckDouble className="text-blue-600 text-xl mr-3 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                 
                </div>
                <div className="w-full lg:w-1/2 order-1 lg:order-2">
                  <img 
                    src="/images/Learning-Resources-Illustration.webp" 
                    alt="Learning" 
                    className="w-full h-auto" 
                    width="637" 
                    height="490" 
                    loading="lazy" 
                    decoding="async"
                    srcSet="/images/Learning-Resources-Illustration.webp 637w"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}

            {activeTab === 'investment' && (
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Investment Planning</h3>
                  <ul className="space-y-4 mb-6">
                    {[
                      "Personalized investment strategies for long-term growth",
                      "Expert guidance on portfolio diversification",
                      "Regular market insights and investment opportunities"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <BiCheckDouble className="text-blue-600 text-xl mr-3 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-600 italic">Build your financial future with expert guidance on investment planning and wealth management.</p>
                </div>
                <div className="w-full lg:w-1/2 order-1 lg:order-2">
                  <img 
                    src="/images/Investment Planning Illustration.webp" 
                    alt="Investment" 
                    className="w-full h-auto" 
                    width="637" 
                    height="490" 
                    loading="lazy" 
                    decoding="async" 
                    srcSet="/images/Investment Planning Illustration.webp 637w"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              { icon: BiBriefcase, title: "Job Referrals", desc: "Direct access to opportunities at top companies", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: BiUser, title: "Career Guidance", desc: "Expert mentoring and personalized strategies", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: BiBook, title: "Study Resources", desc: "Comprehensive learning materials and paths", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: BiTrendingUp, title: "Investment Planning", desc: "Strategic guidance for financial growth", color: "text-blue-600", bg: "bg-blue-50" }
            ].map((card, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition duration-300 transform hover:-translate-y-1" data-aos="zoom-in" data-aos-delay={100 * (index + 1)}>
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-lg flex items-center justify-center text-3xl mb-6`}>
                  <card.icon />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h4>
                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features 2 Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <div className="w-full lg:w-1/3 space-y-12">
              {[
                { icon: BiTime, title: "24/7 Access", desc: "Access our career resources anytime, anywhere through our mobile-responsive platform." },
                { icon: BiTachometer, title: "Personalized Dashboard", desc: "Track your career progress and manage job applications all in one place." },
                { icon: BiBell, title: "Real-time Updates", desc: "Get instant notifications about new job opportunities and events." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-right gap-4" data-aos="fade-right" data-aos-delay={100 * (i + 1)}>
                   <div className="flex-1 order-2 md:order-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                   </div>
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 order-1 md:order-2">
                     <item.icon />
                   </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/3 text-center" data-aos="zoom-in" data-aos-delay="200">
              <img src="/images/Features.webp" alt="App Preview" className="rounded-2xl shadow-2xl mx-auto" width="637" height="956" loading="lazy" decoding="async" />
            </div>

            <div className="w-full lg:w-1/3 space-y-12">
              {[
                { icon: BiShield, title: "Secure Platform", desc: "Your career data and personal information are protected with enterprise-grade security." },
                { icon: BiChat, title: "Expert Support", desc: "Get quick responses to your queries through our dedicated support team." },
                { icon: BiDevices, title: "Cross-platform Access", desc: "Seamlessly access our services across all your devices." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4" data-aos="fade-left" data-aos-delay={100 * (i + 1)}>
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                     <item.icon />
                   </div>
                   <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-5/12" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 mb-8">Find answers to common questions about our career development services, job referrals, and learning resources.</p>
              <div className="hidden lg:block text-blue-100 opacity-50">
                 {/* Decorative SVG Arrow Placeholder */}
                 <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor">
                   <path d="M10 100 Q 50 50 190 190" stroke="currentColor" strokeWidth="2" fill="none" />
                 </svg>
              </div>
            </div>

            <div className="w-full lg:w-7/12" data-aos="fade-up" data-aos-delay="200">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                    >
                      <span className={`font-semibold text-lg ${activeFaq === index ? 'text-blue-600' : 'text-gray-900'}`}>
                        {faq.question}
                      </span>
                      <BiChevronRight className={`transform transition-transform duration-200 text-gray-400 ${activeFaq === index ? 'rotate-90' : ''}`} />
                    </button>
                    <div 
                      className={`px-6 text-gray-600 overflow-hidden transition-all duration-300 ${
                        activeFaq === index ? 'max-h-48 py-4 border-t border-gray-50' : 'max-h-0'
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="zoom-in">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Start Your Career Journey Today</h3>
          <p className="text-blue-50 text-lg mb-10 max-w-2xl mx-auto">
            Join our community of successful professionals. Get access to exclusive job referrals, career
            guidance, and investment planning resources.
          </p>
          <a href="#contact" className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition duration-300 shadow-lg">
            Schedule a Free Consultation
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact us</h2>
            <p className="text-gray-600">Get in touch with our career experts for personalized guidance and support</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div className="space-y-8" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-blue-600 p-8 rounded-2xl text-white h-full">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Info</h3>
                <p className="text-blue-50 mb-8 leading-relaxed">
                  Reach out to us for career guidance, job referrals, or any queries about our services.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-500/40 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 backdrop-blur-sm">
                      <BiMap />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-white text-lg">Our Location</h4>
                      <p className="text-blue-50 mt-1">Bangalore, Karnataka</p>
                      <p className="text-blue-50">India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-500/40 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 backdrop-blur-sm">
                      <BiPhone />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-white text-lg">Contact Hours</h4>
                      <p className="text-blue-50 mt-1">Mon-Fri: 9:00 AM - 9:00 PM</p>
                      <p className="text-blue-50">Sat: 9:00 AM - 1:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-500/40 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0 backdrop-blur-sm">
                      <BiEnvelope />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-white text-lg">Email Address</h4>
                      <p className="text-blue-50 mt-1">help.bcv@bcvworld.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get In Touch</h3>
              <p className="text-gray-600 mb-8">Fill out the form below, and our team will get back to you within 24 hours.</p>
              
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                  />
                </div>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" 
                />
                <textarea 
                  rows="5" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                ></textarea>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
