from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import Optional
import io
from PIL import Image
import numpy as np

app = FastAPI(title="Healthcare Diagnostic API", version="1.0.0")

# Add CORS middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Healthcare Diagnostic API is running"}

@app.post("/diagnose")
async def diagnose_patient(
    symptoms: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    """
    Diagnose patient based on symptoms and optional medical image.
    
    Args:
        symptoms (str): Patient's symptoms description
        image (UploadFile, optional): Medical image file (e.g., X-ray, skin condition)
    
    Returns:
        dict: Diagnosis result with risk level
    """
    try:
        # Validate symptoms input
        if not symptoms or symptoms.strip() == "":
            raise HTTPException(status_code=400, detail="Symptoms cannot be empty")
        
        # Process the uploaded image if provided
        image_info = None
        if image:
            # Validate image file
            if not image.content_type or not image.content_type.startswith('image/'):
                raise HTTPException(status_code=400, detail="File must be an image")
            
            # Read and process the image
            image_data = await image.read()
            try:
                pil_image = Image.open(io.BytesIO(image_data))
                image_array = np.array(pil_image)
                image_info = {
                    "filename": image.filename,
                    "size": pil_image.size,
                    "format": pil_image.format,
                    "mode": pil_image.mode
                }
            except Exception as e:
                raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Simplified AI logic for diagnosis
        symptoms_lower = symptoms.lower()
        
        # Check for infection-related keywords
        infection_keywords = [
            "infection", "infected", "fever", "pus", "inflammation", 
            "swelling", "redness", "pain", "discharge", "wound", 
            "bacteria", "virus", "sepsis", "abscess"
        ]
        
        # Check for high-risk symptoms
        high_risk_keywords = [
            "severe pain", "high fever", "difficulty breathing", 
            "chest pain", "blood", "unconscious", "seizure",
            "stroke", "heart attack", "emergency"
        ]
        
        # Check for medium-risk symptoms
        medium_risk_keywords = [
            "moderate pain", "persistent", "chronic", "recurring",
            "headache", "nausea", "vomiting", "dizziness"
        ]
        
        # Determine diagnosis and risk level
        diagnosis = "Healthy"
        risk_level = "Low"
        
        # Check for infections
        if any(keyword in symptoms_lower for keyword in infection_keywords):
            diagnosis = "Infected"
            risk_level = "High"
        
        # Check for high-risk conditions
        elif any(keyword in symptoms_lower for keyword in high_risk_keywords):
            diagnosis = "Requires Immediate Medical Attention"
            risk_level = "High"
        
        # Check for medium-risk conditions
        elif any(keyword in symptoms_lower for keyword in medium_risk_keywords):
            diagnosis = "Medical Consultation Recommended"
            risk_level = "Medium"
        
        # Prepare response
        response_data = {
            "diagnosis": diagnosis,
            "riskLevel": risk_level,
            "symptoms_analyzed": symptoms,
            "image_processed": image_info is not None,
            "recommendation": get_recommendation(diagnosis, risk_level)
        }
        
        if image_info:
            response_data["image_info"] = image_info
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def get_recommendation(diagnosis: str, risk_level: str) -> str:
    """Generate recommendation based on diagnosis and risk level."""
    if risk_level == "High":
        return "Seek immediate medical attention. Contact your healthcare provider or visit the emergency room."
    elif risk_level == "Medium":
        return "Schedule an appointment with your healthcare provider within the next few days."
    else:
        return "Monitor symptoms and maintain good health practices. Consult a doctor if symptoms worsen."

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)