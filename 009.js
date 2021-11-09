// Enumerating k-mers Lexicographically
// rosalind.info/problems/lexf/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
	
let alph = dataset[0].split(" ")
let k = +dataset[1]

function rec(cur) {
	if (cur.length == k) {
		return [cur]
	}
	
	let acc = []
	let newcur, perm
	
	for (let i = 0; i < alph.length; i++) {
		
		newcur = cur.concat(alph[i])
			
		perm = rec(newcur)
		acc = acc.concat(perm)
	}
	return acc
}

let psher = rec([]).map(a=>a.join(""))
psher = psher.reduce((a,i) => a.concat(a.indexOf(i) !== -1 ? [] : [i]), [])

fs.writeFileSync("answer.txt", psher.join("\n"))
