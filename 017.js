// Introduction to Random Strings
// rosalind.info/problems/cons/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let str = dataset[0]
let prs = dataset[1].split(" ").map(a=>+a)

let pr = []

let b = []

for(let i = 0; i < prs.length; i++) {
	pr["G"] = prs[i] / 2
	pr["C"] = prs[i] / 2
	pr["A"] = (1 - prs[i]) / 2
	pr["T"] = (1 - prs[i]) / 2
	
	let p = 1
	for (let j = 0; j < str.length; j++) {
		p *= pr[str[j]]
	}
	
	b.push(p)
}



fs.writeFileSync("answer.txt", b.map(a=>Math.log10(a)).join(" "))
