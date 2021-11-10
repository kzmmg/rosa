
// Finding a Spliced Motif
// rosalind.info/problems/sseq/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let ds = ""

for (let i = 0; i < dataset.length; i++) {
	if (dataset[i].substr(0,1) === ">") {
		if (ds.length) ds += "\n"
	} else {
		ds += dataset[i]
	}
	
}

dataset = ds.split("\n")

let str = dataset[0]
let sub = dataset[1]

let pos = []
for (let i = 0, j = 0; i < str.length; i++) {
	if (str[i] === sub[j]) {
		pos.push(i+1)
		j++
		if (j >= sub.length) break
	}
}

fs.writeFileSync("answer.txt", pos.join(" "))
