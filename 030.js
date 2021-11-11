// Perfect Matchings and RNA Secondary Structures
// rosalind.info/problems/pmch/

const fs = require("fs")
const bi = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let ds = ""

for (let i = 0; i < dataset.length; i++) {
	if (dataset[i].substr(0,1) === ">") {
		if (ds.length) ds += "\n"
	} else {
		ds += dataset[i]
	}
	
}

dataset = ds.split("\n")

let str = dataset[0]

let numa = bi(0)
let numc = bi(0)

function f(a) {
	if (a.leq(1)) return bi(1)
	else return a.times(f(a.minus(1)))
}

console.log(numa)
for (let i = 0; i < str.length; i++) {
	if (str[i] === "A") numa = numa.plus(1)
	if (str[i] === "C") numc = numc.plus(1)
}


fs.writeFileSync("answer.txt", f(numa).times(f(numc)).toString())
