// Longest Increasing Subsequence 
// rosalind.info/problems/lgis/

const fs = require("fs")
const bi = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let n = +dataset[0]
let perm = dataset[1].split(" ").map(a=>+a)

function fsub(alr, rest, op) {
	if (rest.length == 0) {
		return [alr]
	}
	
	let last
	let lena = alr.length
	
	if (lena) {
		last = alr[lena-1]
	} else {
		last = op.max
	}
	
	let i = 0
	for (; i < rest.length; i++) {
		if (op(rest[i], last)) {
			break	
		}
	}
	
	if (i >= rest.length) {
		return [alr]
	}
	
	let nextrest = rest.slice(i + 1)
	let alr1 = alr.concat([])
	let alr2 = alr.concat([])
	
	alr1.push(rest[i])
	
	return fsub(alr1, nextrest, op).concat(fsub(alr2, nextrest, op))
	
}

let mo = (a, b) => a > b
let le = (a, b) => a < b

mo.max = -1
le.max = Math.pow(2,32)

let inc = fsub([], perm, mo).reduce((a, i) => i.length > a.length ? i : a, [])
let dec = fsub([], perm, le).reduce((a, i) => i.length > a.length ? i : a, [])



fs.writeFileSync("answer.txt", inc.join(" ") + "\n" + dec.join(" "))
