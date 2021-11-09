// Rabbits and Recurrence Relations
// rosalind.info/problems/fib/

const fs = require("fs")
	
let [n, k] = fs.readFileSync("dataset.txt").toString().split(" ")

let fib3 = [1,1]

for (let i = 2; i < n; i++) {
	fib3[i] = fib3[i-2]*k + fib3[i-1]
}

fs.writeFileSync("answer.txt", fib3[n-1])
