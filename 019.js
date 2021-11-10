
// Genome Assembly as Shortest Superstring
// rosalind.info/problems/long/


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

let lbs = []
let strs = []
for (let i = 0, j = 0; i < dataset.length; i++) {
	if (dataset[i][0] === ">") {
		lbs[j] = dataset[i].substr(1)
	} else {
		strs[j] = dataset[i]
		j++
	}
}

//console.log(strs, strs.length)
const k = 3
let lst = Array(strs.length).fill(-1)
let revl = Array(strs.length).fill(-1)
for (let i = 0; i < strs.length; i++) {
	let str = strs[i]
	let halfs = str.substr(0, str.length / 2 + 1)
	
	for (let j = 0; j < strs.length; j++) {
		if (j === i) continue
		
		let str1 = strs[j]
		let halfs1 = str1.substr( -str1.length / 2 - 1)
		
		//console.log(str, str1)
		//console.log(halfs, halfs1)
		if (str1.indexOf(halfs) === - 1) continue
		if (str.indexOf(halfs1) ===  -1) continue
		
		//console.log("----", i, j)
		lst[j] = i
		revl[i] = j
	}
}

let fin = []

console.log(lst)
console.log(revl)
// lst AGGG GGGC next one
// revl GGGC AGGG prev one
let start
for (let i = 0; i < strs.length; i++) {
	// finding start
	// has no prev one
	// ie revl of [i] of start is null
	if (revl[i] === -1) start = i
}

//console.log("start", start)
let cur = start
let suflens = []
while (true) {
	let next = lst[cur]
	if (next === -1) break
	
	let l1 = strs[cur]
	let l2 = strs[next]
	
	let comp = ""
	
	let max = l2.length / 2 + 1
	
	for (let i = max; i < l2.length; i++) {
		if (l1.indexOf(l2.substr(0, i)) === -1) {
			max = i - 1
			break
		}
	}
	
	suflens[cur] = max
	
	cur = next
}

//console.log(suflens)
let line = ""

cur = start

while (true) {

	let next = lst[cur]
	if (next === -1) {
		let last = strs[cur]
		line += last
		break
	}
	
	let l1 = strs[cur]
	let l2 = strs[next]
	let suflen = suflens[cur]
	
	let sub1 = l1.substr(0, l1.length - suflen)
	
	line += sub1
	
	//console.log("line growth", line)
	cur = next
}

fs.writeFileSync("answer.txt", line)
