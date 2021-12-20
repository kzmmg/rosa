// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

dataset = dataset[0].split(" ")

let res = dataset.map(a => 2 * (1-a) * a)

let out = res.join(" ")
console.log(out)
fs.writeFileSync("answer.txt", out)
