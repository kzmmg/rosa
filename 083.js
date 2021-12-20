// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const assert = require("assert")
let dataset = fs.readFileSync("dataset.txt").toString()

dataset = dataset.substring(0, dataset.length - 1)
let glob = 0

let gen = () => { return "Unknown$$$" + glob++ }
class edge {
	constructor(n1,n2) {
		this.node1 = n1
		this.node2 = n2
	}
	
	isinternal() {
		
		//console.log(this.node1.getn(), this.node1.isleaf())
		//console.log(this.node2.getn(), this.node2.isleaf())
		if(this.node1.isleaf() || this.node2.isleaf()) return false
		
		return true
	}
	
	split() {
		let root1 = this.node1.findroot()
		let root2 = this.node2
		
		let taxa1 = root1.gettaxa()
		let taxa2 = root2.gettaxa()
		
		let dif = (s1, s2) => {
			let d = []
			
			for(let i = 0; i < s1.length;i++) {
				if(s2.indexOf(s1[i]) === -1) d.push(s1[i])
			}
		
			return d
		}
		
		taxa1 = dif(taxa1, taxa2)
			
		return [taxa1, taxa2]
	}
	
	rep() {
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
	
	print(t) {
		t = t || 0
		let ts = [...new Array(t).fill("\t")].join("")
		console.log(ts + this.name + ":")
		
		for(let i = 0; i < this.kids.length;i++) {
			this.kids[i].k.print(t+1)
		}
	}
}

let tree = new newicktree()
tree.parse(dataset)

//tree.print()

let res = []

let alltaxa = tree.gettaxa()

alltaxa.sort()
for(let i = 0; i < edges.length; i++) {
	//edges[i].rep()
	
	if(edges[i].isinternal()) {
		//console.log(edges[i].split())
		
		let e = edges[i]
		let s = e.split()
		
		let res0 = []
		
		alltaxa.forEach(t => res0.push(s[0].indexOf(t) === -1 ? 1 : 0))
		
		res.push(res0)
	}
}

let out = res.map(e=>e.join("")).join("\n")
//console.log(out)

fs.writeFileSync("answer.txt", out)
