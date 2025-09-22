import React, { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import InputScreen from './components/InputScreen'
import ResultScreen from './components/ResultScreen'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [diagnosisResult, setDiagnosisResult] = useState(null)

  const navigateToInput = () => {
    setCurrentScreen('input')
  }

  const navigateToResult = (result) => {
    setDiagnosisResult(result)
    setCurrentScreen('result')
  }

  const navigateToHome = () => {
    setCurrentScreen('home')
    setDiagnosisResult(null)
  }

  const navigateBack = () => {
    if (currentScreen === 'result') {
      setCurrentScreen('input')
    } else if (currentScreen === 'input') {
      setCurrentScreen('home')
    }
  }

  return (
    <div className="App">
      {currentScreen === 'home' && (
        <HomeScreen onStartDiagnosis={navigateToInput} />
      )}
      {currentScreen === 'input' && (
        <InputScreen 
          onSubmit={navigateToResult} 
          onBack={navigateBack}
        />
      )}
      {currentScreen === 'result' && (
        <ResultScreen 
          result={diagnosisResult} 
          onBack={navigateBack}
          onHome={navigateToHome}
        />
      )}
    </div>
  )
}

export default App