// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
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
dataset = dataset[0]

const m = {
	A:'U',
	U:'A',
	C:'G',
	G:'C'
}

let memo = {}

let mo = (s) => {
	if (memo[s]) return memo[s]
	
	if (s.length === 2) {
		if (s[0] === m[s[1]]) return 2
		else return 1
	}
	
	if (s.length <= 1) {
		return 1
	}
	
	let lt = s[0]
	let rest = s.substring(1)
	
	let bpl = rest.split("").reduce((a,i, x) => a.concat((i === m[lt]) ? [x] : []), [])
	
	//console.log("bpl", bpl, "...", s, rest)
	
	let sum = 0
	
	for (let i = 0; i < bpl.length; i++) {
		let c1 = rest.slice(0, bpl[i])
		let c2 = rest.slice(bpl[i] + 1)
		
		let moc1 = (memo[c1] || mo(c1)) % 1000000
		memo[c1] = moc1
		let moc2 = (memo[c2] || mo(c2)) % 1000000
		memo[c2] = moc2
		//console.log("> [", c1, "]", moc1, bpl[i], "...", s, rest)
		//console.log(">> [",  c2, "]", moc2, bpl[i], "...",s, rest)
		
		sum += moc1 * moc2
		
	}
	
	//console.log(">>>", sum, "...",s, rest)
	
	let morest = (memo[rest] || mo(rest)) % 1000000
	memo[rest] = morest
	
	sum += morest
	sum %= 1000000
	
	//console.log(">>>>", morest, "...", s, rest)

	return sum
}

// GAUC

let res = mo(dataset) // + 1 for empty total

res %=  1000000
//console.log(memo)

fs.writeFileSync("answer.txt", res)
