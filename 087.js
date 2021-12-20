// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const assert = require("assert")
let dataset = fs.readFileSync("dataset.txt").toString().split(" ")

//An unrooted binary tree on n labeled leaves can be formed by connecting the nth leaf to a new node in the middle of any of the edges of an unrooted binary tree on n − 1 labeled leaves.  -- wiki

let glob = 0

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
		
		if(this.name.indexOf("$$$") === -1) taxa.push(this.name)
			
		for(let i = 0; i < this.kids.length; i++) {
			taxa = taxa.concat(this.kids[i].k.gettaxa())
		}
		
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

let attach_to_every_edge = (tree, taxon) => {
	let edges = tree.getalledges()
	
	let trees = []
	for(let i = 0; i < edges.length;i++) {
		let edge = edges[i]
		
		trees.push(edge.split(taxon))
	}
	
	return trees
}	

let en = (sofar, lefttaxa) => {
	if(lefttaxa.length === 0) {
		return sofar
	}
	
	//sofar.forEach(e=>console.log(e.print()))
	
	let tot = []
	let tco = lefttaxa.concat([])
	let cta = tco.pop()
	for(let i = 0; i < sofar.length; i++) {
		let tree = sofar[i]
		tot = tot.concat(attach_to_every_edge(tree, cta))
	}
	
	return en(tot, tco)
}

//dataset = "dog cat mouse".split(" ")

console.log(dataset)

let taxon1 = dataset.shift()
let taxon2 = dataset.shift()
let taxon3 = dataset.shift()

let tree = new newicktree(taxon1, void 0)
let unnamed = new newicktree("$", tree)

let edg = new edge(tree, unnamed)
tree.addkid({e:edg,k:unnamed})

let taxonleaf2 = new newicktree(taxon2, unnamed)

edg = new edge(unnamed, taxonleaf2)
unnamed.addkid({e:edg,k:taxonleaf2})

let taxonleaf3 = new newicktree(taxon3, unnamed)

edg = new edge(unnamed, taxonleaf3)
unnamed.addkid({e:edg,k:taxonleaf3})

console.log(tree.print())

let trees = en([tree], dataset)

let out = trees.map(e=>e.print() + ";").join("\n")
fs.writeFileSync("answer.txt", out)
