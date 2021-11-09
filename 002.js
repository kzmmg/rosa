const fs = require("fs")
	
fs.writeFileSync("answer.txt", fs.readFileSync("dataset.txt").toString().replace(/T/g, "U"))
