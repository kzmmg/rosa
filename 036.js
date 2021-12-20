// Enumerating Oriented Gene Orderings
// rosalind.info/problems/sign/

const fs = require("fs")
const bi = require("big-integer")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let n = +dataset[0]

let alist = []
let set = new Set()
for (let i = 1; i < dataset.length; i++) {
	let edge = dataset[i].split(" ").map(a=>+a)
	set.push(edge[0])
	set.push(edge[1])
	alist.push(edge)
}

let vx = [...Array(n).keys()]
let disj = vx.filter(i => !set.has(i))

console.log(disj)



function spe(alr, left) {
	if(!left.length) {
		return [alr.concat([])]
	}
	
	let res = []
	for(let i = 0; i < left.length; i++) {
		let cur = left[i]
		
		let var1 = alr.concat([])
		var1.push(cur)
		let var2 = alr.concat([])
		var2.push(-cur)
		
		let wo = left.slice(0,i).concat(left.slice(i+1))
		
		console.log(var1, wo, left)
		res = res.concat(spe(var2, wo)).
					concat(spe(var1, wo))
	}
	
	return res
}

let all = [...Array(n).keys()].map(a=>a+1)
let alr = []
let res = spe(alr, all)
//console.log(res)

fs.writeFileSync("answer.txt", res.length + "\n" + res.map(a=>a.join(" ")).join("\n"))
