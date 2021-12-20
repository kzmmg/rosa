// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const bi = require("big-integer")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")


let trials = +dataset[0]
let A = dataset[1].split(" ").map(e=>+e)


let out = A.map(e=>e*trials).join(" ")
console.log(out)
fs.writeFileSync("answer.txt", out)
