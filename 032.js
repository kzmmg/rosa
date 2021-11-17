// Longest Increasing Subsequence 
// rosalind.info/problems/lgis/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let n = +dataset[0]
let perm = dataset[1].split(" ").map(a=>+a)

function lss(op) {
	let m = Array(perm.length + 1).fill(0)
	let p = []
	let l = 0
	for (let i = 0; i < perm.length; i++) {
		let cur = perm[i]
		
		let lo = 1
		let hi = l + 1
		
		while (lo < hi) {
			let mid = lo + Math.floor((hi - lo) / 2)
			
			if (op(perm[m[mid]],cur)) {
				lo = mid + 1
			} else {
				hi = mid
			}
		}
		
		let newl = lo
		
		p[i] = m[lo - 1]
		m[lo] = i
		
		if (newl > l) l = newl
	}

	let ss = []

	let k = m[l]
	//console.log(perm)
	//console.log(l, k)
	//console.log(m)
	//console.log(p)
	for (let i = l - 1; i >= 0; i--) {
		ss[i] = perm[k]
		k = p[k]
	}
	
	return ss
}

let inc = lss((a,b) => a < b)
let dec = lss((a,b) => a > b)

//console.log(dec)
fs.writeFileSync("answer.txt", inc.join(" ") + "\n" + dec.join(" "))
