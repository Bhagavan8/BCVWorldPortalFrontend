import React, { useState, useEffect } from 'react';
import { CircleHelp, FileText, CheckCircle, Menu, X, Download, Copy, Check, BookOpen, Clock, Users, ArrowRight } from 'lucide-react';

const ImportantQuestions = () => {
  const [activeSection, setActiveSection] = useState('core-java');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('hashmap');

  // Handle Copy Code
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Close sidebar on section click in mobile
  const handleSectionClick = (id) => {
    setActiveSection(id);
    setIsSidebarOpen(false);
    
    // Smooth scroll to section
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Handle question click
  const handleQuestionClick = (questionId) => {
    setCurrentQuestion(questionId);
  };

  // Scroll spy to highlight current question while reading
  useEffect(() => {
    const ids = ['hashmap', 'pure-oop', 'heap-stack', 'complete-oop'];
    const onScroll = () => {
      const headerOffset = 120;
      let activeId = currentQuestion;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - headerOffset <= 0) {
          activeId = id;
        }
      }
      setCurrentQuestion(activeId);
      setActiveSection('core-java');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentQuestion]);

  // Data structure matching the image
  const contentData = {
    title: "Java Interview Questions",
    lastUpdated: "Jan 25, 2026",
    sections: [
      {
        id: "freshers",
        title: "Java Interview Questions for Freshers",
        questions: [
          "Why is Java a platform independent language?",
          "Why is Java not a pure object oriented language?",
          "Difference between Heap and Stack Memory in Java. And how java utilizes this.",
          "Can java be said to be the complete object-oriented programming language?",
          "How is Java different from C++?",
          "Pointers are used in C/C++. Why does Java not make use of pointers?",
          "What do you understand by an instance variable and a local variable?",
          "What are the default values assigned to variables and instances in java?",
          "What do you mean by data encapsulation?",
          "Tell us something about JIT compiler.",
          "Can you tell the difference between equals() method and equality operator (==) in Java?",
          "How is an infinite loop declared in Java?"
        ]
      },
      {
        id: "master-interviews",
        title: "Master Java Interviews With AI Profiles Built From Real Top Tech Experiences",
        features: [
          {
            icon: "👨‍💻",
            title: "Full Stack Developer",
            items: [
              "Free 25-min interviews",
              "Instant scores & feedback",
              "Modelled on real hiring practices",
              "Personalised improvement plans"
            ]
          }
        ]
      },
      {
        id: "about-java",
        title: "What is Java?",
        content: `Java is a high-level programming language that was developed by James Gosling in the year 1982. It is based on the principles of object-oriented programming and can be used to develop large-scale applications.

The following article will cover all the popular Core Java interview questions, String Handling interview questions, Java 8 interview questions, Java multithreading interview questions, Java OOPs interview questions, Java exception handling interview questions, collections interview questions, and some frequently asked Java coding interview questions.

Go through all the important questions to enhance your chances of performing well in the Java Interviews. The questions will revolve around the basic, core & advanced fundamentals of Java.

So, let's dive deep into the plethora of useful Java Technical Interview Questions and Answers categorised into the following sections:

- Java interview questions for Freshers
- Java intermediate interview questions`
      }
    ],
    categories: [
      {
        id: "core-java",
        title: "Java Interview Questions for Freshers",
        icon: <CircleHelp className="w-5 h-5" />,
        questions: [
          {
            id: "hashmap",
            q: "1. Why is Java a platform independent language?",
            code: null,
            a: (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Java is platform independent because it follows the principle of "write once, run anywhere" (WORA). This is achieved through the Java Virtual Machine (JVM). When Java code is compiled, it is converted into bytecode (.class file) rather than platform-specific machine code.</p>
                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                  <li><strong>Bytecode:</strong> Intermediate code that is not platform-specific</li>
                  <li><strong>JVM:</strong> Platform-specific virtual machine that interprets bytecode</li>
                  <li><strong>JRE:</strong> Java Runtime Environment provides libraries and JVM</li>
                  <li><strong>JDK:</strong> Java Development Kit for development</li>
                </ul>
                <p>The same bytecode can run on any device that has a JVM installed, making Java platform independent.</p>
              </div>
            )
          },
          {
            id: "pure-oop",
            q: "2. Why is Java not a pure object oriented language?",
            code: null,
            a: (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Java is not considered a pure object-oriented language because it supports primitive data types (like int, char, boolean, etc.) that are not objects. In a pure OOP language, everything should be represented as objects.</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-2">Features making Java OOP</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Classes and Objects</li>
                      <li>• Inheritance</li>
                      <li>• Polymorphism</li>
                      <li>• Encapsulation</li>
                      <li>• Abstraction</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h4 className="font-semibold text-orange-900 mb-2">Why not pure OOP</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Primitive data types</li>
                      <li>• Static methods and variables</li>
                      <li>• Wrapper classes needed for primitives</li>
                    </ul>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: "heap-stack",
            q: "3. Difference between Heap and Stack Memory in Java. And how java utilizes this.",
            code: `public class MemoryExample {
    int instanceVar; // Stored in Heap
    static int staticVar; // Stored in Method Area
    
    public void method() {
        int localVar = 10; // Stored in Stack
        String str = "Hello"; // Reference in Stack, Object in Heap
    }
}`,
            a: (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900">Heap Memory</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                        <span>Stores objects and instance variables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                        <span>Shared across all threads</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                        <span>Garbage Collection happens here</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                        <span>Dynamic memory allocation</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900">Stack Memory</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                        <span>Stores local variables and method calls</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                        <span>Each thread has its own stack</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                        <span>Memory allocated when method invoked</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                        <span>Automatically cleared when method ends</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: "complete-oop",
            q: "4. Can java be said to be the complete object-oriented programming language?",
            code: null,
            a: (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Java is not a complete object-oriented programming language due to the presence of primitive data types. However, it implements all the major OOP concepts:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-green-50 p-3 rounded border border-green-100">
                    <h5 className="font-semibold text-green-800 text-sm">Encapsulation</h5>
                    <p className="text-xs text-green-700 mt-1">Data hiding using private variables with public getters/setters</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <h5 className="font-semibold text-blue-800 text-sm">Inheritance</h5>
                    <p className="text-xs text-blue-700 mt-1">Extends keyword for class inheritance</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded border border-purple-100">
                    <h5 className="font-semibold text-purple-800 text-sm">Polymorphism</h5>
                    <p className="text-xs text-purple-700 mt-1">Method overloading and overriding</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                    <h5 className="font-semibold text-yellow-800 text-sm">Abstraction</h5>
                    <p className="text-xs text-yellow-700 mt-1">Abstract classes and interfaces</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded border border-red-100">
                    <h5 className="font-semibold text-red-800 text-sm">Classes & Objects</h5>
                    <p className="text-xs text-red-700 mt-1">Blueprint and instances</p>
                  </div>
                </div>
              </div>
            )
          }
        ]
      },
      {
        id: "master-interviews-content",
        title: "Master Java Interviews With AI Profiles",
        icon: <Users className="w-5 h-5" />,
        questions: [
          {
            id: "ai-profiles",
            q: "Full Stack Developer",
            code: null,
            a: (
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Full Stack Developer Profile</h4>
                      <p className="text-sm text-gray-600">AI-powered mock interviews based on real tech company patterns</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-800">Free 25-min interviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-800">Instant scores & feedback</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-800">Real hiring practices</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-800">Personalised improvement plans</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2">
                    Start Free Interview <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <style>{`
        /* Custom Scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.3s ease;
        }
        
        /* Code block styling */
        pre {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          line-height: 1.5;
        }
        
        /* Responsive typography */
        @media (max-width: 640px) {
          .prose {
            font-size: 0.875rem;
          }
        }
        
        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      {/* Main Container - Full Width */}
      <div className="w-full flex">
        
        {/* Left Sidebar - Course Index */}
        <div className={`
          fixed lg:sticky top-[88px] lg:top-[88px] left-0 h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] w-64 lg:w-80 xl:w-96 flex-shrink-0 bg-white z-30 transform transition-transform duration-300 ease-in-out border-r border-gray-200 overflow-y-auto custom-scrollbar shadow-xl lg:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between lg:justify-start lg:flex-col lg:items-start lg:space-y-2">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Java Interview Questions</h1>
              <div className="text-xs lg:text-sm text-gray-500">Last Updated: {contentData.lastUpdated}</div>
            </div>
          </div>

          <div className="p-4 lg:p-6 space-y-8">
            {/* Freshers Section */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">For Freshers</h2>
              <ul className="space-y-2">
                {contentData.sections[0].questions.map((question, index) => {
                  const mapIds = ['hashmap', 'pure-oop', 'heap-stack', 'complete-oop'];
                  const qId = mapIds[index];
                  const isActive = qId && currentQuestion === qId;
                  return (
                    <li key={index}>
                      <button
                        onClick={() => {
                          handleSectionClick('core-java');
                          if (qId) {
                            handleQuestionClick(qId);
                            const el = document.getElementById(qId);
                            if (el) {
                              const headerOffset = 100;
                              const elementPosition = el.getBoundingClientRect().top;
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                            }
                          }
                        }}
                        className={`text-left text-xs lg:text-sm w-full p-2 rounded transition leading-relaxed
                          ${isActive ? 'bg-blue-50 text-blue-800 font-medium border-l-2 border-blue-500' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                      >
                        {question}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Master Interviews</h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">Full Stack Developer</h3>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• Free 25-min interviews</li>
                  <li>• Instant scores & feedback</li>
                  <li>• Real hiring practices</li>
                  <li>• Personalised plans</li>
                </ul>
              </div>
            </div>

            {/* About Java */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">What is Java?</h2>
              <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                Java is a high-level programming language developed by James Gosling in 1982, based on OOP principles for large-scale applications.
              </p>
              <button className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium">
                Read more →
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Content Container */}
          <div className="pt-[96px] lg:pt-6 px-4 lg:px-8 xl:px-12 py-6 lg:py-8 min-h-screen">
            <div className="max-w-5xl mx-auto w-full">
              
              {/* Header Section */}
              <div className="mb-8 lg:mb-12">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
                      Java Interview Questions
                    </h1>
                    <p className="text-sm lg:text-base text-gray-600">
                      Last Updated: {contentData.lastUpdated}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                      <Download size={16} /> Download PDF
                    </button>
                    <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                      <Menu size={20} onClick={() => setIsSidebarOpen(true)} />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 mb-6"></div>
              </div>

              {/* Freshers Section */}
              <div className="mb-12" id="core-java">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-100 rounded">
                      <CircleHelp className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                      Java Interview Questions for Freshers
                    </h2>
                  </div>
                  
                  {/* Questions Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {contentData.sections[0].questions.slice(0, 6).map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-sm lg:text-base text-gray-800">{question}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Questions */}
                <div className="space-y-10">
                  {contentData.categories[0].questions.map((question) => (
                    <div key={question.id} id={question.id} className="scroll-mt-24">
                      <div className="mb-6">
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                          {question.q}
                        </h3>
                        
                        <div className="prose prose-gray max-w-none prose-sm lg:prose-base">
                          {question.a}
                        </div>

                        {question.code && (
                          <div className="mt-6 relative group">
                            <div className="absolute right-4 top-4 z-10">
                              <button 
                                onClick={() => handleCopy(question.code, question.id)}
                                className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                                title="Copy Code"
                              >
                                {copiedId === question.id ? <Check size={16} /> : <Copy size={16} />}
                              </button>
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-4 lg:p-6 rounded-lg overflow-x-auto text-sm lg:text-base">
                              <code>{question.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-200 pt-8"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Interviews Section */}
              <div className="mb-12" id="master-interviews-content">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-purple-100 rounded">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                      Master Java Interviews With AI Profiles
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white mb-8">
                    <div className="max-w-3xl">
                      <h3 className="text-xl lg:text-2xl font-bold mb-4">Full Stack Developer</h3>
                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold">Free 25-min interviews</p>
                              <p className="text-sm text-blue-100">Practice with real scenarios</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold">Instant scores & feedback</p>
                              <p className="text-sm text-blue-100">Get immediate results</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold">Real hiring practices</p>
                              <p className="text-sm text-blue-100">Based on actual company patterns</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold">Personalised improvement plans</p>
                              <p className="text-sm text-blue-100">Custom learning paths</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition">
                        Try for FREE
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Java Section */}
              <div className="mb-12">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">What is Java?</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Java is a high-level programming language that was developed by James Gosling in the year 1982. It is based on the principles of object-oriented programming and can be used to develop large-scale applications.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    The following article will cover all the popular Core Java interview questions, String Handling interview questions, Java 8 interview questions, Java multithreading interview questions, Java OOPs interview questions, Java exception handling interview questions, collections interview questions, and some frequently asked Java coding interview questions.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Go through all the important questions to enhance your chances of performing well in the Java Interviews. The questions will revolve around the basic, core & advanced fundamentals of Java.
                  </p>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-2">Topics covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Core Java', 'String Handling', 'Java 8', 'Multithreading', 'OOPs', 'Exception Handling', 'Collections', 'Coding'].map((topic) => (
                        <span key={topic} className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-300">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportantQuestions;
