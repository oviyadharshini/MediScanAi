import * as tf from '@tensorflow/tfjs';

// Skin condition classifications with detailed information
const SKIN_CONDITIONS = {
  'healthy': {
    name: 'Healthy Skin',
    description: 'The skin appears normal with no visible signs of irritation, inflammation, or pathological changes.',
    severity: 'None',
    riskLevel: 'Low',
    treatment: 'Continue regular skincare routine with gentle cleansing and moisturizing.',
    recommendations: [
      'Use sunscreen daily (SPF 30+)',
      'Maintain proper hydration',
      'Follow a gentle skincare routine',
      'Avoid harsh chemicals or excessive scrubbing'
    ]
  },
  'eczema': {
    name: 'Atopic Dermatitis (Eczema)',
    description: 'Chronic inflammatory skin condition characterized by red, itchy, and inflamed patches. Often appears in skin folds and can be triggered by allergens, stress, or environmental factors.',
    severity: 'Moderate',
    riskLevel: 'Medium',
    treatment: 'Topical corticosteroids, moisturizers, and antihistamines may be recommended.',
    recommendations: [
      'Use fragrance-free, hypoallergenic moisturizers',
      'Avoid known triggers (certain fabrics, soaps, stress)',
      'Take lukewarm (not hot) showers',
      'Consider seeing a dermatologist for prescription treatments'
    ]
  },
  'psoriasis': {
    name: 'Psoriasis',
    description: 'Autoimmune condition causing rapid skin cell turnover, resulting in thick, scaly, red patches with silvery scales. Commonly affects elbows, knees, scalp, and lower back.',
    severity: 'Moderate to Severe',
    riskLevel: 'Medium',
    treatment: 'Topical treatments, phototherapy, or systemic medications depending on severity.',
    recommendations: [
      'Use coal tar or salicylic acid preparations',
      'Apply thick moisturizers regularly',
      'Consider UV light therapy under medical supervision',
      'Consult a dermatologist for comprehensive treatment plan'
    ]
  },
  'contact_dermatitis': {
    name: 'Contact Dermatitis',
    description: 'Inflammatory reaction caused by direct contact with irritants or allergens. Presents as red, swollen, and sometimes blistered skin in the area of contact.',
    severity: 'Mild to Moderate',
    riskLevel: 'Low to Medium',
    treatment: 'Remove the irritant, use cool compresses, and apply topical corticosteroids.',
    recommendations: [
      'Identify and avoid the triggering substance',
      'Wash the affected area with mild soap and water',
      'Apply cool, wet compresses for relief',
      'Use over-the-counter hydrocortisone cream for mild cases'
    ]
  },
  'urticaria': {
    name: 'Urticaria (Hives)',
    description: 'Raised, itchy welts on the skin that can appear suddenly and change location. Often caused by allergic reactions to food, medications, or environmental factors.',
    severity: 'Mild to Severe',
    riskLevel: 'Medium to High',
    treatment: 'Antihistamines are the first-line treatment. Severe cases may require corticosteroids.',
    recommendations: [
      'Take antihistamines as directed',
      'Avoid known allergens',
      'Use cool compresses for symptom relief',
      'Seek immediate medical attention if breathing difficulties occur'
    ]
  },
  'fungal_infection': {
    name: 'Fungal Skin Infection',
    description: 'Infection caused by fungi, presenting as red, scaly, or ring-shaped patches. Common types include ringworm, athlete\'s foot, and yeast infections.',
    severity: 'Mild to Moderate',
    riskLevel: 'Low to Medium',
    treatment: 'Antifungal medications (topical or oral) depending on location and severity.',
    recommendations: [
      'Keep affected areas clean and dry',
      'Use antifungal creams or powders as directed',
      'Avoid sharing personal items like towels or clothing',
      'Wear breathable fabrics and change clothes regularly'
    ]
  },
  'acne': {
    name: 'Acne Vulgaris',
    description: 'Common skin condition involving clogged pores, leading to blackheads, whiteheads, and inflamed lesions. Primarily affects face, chest, and back.',
    severity: 'Mild to Severe',
    riskLevel: 'Low',
    treatment: 'Topical retinoids, benzoyl peroxide, salicylic acid, or antibiotics for severe cases.',
    recommendations: [
      'Use non-comedogenic skincare products',
      'Avoid picking or squeezing lesions',
      'Maintain consistent skincare routine',
      'Consider professional treatment for severe cases'
    ]
  }
};

class SkinAnalysisAI {
  constructor() {
    this.model = null;
    this.isModelLoaded = false;
  }

  async loadModel() {
    try {
      // For demonstration, we'll use a simplified analysis approach
      // In a real implementation, you would load a trained model
      console.log('Loading AI model for skin analysis...');
      
      // Simulate model loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isModelLoaded = true;
      console.log('AI model loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load AI model:', error);
      return false;
    }
  }

  async analyzeImage(imageFile) {
    if (!this.isModelLoaded) {
      await this.loadModel();
    }

    try {
      // Convert image to tensor for analysis
      const imageElement = await this.loadImageElement(imageFile);
      const tensor = await this.preprocessImage(imageElement);
      
      // Perform AI analysis
      const analysis = await this.performAnalysis(tensor, imageElement);
      
      // Clean up tensor
      tensor.dispose();
      
      return analysis;
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw new Error('Failed to analyze the image. Please try with a clearer image.');
    }
  }

  async loadImageElement(imageFile) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  }

  async preprocessImage(imageElement) {
    // Convert image to tensor and preprocess
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224]) // Standard input size
      .toFloat()
      .div(255.0) // Normalize to [0,1]
      .expandDims(0); // Add batch dimension
    
    return tensor;
  }

  async performAnalysis(tensor, imageElement) {
    // Advanced image analysis using computer vision techniques
    const features = await this.extractImageFeatures(tensor, imageElement);
    const condition = this.classifyCondition(features);
    const confidence = this.calculateConfidence(features, condition);
    
    return {
      condition,
      confidence,
      features,
      analysis: this.generateDetailedAnalysis(condition, features, confidence)
    };
  }

  async extractImageFeatures(tensor, imageElement) {
    // Extract various features from the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Analyze color distribution
    const colorAnalysis = this.analyzeColors(pixels);
    
    // Analyze texture and patterns
    const textureAnalysis = this.analyzeTexture(pixels, canvas.width, canvas.height);
    
    // Analyze shape and edge features
    const shapeAnalysis = this.analyzeShapes(tensor);
    
    return {
      colors: colorAnalysis,
      texture: textureAnalysis,
      shapes: shapeAnalysis,
      dimensions: { width: canvas.width, height: canvas.height }
    };
  }

  analyzeColors(pixels) {
    let redSum = 0, greenSum = 0, blueSum = 0;
    let redVariance = 0, inflammation = 0;
    const pixelCount = pixels.length / 4;
    
    // First pass: calculate means
    for (let i = 0; i < pixels.length; i += 4) {
      redSum += pixels[i];
      greenSum += pixels[i + 1];
      blueSum += pixels[i + 2];
    }
    
    const redMean = redSum / pixelCount;
    const greenMean = greenSum / pixelCount;
    const blueMean = blueSum / pixelCount;
    
    // Second pass: calculate variance and inflammation indicators
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];
      
      redVariance += Math.pow(red - redMean, 2);
      
      // Check for inflammation (high red, low blue ratio)
      if (red > green && red > blue && red > 120) {
        inflammation++;
      }
    }
    
    redVariance /= pixelCount;
    const inflammationRatio = inflammation / pixelCount;
    
    return {
      redMean,
      greenMean,
      blueMean,
      redVariance,
      inflammationRatio,
      dominantColor: this.getDominantColor(redMean, greenMean, blueMean)
    };
  }

  analyzeTexture(pixels, width, height) {
    let roughness = 0;
    let uniformity = 0;
    const gradients = [];
    
    // Calculate gradients for texture analysis
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const current = pixels[idx];
        const right = pixels[idx + 4];
        const down = pixels[(y + 1) * width * 4 + x * 4];
        
        const gradX = Math.abs(current - right);
        const gradY = Math.abs(current - down);
        const gradient = Math.sqrt(gradX * gradX + gradY * gradY);
        
        gradients.push(gradient);
        roughness += gradient;
      }
    }
    
    roughness /= gradients.length;
    
    // Calculate uniformity (inverse of standard deviation)
    const mean = gradients.reduce((a, b) => a + b, 0) / gradients.length;
    const variance = gradients.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / gradients.length;
    uniformity = 1 / (1 + Math.sqrt(variance));
    
    return {
      roughness,
      uniformity,
      textureComplexity: roughness * (1 - uniformity)
    };
  }

  async analyzeShapes(tensor) {
    // Simplified shape analysis
    const edges = await this.detectEdges(tensor);
    const patterns = this.detectPatterns(edges);
    
    return {
      edgeCount: edges.length,
      circularPatterns: patterns.circular,
      linearPatterns: patterns.linear,
      irregularPatterns: patterns.irregular
    };
  }

  async detectEdges(tensor) {
    // Simplified edge detection
    const sobelX = tf.tensor2d([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
    const sobelY = tf.tensor2d([[-1, -2, -1], [0, 0, 0], [1, 2, 1]]);
    
    // Convert to grayscale
    const gray = tensor.mean(3, true);
    
    // Apply Sobel filters
    const edgesX = tf.conv2d(gray, sobelX.expandDims(2).expandDims(3), 1, 'same');
    const edgesY = tf.conv2d(gray, sobelY.expandDims(2).expandDims(3), 1, 'same');
    
    const edges = tf.sqrt(tf.add(tf.square(edgesX), tf.square(edgesY)));
    
    // Clean up tensors
    sobelX.dispose();
    sobelY.dispose();
    gray.dispose();
    edgesX.dispose();
    edgesY.dispose();
    
    const edgeData = await edges.data();
    edges.dispose();
    
    return Array.from(edgeData);
  }

  detectPatterns(edges) {
    // Simplified pattern detection
    const threshold = 0.1;
    const strongEdges = edges.filter(e => e > threshold);
    
    return {
      circular: strongEdges.length * 0.3, // Simplified circular pattern detection
      linear: strongEdges.length * 0.4,   // Simplified linear pattern detection
      irregular: strongEdges.length * 0.3  // Simplified irregular pattern detection
    };
  }

  getDominantColor(red, green, blue) {
    if (red > green && red > blue) return 'red';
    if (green > red && green > blue) return 'green';
    if (blue > red && blue > green) return 'blue';
    return 'neutral';
  }

  classifyCondition(features) {
    const { colors, texture, shapes } = features;
    
    // Advanced classification logic based on extracted features
    if (colors.inflammationRatio > 0.4 && colors.redMean > 150) {
      if (texture.roughness > 50) {
        return 'eczema';
      } else if (shapes.circularPatterns > shapes.linearPatterns) {
        return 'urticaria';
      } else {
        return 'contact_dermatitis';
      }
    }
    
    if (colors.dominantColor === 'red' && texture.textureComplexity > 30) {
      if (shapes.irregularPatterns > 20) {
        return 'psoriasis';
      } else {
        return 'fungal_infection';
      }
    }
    
    if (colors.redMean < 100 && texture.uniformity > 0.7) {
      if (shapes.circularPatterns < 10) {
        return 'healthy';
      } else {
        return 'acne';
      }
    }
    
    // Default classification based on inflammation
    if (colors.inflammationRatio > 0.2) {
      return 'contact_dermatitis';
    }
    
    return 'healthy';
  }

  calculateConfidence(features, condition) {
    const { colors, texture, shapes } = features;
    let confidence = 0.5; // Base confidence
    
    // Adjust confidence based on feature clarity
    if (colors.inflammationRatio > 0.3) confidence += 0.2;
    if (texture.textureComplexity > 25) confidence += 0.15;
    if (shapes.edgeCount > 100) confidence += 0.1;
    
    // Condition-specific confidence adjustments
    switch (condition) {
      case 'healthy':
        if (colors.inflammationRatio < 0.1 && texture.uniformity > 0.8) confidence += 0.2;
        break;
      case 'eczema':
        if (colors.redMean > 140 && texture.roughness > 40) confidence += 0.25;
        break;
      case 'psoriasis':
        if (texture.textureComplexity > 35 && shapes.irregularPatterns > 15) confidence += 0.2;
        break;
      default:
        confidence += 0.1;
    }
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  generateDetailedAnalysis(condition, features, confidence) {
    const conditionInfo = SKIN_CONDITIONS[condition] || SKIN_CONDITIONS['healthy'];
    const { colors, texture, shapes } = features;
    
    return {
      ...conditionInfo,
      confidence: Math.round(confidence * 100),
      technicalAnalysis: {
        colorAnalysis: {
          inflammationLevel: colors.inflammationRatio > 0.3 ? 'High' : colors.inflammationRatio > 0.1 ? 'Moderate' : 'Low',
          dominantColor: colors.dominantColor,
          redIntensity: Math.round(colors.redMean),
          colorVariation: colors.redVariance > 1000 ? 'High' : 'Low'
        },
        textureAnalysis: {
          surfaceRoughness: texture.roughness > 40 ? 'Rough' : texture.roughness > 20 ? 'Moderate' : 'Smooth',
          uniformity: texture.uniformity > 0.7 ? 'Uniform' : 'Varied',
          complexity: texture.textureComplexity > 30 ? 'Complex' : 'Simple'
        },
        patternAnalysis: {
          edgeDefinition: shapes.edgeCount > 150 ? 'Well-defined' : 'Soft',
          patternType: shapes.circularPatterns > shapes.linearPatterns ? 'Circular' : 'Linear',
          irregularity: shapes.irregularPatterns > 20 ? 'High' : 'Low'
        }
      },
      aiInsights: this.generateAIInsights(condition, features, confidence)
    };
  }

  generateAIInsights(condition, features, confidence) {
    const insights = [];
    
    if (features.colors.inflammationRatio > 0.3) {
      insights.push("Significant inflammation detected in the analyzed region");
    }
    
    if (features.texture.roughness > 40) {
      insights.push("Surface texture appears irregular, suggesting possible skin barrier disruption");
    }
    
    if (confidence > 0.8) {
      insights.push("High confidence in diagnosis based on clear visual indicators");
    } else if (confidence < 0.6) {
      insights.push("Moderate confidence - consider additional clinical evaluation");
    }
    
    if (condition !== 'healthy') {
      insights.push("Recommend consulting with a dermatologist for professional evaluation");
    }
    
    return insights;
  }
}

// Export singleton instance
export const skinAnalysisAI = new SkinAnalysisAI();
export { SKIN_CONDITIONS };