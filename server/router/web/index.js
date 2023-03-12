module.exports = (app) => {
  const express = require("express");
  const axios = require("axios");
  const router = express.Router({
    mergeParams: true,
  });
  const url = "http://localhost:8000/api/v1/pipeline/";

  router.post("/", async (req, res) => {
    params = {
      data: req.body,
    };
    console.log(url,params);
    res.send(params)
    // try {
    //   axios.post(url, content).then((result) => {
    //     var data = result.data;
    //     res.send(data);
    //     console.log(result);
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  });

  app.use("/web", router);
  app.use(async (err, req, res, next) => {
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message,
    });
  });
};
