const axios = require('axios');
const config = require('../config/config');

const getSuggestions = async (req, res) => {
  try {
    const { inventoryData } = req.body;
    
    // Proxy request to Python AI Service
    const aiResponse = await axios.post(
      `${config.aiService.url}/api/v1/predict/inventory`,
      { data: inventoryData },
      {
        headers: {
          'Authorization': `Bearer ${config.aiService.apiKey}`
        }
      }
    );

    res.json(aiResponse.data);
  } catch (error) {
    console.error('AI Service Error:', error.message);
    res.status(500).json({ message: 'AI Suggestion service temporarily unavailable' });
  }
};

module.exports = { getSuggestions };
