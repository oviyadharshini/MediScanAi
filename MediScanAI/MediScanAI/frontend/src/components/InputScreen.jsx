import React, { useState } from 'react'

const InputScreen = ({ onSubmit, onBack }) => {
  const [symptoms, setSymptoms] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB')
        return
      }
      
      setSelectedFile(file)
      setError('')
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
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
      const formData = new FormData()
      formData.append('symptoms', symptoms)
      if (selectedFile) {
        formData.append('image', selectedFile)
      }
      
      const response = await fetch('http://127.0.0.1:8000/diagnose', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to get diagnosis')
      }
      
      const result = await response.json()
      onSubmit(result)
    } catch (err) {
      setError(err.message || 'Failed to connect to diagnosis service')
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    // Reset file input
    const fileInput = document.getElementById('image-upload')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="input-screen">
      <div className="input-container">
        <div className="input-header">
          <h2>Medical Diagnosis Input</h2>
          <p>Please provide your symptoms and any relevant medical images</p>
        </div>
        
        <form onSubmit={handleSubmit} className="diagnosis-form">
          <div className="form-group">
            <label htmlFor="symptoms">Describe Your Symptoms *</label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Please describe your symptoms in detail... (e.g., fever, headache, skin rash)"
              rows={6}
              className={error && !symptoms.trim() ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image-upload">Upload Medical Image (Optional)</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <div className="file-upload-label">
                <div className="upload-icon">📷</div>
                <p>Click to upload or drag image here</p>
                <p className="file-info">Supports: JPG, PNG, GIF (Max 5MB)</p>
              </div>
            </div>
          </div>
          
          {imagePreview && (
            <div className="image-preview">
              <h4>Image Preview:</h4>
              <div className="preview-container">
                <img src={imagePreview} alt="Medical image preview" />
                <button type="button" onClick={removeImage} className="remove-image-btn">
                  ✕ Remove
                </button>
              </div>
              <p className="file-name">{selectedFile?.name}</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <div className="form-actions">
            <button type="button" onClick={onBack} className="back-btn">
              ← Back
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Get Diagnosis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InputScreen