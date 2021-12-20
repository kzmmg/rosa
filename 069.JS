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

let len = dataset[0].length
let glchr = ""
//exactly two dircycles at some k === full coverage for some k
for (let len0 = len - 1; len0 >=2; len0--) {
	let ds0 = []
	
	for(let i = 0; i < dataset.length;i++) {
		let read = dataset[i]
		
		for (let j = 0; j < read.length - len0 + 1;j++) {
			//console.log(read, j, len0)
			ds0.push(read.substr(j, len0))
		}
	}
	
	let r = []
	let rr = []
	for(let i = 0; i < ds0.length;i++) {
		r.push(rev(ds0[i]))
		rr.push([ds0[i], rev(ds0[i])])
		rr.push([rev(ds0[i]), ds0[i]])
	}

	//console.log(len0, ds0)
	ds0 = union(ds0,r)

	let adj = []
	for(let i = 0; i < ds0.length; i++) {
		let kmer = ds0[i]
		
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

	let nocov = false
	while(!cont()) {
		//console.log(chr)
		//console.log(cur, adj)
		let i
		
		try {
			i = findnext(cur, adj)
		} catch(e) {
			console.log("caught")
			nocov = true
			break
		}
		
		chr += adj[i][0].substr(-1)
		cur = adj[i][1]
		
		adj = remcomp(adj, adj[i])
	}


	if (nocov) {
		continue
	} else {
		glchr = chr
		break
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
}

fs.writeFileSync("answer.txt", glchr)
