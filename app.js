require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// EXPRESS AND CORS SETUP
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


mongoose.connect("mongodb://localhost:27017/noteDB"); //  <<<< -- use this local mongodb if you don't have any clusters on MongoDB

// const atlasurl =
//   "mongodb+srv://" +
//   process.env.DB_ID +
//   ":" +
//   process.env.DB_PASS +
//   "@free-cluster.yo247.mongodb.net/noteDB";
// mongoose.connect(atlasurl);
const itemSchema = mongoose.Schema({
  item: String,
  des: String,
  date: Number
});
const Item = mongoose.model("Item", itemSchema);

//redirect from route "/"
app.get("/", (req, res) => res.redirect("/items"));

//route "/items"
app
  .route("/items")

  // GET ALL NOTES
  .get((req, res) => {
    Item.find({}, (err, foundItems) => {
      if (err) {
        console.log(err);
        return;
      }
      if (foundItems.length === 0) {
        // insert default items if nothing is found
        //Default Items
        const item1 = {
          item: "Morning",
          des: "I have to clean my room.",
          date: new Date().getTime()
        };
        const item2 = {
          item: "Tomorrow",
          des: "a little more of housework",
          date: new Date().getTime()
        };
        const item3 = {
          item: "This Weekend",
          des: "Going to Have some Beer!",
          date: new Date().getTime()
        };
        const item4 = {
          item: "Party",
          des: "Next Friday, I have PARTY!",
          date: new Date().getTime()
        };
        const defaultItems = [item1, item2, item3, item4];
        Item.insertMany(defaultItems, (err) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/items");
          }
        });
      } else {
        res.send(foundItems);
      }
    });
  })

  // POST A NEW NOTE
  .post((req, res) => {
    const itemName = req.body.item;
    const itemDes = req.body.des;
    const itemDate = req.body.date;
    const addItem = new Item({
      item: itemName,
      des: itemDes,
      date: itemDate
    });
    addItem.save(err => {
      if (err) {console.log(err)}
      else {
        res.sendStatus(200);
      }
    });
  });

//route specific items "items/:itemId"
app
  .route("/items/:itemId")

  // DELETE
  .delete((req, res) => {
    const itemId = req.params.itemId;
    Item.deleteOne({ _id: itemId }, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.sendStatus(200);
      }
    });
  })

  // UPDATE
  .patch((req, res) => {
    const itemId = req.params.itemId;
    const newDescription = req.body.des;
    Item.updateOne(
      { _id: itemId },
      { des: newDescription },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          res.sendStatus(200);
        }
      }
    );
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("running on port", port);
});
