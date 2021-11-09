// Mortal Fibonacci Rabbits
// rosalind.info/problems/fibd/

const fs = require("fs")
const bigint = require("big-integer")
	
let [n, k] = fs.readFileSync("dataset.txt").toString().split(" ")

let fib3 = [bigint(1),bigint(1)]
let offs = [bigint(1),bigint(0)]
let adul = [bigint(0),bigint(1)]
let mort = [bigint(0),bigint(0)]

// 6, 3:
// 1, 1, 2, 2, 3, 4
// 1, 0, 1, 1, 1, 2


n = +n
k = +k

console.log(n, k)

for (let i = 2; i < n; i++) {
	mort[i] = offs[i-k] || 0 // those who are absent this month were born k month ago
	offs[i] = adul[i-1] // those who were born are those who were adults month ago
	adul[i] = offs[i-1].add(adul[i-1]).minus(mort[i]) // those who can reproduce are either older or born month ago
	fib3[i] = offs[i].add(adul[i]) //total
}


fs.writeFileSync("answer.txt", fib3[n-1].toString())
