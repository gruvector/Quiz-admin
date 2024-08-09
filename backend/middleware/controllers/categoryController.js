import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname("../", __filename);

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
      console.log(jsonData);
      res.send(jsonData);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res
        .status(500)
        .send({ message: "Error parsing JSON", error: parseError });
    }
  });
};

const editCategory = (req, res) => {
  const filePath = path.join(__dirname, "public", "categories.json");
  const { editCategory, editCategoryIndex } = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send({ message: "Error reading file", error: err });
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData[parseInt(editCategoryIndex)].name = editCategory;

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
          return res.status(500).send({ message: "Error writing file", error: writeErr });
        }
        res.send({ message: "Data updated successfully" });
      });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).send({ message: "Error parsing JSON", error: parseError });
    }
  });
};

const deleteCategory = (req, res) => {
  const filePath = path.join(__dirname, "public", "categories.json");
  const { editCategoryIndex } = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send({ message: "Error reading file", error: err });
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData.splice(editCategoryIndex, 1);

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
          return res.status(500).send({ message: "Error writing file", error: writeErr });
        }
        res.send({ message: "Data updated successfully" });
      });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).send({ message: "Error parsing JSON", error: parseError });
    }
  });
};

export { addCategory, getCategory, editCategory, deleteCategory };
