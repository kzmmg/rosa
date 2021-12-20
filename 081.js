// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")


let s = dataset[0]
let k = +dataset[1]

dataset = dataset.slice(2)

class node {
	constructor(name) {
		this.name = name
		this.kids = {}
		this.namekids = {}
	}
	
	addkid(sub, kid) {
		this.kids[sub] = kid
		this.namekids[kid.getn()] = sub
	}

	setp(par) {
		this.parent = par
		
	}
	
	isroot() {
		return !this.parent
	}
	
	getn() {
		return this.name
	} 
	
	print(tab) {
		if (!tab) tab = 0
		let tabs = [... Array(tab).fill("\t")].join("")
		
		if(this.depth === void 0 || this.leafcount === void 0) {
			console.log(tabs + "am not ready, no depth no leafcount")
			return
		}
		
		console.log(tabs + "me:", this.name)
		console.log(tabs + "at depth:", this.depth)
		if (this.parent) {
			console.log(tabs + "having parent", this.parent.getn())
		} else {
			console.log(tabs + "am root")
		}
		console.log(tabs + "i have", this.countleafs(), "leafs")
		
		for(let k in this.kids) {
			console.log(tabs + "connected via", k, "to:")
			this.kids[k].print(tab + 1)
		}
		
		if(this.isleaf()) {
			console.log(tabs + "am a leaf")
		}
	}
	
	isleaf() {
			return this.kids.length === 0
	}
	
	setd(d) {
		if(!d) d = 0
		
		this.depth = d
		
		for (let k in this.kids) {
			this.kids[k].setd(this.depth + k.length)
		}
	}
	
	getdepth() {
		return this.depth
	}
	
	countleafs() {
		if (this.leafcount !== void 0) return this.leafcount
		
		if(this.isleaf()) {
			this.leafcount = 0
		} else {
			this.leafcount = 0
			for (let k in this.kids) {
				let clc = this.kids[k].countleafs()
				
				if (clc === 0)
					this.leafcount += 1
				else
					this.leafcount += clc
			}
		}
		
		return this.leafcount
	}
	
	findlongestatlk(k) {
		let bag = []
		if (this.leafcount >= k) {
			bag.push(this)
		}
		
		//console.log(this.getn(), bag.length, "  !", k)
		for(let k1 in this.kids) {
			bag = bag.concat(this.kids[k1].findlongestatlk(k))
		}
		
		let max = -1, cand = void 0
		
		//console.log(this.getn(), bag.length, "  !")
		for(let i = 0; i < bag.length; i++) {
			let n = bag[i]
			
			let d = n.getdepth()
			//console.log(n.getn())
			
			if (d > max) {
				max = d
				cand = n
			}
		}
		
		return cand ? [cand] : []
	}
	
	spell(s, ch) {
		if (!s) {
			s = ""
		} 
		
		if(!ch) s = ""
		else {
			let edge = this.namekids[ch]
			
			if (!edge) throw 0
			
			//console.log(">>", edge)
			s = edge + s
		}
		
		if (!this.parent) return s
		
		
		return this.parent.spell(s, this.name)
		
		
	}
}


let ds = {}
let root = {}
for (let i = 0; i < dataset.length; i++) {
	let edge = dataset[i]
	
	//console.log(edge)
	
	edge = edge.split(" ")
	
	//console.log(edge)
	
	let par = edge[0]
	let chi = edge[1]
	let subs = +edge[2]
	let lsub = +edge[3]
	
	let pn
	if (ds[par]) pn = ds[par]
	else pn = new node(par)
	
	let cn
	if (ds[chi]) cn = ds[chi]
	else cn = new node(chi)
	
	ds[par] = pn
	ds[chi] = cn
	
	let sub = s.substr(subs - 1, lsub)
	
	pn.addkid(sub, cn)
	cn.setp(pn)
	
	if(pn.isroot()) root = pn
}

root.setd()
root.countleafs()
//root.print()

let natlk = root.findlongestatlk(k)[0]

//console.log("------", natlk)
let sub = natlk.spell()

let out = sub

console.log(out)
fs.writeFileSync("answer.txt", out)
