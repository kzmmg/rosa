// Partial Permutations
// rosalind.info/problems/pper/

const fs = require("fs")
const bi = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString().split(" ")
let n = bi(+dataset[0])
let k = bi(+dataset[1])

console.log(n, k)

function fmod(x) {
	console.log(x)
	if (x.leq(1)) {
		return bi.one
	}
	
	return (x.times(fmod(x.minus(1))))
}



fs.writeFileSync("answer.txt", fmod(k).times(fmod(n)).divide(fmod(k).times(fmod(n.minus(k)))).mod(1000000))
