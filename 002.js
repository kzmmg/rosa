// Transcribing DNA into RNA
// rosalind.info/problems/rna/

const fs = require("fs")
	
fs.writeFileSync("answer.txt", fs.readFileSync("dataset.txt").toString().replace(/T/g, "U"))
