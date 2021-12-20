// ((((a,b)c,d)e)u,v,(a1,b1)d1)a2 a d1? 
// reduced to a,b)c,d)e)u,v,(a1,b1)d1
// reduced to ,),)),,(,)
// num clbr without open br 3
// num obr 1 obr mode on
// num clbr after obr 1 obr fixed
// obr mode off
// if obron num unfixed obr + 2 + num clbr
// if obroff  and there was comma after last clbr clbr + 2
// if obroff and no comma last symb num clbr

// Distances in Trees
// rosalind.info/problems/nwck/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let data = []
for(let i = 0; i < dataset.length; i += 3) {
	let tree = dataset[i]
	let pair = dataset[i+1]
	
	data.push([tree, pair.split(" ")])
}

let dists = []

function redt(t, p) {
	let o1 = p[0]
	let o2 = p[1]
	
	let i1 = t.indexOf(o1)
	let i2 = t.indexOf(o2)
	
	console.log(i1,i2)
	console.log(t)
	console.log(o1,o2)
	console.log("=====")
	t = t.substring(Math.min(i1,i2), Math.max(i1,i2))
	console.log(t)
	console.log("++++++++++")
	
	t = t.replace(/[^\(\)\,]*/g, "")
	
	console.log(t)
	console.log("++++++++++")
	
	return t
}

function nwckd(t) {
	let num_cl = 0
	let num_op = 0
	
	let is_p2 = false
	
	if (t.substr(-1) === ",") is_p2 = true
	
	for (let i = 0; i < t.length; i++) {
		let ch = t[i]
		
		if (ch == "(") {
			num_op++
		}
		
		if (ch == ")") {
			if (num_op) num_op--
			else {
				num_cl++
			}
		}
	}
	
	if (num_op) {
		return num_op + num_cl + 2
	}
	
	if (is_p2) {
		return num_cl + 2
	}
	
	return num_cl
}

for (let i = 0; i < data.length; i++) {
	let tree = data[i][0]
	let pair = data[i][1]
	
	tree = redt(tree, pair)
	
	let d = nwckd(tree)
	dists.push(d)
}

console.log(dists)	
fs.writeFileSync("answer.txt", dists.join(" "))
