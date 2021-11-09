const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString()

let acc = []
acc["A"] = 0
acc["C"] = 0
acc["G"] = 0
acc["T"] = 0

let i
for (i in dataset.split(""))
	acc[dataset[i]]++
	
fs.writeFileSync("answer.txt", acc["A"] + " " + acc["C"] + " " + acc["G"] + " " + acc["T"])
