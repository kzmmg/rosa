// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const bi = require("big-integer")
let dataset = fs.readFileSync("dataset.txt").toString()

let f = (x) => {
	if(x.eq(1)) return bi(1)
	return x.times(f(x.minus(1)))
}

let out = f(bi(dataset).times(2).minus(4)).divide(f(bi(dataset).minus(2)).times(bi(2).pow(bi(dataset).minus(2)))).mod(1000000)
//console.log(out)

fs.writeFileSync("answer.txt", out)
