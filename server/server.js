const express = require("express")
const cors = require("cors")
const fs = require("fs")
const readLine = require("readline")
const app = express()

app.use(express.json())
app.use(cors())

const spots = []
readFile()

app.get("/spots", (req, res) =>{
    res.json(spots)
})

app.post("/spots", (req, res) =>{
    const user = {"name": req.body.name.trim(), "email": req.body.email, "payment": req.body.payment, "spot": req.body.spot}
    if(!checkForDuplicate(user)){
        spots.push(user)
        writetoFile(user)
        console.log(user.name + " has claimed spot: " + user.spot)
        res.status(201).send()
    }else{
        res.status(521).send("User already exists")
    }
})

function checkForDuplicate(user){
    var found = false
    const editedName = user.name.replace(" ", "").toLowerCase()
    spots.find(function(element){
        if(element.name.replace(" ", "").toLowerCase() == editedName || element.spot[0] == user.spot[0] && element.spot[1] == user.spot[1] || element.email == user.email){
            found = true
        }

    })
    return found;
}

function writetoFile(user){
    var text = user.name + ", " + user.email + ", " + user.payment + ", " + user.spot + "\n"
    fs.appendFile("spots.txt", text, function(err){
        if(err) throw err
        
    })
}

async function readFile(){
    const fileStream = fs.createReadStream("spots.txt")

    const rl = readLine.createInterface({
        input: fileStream,
        ctrlfDelay: "Infinity"
    })

    for await (const line of rl){
        var lnArr = line.split(",")
        if(lnArr[0] == ""){
            continue
        }
        const user = {name: lnArr[0].trim(), email: lnArr[1].trim(), payment: lnArr[2].trim(), spot: [lnArr[3].trim(), lnArr[4].trim()]}
        if(!checkForDuplicate(user)){
            spots.push(user)
        }

    }


}

app.listen(3000)


