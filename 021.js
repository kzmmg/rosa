

// Locating Restriction Sites
// rosalind.info/problems/revp/


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
dataset = dataset[0]

function rev(s) {
	return s.split("").reverse().join("").replace(/T/g, "R").replace(/A/g, "T").
	replace(/R/g, "A").replace(/C/g, "R").replace(/G/g, "C").replace(/R/g, "G")
}

function rpal(s) {
	if (s.length % 2) return false
	
	let len = s.length / 2
	let pref = s.substr(0, len)
	let suff = s.substr(-len)
	
	suff = rev(suff)
	
	if (suff === pref) return true
	return false
}

let res = []
for (let i = 4; i <= 12; i+=2) {
	for (let j = 0; j < dataset.length; j++) {
		let cut = dataset.substr(j,i)
		if (cut.length < i) continue
		
		if (rpal(cut)) {
			res.push(j + 1 + " " + i)
		}
	}
}

fs.writeFileSync("answer.txt", res.join("\n"))
