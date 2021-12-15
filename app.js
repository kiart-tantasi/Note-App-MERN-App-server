require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/noteDB"); <<<< -- use this local mongodb if you don't have any clusters on MongoDB
const atlasurl =
  "mongodb+srv://" +
  process.env.DB_ID +
  ":" +
  process.env.DB_PASS +
  "@free-cluster.yo247.mongodb.net/noteDB";

mongoose.connect(atlasurl);
const itemSchema = mongoose.Schema({
  item: String,
  des: String,
});
const Item = mongoose.model("Item", itemSchema);

//Default Items
const item1 = {
  item: "Morning",
  des: "I have to clean my room.",
};
const item2 = {
  item: "Tomorrow",
  des: "a little more of housework",
};
const item3 = {
  item: "This Weekend",
  des: "Going to Have some Beer!",
};
const defaultItems = [item1, item2, item3];

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
    const addItem = new Item({
      item: itemName,
      des: itemDes,
    });
    addItem.save();
    res.redirect("/items");
  });

//route specific items "items/:itemName"
app
  .route("/items/:itemName")

  // DELETE
  .delete((req, res) => {
    Item.deleteOne({ item: req.params.itemName }, (err) => {
      if (err) {
        console.log(err);
      } else {
        Item.find({}, (err, foundItems) => {
          if (err) {
            console.log(err);
          } else {
            if (foundItems.length === 0) {
              res.sendStatus(404);
            } else if (foundItems.length > 0) {
              res.send(foundItems);
            }
          }
        });
      }
    });
  })

  // UPDATE
  .patch((req, res) => {
    Item.updateOne(
      { item: req.params.itemName },
      { des: req.body.des },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          Item.find({}, (err, foundItems) => {
            if (err) {
              console.log(err);
            } else {
              if (foundItems.length === 0) {
                res.sendStatus(404);// This is not suppused to run since this is updating, not deleting.
              } else if (foundItems.length > 0) {
                res.send(foundItems);
              }
            }
          });
        }
      }
    );
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("running on port", port);
});
