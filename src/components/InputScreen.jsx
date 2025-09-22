import React, { useState } from 'react'
import { skinAnalysisAI } from '../utils/skinAnalysisAI'

const InputScreen = ({ onSubmit, onBack }) => {
  const [symptoms, setSymptoms] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB')
        return
      }
      
      setSelectedFile(file)
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Validate symptoms
    if (!symptoms.trim()) {
      setError('Please describe your symptoms')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      if (selectedFile) {
        // Use AI analysis for image-based diagnosis
        console.log('Starting AI image analysis...');
        const aiAnalysis = await skinAnalysisAI.analyzeImage(selectedFile);
        
        const result = {
          diagnosis: aiAnalysis.analysis.name,
          riskLevel: aiAnalysis.analysis.riskLevel,
          symptoms_analyzed: symptoms,
          image_processed: true,
          confidence: aiAnalysis.confidence,
          detailed_analysis: aiAnalysis.analysis,
          ai_powered: true,
          recommendation: aiAnalysis.analysis.treatment,
          timestamp: new Date().toISOString(),
          image_info: {
            filename: selectedFile.name,
            size: [aiAnalysis.features.dimensions.width, aiAnalysis.features.dimensions.height],
            format: selectedFile.type
          }
        };
        
        onSubmit(result);
      } else {
        // Fallback to symptom-based analysis
        const result = await performSymptomAnalysis(symptoms);
        onSubmit(result);
      }
    } catch (err) {
      console.error('Diagnosis error:', err)
      setError(err.message || 'Failed to analyze the image. Please try again with a clearer image.')
    } finally {
      setIsLoading(false)
    }
  }

  const performSymptomAnalysis = async (symptoms) => {
    // Enhanced symptom-based analysis
    const symptomsLower = symptoms.toLowerCase();
    
    // Skin-specific symptom analysis
    const skinConditions = {
      eczema: ['eczema', 'atopic dermatitis', 'dry skin', 'itchy patches', 'red patches', 'scaling'],
      psoriasis: ['psoriasis', 'thick patches', 'silvery scales', 'plaque', 'scaly skin'],
      urticaria: ['hives', 'welts', 'raised bumps', 'itchy bumps', 'allergic reaction'],
      contact_dermatitis: ['contact dermatitis', 'skin irritation', 'rash from contact', 'allergic rash'],
      fungal_infection: ['fungal infection', 'ringworm', 'athlete\'s foot', 'yeast infection', 'circular rash'],
      acne: ['acne', 'pimples', 'blackheads', 'whiteheads', 'breakout']
    };
    
    let detectedCondition = 'healthy';
    let maxMatches = 0;
    
    for (const [condition, keywords] of Object.entries(skinConditions)) {
      const matches = keywords.filter(keyword => symptomsLower.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedCondition = condition;
      }
    }
    
    // Import condition data
    const { SKIN_CONDITIONS } = await import('../utils/skinAnalysisAI');
    const conditionInfo = SKIN_CONDITIONS[detectedCondition] || SKIN_CONDITIONS['healthy'];
    
    return {
      diagnosis: conditionInfo.name,
      riskLevel: conditionInfo.riskLevel,
      symptoms_analyzed: symptoms,
      image_processed: false,
      confidence: maxMatches > 0 ? 70 : 50,
      detailed_analysis: conditionInfo,
      ai_powered: false,
      timestamp: new Date().toISOString(),
      recommendation: conditionInfo.treatment
    };
  };

  const removeImage = () => {
    setSelectedFile(null)
    // Reset the file input
    const fileInput = document.getElementById('image-upload')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="input-screen">
      <div className="header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <h2>Skin Condition Analysis</h2>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-group">
          <label htmlFor="symptoms">Describe your symptoms:</label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Please describe your skin condition, symptoms, and any relevant details..."
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image-upload">Upload an image (optional):</label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          {selectedFile && (
            <div className="selected-file">
              <div className="file-info">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="remove-file-btn"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
                {selectedFile ? 'AI Analyzing Image...' : 'Analyzing Symptoms...'}
              </div>
            ) : (
              'Get AI Diagnosis'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InputScreen