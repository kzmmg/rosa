// Finding a Motif in DNA 
// rosalind.info/problems/subs/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let dna = dataset[0]
let motif = dataset[1]
let lenm = motif.length
	
let pos = []
for (i = 0; i < dna.length; i++) {
	if (dna.substr(i,lenm) === motif)
		pos.push(i + 1)
}


fs.writeFileSync("answer.txt", pos.join(" "))
