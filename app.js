const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/reactDB");

const itemSchema = {
    item: String,
    des: String
}

const Item = mongoose.model("Item",itemSchema);

/* --- Adding Default Items --- 
const item1 = {
    item: "item1",
    des: "des of item1"
}
const item2 = {
    item:"item2",
    des:"des of item2"
}
const defaultItems = [item1,item2];
Item.insertMany(defaultItems, err => {
    console.log("Default Items Added")
    if (err) {
        console.log(err);
    }
})
 ---------------- */

app.route("/items")

.get((req,res) => {
    Item.find({}, (err,foundItems) => {
        if (foundItems.length === 0) {
            res.send("No Items.");
            console.log("No Items.")
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
    res.redirect("/items")
})

.delete((req,res) => {
    console.log("Delete Method Activated!")
})

app.route("/items/:itemName")

.delete((req,res) => {
    const itemId = req.body._id;
    Item.findByIdAndRemove(itemId,err=>{
        if(err) {
            console.log(err)
        } else {
            console.log("Item ID: " + itemId +" was Deleted.")
        }
    })
})

.patch((req,res) => {
    Item.findOneAndUpdate(
        {item: req.params.itemName},
        {des: req.body.des},
        err => {
            if (err) {
                console.log(err)
            } else {
                console.log("Successfully Patched.")
            }
        }
    )
})

.put((req,res) => {
    Item.findOneAndUpdate(
        {item: req.params.itemName},
        {item: req.body.item,
        des: req.body.des},
        {overwrite: true},
        err => {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully Put.")
            }
        }
    )
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`running on port ${port}`);
})
