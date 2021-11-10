

// Finding a Shared Motif
// rosalind.info/problems/lcsm/

// SI!!!!

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

let s1 = dataset[0]
let s2 = dataset[1]

let subs = []

for (let i = 2; i <= s1.length; i++) {
	for (let j = 0; j < s1.length; j++) {
		let sub = s1.substr(j, i)
		if (s2.indexOf(sub) !== -1) {
			subs.push(sub)
		}
	}
}

console.log(dataset)
subs = [...new Set(subs)]

console.log("subs", subs)
let flags = Array(subs.length).fill(1)
for (let i = 0; i < dataset.length; i++) {
	for (let j = 0; j < subs.length; j++) {
		if (dataset[i].indexOf(subs[j]) === -1) {
			flags[j] = 0
		}
	}
}

let subf = []
for (let i = 0; i < subs.length; i++) {
	if (flags[i]) subf.push(subs[i])
}
	
console.log(subf.sort((a,b) => {
	return b.length - a.length
}))

fs.writeFileSync("answer.txt", subf[0])
