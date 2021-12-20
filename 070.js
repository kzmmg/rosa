// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let sum = dataset.reduce((a,i)=>a+i.length, 0)

console.log(sum)

let n50 = 0.5 * sum
let n75 = 0.75 * sum

console.log(n50, n75)

dataset.sort((a,b) => b.length - a.length)

console.log(dataset)

let lena = dataset.map(a=>a.length)

let lens = [...new Set(lena)]

console.log(lens)

let cn50 = -1
let cn75 = -1
for (let i = 0; i < lens.length; i++) {
	let len = lens[i]
	
	let sum = 0
	for (let j = 0; j < dataset.length; j++) {
		if(dataset[j].length >= len) {
			//console.log(">>>>", len)
			sum+=dataset[j].length
		}
	}
	
	//console.log(cn50,cn75,len, sum)
	if (len > cn50 && sum >= n50) {
		cn50 = len
	}
	if (len > cn75 && sum >= n75) {
		cn75 = len
	}
}

console.log(cn50, cn75)

fs.writeFileSync("answer.txt", cn50 + " " + cn75)
