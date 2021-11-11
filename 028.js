
 
// Matching Random Motifs 
// rosalind.info/problems/rstr/

const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let num = +dataset[0]
let str = dataset[1]
let gcs = dataset[2].split(" ").map(a=>+a)


let lendif = num - str.length + 1
let res = []
for (let i = 0; i < gcs.length; i++) {
	let gc = gcs[i] /2
	let at = (1 - gcs[i]) / 2
	let probs = {"C": gc, "G": gc, "A": at, "T": at}

	let prob = 1
	
	for (let i = 0; i < str.length; i++) {
		prob *= probs[str[i]]
	}
	
	res.push(lendif * prob)
}

fs.writeFileSync("answer.txt", res.join(" "))
