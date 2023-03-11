module.exports = (app) => {
  const express = require("express");
  const assert = require("http-assert");
  const jwt = require("jsonwebtoken");
  const axios = require("axios");
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./static/upload")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  const upload = multer({ storage: storage })
  const router = express.Router({
    mergeParams: true,
  });
  const url = "http://localhost:8000/api/v1/pipeline/";
  
  router.post("/", async (req, res) => {
    var data = req.body;
    content = {
      content: data,
    };
    try {
      axios.post(url, content).then((result) => {
        var data = result.data;
        res.send(data);
        console.log(result);
      });
    } catch (error) {
      console.log(error);
    }
  });

  router.post("/voice", async (req, res) => {
    console.log(req.files);
    // var data = req;
    // console.log(data);
    // content = {
    //   content: data,
    // };
    // console.log(content);
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

  router.get("/:id", async (req, res) => {
    const id = req.params;
    console.log("receive request");
    res.send(id);
  });

  app.use("/web", upload.any(), router);
  app.use(async (err, req, res, next) => {
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message,
    });
  });
};
