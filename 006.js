// Computing GC Content
// rosalind.info/problems/gc/

const fs = require("fs")
	
let dataset = fs.readFileSync("dataset.txt").toString()

dataset = dataset.split("\r\n")

let nu = ""

for (let i = 0; i < dataset.length; i++) {
	if (dataset[i][0] == ">")
		nu += "\r\n" + dataset[i] + "\r\n"
	else if (dataset[i].length > 0)
		nu += dataset[i]
}

dataset = nu.substr(2).split("\r\n")

console.log(dataset)

let id
let max = 0

console.log(dataset.length)

for (let i = 0; i < dataset.length; i+=2) {
	let tid = dataset[i].substr(1)
	//console.log(tid)
	
	let st = dataset[i+1]
	//console.log(st)
	let len = st.length
	let g =  st.split("").reduce(function (a, i) { return a + (i == "G" ? 1 : 0)}, 0)
	let c =  st.split("").reduce(function (a, i) { return a + (i == "C" ? 1 : 0)}, 0)
	let gc = g + c
	
	gc = gc / len * 100
	
	//console.log(gc)
	if (gc > max) {
		id = tid
		max = gc
	}
}

fs.writeFileSync("answer.txt", id + "\n" + max)
