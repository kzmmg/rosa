// Calculating Expected Offspring
// rosalind.info/problems/iev/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split(" ").map(a=>+a)
	
let [n1,n2,n3,n4,n5,n6] = dataset


fs.writeFileSync("answer.txt", 2 * (n1 * 1 + n2 * 1 + n3 * 1 + n4 * 0.75 + n5 * 0.5))
