// routes/policyprepare.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const apiCaller = require('../apicaller');
// ✅ API to get all images for a given user and vehicle number
router.get('/get-images/:user/:vehicleno', (req, res) => {
  const { user, vehicleno } = req.params;
  const folderPath = path.join(__dirname, '../public/downloads/Gallery/policy/user','TN57AB1234');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error reading folder',
        error: err.message
      });
    }

    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    const urls = imageFiles.map(file => `/downloads/Gallery/policy/user/TN57AB1234/${file}`);
    res.json({ success: true, images: urls });
  });
});



router.post('/policypreparegrid', async (req, res) => {
  try {
    // 🧠 Step 1: Prepare payload
    const payload = { userid: "1" };
    // console.log("📤 Payload before API:", payload);

    // 🧠 Step 2: Call API
    const result = await apiCaller.apicallerLivePort('Policy_renewal/policy_prepare_list', payload);
    // console.log("📥 API Response:", result);

    // 🧠 Step 3: Send formatted response to client
    res.json({
      success: result?.success ?? false,
      fresh: result?.fresh || [],
      waiting: result?.waiting || [],
      BranchList: result?.waiting_count?.toString() || "0",
      RoleList: result?.fresh_count?.toString() || "0"
    });

  } catch (error) {
    console.error('❌ Error in /policypreparegrid:', error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error"
    });
  }
});

router.post('/prepareupdate', async (req, res) => {
  try {
    const data = req.body.data || [];
    // console.log("Parsed data array:", data);
    // If you need to map them properly
    const [Id] = data;

    // Example payload to API
    const id = {
       id: Id
    };

    const result = await apiCaller.apicallerLivePort('Policy_renewal/operation_policy_prepare', id);

    // console.log("API Response:", result);

    res.json({
      success: result.success,
      message: result.message,
      data: result.results
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post('/preparesave', async (req, res) => {
  try {
     const UserId = req.session.AgntDtl.UserId
    const data = req.body.data || [];
    // console.log("Parsed data array:", data);
    // If you need to map them properly
    const [payment_datee,customername,mobile,vehicleno,make,model,idv,amount,transactionid,merchentorderid,regdate,chasisno,engineno,od,tp,netpremium,grosspremium,paymentmode,company,policyno,id] = data;

    // Example payload to API
      const savedata = {
        policyid: id,
        payment_datee: payment_datee,
        customername: customername,
        mobile: mobile,
        vehicleno: vehicleno,
        make: make,
        model: model,
        idv: idv,
        amount: amount,
        transactionid: transactionid,
        merchentorderid: merchentorderid,
        regdate: regdate,
        chasisno: chasisno,
        engineno: engineno,

        od: od,
        tp: tp,
        netpremium: netpremium,
        grosspremium: grosspremium,
        paymentmode: paymentmode,
        company: company,
        policyno: policyno,
  

        createby: UserId,
    };

    const result = await apiCaller.apicallerLivePort('Policy_renewal/operation_policy_save', savedata);

    // console.log("API Response:", result);

    res.json({
      success: result.success,
      message: result.message,
      data: result.insertedId
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post('/prepare_pending', async (req, res) => {
  try {
     const UserId = req.session.AgntDtl.UserId
    const data = req.body.data || [];
    // console.log("Parsed data array:", data);
    // If you need to map them properly
    const [id,policystatus] = data;

    // Example payload to API
      const savedata = {
        userid: UserId,
        policystatus: policystatus,
        id: id,
       
    };

    const result = await apiCaller.apicallerLivePort('Policy_renewal/policy_prepare_pending', savedata);

    // console.log("API Response:", result);

    res.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
