
// Consensus and Profile
// rosalind.info/problems/cons/

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
let dnas = []
	
for (let i = 0; i < dataset.length; i++) {
	if (i % 2 == 1)
		dnas.push(dataset[i])
}

let p = []

p["A"] = []
p["C"] = []
p["G"] = []
p["T"] = []

let cons = ""

for(let i = 0; i< dnas[0].length;i++) {
	
	p["A"][i] = 0
	p["C"][i] = 0
	p["G"][i] = 0
	p["T"][i] = 0
	for (let j = 0; j < dnas.length; j++) {
		//	console.log(dnas[j][i])
			
			p[dnas[j][i]][i]++
	}
	//
	//console.log(p)
	let max = Math.max(p["A"][i], p["C"][i],p["G"][i],p["T"][i])
	let ip = []
	ip[p["A"][i]] = "A"
	ip[p["C"][i]] = "C"
	ip[p["G"][i]] = "G"
	ip[p["T"][i]] = "T"
	
	cons += ip[max]
}

let stra = "A: " + p["A"].join(" ")
let strg = "G: " + p["G"].join(" ")
let strc = "C: " + p["C"].join(" ")
let strt = "T: " + p["T"].join(" ")

fs.writeFileSync("answer.txt", cons + "\n" + stra + "\n" + strc + "\n" + strg + "\n" + strt + "\n")
