# Healthcare Diagnostic Application

## Overview

This is a healthcare diagnostic application that allows users to submit symptoms and optional medical images for AI-powered diagnosis. The system consists of a React frontend built with Vite and a FastAPI backend that processes diagnostic requests. Users can input their symptoms through a web interface and optionally upload medical images (like X-rays or skin condition photos) to receive diagnostic insights with risk level assessments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19.1.1 with Vite for fast development and building
- **Build Tool**: Vite with Hot Module Replacement (HMR) for rapid development
- **Styling**: CSS with custom styles featuring gradient backgrounds and modern UI components
- **Code Quality**: ESLint configuration with React-specific rules and hooks validation
- **Development Server**: Runs on localhost:5173 by default

### Backend Architecture
- **Framework**: FastAPI for high-performance API development with automatic documentation
- **API Design**: RESTful API with a single `/diagnose` endpoint that accepts form data
- **File Processing**: Handles multipart form data for symptoms (text) and optional image uploads
- **Image Processing**: Uses PIL (Python Imaging Library) for image validation and processing
- **Error Handling**: Comprehensive input validation with appropriate HTTP status codes
- **CORS Configuration**: Configured to accept requests from multiple frontend ports

### Data Flow
- **Input Processing**: Accepts symptoms as form text and optional medical images
- **Validation**: Server-side validation for both text input and image file types
- **Response Format**: JSON responses with diagnostic results and risk levels
- **Communication**: HTTP-based communication between frontend and backend

### Security Considerations
- **CORS Policy**: Restricts origins to localhost development ports
- **File Type Validation**: Ensures uploaded files are valid image formats
- **Input Sanitization**: Validates symptoms input to prevent empty or malicious submissions

## External Dependencies

### Frontend Dependencies
- **React & React-DOM**: Core React framework for UI development
- **Vite**: Modern build tool and development server
- **ESLint**: Code linting with React-specific plugins (react-hooks, react-refresh)

### Backend Dependencies
- **FastAPI**: Modern Python web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI applications
- **PIL (Pillow)**: Python Imaging Library for image processing
- **NumPy**: Scientific computing library for image data manipulation

### Development Tools
- **Hot Module Replacement**: Provided by Vite for instant code updates
- **TypeScript Support**: Available through Vite plugin architecture
- **Cross-Origin Resource Sharing**: Handled by FastAPI middleware

### Planned Integrations
- The application architecture suggests integration with AI/ML models for medical diagnosis
- Image processing pipeline indicates support for medical image analysis
- The diagnostic endpoint structure supports future expansion with additional medical data inputs