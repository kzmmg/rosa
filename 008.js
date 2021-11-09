// Enumerating Gene Orders
// rosalind.info/problems/perm/

const fs = require("fs")

let dataset = +fs.readFileSync("dataset.txt").toString()
let num = 1

for (let i = dataset; i >= 1; i--) {
	num *= i
}
	
let initray = Array.from(Array(dataset).keys()).map(a => a + 1)

function rec(cur, rem) {
	if (rem.length === 0) {
		return [cur]
	}
	
	let acc = []
	let newcur, newrem, perm
	
	for (let i = 0; i < rem.length; i++) {
		
		newcur = cur.concat(rem[i])
		newrem = rem.filter(a => a != rem[i])
			
		perm = rec(newcur, newrem)
		acc = acc.concat(perm)
	}
	return acc
}

let psher = rec([], initray).map(a=>a.join(" "))

fs.writeFileSync("answer.txt", num + "\n" + psher.join("\n"))
