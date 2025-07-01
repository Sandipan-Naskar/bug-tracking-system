
import { useState } from 'react';
import { Bug, Menu, X, Star, Github, Linkedin, Mail, Phone, MapPin, ArrowRight, Instagram, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search through page content
    const searchableContent = [
      'features', 'bug tracking', 'authentication', 'password security',
      'crud operations', 'mongodb', 'developer', 'results', 'outcomes',
      'references', 'contact', 'mern stack', 'react', 'node.js'
    ];

    const results = searchableContent.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);

    // Auto-scroll to relevant sections
    if (searchQuery.toLowerCase().includes('feature')) {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else if (searchQuery.toLowerCase().includes('result')) {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    } else if (searchQuery.toLowerCase().includes('developer')) {
      document.getElementById('developer')?.scrollIntoView({ behavior: 'smooth' });
    } else if (searchQuery.toLowerCase().includes('contact')) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }

    toast({
      title: "Search Results",
      description: results.length > 0 ? `Found ${results.length} results` : "No results found",
    });
  };

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await emailjs.send(
        'service_lkpfc1r', // Service ID
        'template_g7e2cqt', // Template ID
        {
          from_name: contactForm.name,
          from_email: contactForm.email,
          message: contactForm.message,
        },
        'zZavmPQ9nkOTMMGGy' // Public Key
      );

      if (result.status === 200) {
        toast({
          title: "Message Sent",
          description: "Thank you for your message! We'll get back to you soon.",
        });
        setContactForm({ name: '', email: '', message: '' });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const features = [
    {
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      title: "Login/Register Feature and Strong Password Authentication System",
      description: "This feature will be helpful for the user to keep their Bug related data safe as here B-Crypt Password Algorithm is used which is the very safest algorithm."
    },
    {
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
      title: "Add New Bug feature, Keep track of Status of the Bug and Location of the Bug feature in a single System",
      description: "This feature will be helpful for the developer to create, update and delete Bug related data and prioritized the bug easily and efficiently."
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      title: "Feature of categorization of the Bugs (High, Medium, Low)",
      description: "Add Notes, edit Notes related to Bugs for future use and having the strong storage facility in the form of MongoDB database that uses AWS cloud services"
    }
  ];

  const results = [
    { image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop", title: "Login Page" },
    { image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop", title: "Registration Page" },
    { image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop", title: "Add New Bug Section" },
    { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", title: "Filter and View Bugs" },
    { image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop", title: "Database View" }
  ];

  const outcomes = [
    {
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      title: "It helps the Project Managers and developers to manage and prioritized the bugs and issues in a simpler manner."
    },
    {
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
      title: "It removes the problem of searching the solution of the bugs everytime and all the data related to bugs and user is safe and stored securely in MongoDB Database"
    },
    {
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
      title: "It saves time as it has a feature of create, update, delete and read (CRUD operations can be performed)"
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      title: "Its Makes the overall development Process faster and efficient as all features are present in a single system"
    }
  ];

  const references = [
    {
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      title: "How Bug tracking done right with Jira Software",
      author: "by Atlassian",
      date: "2022",
      link: "https://www.atlassian.com/software/jira/features/bug-tracking"
    },
    {
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop",
      title: "What is bug tracking? and How bug tracking works",
      author: "by IBM",
      date: "2023",
      link: "https://www.ibm.com/topics/bug-tracking"
    },
    {
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop",
      title: "MERN Stack - What is MERN Stack?",
      author: "by GeeksforGeeks",
      date: "2024",
      link: "https://www.geeksforgeeks.org/mern/understand-mern-stack/"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Bug className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Bug Tracker</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#results" className="text-gray-700 hover:text-blue-600 transition-colors">Result Images</a>
              <a href="#outcomes" className="text-gray-700 hover:text-blue-600 transition-colors">Project Outcomes</a>
              <a href="#developer" className="text-gray-700 hover:text-blue-600 transition-colors">Developer</a>
              <a href="#references" className="text-gray-700 hover:text-blue-600 transition-colors">References</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Form */}
          {isSearchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  placeholder="Search features, developer info, references..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </form>
              {searchResults.length > 0 && searchQuery && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Found: {searchResults.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                <a href="#home" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                <a href="#features" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                <a href="#results" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Result Images</a>
                <a href="#outcomes" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Project Outcomes</a>
                <a href="#developer" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Developer</a>
                <a href="#references" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">References</a>
                <a href="#contact" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-teal-500">Bug Tracking</span> System
            </h1>
            <p className="text-xl md:text-2xl text-yellow-600 max-w-4xl mx-auto leading-relaxed">
              This Application will be helpful for the Software Developers to evaluate, monitored and prioritized the Bugs during Development and Software Testing.
            </p>
            <div className="mt-8">
              <button 
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            <span className="text-blue-600">Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Read more
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            <span className="text-blue-600">Results</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <img src={result.image} alt={result.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{result.title}</h3>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Outcomes Section */}
      <section id="outcomes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Project <span className="text-blue-600">Outcomes</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {outcomes.map((outcome, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <img src={outcome.image} alt={`Outcome ${index + 1}`} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">{outcome.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section id="developer" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            <span className="text-blue-600">Developer</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <img 
                src="https://i.postimg.cc/prWx1cF9/Sandipan-Photo.jpg" 
                alt="Developer" 
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sandipan Naskar</h3>
              <p className="text-gray-600 mb-2">Web Developer</p>
              <p className="text-gray-600 mb-2">B.Tech In Computer Science And Engineering</p>
              <p className="text-gray-600 mb-4">🚀 Passionate about building full-stack web applications with clean UI and efficient backends.</p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://github.com/Sandipan-Naskar" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/sandipan-naskar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section id="references" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            <span className="text-blue-600">References</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {references.map((reference, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <img src={reference.image} alt={reference.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{reference.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{reference.date}</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{reference.title}</h3>
                  <a 
                    href={reference.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            <span className="text-blue-600">Contact Us</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">+91-6290410080</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">sandipannaskar74@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Kolkata, West Bengal</span>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.instagram.com/sandipan.naskar__?igsh=enl4bXlydmxpMHhs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://www.facebook.com/share/1GEcG2Ruu5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/sandipan-naskar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your message here..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bug className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">Bug Tracker</span>
              </div>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/sandipan.naskar__?igsh=enl4bXlydmxpMHhs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.facebook.com/share/1GEcG2Ruu5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/sandipan-naskar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2">
                <a href="tel:+916290410080" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+91-6290410080</span>
                </a>
                <a href="mailto:sandipannaskar74@gmail.com" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>sandipannaskar74@gmail.com</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span>Kolkata, West Bengal</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#home" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  <span>Home</span>
                </a>
                <a href="#features" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  <span>Features</span>
                </a>
                <a href="#results" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  <span>Result Images</span>
                </a>
                <a href="#outcomes" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  <span>Project Outcomes</span>
                </a>
                <a href="#developer" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  <span>Developer</span>
                </a>
                <a href="#references" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  <span>References</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe for latest updates</p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                />
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>Created by <span className="text-blue-400">Sandipan Naskar</span> | All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
