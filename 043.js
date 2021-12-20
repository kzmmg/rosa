// Introduction to Alternative Splicing
// rosalind.info/problems/aspc/

const fs = require("fs")
const b = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString().split(" ")
let n = b(dataset[0])
let m = b(dataset[1])

//console.log(n,m)

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

let sum = b(0)
for (let k = m; k.leq(n); k = k.plus(b.one)) {
	//console.log(n, k, c(n,k))
	sum = sum.plus(c(n,k)).mod(1000000)
}

// 6 3 6!/3! = 4 * 5 * 6 = 120 / 3! = 120 / 6 = 20

fs.writeFileSync("answer.txt", sum)
