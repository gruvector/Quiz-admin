import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname("../", __filename);
// Add Category
const addCategory = (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, "public", "categories.json");


  fs.writeFile(
    filePath,
    JSON.stringify(data.categories, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res
          .status(500)
          .send({ message: "Error writing file", error: err });
      }
      res.send({ message: "Data updated successfully" });
    }
  );
};


// Get Category
const getCategory = (req, res) => {
  const filePath = path.join(__dirname, "public", "categories.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res
        .status(500)
        .send({ message: "Error reading file", error: err });
    }

    try {
      const jsonData = JSON.parse(data);
      res.send(jsonData);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res
        .status(500)
        .send({ message: "Error parsing JSON", error: parseError });
    }
  });
};

export { addCategory, getCategory };
