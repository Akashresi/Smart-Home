const axios = require('axios');
const config = require('../config/config');

const getSuggestions = async (req, res) => {
  try {
    const { inventoryData } = req.body;
    
    // Proxy request to Python AI Service
    const aiResponse = await axios.post(
      `${config.aiService.url}/api/v1/predict-inventory`,
      { items: inventoryData },
      {
        headers: {
          'Authorization': `Bearer ${config.aiService.apiKey}`
        }
      }
    );

    res.json(aiResponse.data);
  } catch (error) {
    console.error('AI Service Error:', error.message);
    res.json({ suggestions: [], message: 'AI Suggestion service temporarily unavailable' });
  }
};

const getDeviceRecommendations = async (req, res) => {
  try {
    const aiResponse = await axios.post(
      `${config.aiService.url}/api/v1/recommend`,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${config.aiService.apiKey}`
        }
      }
    );
    res.json(aiResponse.data);
  } catch (error) {
    console.error('AI Service Error:', error.message);
    res.json({ suggestion: 'AI recommendations are currently offline', predictedSavings: 0 });
  }
};

module.exports = { getSuggestions, getDeviceRecommendations };
