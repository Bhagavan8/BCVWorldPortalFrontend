// AboutUs.jsx
import React, { useState, useEffect } from 'react';
import '../assets/css/AboutUs.css';

const AboutUs = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
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
    email: "bhagavan.cv@bcvworld.com",
    experience: "7+",
    specialization: "Full Stack Development, IT Solutions, Education Technology"
  };

  const platformFeatures = [
    {
      icon: "💼",
      title: "Job Portal",
      description: "Curated career opportunities for freshers and experienced professionals. We bridge the gap between talent and top recruiters.",
      color: "#3b82f6"
    },
    {
      icon: "📚",
      title: "Learning Hub",
      description: "Comprehensive resources to master new skills. From coding to soft skills, access quality content without the premium price tag.",
      color: "#10b981"
    },
    {
      icon: "💰",
      title: "Financial Wisdom",
      description: "Smart tools and insights for personal finance. Plan your investments, calculate returns, and secure your financial future.",
      color: "#f59e0b"
    },
    {
      icon: "🎁",
      title: "100% Free Access",
      description: "We believe in equality of opportunity. No hidden charges, no premium tiers—just pure value for everyone.",
      color: "#ef4444"
    },
    {
      icon: "🧮",
      title: "Smart Calculators",
      description: "Essential tools for everyday decisions. EMI, SIP, Income Tax, and more—simplify complex calculations instantly.",
      color: "#8b5cf6"
    },
    {
      icon: "🌍",
      title: "Community Driven",
      description: "Built for the community, by the community. Join 4000+ users who are shaping their future with BCVWorld.",
      color: "#06b6d4"
    }
  ];

  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-pattern"></div>
        <div className="container">
          <div className="hero-content">
            <div className="realtime-badge">
              <span className="status-dot"></span>
              <span className="live-text">LIVE SYSTEM</span>
              <span className="separator">|</span>
              <span className="current-time">{currentTime}</span>
            </div>
            
            <h1 className="hero-title">
              Empowering Your <br />
              <span className="gradient-text">Digital Future</span>
            </h1>
            
            <p className="hero-subtitle">
              The all-in-one ecosystem for careers, learning, and financial growth.
              <br />
              <strong>100% Free. No Hidden Costs. Just Value.</strong>
            </p>
            
            <div className="hero-stats-row">
              <div className="hero-stat">
                <span className="h-stat-num">7+</span>
                <span className="h-stat-label">Years Exp</span>
              </div>
              <div className="hero-stat">
                <span className="h-stat-num">4000+</span>
                <span className="h-stat-label">Users</span>
              </div>
              <div className="hero-stat">
                <span className="h-stat-num">FREE</span>
                <span className="h-stat-label">Forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="container">
          <div className="founder-layout">
            <div className="founder-image-area">
               <div className="founder-initials-display">
                  {founderInfo.name.split(' ').map(n => n[0]).join('')}
               </div>
            </div>
            <div className="founder-content-area">
              <h4 className="section-label">THE VISIONARY</h4>
              <h2 className="founder-name">{founderInfo.name}</h2>
              <p className="founder-role">{founderInfo.role}</p>
              
              <p className="founder-bio">
                With over <strong>7+ years of expertise</strong> in the IT industry, I founded BCVWorld with a singular vision: to democratize access to digital success. 
                <br /><br />
                I realized that quality resources for career growth and financial planning were often locked behind paywalls. BCVWorld is my answer to that—a comprehensive, free platform designed to empower students, professionals, and investors alike.
              </p>
              
              <div className="founder-specialties">
                {founderInfo.specialization.split(',').map((spec, i) => (
                  <span key={i} className="spec-tag">{spec.trim()}</span>
                ))}
              </div>
              
              <a href={`mailto:${founderInfo.email}`} className="founder-cta">
                Connect with Me &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose BCVWorld?</h2>
            <p className="section-desc">We combine technology with purpose to deliver an unmatched experience.</p>
          </div>
          
          <div className="features-minimal-grid">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon-wrapper" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <div className="feature-text">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-wrapper">
            <div className="mission-left">
              <h2 className="section-title text-white">Our Promise</h2>
              <p className="mission-lead">
                "To provide a free, world-class platform that accelerates your personal and professional growth."
              </p>
            </div>
            <div className="mission-right">
              <div className="mission-list-modern">
                <div className="m-item">
                  <span className="check-icon">✓</span>
                  <strong>Always Free:</strong> No premium subscriptions, ever.
                </div>
                <div className="m-item">
                  <span className="check-icon">✓</span>
                  <strong>Data Privacy:</strong> Your data is yours. We respect your privacy.
                </div>
                <div className="m-item">
                  <span className="check-icon">✓</span>
                  <strong>Community First:</strong> Built based on user feedback and needs.
                </div>
                <div className="m-item">
                  <span className="check-icon">✓</span>
                  <strong>Expert Quality:</strong> Resources curated by industry veterans.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
           <div className="cta-minimal">
             <h2>Join 4000+ Empowered Users</h2>
             <p>Start your journey towards a smarter career and financial future today.</p>
             <div className="cta-actions">
               <button className="btn-primary">Get Started for Free</button>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
