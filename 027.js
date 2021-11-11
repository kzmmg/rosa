

// Matching Random Motifs 
// rosalind.info/problems/rstr/

const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let nums = dataset[0]
let str = dataset[1]

let num1 = +nums.split(" ")[0]
let num2 = +nums.split(" ")[1]

let prob = 1
let gc = num2 /2
let at = (1 - num2) / 2
let probs = {"C": gc, "G": gc, "A": at, "T": at}

for (let i = 0; i < str.length; i++) {
	prob *= probs[str[i]]
}

// prob - p prob

let pprob = prob
let qprob = 1 - prob

// !(at least 1) is 0, P(at least 1) = 1 - P(0), P(0) = qprob^


console.log(pprob, qprob)
fs.writeFileSync("answer.txt", 1 - Math.pow(qprob, num1))
