import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Coffee, Database, Layers, Server, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const JavaLearning = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const modules = [
    {
      title: "Java Fundamentals",
      description: "Master the basics of Java programming language, syntax, and OOP concepts.",
      icon: <Coffee className="w-6 h-6 text-orange-600" />,
      level: "Beginner",
      topics: ["Variables & Data Types", "Control Flow", "OOP Principles", "Exception Handling"]
    },
    {
      title: "Advanced Java",
      description: "Deep dive into Collections, Multithreading, Streams API, and functional programming.",
      icon: <Code className="w-6 h-6 text-blue-600" />,
      level: "Intermediate",
      topics: ["Collections Framework", "Multithreading & Concurrency", "Java 8+ Features", "IO & NIO"]
    },
    {
      title: "Spring Framework",
      description: "Build enterprise-grade applications using Spring Core, MVC, and AOP.",
      icon: <Layers className="w-6 h-6 text-green-600" />,
      level: "Advanced",
      topics: ["Dependency Injection", "Spring MVC", "Spring Security", "Spring Data JPA"]
    },
    {
      title: "Spring Boot",
      description: "Rapid application development with auto-configuration and embedded servers.",
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      level: "Advanced",
      topics: ["Auto Configuration", "Actuator", "Profiles", "Restful Web Services"]
    },
    {
      title: "Microservices",
      description: "Architect scalable and resilient distributed systems.",
      icon: <Server className="w-6 h-6 text-purple-600" />,
      level: "Expert",
      topics: ["Service Discovery", "API Gateway", "Circuit Breaker", "Distributed Tracing"]
    },
    {
      title: "Database & SQL",
      description: "Master database design, SQL queries, and ORM integration.",
      icon: <Database className="w-6 h-6 text-indigo-600" />,
      level: "Intermediate",
      topics: ["SQL Basics", "Normalization", "JDBC", "Hibernate"]
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <SEO 
        title="Java Learning Path | BCVWorld" 
        description="Comprehensive Java learning path covering Core Java, Spring Boot, Microservices, and more." 
      />
      
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Start Your Journey
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Java <span className="text-blue-600">Learning Path</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A structured roadmap to guide you from a beginner to an expert Java Developer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {module.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  module.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                  module.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                  module.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {module.level}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{module.title}</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">{module.description}</p>
              
              <div className="space-y-3 mb-6">
                {module.topics.map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    {topic}
                  </div>
                ))}
              </div>

              <Link 
                to="#" 
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Start Learning <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JavaLearning;
