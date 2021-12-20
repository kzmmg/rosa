// Creating a Distance Matrix
// rosalind.info/problems/pdst/

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

let dm = Array(dataset.length)

for (let i = 0; i < dataset.length; i++) {
	dm[i] = []
}

function dist (str1, str2) {
	//console.log(str1, str2)
	let len = str1.length
	let count = 0
	for (let i = 0; i < str1.length; i++) {
		if (str1[i] !== str2[i]) count++
	}
	
	return count/len
}

for(let i = 0; i < dataset.length; i++) {
	for (let j = 0; j < dataset.length; j++) {
		let dis = dist(dataset[i], dataset[j])
		//console.log(dis, i, j)
		dm[i][j] = dis
	}
}

console.log(dm)
fs.writeFileSync("answer.txt", dm.map(a=>a.join(" ")).join("\n"))
