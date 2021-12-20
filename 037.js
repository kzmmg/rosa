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
	set.add(edge[0])
	set.add(edge[1])
	alist.push(edge)
}

let vx = [...Array(n).keys()].map(a=>a+1)
let disj = vx.filter(i => !set.has(i))

//console.log(disj)
//console.log(alist)

let counter = disj.length

console.log(alist.length)
while(alist.length > 0) {
	
	let part = new Set()
	let nualist = []
	let partlen = 0
	
	while (true) {
		
		for(let i = 0; i < alist.length; i++) {
			let item = alist[i]
			
			if (!part.size || part.has(item[0]) || part.has(item[1])) {
				part.add(item[0])
				part.add(item[1])
			}
		}
		
		if (part.size > partlen) {
			partlen = part.size
		} else {
			break
		}
	
	}
	
	for (let i = 0; i < alist.length; i++) {
		let item = alist[i]
		
		if (!part.size || part.has(item[0]) || part.has(item[1])) {
			continue
		} else {
			nualist.push(item)
		}
	}
	
	if(nualist.length !== alist.length) {
		counter++
	}
	
	alist = nualist
}

counter--

fs.writeFileSync("answer.txt", counter)
