// k-Mer Composition
// rosalind.info/problems/kmer/

const fs = require("fs")

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
let s = dataset[0]

function gen(is) {
	if (is.length === 4) {
		return [is]
	}
	
	let a = is + "A"
	let t = is + "T"
	let c = is + "C"
	let g = is + "G"
	
	return gen(a).concat(gen(c)).concat(gen(g)).concat(gen(t))
}

let mers = gen("")

mers.sort()

let counts = []
for (let i = 0; i < mers.length; i++) {
	let m = mers[i]
	let count = 0
	for (let j = 0; j < s.length; j++) {
			if(s.substr(j,4)===m) count++
	}
	
	counts.push(count)
}

fs.writeFileSync("answer.txt", counts.join(" "))
