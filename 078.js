// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const bi = require("big-integer")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")


dataset[0] = dataset[0].split(" ")
let N = +dataset[0][0]
let g0 = +dataset[0][1]
let A = dataset[1].split(" ").map(e=>+e)


console.log(N, g0, A)

let fm = {}
let f = (x) => {
	if(fm[x]) return fm[x]
	
	if(x.lt(2)) return bi.one
	let m1 = fm[x.minus(1).toString()] || f(x.minus(1))
	fm[x.minus(1).toString()] = m1
	
	return m1.times(x)
}

let c = (n,k) => {
	return f(n).divide(f(k)).divide(f(n.minus(k)))
}

let pr = 0

let ws = (m) => {
	let p = m / (2 * N)
	let q = 1 - p
	
	return Math.pow(p,2 * N)
}

let ws0 = (m, i) => {
	let p = m / (2 * N)
	let q = 1 - p
	
	return c(bi(2).times(N), bi(i)) * Math.pow(p,i) * Math.pow(q, 2 * N-i)
}

let memo = {}

let genrec = (genleft, m) => {
	if (genleft === 0) {// time to count
		let pr = ws(m)
		
		return pr
	}
	
	let sum = 0
	for (let m0 = 0; m0 <= 2 * N; m0++) {
		let pr = ws0(m, m0)
		
		let mem = genrec(genleft - 1, m0)
		sum += pr * mem
	}
	return sum

}

let B = []

for(let g = 0; g < g0; g++) {
	if(!B[g]) B[g] = []
	
	for(let i = 0; i < A.length; i++) {
		
		let n = A[i]
		let m = 2 * N - n
		B[g][i] = Math.log10(genrec(g, m))
	}
}

let out = B.map(e=>e.map(e=>Math.round(e * 100000) / 100000).join(" ")).join("\n")
console.log(out)
fs.writeFileSync("answer.txt", out)
