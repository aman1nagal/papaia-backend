const multer = require("multer");
const fs = require('fs');
const path = require('path');
const { categories } = require("./config");
const folderName = "public/images";

const filePath = path.resolve(__dirname + "./../" + folderName)
if (!fs.existsSync("public") || !fs.existsSync(folderName)) {
  fs.mkdirSync("public");
  fs.mkdirSync("public/images")
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(filePath + `/${categories[file.fieldname]}`))
  },
  filename: function (req, file, cb) {

    const finalName = Date.now() + path.extname(file.originalname)
    const folderCreate = path.resolve(__dirname + "./../" + folderName + `/${categories[file.fieldname]}`)

    if (!fs.existsSync(folderCreate)) fs.mkdirSync(folderCreate)
    req.body[file.fieldname] = `${categories[file.fieldname]}/${finalName}`

    if (!req["fields"]) {
      req["fields"] = [file.fieldname]
    } else {
      req["fields"] = [...req.fields, file.fieldname];
    }

    cb(null, finalName)
  }
})

const uploadCategories = multer({ storage: storage })

module.exports = { uploadCategories }