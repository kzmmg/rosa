// Independent Alleles
// rosalind.info/problems/lia/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split(" ").map(a=>+a)
	
let [k, N] = dataset

// 
// AaBb x AaBb = AaBb 0.5 (for Aa) * 0.5 (for Bb) = 0.25
// any other mate pairs also give 0.25 no matter what kind of kid mated so 0.25 is constant for every gen

console.log(k, N)


function f(n) {
	return (n===1 || n === 0)? 1 : f(n-1) * n;
}

function c(n, k) {
	return f(n) / (f(k) * f(n-k))
}

let kgen = 0.25
console.log(kgen)
let sum = 0

let am = Math.pow(2,k)

for (let i = N; i <= am; i++) {
	let coef = Math.pow(kgen, i) * Math.pow(1-kgen, am - i) * c(am, i)
	console.log(coef, i, Math.pow(kgen, am - i), Math.pow(1-kgen, i), c(am, i))
	sum += coef
}

fs.writeFileSync("answer.txt", sum)
