import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Briefcase, 
  BookOpen, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Linkedin, 
  Github, 
  Mail,
  MapPin,
  Building,
  Award,
  Code
} from 'lucide-react';
import SEO from '../components/SEO';

const AboutUs = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
      await axios.post(`${API_BASE_URL}/api/contact`, {
        ...formData,
        subject: 'Contact from About Us Page'
      });
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const founderInfo = {
    name: "Bhagavan C V",
    role: "Founder & Full Stack Developer",
    email: "bhagavancv@gmail.com",
    location: "Bangalore, India",
    linkedin: "https://linkedin.com/in/bhagavan-c-v-b41661150",
    github: "https://github.com/Bhagavan8",
    experience: "7+",
    summary: "Dynamic and detail-focused Full Stack Java Developer with 7 years of experience in designing and delivering scalable, high-performance web and enterprise applications. Proficient in Java, Spring Boot, Microservices, REST APIs, JPA, Hibernate, React.js, and SQL, with a strong focus on building reliable backend systems and seamless frontend integrations. Experienced in deploying applications on Azure Cloud and automating workflows through Jenkins and modern CI/CD pipelines.",
    skills: [
      "Java", "Spring Boot", "Microservices", "React.js", "Azure", "Kafka", "Hibernate", "PostgreSQL", "Docker", "Jenkins"
    ]
  };

  const experience = [
    {
      company: "PwC India",
      role: "Senior Associate",
      period: "Sept 2025 - Present", // Adjusted based on logic, resume said 2025 which is likely a future target or error, using 2023 as plausible current or assume resume is correct relative to env date 2026. If env is 2026, Sept 2025 is past. I'll stick to what the resume says: Sept 2025. Wait, if today is Jan 2026, Sept 2025 is 4 months ago. So he started recently.
      location: "Bangalore, India",
      desc: "Contributing to the enhancement of the Parcel Pay System (PPS), a microservice-based invoice automation platform built using Java 17, Spring Boot, and Spring Batch."
    },
    {
      company: "Deloitte USI",
      role: "Consultant",
      period: "Apr 2022 - Sept 2025",
      location: "Bangalore, India",
      desc: "Planned and designed distributed Microservices using Java 17, Spring Boot, REST APIs, and JPA, connected with React.js frontends and deployed on Azure Cloud."
    },
    {
      company: "KPMG India",
      role: "Associate Consultant",
      period: "Jul 2021 - Mar 2022",
      location: "Bangalore, India",
      desc: "Designed and optimized Microservices for an audit management platform using Java, Spring Boot, MySQL, and React.js."
    },
    {
      company: "eMudhra Limited",
      role: "Software Developer",
      period: "Dec 2018 - Jun 2021",
      location: "Bangalore, India",
      desc: "Implemented, enhanced, and maintained RESTful APIs and Microservices using Java, Spring Boot, and Hibernate, supporting millions of secure digital transactions."
    }
  ];

  const platformFeatures = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Job Portal",
      description: "Access curated job openings from top product companies and startups. We verify every listing to ensure legitimate career opportunities.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Learning Hub",
      description: "Master in-demand skills with our structured roadmaps. From Data Structures to System Design, get the resources you need to excel.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Financial Wisdom",
      description: "Practical insights on salary negotiation, tax planning, and investments to help you maximize your earnings and build wealth.",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "1:1 Mentorship",
      description: "Accelerate your growth with paid, personalized sessions. Mock interviews, resume reviews, and career strategy from experts.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Quality First",
      description: "No fluff, just value. We ensure all our free resources and job postings meet the highest standards of quality and relevance.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Join 4000+ professionals in a supportive ecosystem. Network, share experiences, and grow together with peers.",
      color: "bg-cyan-100 text-cyan-600"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <SEO 
        title="About Us | BCVWorld" 
        description="Learn about BCVWORLD's mission to empower careers through free job referrals, mentoring, and financial tools. Meet the founder, Bhagavan C V." 
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-50 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-50 to-transparent opacity-50 -z-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              LIVE SYSTEM | {currentTime}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Empowering Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Digital Future</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one ecosystem for careers, learning, and financial growth.
              <br className="hidden sm:block" />
              <span className="font-semibold text-slate-800">100% Free. No Hidden Costs. Just Value.</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">7+</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Years Exp</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">4000+</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">FREE</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Forever</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Founder Image/Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/3 sticky top-24"
            >
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 group">
                <div className="h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                   <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <div className="px-8 pb-8 relative text-center">
                  <div className="w-32 h-32 mx-auto -mt-16 relative">
                     <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-md -m-2"></div>
                     <div className="w-full h-full rounded-full bg-white p-1.5 shadow-xl relative z-10">
                        <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                           <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter">
                             {founderInfo.name.split(' ').map(n => n[0]).join('')}
                           </span>
                        </div>
                     </div>
                     <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full z-20" title="Online"></div>
                  </div>
                  
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{founderInfo.name}</h2>
                    <p className="text-blue-600 font-semibold mb-6 bg-blue-50 inline-block px-4 py-1.5 rounded-full text-sm">{founderInfo.role}</p>
                    
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-600 mb-8 border-y border-slate-100 py-4">
                      <div className="flex flex-col items-center gap-1">
                         <MapPin className="w-5 h-5 text-slate-400 mb-1" />
                         <span className="font-medium">Bangalore</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="flex flex-col items-center gap-1">
                         <Mail className="w-5 h-5 text-slate-400 mb-1" />
                         <a href={`mailto:${founderInfo.email}`} className="font-medium hover:text-blue-600 transition-colors">Email Me</a>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="flex flex-col items-center gap-1">
                         <Code className="w-5 h-5 text-slate-400 mb-1" />
                         <span className="font-medium">7+ Yrs Exp</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a 
                        href={founderInfo.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 bg-[#0077b5] text-white rounded-xl font-bold hover:bg-[#006399] transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span>Connect</span>
                      </a>
                      <a 
                        href={founderInfo.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 bg-[#24292e] text-white rounded-xl font-bold hover:bg-[#1b1f23] transition-all shadow-lg shadow-slate-300 hover:shadow-slate-400 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <Github className="w-5 h-5" />
                        <span>Follow</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Founder Bio & Experience */}
            <div className="w-full lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h4 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-2">The Visionary</h4>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Building Solutions for a Better Future</h2>
                <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                  {founderInfo.summary}
                </p>
                <p className="text-slate-600 leading-relaxed mb-12">
                  I realized that quality resources for career growth and financial planning were often locked behind paywalls. BCVWorld is my answer to that—a comprehensive, free platform designed to empower students, professionals, and investors alike.
                </p>

                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Professional Journey
                </h3>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 group-[.is-active]:bg-blue-600 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                         <Building className="w-5 h-5" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-lg">{exp.company}</h4>
                          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full shrink-0">{exp.period}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose BCVWorld?</h2>
            <p className="text-slate-600 text-lg">We combine technology with purpose to deliver an unmatched experience.</p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {platformFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Promise</h2>
              <p className="text-xl text-slate-300 leading-relaxed mb-8">
                "To provide a free, world-class platform that accelerates your personal and professional growth."
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Always Free", desc: "No premium subscriptions, ever." },
                  { title: "Data Privacy", desc: "Your data is yours. We respect your privacy." },
                  { title: "Community First", desc: "Built based on user feedback." },
                  { title: "Expert Quality", desc: "Resources curated by veterans." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
               <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700">
                  <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                  <form className="space-y-4" onSubmit={handleContactSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                        placeholder="Your Name" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                        placeholder="your@email.com" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                      <textarea 
                        rows="4" 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                        placeholder="How can we help?"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -ml-16 -mb-16"></div>
             
             <div className="relative z-10 max-w-3xl mx-auto">
               <h2 className="text-3xl sm:text-4xl font-bold mb-6">Join 4000+ Empowered Users</h2>
               <p className="text-lg text-blue-100 mb-10">Start your journey towards a smarter career and financial future today.</p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                   Get Started for Free
                 </Link>
                 <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors border border-blue-500">
                   Contact Support
                 </Link>
               </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
