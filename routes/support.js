// routes/apiroutes.js
const express = require('express');
const router = express.Router();
const apiCaller = require('../apicaller');

// POST /api/leads/save
router.post('/support_report', async (req, res) => {
  try {
    const UserId = req.session.AgntDtl.UserId
    const data = req.body.data || [];
    // console.log("Parsed data array:", data);
    // If you need to map them properly
    const [fromdate, todate, status] = data;

    // Example payload to API
    const payload = {
      fromdate: fromdate, 
      todate: todate,        
      userid: UserId,
    };

    const result = await apiCaller.apicallerLivePort('renewal/support_report', payload);

    console.log("API Response:", result);

    res.json({
      success: result.success,
      message: "Data fetched successfully",
      data: result.data
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
  
module.exports = router;
