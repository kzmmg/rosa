// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let ds = ""
const bi = require("big-integer")

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
	A:['U'],
	U:['A','G'],
	C:['G'],
	G:['C','U']
}

let memo = {}

let mo = (s) => {
	if (memo[s]) return memo[s]
	
	if (s.length < 4) {
		return bi(1)
	}
	
	let lt = s[0]
	let rest = s.substring(1)
	
	let bpl = rest.split("").reduce((a,i, x) => a.concat((m[lt].indexOf(i) !== -1) ? [x] : []), [])
	
	//console.log("bpl", bpl, "...", s, rest)
	
	let sum = bi(0)
	
	for (let i = 0; i < bpl.length; i++) {
		if(bpl[i] < 3) continue
		let c1 = rest.slice(0, bpl[i])
		let c2 = rest.slice(bpl[i] + 1)
		
		let moc1 = (memo[c1] || mo(c1))
		memo[c1] = moc1
		let moc2 = (memo[c2] || mo(c2))
		memo[c2] = moc2
		//console.log("> [", c1, "]", moc1, bpl[i], "...", s, rest)
		//console.log(">> [",  c2, "]", moc2, bpl[i], "...",s, rest)
		
		sum = sum.plus(moc1.times(moc2))
		
	}
	
	//console.log(">>>", sum, "...",s, rest)
	
	let morest = (memo[rest] || mo(rest))
	memo[rest] = morest
	
	sum = sum.plus(morest)
	
	//console.log(">>>>", morest, "...", s, rest)

	return sum
}

// GAUC

let res = mo(dataset) // + 1 for empty total

//console.log(memo)

console.log("memoAC", memo["AC"])

let out = res.toString()// + (284850219977421 - res)
console.log(out)
fs.writeFileSync("answer.txt", out)
