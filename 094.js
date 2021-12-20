// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const bf = require("bitfield")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

fs.writeFileSync("answer.txt", "")

console.log = function () {
	fs.appendFileSync("answer.txt", [...arguments].join(" ") + "\n")
}

let str = dataset[0]

let strs = dataset.slice(1)

let itwn = (s1,s2, sofar) => {
	//console.log(s1,s2)
	if(s1.length === 0) {
		let res = []
		for(let i = 0; i < sofar.length; i++) {
			let s0 = sofar[i] + s2
			if(str.indexOf(s0) !== -1) {
				res.push(s0)
			}
		}
		return res.length
	}
	
	if(s2.length === 0) {
		let res = []
		for(let i = 0; i < sofar.length; i++) {
			let s0 = sofar[i] + s1
			if(str.indexOf(s0) !== -1) {
				res.push(s0)
			}
		}
		
		return res.length
	}
	
	let res1 = []
	
	for(let i = 0; i < sofar.length; i++) {
		let s0 = sofar[i] + s1[0]
		
		if(str.indexOf(s0) !== -1) {
			res1.push(s0)
		}
		
	}
	
	let len = 0
	if(res1.length !== 0) {
		len = itwn(s1.substring(1), s2, res1)
	}
	
	let res2 = []
	
	for(let i = 0; i < sofar.length; i++) {
		let s0 = sofar[i] + s2[0]
		
		if(str.indexOf(s0) !== -1) {
			res2.push(s0)
		}
	}
	
	let len2 = 0
	if(res2.length !== 0) {
		len2 = itwn(s1, s2.substring(1), res2)
	}
	
	let res = len + len2
	
	return res
}

let itwn2 = (s1,s2, sofar) => {
	//console.log(s1,s2)
	if(s1.length === 0) {
		let res = []
		for(let i = 0; i < sofar.length; i++) {
			let s0 = sofar[i] + s2
			res.push(s0)
		}
		
		res = [...new Set(res)]
		return res
	}
	
	if(s2.length === 0) {
		let res = []
		for(let i = 0; i < sofar.length; i++) {
			let s0 = sofar[i] + s1
			res.push(s0)
		}
		
		res = [...new Set(res)]
		return res
	}
	
	if(s1.length === 1 && s2.length === 1) {
		let res = []
		
		for(let i = 0; i < sofar.length; i++) {
			let s01 = sofar[i] + s1[0] + s2[0]
			res.push(s01)
			let s02 = sofar[i] + s2[0] + s1[0]
			res.push(s02)
		}
		
		res = [...new Set(res)]
		return res
	}
	let res1 = []
	
	for(let i = 0; i < sofar.length; i++) {
		let s0 = sofar[i] + s1[0]
		
		res1.push(s0)
		
	}
	
	res1 = [...new Set(res1)]
	res1 = itwn2(s1.substring(1), s2, res1)
	
	let res2 = []
	
	for(let i = 0; i < sofar.length; i++) {
		let s0 = sofar[i] + s2[0]
		
		res2.push(s0)
	}
	
	res2 = [...new Set(res2)]
	
	res2 = itwn2(s1, s2.substring(1), res2)
	
	let res = res1.concat(res2)
	res = [...new Set(res)]
	
	return res
}


console.log(str.length)

let M = []
for(let i = 0; i < strs.length; i++) {
	let s1 = strs[i]
	
	if(!M[i]) M[i] = []
	for(let j = 0; j < strs.length; j++) {
		let s2 = strs[j]
		//console.log(s1,s2)
		
		let res = itwn(s1,s2,[""])
		//console.log("res", res, res.length)
		if(res > 0) M[i][j] = 1
		else M[i][j] = 0
	}
}


fs.appendFileSync("answer.txt", M.map(e => e.join(" ")).join("\n"))
