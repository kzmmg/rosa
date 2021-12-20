// Counting Disease Carriers
// rosalind.info/problems/afrq/

const fs = require("fs")
const b = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString().split(" ").map(a=>+a)

let b1 = []
for (let i = 0 ; i < dataset.length; i++) {
	let p = Math.sqrt(dataset[i])
	let q = 1 - p
	b1.push(2*p*q + p * p)
}

// 6 3 6!/3! = 4 * 5 * 6 = 120 / 3! = 120 / 6 = 20

fs.writeFileSync("answer.txt", b1.join(" "))
