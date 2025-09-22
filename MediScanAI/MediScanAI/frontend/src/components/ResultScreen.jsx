import React from 'react'

const ResultScreen = ({ result, onBack, onHome }) => {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return '#22c55e' // Green
      case 'medium':
        return '#f59e0b' // Orange
      case 'high':
        return '#ef4444' // Red
      default:
        return '#6b7280' // Gray
    }
  }

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return '✅'
      case 'medium':
        return '⚠️'
      case 'high':
        return '🚨'
      default:
        return 'ℹ️'
    }
  }

  if (!result) {
    return (
      <div className="result-screen">
        <div className="result-container">
          <div className="error-message">
            No diagnosis result available. Please try again.
          </div>
          <button onClick={onHome} className="home-btn">
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="result-screen">
      <div className="result-container">
        <div className="result-header">
          <h2>Diagnosis Results</h2>
          <p>AI analysis of your symptoms and medical data</p>
        </div>
        
        <div className="diagnosis-card">
          <div className="diagnosis-main">
            <h3>Diagnosis</h3>
            <div className="diagnosis-text">
              {result.diagnosis}
            </div>
          </div>
          
          <div className="risk-assessment">
            <h3>Risk Level</h3>
            <div 
              className="risk-badge"
              style={{ 
                backgroundColor: getRiskColor(result.riskLevel),
                color: 'white'
              }}
            >
              <span className="risk-icon">{getRiskIcon(result.riskLevel)}</span>
              <span className="risk-text">{result.riskLevel}</span>
            </div>
          </div>
        </div>
        
        <div className="recommendation-section">
          <h3>Recommendation</h3>
          <div className="recommendation-text">
            {result.recommendation}
          </div>
        </div>
        
        <div className="analysis-details">
          <h4>Analysis Details</h4>
          <div className="detail-item">
            <strong>Symptoms Analyzed:</strong>
            <p>{result.symptoms_analyzed}</p>
          </div>
          
          {result.image_processed && (
            <div className="detail-item">
              <strong>Medical Image:</strong>
              <p>✅ Image processed and analyzed</p>
              {result.image_info && (
                <div className="image-details">
                  <small>
                    File: {result.image_info.filename} | 
                    Size: {result.image_info.size?.[0]}x{result.image_info.size?.[1]} | 
                    Format: {result.image_info.format}
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="disclaimer">
          <h4>⚠️ Important Disclaimer</h4>
          <p>
            This AI diagnosis is for educational and informational purposes only. 
            It should not replace professional medical advice, diagnosis, or treatment. 
            Always consult with qualified healthcare professionals for medical concerns.
          </p>
        </div>
        
        <div className="result-actions">
          <button onClick={onBack} className="back-btn">
            ← Back to Input
          </button>
          <button onClick={onHome} className="home-btn">
            🏠 Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultScreen