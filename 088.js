// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const assert = require("assert")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let taxa = dataset[0].split(" ")
dataset = dataset.slice(1)

let res = []
let desc = (t1,t2) => {
	let res = []
	for(let i = 0; i < t1.length; i++) {
		for(let j = 0; j < t2.length; j++) {
			res.push([t1[i],t2[j]])
		}
	}
	
	return res
}

let totuples = (s) => {
	let t = []
	for(let i = 0; i < s.length;i++)
		for (let j = i+1; j < s.length; j++)
			t.push([s[i],s[j]])
		
	return t
}

for(let i = 0; i < dataset.length;i++) {
	let poq = dataset[i]
	
	if(poq.split("1").length < 3 || poq.split("0").length < 3) continue
	
	let team1 = []
	let team2 = []
	
	for(let j = 0; j < poq.length; j++) {
		if(poq[j] === '1') team1.push(j)
		if(poq[j] === '0') team2.push(j)
	}

	team1 = totuples(team1)
	team2 = totuples(team2)
	
	let prod = desc(team1, team2)
	
	res = res.concat(prod)
}

let print_tuple = (t) => {
	return "{" + taxa[t[0]] + ", " + taxa[t[1]]+ "}"
}

let tts = (t) => {
	t = t.concat([])
	t.sort((a,b)=>a<b)
	
	return t[0]+"/"+t[1]
}

let tsts = (t1,t2)=> {
	t1 = tts(t1)
	t2 = tts(t2)
	
	return t1+"|"+t2
}

res = res.map(e=>tsts(e[0],e[1]))
res.sort()
res = [...new Set(res)]
res = res.map(e=>e.split("|"))
res = res.map(e=>[e[0].split("/"),e[1].split("/")])

let out = res.map(e=>print_tuple(e[0]) + " " + print_tuple(e[1])).join("\n")
fs.writeFileSync("answer.txt", out)
