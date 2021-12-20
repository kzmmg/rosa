// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const assert = require("assert")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let chs = []
for(let i = 0; i < dataset[0].length; i++) {
	let pch = []
	let ch = dataset[0][i]
	for(let j = 0; j < dataset.length; j++) {
		if(dataset[j][i] === ch) pch.push(1)
		else pch.push(0)
	}
	
	let sum = pch.reduce((a,i)=>a+i,0)
	if(sum > 1 && sum < dataset.length - 1) chs.push(pch)
}

let out = chs.map(e=>e.join("")).join("\n")
//console.log(out)

fs.writeFileSync("answer.txt", out)
