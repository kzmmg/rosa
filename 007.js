// Counting Point Mutations
// rosalind.info/problems/hamm/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let acc = 0

for (let i = 0; i < dataset[0].length; i++) {
	let c1 = dataset[0][i]
	let c2 = dataset[1][i]
	
	if (c1 !== c2)
		acc++
}
	
fs.writeFileSync("answer.txt", acc)
