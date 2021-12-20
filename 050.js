// Introduction to Pattern Matching
// rosalind.info/problems/trie/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let ds = ""

let trie = {}
for (let i = 0; i < dataset.length; i++) {
	let s = dataset[i]
	
	place(trie, s)
}

function place(t,s) {
	let lvl = t
	for (let i = 0; i < s.length; i++) {
		let ch = s[i]
		
		if (!lvl[ch]) lvl[ch] = {}
		lvl = lvl[ch]
			
	}
}

//console.log(JSON.stringify(trie))

let taken = 1
function walk(t, prev, symb) {
	
	if (!t || Object.keys(t).length === 0) {
		return []
	}
	
	let lst = []
	
	//console.log("\n\n\n" + JSON.stringify(t))
	//console.log("--------")
	for (k in t) {
		let next = taken + 1
		taken = next
		
		lst.push([prev, next, k])
		
		//console.log("->", prev, next, symb, k)
		//console.log("\n\n\n")
		lst = lst.concat(walk(t[k], next, k))
	}
	
	return lst
}

let l = walk(trie, 1, "")

//l = l.filter(a => a[0] !== 0)
//console.log(l)

fs.writeFileSync("answer.txt", l.map(a => a.join(" ")).join("\n"))

