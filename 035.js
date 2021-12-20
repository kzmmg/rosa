// Maximum Matchings and RNA Secondary Structures
// rosalind.info/problems/mmch/

const fs = require("fs")
const bi = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let str = dataset[1]

let numa = str.split("").filter(i => i === "A").length
let numu = str.split("").filter(i => i === "U").length
let numg = str.split("").filter(i => i === "G").length
let numc = str.split("").filter(i => i === "C").length

console.log(numa, numu, numc, numg)

let minau = bi(Math.min(numa, numu))
let maxau = bi(Math.max(numa, numu))
let mincg = bi(Math.min(numc, numg))
let maxcg = bi(Math.max(numc, numg))

function f(x) {
	return x.leq(2) ? bi(1) : x.times(f(x.minus(1)))
}

function c(n,k) {
	return f(n).divide(f(n.minus(k)).times(f(k)))
}

console.log(maxau, minau)

fs.writeFileSync("answer.txt", c(maxau, minau).times(f(minau)).times(c(maxcg, mincg)).times(f(mincg)).toString())
