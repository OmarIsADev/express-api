import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import cors from "cors";

const path = "./data";
const app = express();
const port = 1000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const readAllFiles = () => {
  let data = [];

  const file = fs.readdirSync(path);
  file.forEach((file) => {
    data.push(JSON.parse(fs.readFileSync(`./data/${file}`)));
  });
  if (data.length > 0) {
      return [data, data.at(-1).id + 1];
  }
  else return [[], 1]
};

const readFile = (id) => {
  return JSON.parse(fs.readFileSync(`./data/${id}.json`));
};

const addData = (data, id) => {
  fs.writeFile(`./data/${id}.json`, data, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log("data writen");
  });
};

app.get("/data", (req, res) => {
  const [data, id] = readAllFiles();
  console.log("data requested");

  if (data) {
    res.send(data);
    return;
  }
});

app.get("/data/:id", (req, res) => {
  const [data, id] = readFile(req.params.id);

  res.send(data);
});

app.post("/create", (req, res) => {
  const [data, id] = readAllFiles();

  if (!req.body) {
    res.status(400).send("name is required");
    return;
  }

  const item = JSON.stringify({ ...req.body, id });
  console.log(req.body)
  console.log({ ...req.body, id });

  res.status(200).send([...data, { name: req.body.name, id }]);

  addData(item, id);
});

app.delete("/delete/:id", (req, res) => {
  fs.unlinkSync(`./data/${req.params.id}.json`);

  const [data, id] = readAllFiles();

  if (data) {
    res.send(data);
    return;
  }
});

app.get("/", function (req, res) {
  res.send({"message": "Hello World!"});
  console.log("request done in /")
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
