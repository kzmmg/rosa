// Independent Segregation of Chromosomes
// rosalind.info/problems/indc/

const fs = require("fs")
const b = require("big-integer")

let dataset = b(+fs.readFileSync("dataset.txt").toString()).times(2)
let n = dataset

let ft = []
function f(x) {
	if (ft[x]) return ft[x]
	
	if (x.leq(1)) {
		ft[x] = b.one
		return ft[x]
	}
	
	ft[x] = x.times(f(x.minus(b.one)))
	
	return ft[x]
}

function c(n,k) {
	return f(n).divide(f(n.minus(k)).times(f(k)))
}

let sum = 0
let sums = []
let p = 1/2
for (let k = b(0); k.leq(n - 1); k = k.plus(b.one)) {
	//console.log(n, k, c(n,k))
	sum = sum + c(n,k) * Math.pow(p, k) * Math.pow(1-p, n-k)
	sums.push(Math.ceil(Math.log10(sum) * 10000) / 10000)
}

// 6 3 6!/3! = 4 * 5 * 6 = 120 / 3! = 120 / 6 = 20

fs.writeFileSync("answer.txt", sums.reverse().join(" "))
