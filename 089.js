// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const bi = require("big-integer")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let n = bi(dataset[0])

let f = (x) => {
	if(x.eq(1) || x.leq(0)) return bi.one
	
	return x.times(f(x.minus(1)))
}

let c = (n,k) => {
	return f(n).divide(f(n.minus(k)).times(f(k)))
}

let res = c(n,bi(4))

let out = res.mod(1000000)
fs.writeFileSync("answer.txt", out)
