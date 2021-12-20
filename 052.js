// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/


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

let d = []

let s1 = dataset[0]
let s2 = dataset[1]
for (let i = 0; i <= s1.length; i++) {
	d[i] = []
	d[i][0] = i
}
for (let j = 0; j <= s2.length; j++) {
	d[0][j] = j
}

for (let i = 1; i <= s1.length; i++) {
	for (let j = 1; j <= s2.length; j++) {
		
		let aijm1 = d[i][j-1] || 0
		let aim1j = d[i-1] && d[i-1][j] || 0
		let aim1jm1 = d[i-1] && d[i-1][j-1] || 0
		
		
		let plo = s1[i-1] !== s2[j-1] ? 1 : 0
		
		d[i][j] = Math.min(aijm1 + 1,aim1j + 1,aim1jm1 + plo)
	}
}

//console.log(d.map(i => i.join(" ")).join("\n"))



fs.writeFileSync("answer.txt", d[s1.length][s2.length])
