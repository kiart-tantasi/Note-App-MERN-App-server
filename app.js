const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

//mongodb with mongoose
mongoose.connect("mongodb://localhost:27017/noteDB");
const itemSchema = mongoose.Schema({
    item: String,
    des: String
});
const Item = mongoose.model("Item",itemSchema);

//Adding Default Items
function addDefaultItems() {
    const item1 = {
        item: "Morning",
        des: "I have to cleaning my room."
    }
    const item2 = {
        item:"Tomorrow",
        des:"a little more of housework"
    }
    const item3 = {
        item:"This Weekend",
        des:"Going to Have some Beer!"
    }
    const defaultItems = [item1,item2,item3];
    Item.insertMany(defaultItems, err => {
        if (err) {
            console.log(err);
        }
    })
}

//route items
app.get("/",(req,res) => res.redirect("/items"));
app.route("/items")
.get((req,res) => {
    Item.find({}, (err,foundItems) => {
        if (foundItems.length === 0) {
            addDefaultItems();
            res.redirect("/items");
        } else {
            res.send(foundItems);
        }
    })
})
.post((req,res) => {
    const itemName = req.body.item;
    const itemDes = req.body.des;
    const addItem = new Item({
        item: itemName,
        des: itemDes
    })
    addItem.save();
    res.redirect("/items");
})

//route specific items
app.route("/items/:itemName")
.delete((req,res) => {
    const itemId = req.body._id;
    Item.findByIdAndRemove(itemId,err=>{
        if(err) {
            console.log(err);
        }
    })
})
.patch((req,res) => {
    Item.updateOne(
        {item: req.params.itemName},
        {des: req.body.des},
        err => {
            if (err) {
                console.log(err);
            }
        }
    )
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("running on port", port);
});