
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
		console.log(strs[j].length)
		j++
	}
}

//console.log(strs, strs.length)
const k = 3

function more_than_half(x) {
	if (x % 2 === 0) return x / 2 + 1
	
	return Math.ceil(x/2)
}

function find_suf_len(s1, s2) {
	let start = more_than_half(s2.length)
	
	for (let i = start; i < s2.length; i++) {
		if (s1.indexOf(s2.substr(0, i)) === -1) {
			return i - 1
		}
	}
	return 0
}

let lst = Array(strs.length).fill(-1)
let revl = Array(strs.length).fill(-1)
let suflens = Array(strs.length).fill(0)

for (let i = 0; i < strs.length; i++) {
	let str = strs[i]
	let halfs = str.substr(0, more_than_half(str.length))
	
	let max = 0
	for (let j = 0; j < strs.length; j++) {
		if (j === i) continue
		
		let str1 = strs[j]
		let halfs1 = str1.substr( - more_than_half(str1.length))
		
		//console.log(str, str1)
		//console.log(halfs, halfs1)
		if (str1.indexOf(halfs) === - 1) continue
		if (str.indexOf(halfs1) ===  -1) continue
		
		
		// this is not enough to assume they line up some string may line up via a longer prefix of str
		
		let slen = find_suf_len(str1, str)
		
		console.log("----", i, j, slen)
		if (slen > suflens[j]) {
			suflens[j] = slen
			lst[j] = i
			revl[i] = j
		}
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

//console.log(start)
//console.log(suflens)
let line = ""
let cur = start

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
