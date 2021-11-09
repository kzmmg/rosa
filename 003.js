const fs = require("fs")
	
fs.writeFileSync("answer.txt", Array.
	from(fs.readFileSync("dataset.txt").toString()).reverse().join("").replace(/T/g, "R").replace(/A/g, "T").
	replace(/R/g, "A").replace(/C/g, "R").replace(/G/g, "C").replace(/R/g, "G"))
