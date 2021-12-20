// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const bi = require("big-integer")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

dataset = dataset[0].split(" ")
let N = +dataset[0]
let m = +dataset[1]
let g = +dataset[2]
let k = +dataset[3]

console.log(N, m, g, k)


//console.log(p,q)

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

let ws = (m, i) => {
	let p = m / (2 * N)
	let q = 1 - p
	
	return c(bi(2).times(N), bi(i)) * Math.pow(p,2 * N-i) * Math.pow(q, i)
}

let ws0 = (m, i) => {
	let p = m / (2 * N)
	let q = 1 - p
	
	return c(bi(2).times(N), bi(i)) * Math.pow(p,i) * Math.pow(q, 2 * N-i)
}

let memo = {}

let genrec = (genleft, m) => {
	if (memo[[genleft,m].join(",")] !== void 0) return memo[[genleft,m].join(",")]
	
	if (genleft === 0) {// time to count
		let pr = 0
		for (let i = k; i <= 2 * N; i++) {
			pr += ws(m, i)
		}
		
		
		memo[[genleft,m].join(",")] = pr
		
		//console.log(pr, genleft, m, memo)
		return pr
	}
	
	let sum = 0
	for (let m0 = 0; m0 <= 2 * N; m0++) {
		let pr = ws0(m, m0)
		
		let mem = memo[[genleft-1,m0].join(",")]
		if (mem === void 0) {
			//console.log(">>>",m0)
			mem = genrec(genleft - 1, m0)
		}
		sum += pr * mem
	}
	
	memo[[genleft,m].join(",")] = sum
	//console.log(memo)
	return sum

}

let out = genrec(g - 1, m)
console.log(out)
fs.writeFileSync("answer.txt", out)
