// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let union = (a,b) => {
	let c = a.concat(b)
	
	return c
}

let rev = (s) => {
	return s.split("").reverse().join("").replace(/T/g, "R").replace(/A/g, "T").
	replace(/R/g, "A").replace(/C/g, "R").replace(/G/g, "C").replace(/R/g, "G")
}

/*let r = []
let rr = []
for(let i = 0; i < dataset.length;i++) {
	r.push(rev(dataset[i]))
	rr.push([dataset[i], rev(dataset[i])])
	rr.push([rev(dataset[i]), dataset[i]])
}*/


//dataset = union(dataset,r)

let l = dataset[0].length - 1

let adj = []
for(let i = 0; i < dataset.length; i++) {
	let kmer = dataset[i]
	
	adj.push(kmer)
}

console.log(adj)


let comp = () => {
	//console.log(circ)
	let init = circ[0][0].substring(0,2)
	
	for(let i = 0; i < circ.length;i++) {
		if (circ[i][1].length) return false
	}
	
	return true
}

let findcand = (w, a) => {
	let cs = []
	
	for(let i = 0; i < a.length;i++) {
		if (a[i].substr(0,l) === w/* || rev(a[i]).substr(0,2) === w*/) {
			cs.push(a[i])
			//console.log(">>>>>", w, a[i])
		}
	}

	return cs
}

let without = (p,c) => {
	let i
	
	for(i = 0; i < p.length; i++) {
		if(p[i] === c) break
	}
	
	return p.slice(0,i).concat(p.slice(i+1))
}

let el = adj[0]
adj = adj.slice(1)
adj.sort()
let circ = [[el, adj]]
//console.log(adj)
// cant use read twice? no!
while(!comp()) {
	//console.log(circ)
	let nucirc = []
	for (let i = 0; i < circ.length; i++) {
		let cur = circ[i]
		let sym = cur[0]
		let pool = cur[1]
		let candidates = findcand(sym.substr(-l), pool)
		
		//console.log("<<<", sym, circ.length, pool.length, pool)
		if(!candidates.length) continue
		
		
		let curs = []
		for (let j = 0; j < candidates.length; j++) {
			let c = candidates[j]
			
			let c0 = c
			//if (sym.substr(-2) !== c.substr(0,2)) c0 = rev(c)
			curs.push([sym + c0.substr(-1), without(pool, c)])
		}
		
		
		//console.log(">curs len", curs.length)
		nucirc = nucirc.concat(curs)
	}
	
	if (nucirc.length) {
		circ = [...new Set(nucirc)]
	}
	
	nucirc = []
	
	for (let i = 0; i < circ.length; i++) {
		let found = false
		for (let j = i + 1; j < circ.length; j++) {
			if (circ[i][0] === circ[j][0]) found = true
		}
		
		if (!found) nucirc.push(circ[i])
	}
	
	circ = nucirc
	
//console.log("c len", circ.length, circ)
}

circ = [...new Set(circ.map(a=>a[0].substring(0, a[0].length - l)))]


fs.writeFileSync("answer.txt", circ.join("\n"))
