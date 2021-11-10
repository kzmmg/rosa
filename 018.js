
// Overlap Graphs
// rosalind.info/problems/grph/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let ds = ""

for (let i = 0; i < dataset.length; i++) {
	if (dataset[i].substr(0,1) === ">") {
		if (ds.length) ds += "\n"
		ds += dataset[i] + "\n"
	} else {
		ds += dataset[i]
	}
	
}

dataset = ds.split("\n")

let strs = []
for (let i = 0, j = 0; i < dataset.length; i++) {
	//console.log(dataset[i] + "////")
	if (dataset[i][0] === ">") {
		//console.log("!!!!", i)
		strs[j] = [dataset[i].substr(1)]
	} else {
		//console.log("11111", i, dataset[i])
		strs[j][1] = dataset[i]
		j++
	}
}

//console.log(strs)
const k = 3
let lst = []
for (let i = 0; i < strs.length; i++) {
	for (let j = 0; j < strs.length; j++) {
		if (strs[i][1].substr(0, k) === strs[j][1].substr(-k) && i != j) {
			lst.push(strs[j][0] + " " + strs[i][0])
		}
	}
}

fs.writeFileSync("answer.txt", lst.join("\n"))
