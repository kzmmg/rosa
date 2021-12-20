// Counting Subsets
// rosalind.info/problems/sset/

const fs = require("fs")
const b = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let n = b(dataset[0])

fs.writeFileSync("answer.txt", b(2).pow(n).mod(1000000).toString())
