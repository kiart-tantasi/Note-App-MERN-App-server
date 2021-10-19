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

/* --- Adding Default Items --- */

const item1 = {
    item: "Table",
    des: "a piece of furniture with a flat top and one or more legs, providing a level surface on which objects may be placed, and that can be used for such purposes as eating, writing, working, or playing games."
}
const item2 = {
    item:"Book",
    des:"a written or printed work consisting of pages glued or sewn together along one side and bound in covers."
}

const item3 = {
    item:"Pen",
    des:"an instrument for writing or drawing with ink, typically consisting of a metal nib or ball, or a nylon tip, fitted into a metal or plastic holder."
}

const defaultItems = [item1,item2,item3];

Item.find({},
    (err,foundItems) => {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, err => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Since no items were found in database, default items were added accordingly.")
                    }
                })

            }
        }
    })


/* ---------------------------- */

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
    Item.updateOne(
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

// .put((req,res) => {
//     Item.findOneAndUpdate(
//         {item: req.params.itemName},
//         {item: req.body.item,
//         des: req.body.des},
//         {overwrite: true},
//         err => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log("Successfully Put.")
//             }
//         }
//     )
// })

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`running on port ${port}`);
})
