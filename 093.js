// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const bf = require("bitfield")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let startt = new Date().getTime()

let taxa = dataset[0].split(" ")
let taxao = {}

let debug = 0

for(let i = 0; i < taxa.length;i++) {
	taxao[taxa[i]] = i
}

let cur_colors = []

let t1 = dataset[1]
let t2 = dataset[2]

let glob = 0
let globid = 0
let gen = () => { return "$" + glob++ }

class ubtree {
	constructor(name) {
		this.name = name || gen()
		this.id = globid++
		this.ns = []
		this.nso = {}
		
		this.nleaves = new Uint16Array(3)
		
		this.nleaves_counted = [false, false, false]
		
		this.taxao = taxao[this.name]
	}
	
	
	nleaves_c(dir) {
		let dir_idx = this.nso[dir.id]
		
		if(this.nleaves_counted[dir_idx]) {
			return this.nleaves[dir_idx]
		}
		
		if(this.ns.length === 1) {
			if(dir.id === this.ns[0].id) {
				this.nleaves_counted[0] = true
				this.nleaves[0] = 1
				return 1
			}
			else throw "panic"
		}
		
		this.nleaves[dir_idx] = 0
		for(let i = 0; i < this.ns.length; i++) {
			let n = this.ns[i]
			
			if(n.id === dir.id) continue
			
			this.nleaves[dir_idx] += n.nleaves_c(this)
		}
		
		this.nleaves_counted[dir_idx] = true
		
		return this.nleaves[dir_idx]
	}
	
	getn() {
		return this.name
	}
	
	isleaf() {
		return this.ns.length === 1
	}
	
	addn(n) {
		//assert(this.ns.length <= 2)
		this.ns.push(n)
		this.nso[n.id] = this.ns.length - 1
	}
	
	parse(txt) {
		//assert(txt[0]==="(", txt[0])
		//assert(txt.substr(-1)===")", txt.substr(-1))
		
		let strip = txt.substring(1, txt.length - 1)
		
		let subtree = ""
		let cur_tax = ""
		let stack = []
		for(let i = 0; i < strip.length; i++) {
			let ch = strip[i]
			
			if(ch === "(" && !subtree.length) {
				subtree += ch
			}
			
			if(["(", ")", ","].indexOf(ch) === -1 && !subtree) {
				cur_tax += ch
			}
			
			if("," === ch && !subtree.length) {
				let n = new ubtree(cur_tax)
				this.addn(n)
				n.addn(this)
				cur_tax = ""
			}
			
			if(subtree.length && stack.length) {
				subtree += ch
			}
			
			if(subtree.length && ch === "(") {
				stack.push(ch)
			}
			
			if(subtree.length && stack.length && ch === ")") {
				stack.pop()
			}
			
			if(subtree.length && !stack.length) {
				let sub = subtree
				subtree = ""
				
				let n = new ubtree(void 0)
				n.parse(sub)
				this.addn(n)
				n.addn(this)
				i++ // skipping next comma
			}
		}
		
		if(cur_tax) {
			let n = new ubtree(cur_tax)
			this.addn(n)
			n.addn(this)
			cur_tax = ""
		}
	}
	
	getinternalnodes(dir) {
		let inds = []
		
		if(this.ns.length === 3) {
			inds.push(this)
		}
		
		for(let i = 0; i < this.ns.length; i++) {
			let n = this.ns[i]
			
			if(n.name === dir.name) continue
			if(this.forbidden && this.forbidden.name === n.name) continue
			
			let indsn = n.getinternalnodes(this)
			inds = inds.concat(indsn)
		}
		
		return inds
	}
	
	getnodes(dir) {
		let nds = []
		
		nds.push(this)
		
		for(let i = 0; i < this.ns.length; i++) {
			let n = this.ns[i]
			
			if(n.name === dir.name) continue
			if(this.forbidden && this.forbidden.name === n.name) continue
			
			let ndsn = n.getnodes(this)
			nds = nds.concat(ndsn)
		}
		
		return nds
	}
	
	
	print(dir) {
		if(this.ns.length === 1) {
			return this.name
		}
		
		let n
		if(this.name.indexOf("$") !== -1) {
			n = ""
		} else {
			n = this.name
		}
		
		let pv = ")" + n
		
		for(let i = 0; i < this.ns.length;i++) {
			let n = this.ns[i]
			
			if(n.name === dir.name) continue
			if(this.forbidden && this.forbidden.name === n.name) continue
			
			let pv0 = this.ns[i].print(this)
			
			pv = "," + pv0 + pv
		}
		
		pv = pv.substring(1)
		
		pv = "(" + pv
		
		return pv
	}
	
	//v7
	print_dbg(dir,tabs) {
		if(!tabs) tabs = 0
		
		let ts = [...Array(tabs).fill("\t")].join("")
		
		
		console.log(ts + this.name + " " + this.id)
		console.log(ts + "nleaves = " + this.nleaves)
		console.log(ts + "ic = " + this.ic)
		if(this.ns.length === 1) {
			return
		}
		
		for(let i = 0; i < this.ns.length;i++) {
			let n = this.ns[i]
			
			if(n.name === dir.name) continue
			
			this.ns[i].print_dbg(this, tabs + 1)
		}
	}
	
	internaledges(dir) {
		if(this.ns.length === 1 && this.ns[0].name === dir.name) {
			return []
		}
		
		let n1 = this
		
		let ies = []
		for(let i = 0; i < this.ns.length; i++) {
			let n2 = this.ns[i]
			
			if(n2.id === dir.id) continue
			
			if(n2.ns.length !== 3) continue
			
			ies.push({from: n1, to: n2})
			ies.push({from: n2, to: n1})
			
			ies = ies.concat(n2.internaledges(this))
		}
		
		return ies
	}
	
	alledges(dir) {
		if(this.ns.length === 1 && this.ns[0].name === dir.name) {
			return []
		}
		
		let n1 = this
		
		let es = []
		for(let i = 0; i < this.ns.length; i++) {
			let n2 = this.ns[i]
			
			if(n2.id === dir.id) continue
			
			es.push({from: n1, to: n2})
			es.push({from: n2, to: n1})
			
			es = es.concat(n2.alledges(this))
		}
		
		return es
	}
	
	leaves(dir) {
		if(this.cache_idx === void 0) throw "unprepared"
		
		let cache_idx = this.cache_idx
		//console.log(cache_idx, this.id, dir.id)
		if (leaves_cache[cache_idx][this.id] && leaves_cache[cache_idx][this.id][dir.id]) {
			return leaves_cache[cache_idx][this.id][dir.id]
		}
		//if(debug) console.log("got here")
		if(!leaves_cache[cache_idx][this.id]) leaves_cache[cache_idx][this.id] = {}
		
		if(this.ns.length === 1) {
			let ta = new Uint16Array(1)
			ta[0] = taxao[this.name]
			leaves_cache[cache_idx][this.id][dir.id] = ta
			return ta
		}
		
		let ls = void 0
		for(let i = 0; i < this.ns.length; i++) {
			let n = this.ns[i]
			
			if(n.name === dir.name) continue
			if(this.forbidden && this.forbidden.name === n.name) continue
			
			let lsn = n.leaves(this)
			
			if(!ls) {
				ls = lsn
			} else {
				let ls0 = new Uint16Array(lsn.length + ls.length)
				ls0.set(lsn)
				ls0.set(ls, lsn.length)
				ls = ls0
			}
		}
		
		leaves_cache[cache_idx][this.id][dir.id] = ls
		return ls
	}
	
	induced_leavesets() {		
		//assert(this.ns.length === 3)
		
		let n1 = this.ns[0]
		let l1 = n1.leaves(this)
		
		let n2 = this.ns[1]
		let l2 = n2.leaves(this)
		
		let n3 = this.ns[2]
		let l3 = n3.leaves(this)
		
		return [l1,l2,l3]
	}
	
	prepare(dir, len) {
		this.ic = []
		
		this.ic[0] = new Uint16Array(len) // for subtrees born from the edge from first neighbor
		this.ic[1] = new Uint16Array(len) // for subtrees born from the edge from second neighbor
		this.ic[2] = new Uint16Array(len) // for subtrees born from the edge from third neighbor
		
		this.ic[0].fill(2 * taxa.length)
		this.ic[1].fill(2 * taxa.length)
		this.ic[2].fill(2 * taxa.length) // filling it with an unfeasible number will help detect bugs
		
		if(this.ns.length === 1) {
			return
		}
		
		for(let i = 0; i < this.ns.length; i++) {
			let n = this.ns[i]
			
			if(n.id === dir.id) continue
			
			n.prepare(this, len)
		}
	}
	
	set_intersect_direct(dir, st, idx, len) {
		let ic_idx1 = this.nso[dir.id]
		let ic_idx2 = idx
		if(this.ic[ic_idx1][ic_idx2] !== 2 * taxa.length) throw ["double entrance", idx, ic_idx1,ic_idx2, " ====", this.ic]
		this.ic[ic_idx1][ic_idx2] = len
	}
	
	peek_isec_len(dir, idx) {
		let ic_idx1 = this.nso[dir.id]
		let ic_idx2 = idx
		
		return this.ic[ic_idx1][ic_idx2]
	}
	
	intersect(dir, st, idx) {
		let subtree_from = st.from
		let subtree = st.to
		
		let ic_idx1 = this.nso[dir.id]
		let ic_idx2 = idx
		
		// this.ic[ic_idx1][ic_idx2] is our target cell
		
		if(this.ns.length === 1) {
			let st_leaves = subtree.leaves(subtree_from) // needs precompute!
			let this_leave = this.taxao
			if(st_leaves.indexOf(this_leave) === -1) {
				this.ic[ic_idx1][ic_idx2] = 0
			} else {
				this.ic[ic_idx1][ic_idx2] = 1
			}
			return this.ic[ic_idx1][ic_idx2]
		}
		
		// here we can be sure (since subtrees are sorted by .nleaves ASC
		// that all smaller subtrees are already computed
		this.ic[ic_idx1][ic_idx2] = 0
		for(let i = 0; i < this.ns.length; i++) {
			let n = this.ns[i]
			
			if(n.id === dir.id) continue
			
			let selfid = n.nso[this.id]
			
			let num = n.ic[selfid][ic_idx2]
			
			/*if(num === taxa.length * 2) {
				this.print_dbg(dir)
				throw "error somewhere"
			}*/
			
			this.ic[ic_idx1][ic_idx2] += num
		}
		
		return this.ic[ic_idx1][ic_idx2]
	}
	
	propagate_cache_idx(dir,idx) {
		this.cache_idx = idx
		
		for(let i = 0; i < this.ns.length; i++) {
			let n = this.ns[i]
			
			if(n.id === dir.id) continue
			
			n.propagate_cache_idx(this, idx)
		}
	}
	
	rem(dir) {
		let rems = []
		
		for(let i = 0; i < this.ns.length; i++) {
			let n = this.ns[i]
			
			if(n.id === dir.id) continue
			
			rems.push({from:this, to:n})
		}
		
		if(rems.length !== 2) {
			this.print_dbg(dir)
			console.log(rems.length)
			throw "problem"
		}
		
		return rems
	}
}

let leaves_cache = [{}, {}]

glob = 0
globid = 0
let tree1 = new ubtree()
tree1.parse(t1.substring(0, t1.length - 1))

glob = 0
globid = 0
let tree2 = new ubtree()
tree2.parse(t2.substring(0, t2.length - 1))

//console.log(tree1.print(tree1))
//console.log(tree2.print(tree2))

// First,we calculate a matrix that for each pairs of subtrees F ∈ Tand G ∈ T0stores the number of leaves in both trees,|F ∩ G|.This can be achieved in time and space O(n2) [3].
let edges1 = tree1.alledges(tree1)
let edges2 = tree2.alledges(tree2)

for(let i = 0; i < edges1.length; i++) {
	let edge = edges1[i]
	let from = edge.from
	let to = edge.to
	
	to.nleaves_c(from)
}

for(let i = 0; i < edges2.length; i++) {
	let edge = edges2[i]
	let from = edge.from
	let to = edge.to
	
	to.nleaves_c(from)
}

//tree1.print_dbg(tree1)

console.log("\n\n-------------------\n\n")
//tree2.print_dbg(tree2)

console.log(edges1.length, edges2.length)

// 3(n + (n - 2)) = 6n - 6; n=2000 => 12000 - 6 = 11996 subtrees 11996 * 11996 ~ 10k * 10k = 10^10
// incorrect. it is 3n + (n-2)= 4n - 2 n =2000 => 7998 subtrees 7998 * 7998 ~ 8k * 8k = 64kk counts
// 64kk counts where each count is [0...2000] (16 bit = 2 b) 128kkb = 128mb

// incorrect. it is n + 3(n-2) = 4n - 6 => 7994 subtrees size is around the same

// should be not bad

// every directed edge uniquely identifies a subtree it points to
// num(edges ubtree of n leaves) = 2n - 3
// num(of dir edges of ubt of n) = 4n - 6

// prepare for count (init that total 128mb memory where 2000 * 3 = 6000 els = 6000 * 16 = 96000bit = 12000b = 12kb is at every internal node and 4kb = (12/3) is at every leaf
tree1.prepare(tree1, 4 * taxa.length - 6)
//tree2.prepare(tree2, 4 * taxa.length - 6)

//get subtrees from tree1 sorted by the number of leaves in ASC
//get same for tree2

let subs1 = edges1
let subs2 = edges2

// to each edge add third property (apart from .from and .to) called .nleaves

for(let i = 0; i < edges1.length; i++) {
	let edge = edges1[i]
	let from = edge.from
	let to = edge.to
	
	edge.nleaves = to.nleaves[to.nso[from.id]]
}

for(let i = 0; i < edges2.length; i++) {
	let edge = edges2[i]
	let from = edge.from
	let to = edge.to
	
	edge.nleaves = to.nleaves[to.nso[from.id]]
}

edges1.sort((a,b) => a.nleaves - b.nleaves)
//edges2.sort((a,b) => a.nleaves - b.nleaves)

//console.log(edges1)
//console.log(edges2)

tree1.propagate_cache_idx(tree1, 0)
tree2.propagate_cache_idx(tree2, 1)


for(let i = 0; i < edges1.length; i++) {
	let edge = edges1[i]
	let from = edge.from
	let to = edge.to
	
	let l = to.leaves(from)
	if(l.length !== edge.nleaves) throw "problem"
}

console.log("computed leaves for the first tree", 
				taxa.length, 
				2*taxa.length - 2, 
				Object.keys(leaves_cache[0]).length)

for(let i = 0; i < edges2.length; i++) {
	let edge = edges2[i]
	let from = edge.from
	let to = edge.to
	
	let l = to.leaves(from)
	if(l.length !== edge.nleaves) throw "problem"
}

console.log("computed leaves for the second tree", 
				taxa.length, 
				2*taxa.length - 2, 
				Object.keys(leaves_cache[1]).length)

// now start counting intersections
let tree2_address = {}
for(let i = 0; i < edges2.length; i++) {
	let subtree = edges2[i]
	
	if(!tree2_address[subtree.to.id]) tree2_address[subtree.to.id] = {}
	
	tree2_address[subtree.to.id][subtree.from.id] = i
}

console.log("to intersections")

let intersect = (st1, st2, i) => { return st1.to.intersect(st1.from, st2, i) }

//debug = 1
for(let i = 0; i < edges1.length; i++) {
	let subtree1 = edges1[i]
	for(let j = 0; j < edges2.length; j++) {
		let subtree2 = edges2[j]
		
		//console.log(i,j, "nleaves", subtree1.nleaves)
		intersect(subtree1, subtree2, j)
		//set_intersect_len(subtree2, subtree1, i, len)
	}
}
console.log("intersected all subtrees of first tree with subtrees of second")

console.log("stopping now, elapsed = ", ((new Date().getTime()) - startt) / 1000, "sec")
//throw 0
/*for(let i = 0; i < edges2.length; i++) {
	let subtree2 = edges2[i]
	for(let j = 0; j < edges1.length; j++) {
		let subtree1 = edges1[j]
		
		intersect(subtree2, subtree1, j)
	}
}*/

console.log("intersected all subtrees of second tree with subtrees of first")

//tree1.print_dbg(tree1)
//console.log("\n+---------------------------+\n")
//tree2.print_dbg(tree2)


// break here

//Next, for each pair of inner nodes, v ∈ T, v0 ∈ T' with sub-trees Fi , i = 1, . . . , dv and Gj , j = 1, . . . , dv' , respectively, we calculate a matrix, I, such that I[i, j] = |Fi∩Gj|.

leaves_cache = []

let internaledges1 = tree1.internaledges(tree1)
let internaledges2 = tree2.internaledges(tree2)
	
//console.log(internaledges1.map(e=>e.from.name + " "+ e.to.name))
//let DS = []
let dist = 0

let L = (st1, st2) => {
	let address = tree2_address[st2.to.id][st2.from.id]
	let len = st1.to.peek_isec_len(st1.from, address)
	//console.log("lookup isec len", st1.from.name, st1.to.name, st2.from.name, st2.to.name, len)
	
	return len
}

for(let i = 0; i < internaledges1.length; i++) {	
	let F1 = {from: internaledges1[i].to, to:internaledges1[i].from}
	let rem = internaledges1[i].to.rem(internaledges1[i].from)
	let F2 = rem[0]
	let F3 = rem[1]
	
	for(let j = 0; j < internaledges2.length; j++) {
		
		let G1 = {from: internaledges2[j].to, to:internaledges2[j].from} 		//--------------+,
		let rem = internaledges2[j].to.rem(internaledges2[j].from)				//				 |
 		let G2 = rem[0] 														//                > claim
		let G3 = rem[1] 														//--------------+/
		
		
		let dist0 = dist
		dist += L(F1, G1) * 
						(  L(F1,G2) * L(F2,G1) * L(F3,G3) + 
							L(F1,G3) * L(F2,G1) * L(F3,G2) + 
							L(F1,G2) * L(F3,G1) * L(F2,G3) + 
							L(F1,G3) * L(F3,G1) * L(F2,G2) )
		
		//if(dist0 > dist) throw "overflow"
		//console.log("-------------------------", dist)
	}
	
}

console.log(dist)
//tree1.print_dbg(tree1)
//tree2.print_dbg(tree2)
console.log("stopping now, elapsed = ", ((new Date().getTime()) - startt) / 1000, "sec")
//while(true) {}
//throw "stop here"


let out = dist / 2
console.log(out)
fs.writeFileSync("answer.txt", out)
