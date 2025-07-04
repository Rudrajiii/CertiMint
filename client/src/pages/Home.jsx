// Home.jsx
// import { GoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { 
  FaGithub, 
  FaTwitter, 
  FaInfoCircle, 
  FaShieldAlt, 
  FaRocket, 
  FaCertificate,
  FaArrowRight,
  FaCheckCircle,
  FaPhone,
  FaTimes
} from 'react-icons/fa';
import { 
  MdOutlineArrowOutward, 
  MdSecurity, 
  MdVerifiedUser, 
  MdAutoAwesome,
  MdAddIcCall 
} from "react-icons/md";
import { toast } from 'react-toastify';
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import './Home.scss';
import __certimint__ from '../../video/certimint.mp4';

export default function Home() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showAnnotation, setShowAnnotation] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [customerName, setCustomerName] = useState('');
  const [isCallInitiating, setIsCallInitiating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Add this state

  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' }
  ];

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userData = await response.json();

        login({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
        });
        navigate('/upload');
      } catch (error) {
        alert('Login Failed');
      }
    },
    onError: () => {
      alert('Login Failed');
    },
  });

  const handleCallAssistance = () => {
    setShowCallModal(true);
  };

  const closeCallModal = () => {
    setShowCallModal(false);
    setPhoneNumber('');
    setCustomerName('');
    setCountryCode('+91');
    setIsCallInitiating(false);
    setShowSuccessMessage(false); // Reset success message state
  };

  const initiateCall = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setIsCallInitiating(true);

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      
      const response = await fetch('http://localhost:5001/api/initiate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          customerName: customerName || 'Customer'
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('call initiated successfully:', result);
        setShowSuccessMessage(true); // Show success message
        
        // Hide success message and close modal after 3.5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
          closeCallModal();
        }, 3500);
      } else {
        toast.error(result.error || 'Failed to initiate call');
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      toast.error('Failed to initiate call. Please try again.');
    } finally {
      setIsCallInitiating(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnnotation(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  function redirectToNFTDashBoard() {
    navigate('/nfts');
  }

  return (
    <div className="home-page">
      {/* Grid Background */}
      <div className="grid-background">
        <div className="grid-lines"></div>
      </div>

      {/* Login Button - Top Left */}
      <div className="login-section">
        <button
          type="button"
          className="custom-google-btn google-login-button"
          onClick={() => googleLogin()}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>

      {/* Top Right Circular Buttons */}
      <div className="top-right-buttons">
        <button className="circular-btn info-btn" title="Information">
          <FaInfoCircle size={20} />
        </button>
        <button onClick={redirectToNFTDashBoard} className="circular-btn arrow-btn" title="External Link">
          <MdOutlineArrowOutward size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header-section">
          <div className="badge">
            An Analyze & Provide Remark
            <span className="look-at-me-damnit-dot look-at-me-damnit-dot--blinking roundy"></span>
          </div>
          <h1 className="main-title">
            Certify Smarter Trust{' '}
            <RoughNotation 
              type="box" 
              show={showAnnotation}
              color="#FBE9D9"
              strokeWidth={3}
              padding={8}
              animationDuration={1200}
            >
              Deeper
            </RoughNotation>
            <br />
            <span className="subtitle">Certified NFT-Secured Truly Yours.</span>
          </h1>
          <p className="description">
            Leverage the power of 
              artificial intelligence
            and {' '}
            <RoughNotation 
              type="underline" 
              show={showAnnotation}
              color="#FBE9D9"
              strokeWidth={2}
              padding={5}
              animationDuration={1200}
            >
              blockchain
            </RoughNotation>
            
            blockchain to issue tamper-proof, verifiable certifications. From skill assessment to lifelong proof of learning — secure, shareable, and {' '}
            <RoughNotation 
              type="underline" 
              show={showAnnotation}
              color="#FBE9D9"
              strokeWidth={2}
              padding={5}
              animationDuration={1200}
            >
              truly owned by you.
            </RoughNotation> 
          </p>
          
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => googleLogin()}>
              Get Started <FaArrowRight />
            </button>
            <button className="btn-secondary" onClick={handleCallAssistance} >
              <MdAddIcCall style={{verticalAlign:'middle'}}/> Call for assistence
            </button>
          </div>
        </div>

        {/* Main Display Area */}
        <div className="display-area">
          <video 
            className="hero-video"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src={__certimint__} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Bottom Cards */}
        <div className="bottom-cards">
          <div className="card card-1">
            <div className="card-icon">
              <MdSecurity size={40} />
            </div>
            <div className="card-content">
              <h3>Blockchain Security</h3>
              <p>Your certificates are secured on the blockchain, making them tamper-proof and permanently verifiable.</p>
              <div className="card-features">
                <span><FaCheckCircle /> Immutable Records</span>
                <span><FaCheckCircle /> Global Verification</span>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
          
          <div className="card card-2">
            <div className="card-icon">
              <MdAutoAwesome size={40} />
            </div>
            <div className="card-content">
              <h3>AI-Powered Analysis</h3>
              <p>Advanced AI algorithms analyze and validate your submissions with precision and intelligent feedback.</p>
              <div className="card-features">
                <span><FaCheckCircle /> Smart Detection</span>
                <span><FaCheckCircle /> Instant Feedback</span>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
        </div>

        {/* Bottom Center Card */}
        <div className="center-card">
          <div className="center-card-content">
            <div className="center-card-icon">
              <FaCertificate size={50} />
            </div>
            <div className="center-card-info">
              <h2>Own Your Achievement</h2>
              <p>Transform your skills into verifiable NFT certificates that you truly own forever.</p>
              <div className="center-card-stats">
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Certificates Issued</span>
                </div>
                <div className="stat">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Accuracy Rate</span>
                </div>
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Trusted Partners</span>
                </div>
              </div>
              
            </div>
          </div>
          <div className="center-card-decoration">
            <div className="floating-icon icon-1"><MdVerifiedUser /></div>
            <div className="floating-icon icon-2"><FaShieldAlt /></div>
            <div className="floating-icon icon-3"><FaCertificate /></div>
          </div>
        </div>
      </div>

      {/* Call Assistance Modal */}
      {showCallModal && (
        <div className="modal-overlay" onClick={closeCallModal}>
          <div className="call-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FaPhone /> Request Call Assistance</h3>
              <button className="close-btn" onClick={closeCallModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              {!showSuccessMessage ? (
                <>
                  <p>We'll call you to provide personalized assistance with CertiMint.</p>
                  <div className="form-group">
                    <label>Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <div className="phone-input-group">
                      <select 
                        value={countryCode} 
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="country-select"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code} {country.country}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="phone-input"
                        maxLength="15"
                      />
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      className="call-now-btn" 
                      onClick={initiateCall}
                      disabled={isCallInitiating}
                    >
                      {isCallInitiating ? (
                        <>
                          <div className="spinner"></div>
                          Initiating Call...
                        </>
                      ) : (
                        <>
                          <FaPhone /> Call Now
                        </>
                      )}
                    </button>
                    <button className="cancel-btn" onClick={closeCallModal}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="success-message">
                  <div className="success-icon">
                    <FaCheckCircle size={48} />
                  </div>
                  <h3>Call Initiated Successfully!</h3>
                  <p>You will receive a call shortly on {countryCode} {phoneNumber}</p>
                  <div className="success-animation">
                    <div className="check-animation"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>&copy; 2025 certimint. Crafted with passion.</p>
          </div>
          <div className="footer-right">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaGithub size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
