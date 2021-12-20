// Error Correction in Reads
// rosalind.info/problems/corr/

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

function rev(s) {
	return s.split("").reverse().join("").replace(/T/g, "R").replace(/A/g, "T").
	replace(/R/g, "A").replace(/C/g, "R").replace(/G/g, "C").replace(/R/g, "G")
}

let counts = {}
for(let i = 0; i < dataset.length; i++) {
	let str = dataset[i]
	
	let revc = rev(str)
	
	counts[str] = counts[str] ? counts[str] + 1 : 1
	counts[revc] = counts[revc] ? counts[revc] + 1 : 1
}

console.log(counts)

let wrongs = []
let rights = []

for (let i in counts) {
	let c = counts[i]
	
	if (c < 2) wrongs.push(i)
	else rights.push(i)
}

wrongs = wrongs.filter(i => dataset.indexOf(i) !== -1)

function dist(a,b) {
	let d = 0
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) d++
	}
	return d
}

let sol = []
for (let i = 0; i < wrongs.length; i++) {
	for (let j = 0; j < rights.length; j++) {
		if (dist(wrongs[i], rights[j]) === 1) {
			sol.push(wrongs[i] + "->" + rights[j])
		}
	}
}

fs.writeFileSync("answer.txt", sol.join("\n"))
