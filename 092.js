// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const assert = require("assert")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let taxa = dataset[0].split(" ")

let t1 = dataset[1]
let t2 = dataset[2]

let glob = 0

let diff = (s) => {
	let d = []
	
	let so = {}
	
	for(let i = 0; i < s.length; i++) {
		so[s[i]] = 1
	}
	
	for(let i = 0; i < taxa.length; i++) {
		if(!so[i]) d.push(i)
	}

	return d
}

let taxao = {}

for(let i = 0; i < taxa.length;i++) {
	taxao[taxa[i]] = i
}

let tcache = {}
let gen = () => { return "Unknown$$$" + glob++ }
class edge {
	constructor(n1,n2) {
		this.node1 = n1
		this.node2 = n2
	}
	
	isinternal() {
		assert(!this.abandoned)
		
		//console.log(this.node1.getn(), this.node1.isleaf())
		//console.log(this.node2.getn(), this.node2.isleaf())
		if(this.node1.isleaf() || this.node2.isleaf()) return false
		
		return true
	}
	
	modelsplit() {
		let n2t = this.node2.gettaxa()
		
		//console.log(n1t,n2t)
		//throw 1
		
		//console.log(taxa)
		//console.log(n1t,n2t)
		return n2t
	}
	
	splitoncopy(taxon) {
		assert(!this.abandoned)
		
		let n1 = this.node1
		let n2 = this.node2
		
		let unnamed = new newicktree(gen(), n1)
		let ttree = new newicktree(taxon, unnamed)
				
		n1.replacekid(n2, unnamed)
		
		n2.setparent(unnamed)
		unnamed.addkid({e:new edge(unnamed, n2), k:n2})
		unnamed.addkid({e:new edge(unnamed, ttree), k:ttree})
		
		this.abandon()
		
		return n1.findroot()
	}
	
	abandon() {
		assert(!this.abandoned)
		this.abandoned = true
	}
	
	split(taxon) {
		assert(!this.abandoned)
		let n1 = this.node1
		let n2 = this.node2
		
		let root = n1.findroot()
		let copy = root.copytree()
		
		//console.log("copy:", copy.print())
		
		return copy.findedge(n1,n2).splitoncopy(taxon)
	}
	
	rep() {
		assert(!this.abandoned)
		console.log(this.node1.getn(), "<->", this.node2.getn(), this.isinternal())
	}
}

let edges = []
class newicktree {
	constructor(name, par) {
		this.name = name || gen()
		this.kids = []
		this.parent = par
	}
	
	replacekid(old, nu) {
		let nuedge = new edge(this, nu)
		let old_name = old.getn()
		
		for(let i = 0; i < this.kids.length; i++) {
			let kid = this.kids[i]
			
			if(kid.k.getn() === old_name) this.kids[i] = {e:nuedge, k:nu}
		}
	}
	
	setparent(p) {
		this.parent = p
	}
	
	copytree(par) {
		let selfcopy = new newicktree(this.name, par)
		
		for(let i = 0; i < this.kids.length; i++) {
			let kid = this.kids[i]
			
			let k = kid.k
			let e = kid.e
			
			k = k.copytree(selfcopy)
			e = new edge(selfcopy, k)
			selfcopy.addkid({k: k, e:e})
		}
		
		return selfcopy
	}
	
	findedge(n1, n2) {
		for(let i = 0; i < this.kids.length; i++) {
			let e = this.kids[i].e
			
			if(e.node1.getn() === n1.getn() && e.node2.getn() === n2.getn()) return e
			
			e = this.kids[i].k.findedge(n1,n2)
			
			if(e) return e
		}
		
		return void 0
	}
	
	findroot() {
		if(this.parent === void 0) {
			return this
		}
		
		return this.parent.findroot()
	}
	
	gettaxa() {
		let taxa = []
		
		if(tcache[this.name]) {
			//console.log("cache hit")
			return tcache[this.name]
		}
		
		if(this.name.indexOf("$$$") === -1) taxa.push(taxao[this.name])
			
		for(let i = 0; i < this.kids.length; i++) {
			let kid = this.kids[i].k
			
			let kidtaxa
			
			if(tcache[kid.name]) {
				kidtaxa = tcache[kid.name]
			} else {
				kidtaxa = this.kids[i].k.gettaxa()
				tcache[kid.name] = kidtaxa
			}
			taxa = taxa.concat(kidtaxa)
		}
		
		tcache[this.name] = taxa
		return taxa
	}
	
	getn() {
		return this.name
	}
	
	isleaf() {
		return this.kids.length === 0 || (this.parent === void 0 && this.kids.length === 1)
	}
	
	addkid(kid) {
			this.kids.push(kid)
	}
	
	parse(txt) {
		assert(txt[0]==="(", txt[0])
		assert(txt.substr(-1)===")", txt.substr(-1))
		
		let strip = txt.substring(1, txt.length - 1)
		
		let subtree = ""
		let cur_tax = ""
		let stack = []
		for(let i = 0; i < strip.length; i++) {
			let ch = strip[i]
			//console.log(strip.substring(0,i)+"["+strip.substring(i,i+1)+"]"+strip.substring(i+1))
			
			if(ch === "(" && !subtree.length) {
				//console.log("starting subtree")
				subtree += ch
			}
			
			if(["(", ")", ","].indexOf(ch) === -1 && !subtree) {
				//console.log("adding to taxon")
				cur_tax += ch
			}
			
			if("," === ch && !subtree.length) {
				//console.log("parsed taxon", cur_tax)
				let kid = new newicktree(cur_tax, this)
				let edg = new edge(this, kid)
				edges.push(edg)
				this.addkid({e:edg,k:kid})
				cur_tax = ""
			}
			
			if(subtree.length && stack.length) {
				//console.log("adding to subtree")
				subtree += ch
			}
			
			if(subtree.length && ch === "(") {
				//console.log("putting to stack", stack)
				stack.push(ch)
			}
			
			if(subtree.length && stack.length && ch === ")") {
				stack.pop()
				//console.log("popping from stack", stack)
			}
			
			if(subtree.length && !stack.length) {
				let sub = subtree
				subtree = ""
				
				let kid = new newicktree(void 0, this)
				kid.parse(sub)
				let edg = new edge(this, kid)
				edges.push(edg)
				this.addkid({e:edg,k:kid})
				i++ // skipping next comma
			}
		}
		
		if(cur_tax) {
			//console.log("parsed taxon", cur_tax)
			let kid = new newicktree(cur_tax)
			let edg = new edge(this, kid)
			edges.push(edg)
			this.addkid({e:edg,k:kid})
			cur_tax = ""
		}
	}
	
	getleafedges() {
		if(this.kids.length === 0) return []
		
		let tot = []
		for(let i = 0; i < this.kids.length;i++) {
			let kid = this.kids[i]
			let e = kid.e
			
			if(!e.isinternal()) tot.push(e)
			tot = tot.concat(kid.k.getleafedges())
		}
		
		return tot
	}
	
	getinternaledges() {
		if(this.kids.length === 0) return []
		
		let tot = []
		for(let i = 0; i < this.kids.length;i++) {
			let kid = this.kids[i]
			let e = kid.e
			
			if(e.isinternal()) tot.push(e)
			tot = tot.concat(kid.k.getinternaledges())
		}
		
		return tot
	}
	
	getalledges() {
		if(this.kids.length === 0) return []
		
		let tot = []
		for(let i = 0; i < this.kids.length;i++) {
			let kid = this.kids[i]
			let e = kid.e
			
			tot.push(e)
			tot = tot.concat(kid.k.getalledges())
		}
		
		//console.log("tot edges", tot.length)
		return tot
	}
	
	print() {
		if(this.kids.length === 0) return this.name
		let n
		if(this.name.indexOf("$") !== -1) n = ""
		else n = this.name
		
		let pv = ")" + n
		
		for(let i = 0; i < this.kids.length;i++) {
			let pv0 = this.kids[i].k.print()
			pv = "," + pv0 + pv
		}
		
		pv = this.kids.length > 0 ? pv.substring(1) : pv
		
		pv = "(" + pv
		
		return pv
	}
}


let tree1 = new newicktree()
let tree2 = new newicktree()

tree1.parse(t1.substring(0, t1.length - 1))
tree2.parse(t2.substring(0, t2.length - 1))

let inter1 = tree1.getinternaledges()
let inter2 = tree2.getinternaledges()

console.log("internals processed")

let splits1 = []

for(let i = 0; i < inter1.length;i++) {
	//console.log(i)
	splits1.push(inter1[i].modelsplit())
}

let splits2 = []

tcache = {}

for(let i = 0; i < inter2.length;i++) {
	splits2.push(inter2[i].modelsplit())
}
console.log("splits formed")
let s = 0


let aeq = (a1,a2) => {
	let a2o = {}
	for(let i = 0; i < a2.length; i++) {
		a2o[a2[i]] = 1
	}
	for(let i = 0; i < a1.length; i++)
		if(!a2o[a1[i]]) return false
	
	return true
}

let spleq = (s1,s2) => {
	//console.log("+=======")
	//console.log(s1)
	//console.log(s2)
	let len1 = s1.length
	let len2 = s2.length
	
	let len_c1 = taxa.length - len1
	let len_c2 = taxa.length - len2
	
	if(len1 !== len2 && len1 !== len_c2) return false
	
	if(len1 !== len2) {
		len2 = len_c2
		s2 = diff(s2)
	}

	if(aeq(s1, s2)) {
		return true
	}
}


console.log("splits lens", splits1.length, splits2.length)
console.log("taxa len", taxa.length)
for(let i = 0; i < splits1.length; i++) {
	for(let j = 0; j < splits2.length; j++) {
		//console.log(splits1[i])
		//console.log(splits2[j])
		//console.log(i,j)
		
		//if(j % 2500 === 0) console.log(i,j)
		if(spleq(splits1[i], splits2[j])) s++
	}
}

//console.log(tree1.print())
//console.log(tree2.print())
console.log(s)
let out = 2 * (taxa.length - 3) - 2 * s
console.log(out)
//fs.writeFileSync("answer.txt", out)
