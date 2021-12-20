// Counting Phylogenetic Ancestors
// rosalind.info/problems/inod/

const fs = require("fs")
const bi = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString()
let n = +dataset

fs.writeFileSync("answer.txt", n-2)
