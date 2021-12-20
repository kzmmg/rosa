// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let union = (a,b) => {
	let c = a.concat(b)
	
	return [...new Set(c)]
}

let rev = (s) => {
	return s.split("").reverse().join("").replace(/T/g, "R").replace(/A/g, "T").
	replace(/R/g, "A").replace(/C/g, "R").replace(/G/g, "C").replace(/R/g, "G")
}

let r = []
let rr = []
for(let i = 0; i < dataset.length;i++) {
	r.push(rev(dataset[i]))
	rr.push([dataset[i], rev(dataset[i])])
	rr.push([rev(dataset[i]), dataset[i]])
}

dataset = union(dataset,r)

let adj = []
for(let i = 0; i < dataset.length; i++) {
	let kmer = dataset[i]
	
	adj.push([kmer.substring(0, kmer.length - 1),kmer.substring(1), kmer])
}

adj = [...new Set(adj)]

let chr = ""

let remcomp = (a, e) => {
	let nu = []
	
	for (let i = 0; i < a.length;i++) {
		if (a[i][2] === e[2]) continue
		if (a[i][2] === rev(e[2])) continue
		
		nu.push(a[i])
	}

	return nu
}

console.log("<>>", rev("TAATC"))
//console.log(adj.length,adj)
chr += adj[0][0]
let cur = adj[0][1]

adj = remcomp(adj, adj[0])
//console.log(adj.length, cur, adj)

let findnext = (cur, adj) => {
	for(let i = 0; i < adj.length;i++) {
		if(cur === adj[i][0]) return i
	}
	
	console.log([adj.length, cur, adj])
	throw 1
}

let cont = () => {
	let chr0 = chr + chr + chr;
	
	//console.log(chr, adj)
	for (let i = 0; i < adj.length;i++) {
		if (chr0.indexOf(adj[i][2]) == -1 && chr0.indexOf(rev(adj[i][2])) == -1) return false
	}
	
	return true
}

while(!cont() || !adj.length) {
	//console.log(chr)
	console.log(cur, adj)
	let i = findnext(cur, adj)
	
	chr += adj[i][0].substr(-1)
	cur = adj[i][1]
	
	adj = remcomp(adj, adj[i])
}


//console.log(chr)
/*console.log("------")
console.log(a)
console.log(b)
console.log(union(a,b))
console.log(inter(a,b))
console.log(diff(a,b))
console.log(diff(b,a))
console.log(comp(a))
console.log(comp(b))*/


fs.writeFileSync("answer.txt", chr)
