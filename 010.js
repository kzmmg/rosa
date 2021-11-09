// Ordering Strings of Varying Length Lexicographically
// rosalind.info/problems/lexv/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
	
let alph = dataset[0].split(" ")
let k = +dataset[1]

function rec(cur, len) {
	if (cur.length == len) {
		return [cur]
	}
	
	let acc = []
	let newcur, perm
	
	for (let i = 0; i < alph.length; i++) {
		
		newcur = cur.concat(alph[i])
			
		perm = rec(newcur, len)
		acc = acc.concat(perm)
	}
	return acc
}

let psher = []

for (let i = 1; i <= k; i++) {
	psher = psher.concat(rec([],i).map(a => a.join("")))
}

psher.sort((a,b) => {
	//console.log(a,b)
	let lena = a.length
	let lenb = b.length
	
	let minlen = lena > lenb ? lenb : lena
	let suba = a.substr(0, minlen)
	let subb = b.substr(0, minlen)
	
	let res = 100
	
	if (suba === subb) {
		if (lena > lenb) res = 1
		else
			res = -1
	}
	
	if (res == 100) {
		for (let i = 0; i < minlen; i++) {
		
			//console.log("subs", suba, subb)
			//console.log(suba[i], subb[i], alph.indexOf(suba[i]), alph.indexOf(subb[i]))
			if (alph.indexOf(suba[i]) < alph.indexOf(subb[i])) {
				res = -1
				break
			} else if (alph.indexOf(suba[i]) > alph.indexOf(subb[i])) {
				res = 1
				break
			}
		}
	}
	
	if (res == 100) res = 1
	
	//console.log(res)
	
	return res
})

fs.writeFileSync("answer.txt", psher.join("\n"))
