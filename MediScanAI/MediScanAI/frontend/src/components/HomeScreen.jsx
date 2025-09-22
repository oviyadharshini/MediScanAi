import React from 'react'

const HomeScreen = ({ onStartDiagnosis }) => {
  return (
    <div className="home-screen">
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">🏥 AI Healthcare Diagnostic</h1>
          <p className="home-subtitle">Advanced AI-powered medical diagnosis system</p>
        </div>
        
        <div className="home-content">
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Symptom Analysis</h3>
              <p>Describe your symptoms and get instant AI analysis</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>Image Diagnosis</h3>
              <p>Upload medical images for comprehensive analysis</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Results</h3>
              <p>Get immediate diagnosis with risk assessment</p>
            </div>
          </div>
          
          <div className="cta-section">
            <button 
              className="start-diagnosis-btn"
              onClick={onStartDiagnosis}
            >
              Start Diagnosis
            </button>
            <p className="disclaimer">
              ⚠️ This is for educational purposes only. Always consult a healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen