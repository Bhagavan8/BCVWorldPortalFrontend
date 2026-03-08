import React from 'react';
import { FaCalendarAlt, FaBook, FaCheckCircle, FaLaptopCode, FaClock } from 'react-icons/fa';
import SEO from '../components/SEO';

const StudyPlan = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <SEO 
        title="Study Plan | BCVWorld" 
        description="Comprehensive study plans for Java, Data Structures, Algorithms, and Interview Preparation."
      />
      
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-6">
            <FaCalendarAlt className="text-4xl text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Structured Study Plans
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your roadmap to mastering coding and cracking interviews. Choose a plan that fits your schedule and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <FaLaptopCode className="text-2xl text-purple-600" />
              <h3 className="text-xl font-bold text-slate-800">Java Full Stack</h3>
            </div>
            <p className="text-slate-600 mb-4">30-day intensive plan covering Core Java, Spring Boot, and React.</p>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <FaClock /> <span>4 Weeks</span>
              <span className="mx-2">•</span>
              <FaBook /> <span>Beginner to Pro</span>
            </div>
            <button className="w-full py-2 px-4 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition-colors">
              View Plan (Coming Soon)
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
              <FaCheckCircle className="text-2xl text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-800">Placement Prep</h3>
            </div>
            <p className="text-slate-600 mb-4">Daily targets for aptitude, reasoning, and coding questions.</p>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <FaClock /> <span>60 Days</span>
              <span className="mx-2">•</span>
              <FaBook /> <span>Interview Ready</span>
            </div>
             <button className="w-full py-2 px-4 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors">
              View Plan (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
