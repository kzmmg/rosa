// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const assert = require("assert")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let s = dataset[0]

let glob_counter = 0
let gen_node_name = () => {
	return (glob_counter++)
}


let i
let ch

const cur = -1

class edge {
	constructor(n1,n2, w) {
		this.node1 = n1
		this.node2 = n2
		this.word = w
	}
	
	isfinalized() {
		assert(!this.abandoned)
		
		return this.finalized
	}
	
	finalize() {
		assert(!this.abandoned)
		
		if(this.word[1] === cur) {
			this.word[1] = i
		}
		
		this.finalized = true
	}
	
	realize_word() {
		assert(!this.abandoned)
		
		let p1 = this.word[0]
		
		let p2
		if(this.word[1] === cur) {
			p2 = i
		} else {
			p2 = this.word[1]
		}
		
		return s.substring(p1, p2 + 1)
	}
	
	realize() {
		assert(!this.abandoned)
		
		if(this.word[1] === cur) {
			this.word[1] = i
		}
	}
	
	getn1() {
		assert(!this.abandoned)
		
		return this.node1
	}
	
	getn2() {
		assert(!this.abandoned)
		
		return this.node2
	}
	
	getword() {
		assert(!this.abandoned)
		
		return this.word
	}
	
	split(pointer) {
		assert(!this.abandoned)
		/* (n1)---------------->(n2) 
				|
				|
				v
			(n1)----->(n3)----->(n2)
		
		*/
		
		let w = this.word
		
		let w1 = [w[0],w[0] + pointer - 1]
		let w2 = [w[0] + pointer, w[1]] // w[1] may be "#" (cur) but we dont care
		
		let n1 = this.node1
		let n2 = this.node2
		
		let split_node_name = gen_node_name()
		let split_node_parent = n1
		let split_node = new node(split_node_parent,split_node_name);
		
		let edge_to_split_node = new edge(n1, split_node, w1)
		edge_to_split_node.finalize() // internal edges are finalized (realized) on split!
		split_node.sete(edge_to_split_node)
		
		n1.replace_kid(n2, split_node)
		
		let edge_from_split_node = new edge(split_node, n2, w2)
		n2.update_parent(split_node)
		n2.sete(edge_from_split_node)
		split_node.addkid(edge_from_split_node, n2)
		
		// if this edge we are splitting is ITSELF finalized then edge_from_split_node must
		// also be finalized: test case: GTGGGGCGGGATGGGGA$
		
		if(this.isfinalized()) {
			edge_from_split_node.finalize()
		}
		
		
		/* (n1)-[w1]-->(n3)-[w2]->(n2)
				|
				|
				v
		   (n1)-[w1]-->(n3)-[w2]->(n2)
						|
		                 `------->(n4)
		
		*/
		
					
		let nu_leaf = new node(split_node, gen_node_name())
		let edge_to_nu_leaf = new edge(split_node, nu_leaf, [i, cur])
					
		// edges to leafs are never finalized
					
		nu_leaf.sete(edge_to_nu_leaf)
		split_node.addkid(edge_to_nu_leaf, nu_leaf)
		
		this.abandon()
		
		return {
			edge_to_split_node: edge_to_split_node,
			edge_from_split_node: edge_from_split_node,
			split_node: split_node,
			
			nu_leaf: nu_leaf,
			edge_to_nu_leaf: edge_to_nu_leaf
		}
	}
	
	abandon() {
		assert(!this.abandoned)
		
		this.abandoned = true
	}
	
	//....for tests
	realize_word_for_print() {
		assert(!this.abandoned)
		
		let p1 = this.word[0]
		let flag = false
		let p2
		if(this.word[1] === cur) {
			p2 = i
			flag = true
		} else {
			p2 = this.word[1]
		}
		let real = s.substring(p1, p2 + 1) + (flag ? "(unrealized)" : "")
		
		return real
	}
}

class node {
	constructor(par, name, edge) {
		this.name = name
		this.parent = par
		this.edgetop = edge
		this.kids = []
		this.namekids = {}
		this.fltredges = {}
		this.outgoingedges = []
		this.outgoingedgesbyidx = {}
		
		this.suffixlinkfrom = void 0
		this.suffixlinkto = void 0
		this.depth = void 0
	}
	
	setdepth(d) {
		throw "computed automatically"
	}
	
	getdepth() {
		return this.depth
	}
	
	isinternal() {
		return this.parent && this.kids.length > 0 || !this.parent
	}
	
	addsuffixlinkfrom(node) {
		this.suffixlinkfrom = node
	}
	
	addsuffixlinkto(node) {
		this.suffixlinkto = node
	}
	
	update_parent(p) {
		this.parent = p
	}
	
	findedge(subs) {
		if (!subs) {
			return this.outgoingedges
		}
		
		return this.fltredges[subs]
	}
	
	alledges() {
		return this.kids.map(k => k.edge.realize_word())
	}
	
	replace_kid(old, nu) {
		let k = this.kids
		let old_kid_name = old.getn()
		let nu_kid_name = nu.getn()
		
		let i
		
		let old_kid = this.namekids[old_kid_name]
		
		let pos = old_kid[1]
		
		k[pos] = {kid: nu, edge: nu.getpedge()}
		
		delete this.namekids[old_kid_name]
		this.namekids[nu_kid_name] = [nu,pos]
		
		// we only replace kids with the same letter
		let old_edge_name = s[old.getpedge().getword()[0]]
		let nu_edge_name = s[nu.getpedge().getword()[0]]
		
		assert(old_edge_name === nu_edge_name, [old_edge_name, nu_edge_name])
		
		this.fltredges[old_edge_name] = nu.getpedge()
		
		let old_rw = old.getpedge().realize_word()
		let nu_rw = nu.getpedge().realize_word()
		let idx = this.outgoingedgesbyidx[old_rw]
		delete this.outgoingedgesbyidx[old_rw]
		this.outgoingedgesbyidx[nu_rw] = idx
		this.outgoingedges[idx] = nu_rw
	}
	
	sete(e) {
		this.edgetop = e
	}
	
	getfullway() {
		assert(this.isinternal(), this.name)
		
		return  this.fullway
	}
	
	
	addkid(edge, kid) {
		assert(this.parent && this.getpedge().isfinalized() || !this.parent)
		
		if(this.depth === void 0) {
			//console.log("depth counting for internal node", this.getn())
			let wordlen = this.parent ? this.getpedge().getword()[1] + 1 - this.getpedge().getword()[0] : 0
			this.depth = this.parent ? (this.parent.getdepth() + wordlen) : 0;
		}			
		
		this.kids.push({edge:edge,kid:kid})
		
		let len = this.kids.length
		let pos = len - 1
		this.namekids[kid.getn()] = [kid, pos]
		
		//"The substring labels for the edges leading down from a node to its children must begin with different symbols."
		assert(!this.fltredges[s[edge.getword()[0]]], [edge.realize_word(), kid.getn()])
		
		this.fltredges[s[edge.getword()[0]]] = edge
		
		let rw = edge.realize_word()
		this.outgoingedges.push(rw)
		this.outgoingedgesbyidx[rw] = this.outgoingedges.length - 1
	}
	
	getn() {
		return this.name
	}
	
	getp() {
		return this.parent
	}
	
	getpedge() {
		return this.edgetop
	}
	
	realize() {
		let k = this.kids
		
		for(let i = 0; i < k.length; i++) {
			let k0 = k[i]
			k0.edge.realize()
			k0.kid.realize()
		}
	}	

	json(tab) {
		let obj = {}
		for(let k in this.kids) {
			let word = this.kids[k].edge.realize_word_for_print()
			obj[word] = this.kids[k].kid.json()
		}
		
		return obj
	}	
	
	edges_print(acc) {
		for(let i = 0; i < this.kids.length;i++) {
			let w = this.kids[i].edge.realize_word().replace(/\$/g, "")
			acc[0] += w.length
			
			this.kids[i].kid.edges_print(acc)
			//console.log(w)
		}
		
		return acc
	}
}

class active_point {
	constructor(root, sq) {
		this.root = root
		
		this.active_node = root
		this.active_edge = void 0
		this.active_length = 0
		
		this.sq = sq
	}
	
	is_on_root() {
		return this.active_node === this.root
	}
	//abcdefabxybcdmnabcdeabcdefabxybcdmnabcdexxabcdefabxybcdmnabcdeab$
	adjust_active_edge(offs) {
		//console.log("We are in the adj function for adjustment (dfs)")
		this.print()
		let ltr = this.active_edge
		let len = this.active_length
		
		let e = this.find_active_edge(ltr)
		
		if (!e && len > 0) { // abnormal
			throw [len, i, this.print(), e, this.sq.peekword()]
		} else if (!e) {
			this.active_length = 0 // it is 0 already, j.t.b explicit
			this.active_edge = void 0
			return
		}

		let w = (e.getword()[1] >= 0 ? e.getword()[1] : i) - e.getword()[0] + 1
		//console.log("Adjustment for rule1, w.length =", w, "active_length =", this.active_length)
		
		if (w < len) {
			let peek = this.sq.peekword()
			let d = this.active_node.getdepth()
			
			while(w <= len) {
				len -= w
				
				this.active_node = e.getn2()
				this.active_length = len
				
				if(len === 0) {
					this.active_edge = void 0
					break
				}
				
				d = this.active_node.getdepth()
				let peekl = peek.substring(d)
				
				this.active_edge = peekl[0]
				
				e = this.active_node.fltredges[this.active_edge]
				
				w = (e.getword()[1] >= 0 ? e.getword()[1] : i) - e.getword()[0] + 1
			}
			
			return
		} else if (w === len) {
			//console.log("Adjustment... switching to next node (suffices for the case)")
			this.print()
			
			this.active_node = e.getn2()
			this.active_length = 0
			this.active_edge = void 0
		} else {
			return // recursion stopper
		}
	}	
	decrement_active_length() {
		assert(this.active_length > 0)
		
		this.active_length--
		
		if(this.active_length === 0) {
			this.active_edge = void 0
		}
	}
	
	decrement_rule1() {
		assert(this.active_length > 0, this.active_length)
		assert(this.is_on_root())
		
		this.decrement_active_length()
		
		let peek = this.sq.peek()
		if(this.active_length > 0) {
			//console.log("peeking", peek, "for suffix", this.sq.peekword(), this.sq.acc)
			this.active_edge = peek
		} else {
			this.active_edge = void 0
		}
	
		let e = this.find_active_edge()
		
		if(Array.isArray(e)) return // ??
		if(!e.isfinalized()) return
		
		let w = e.getword()
		//console.log("Rule1 potential flip situation. Edge(word) = ", w, "from node(root)=", this.active_node.getn())
		//console.log("Active length = ", this.active_length)
		if(this.active_length >= w[1] - w[0] + 1) {
			//console.log("Adjusting active_edge...")
			this.adjust_active_edge(this.active_node.getdepth())
		}
	}
	
	follow_suffix_link_or_set_to_root_rule3() {
		let n = this.active_node
		
		let l = n.suffixlinkto
		
		if(l) {
			this.active_node = l
		} else {
			this.active_node = this.root
		}
		
		//console.log(n.getn(), this.active_node.getn())
		
		// adjustment for "link leads to internal node with short edge" case
		
		let e = this.find_active_edge()
		
		if (Array.isArray(e)) return
		if (!e.isfinalized()) return
		
		let w = this.find_active_edge() && this.find_active_edge().getword()
		
		//console.log("Rule3 potential flip situation. Edge(word) =", w, "from node =", this.active_node.getn())
		//console.log("Rule3 potential flip situation. Suffix(peek) =", this.sq.peekword(), "active_length =", this.active_length)
		if(this.active_length >= w[1] - w[0] + 1) {
			//console.log("Adjusting active_edge...")
			this.adjust_active_edge(this.active_node.getdepth())
		}
	}
	
	increment_active_length() {
		if(!this.active_edge) {
			this.active_edge = ch
		}
		
		let e = this.active_node.findedge(this.active_edge)
		
		assert(!Array.isArray(e))
		//console.log(e.realize_word(), e.isfinalized(), this.active_node.getn(), e.getn2().getn(), "inside increment active length")
		if(!e.isfinalized()) {
			this.active_length++
			return
		} // cannot flip unrealized edges
		
		let word = e.realize_word()
			
		//console.log("flip situation", word, this.active_length + 1)	
		
		if(word.length <= this.active_length + 1) {
			this.active_length = 0
			this.active_edge = void 0
			this.active_node = e.getn2()
		} else {
			this.active_length++
		}
	}
	
	generate_from_active_node() {
		let leaf = new node(this.active_node, gen_node_name())
		let edg = new edge(this.active_node, leaf, [i, cur])
		leaf.sete(edg)
		this.active_node.addkid(edg, leaf)
	}
	
	find_active_edge(ch) {
		let ltr = ch || this.active_edge 
		
		return this.active_node.findedge(ltr)
	}
	
	is_ch_already_present_at_active_node() {
		return this.active_node.fltredges[ch] != void 0 || this.active_length !== 0
	}
	
	is_goes_along_active_edge() {
		let e = this.find_active_edge()
		
		if(Array.isArray(e)) return true
		
		let w = e.getword()
		
		let l = this.active_length
		
		let lc = s[w[0] + l]
		
		return lc === ch
	}
	
	split_active_edge() {
		let e = this.find_active_edge()
		
		assert(!Array.isArray(e), e)
		
		let res = e.split(this.active_length)
		
		return res.split_node
	}
	
	print() {
		//console.log("(", this.active_node.getn(), ",", this.active_edge, ",", this.active_length, ")")
	}
}

class squeue_ {
	constructor() {
		this.acc = []
	}
	
	add() {
		this.acc.push(i)
	}
	
	get() {
		let sfx = this.acc.shift()
		let sub = s.substring(sfx, i + 1)
		
		return sub
	}
	
	peek() {
		return s.substr(this.acc[0], 1)
	}
	
	peekword() {
		//console.log(this.acc[0], i)
		return s.substring(this.acc[0], i + 1)
	}
}

class needslink {
	constructor() {
		this.node = void 0
	}
	
	del() {
		this.node = void 0
	}
	
	get() {
		return this.node
	}
	
	set(n) {
		//console.log("Needs link is set to", n.getn())
		this.node = n
	}
	
	is() {
		return this.node !== void 0
	}
}

let bst = (s) => {	
	i = 0
	ch = 0
	glob_counter = 0
	fullways = {}
	fullways_a = []
	
	let remainder = 0
	
	let root = new node(void 0, gen_node_name(), void 0)
		
	let squeue = new squeue_()
	let ap = new active_point(root, squeue)
	
	
	let rule1 = (first_ltr_of_next_sfx) => {
		if(!ap.is_on_root()) return
		
		//console.log("Rule1 invoked. Split from root")
		
		ap.decrement_rule1()
		
		return true
	}
	
	let needs_link = new needslink()
	let rule2 = (node_to_link) => {
		if(!needs_link.is()) {
			needs_link.set(node_to_link)
			return
		}
		
		//console.log("Rule2 invoked. needs_link = ", needs_link.get().getn(), "node_to_link =", node_to_link.getn())
		let last_added = needs_link.get()
		let newly_added = node_to_link
		
		last_added.addsuffixlinkto(newly_added)
		newly_added.addsuffixlinkfrom(last_added)
		
		needs_link.set(node_to_link)
	}
	
	let rule3 = () => {
		if(ap.is_on_root()) return
		
		//console.log("Rule3 invoked")
		ap.follow_suffix_link_or_set_to_root_rule3()
	}
	
	let need_insert = () => {
		// 1. If current active node has no suffix beginning with current char (active_edge is null), 
		// we need to insert
		return !ap.is_ch_already_present_at_active_node()
	}
	
	let need_split = () => {
		
		return !ap.is_goes_along_active_edge()
	}
	
	let insert = () => {
		//console.log("Step", i + 1, "need insert")
		let leaf = ap.generate_from_active_node()
		
		let inv = false
		
		if(ap.active_node.isinternal()) {
			rule2(ap.active_node)
		}
		
		if (!inv) {
			rule3()
		} else {
			//console.log("Rule1 already invoked so skipping rule3")
		}
	}
	
	let split = () => {
		//console.log("Step", i + 1, "need split")
		let split_node = ap.split_active_edge()
		let inv = rule1() // if split happened at root
				
		rule2(split_node) // setting suffix links
				
		// rule1.invoked === !rule3.invoked
		if(!inv) {
			rule3()	// walking suffix links
		} else {
			//console.log("Rule1 already invoked so skipping rule3")
		}
	}
	
	let do_split_or_insert_while_can = () => {
		//console.log("Step", i + 1, "need action")
				
		let empty_step = false // as we came here it is false
		while(remainder > 0 && !empty_step) {
			//console.log("\n\n---------------->Do something substep, remainder = ", remainder)
				
			if (need_split()) {
				
				squeue.get()
				split()
				
				remainder--
			} 
			
			if(need_insert()) {
				
				squeue.get()
				insert()
				
				remainder--
			}
	
			//console.log("\nremainder =", remainder)
			
			empty_step = !need_split() && !need_insert()
		}
	}
	
	let accumulate = () => {
		//console.log("Step", i + 1, "need accumulate")
			
		if(needs_link.is() && needs_link.get().isinternal()) {
			rule2(ap.active_node)
		}
		ap.increment_active_length()
		squeue.add()
		remainder++
	}
		
	let print_state = () => {
		//console.log("remainder=", remainder)
	}
	
	// i is global
	for(i = 0; i < s.length; i++) {
		if(i % 10000 === 0) console.log("----------------------------------Step", i, "began", remainder)
		
		if (remainder === 0) {
			remainder = 1
		}
		
		ch = s[i]
		
		//console.log("s[",i, "] =", ch, "for s = ", s.substring(0,i) + "["+s.substring(i,i+1)+"]"+s.substring(i+1))
		//console.log("Before step:\n\tremainder = ", remainder, "\n\tAP:")
		
		let need_do_something = need_insert() || need_split()
		if(need_do_something) {
			do_split_or_insert_while_can()
		}
		
		if (!need_do_something || remainder > 0) {
			accumulate()
		}
		
		needs_link.del() // links are not set across iterations
		
		//console.log("After step:\n\tremainder = ", remainder, "\n\tAP:")
		//console.log("\n\n\n")
	}
	
	//console.log("---------------------------------\n")
	
	if(need_split()) {
		split(true)
	}
	
	return root
}


////console.log = function () {}

//----------------------------------------------------------tests
s = "abcabxabcd"
let abcabxabcd = bst(s)

abcabxabcd.realize()
assert.deepEqual(abcabxabcd.json(), {
  "ab": {
    "c": {
      "abxabcd": {},
      "d": {}
    },
    "xabcd": {}
  },
  "b": {
    "c": {
      "abxabcd": {},
      "d": {}
    },
    "xabcd": {}
  },
  "c": {
    "abxabcd": {},
    "d": {}
  },
  "xabcd": {},
  "d": {}
})

s = "cdddcdc$"

let cdddcdc$ = bst(s)

cdddcdc$.realize()
assert.deepEqual(cdddcdc$.json(), {
  "c": {
    "d": {
      "ddcdc$": {},
      "c$": {}
    },
    "$": {}
  },
  "d": {
    "d": {
      "dcdc$": {},
      "cdc$": {}
    },
    "c": {
      "dc$": {},
      "$": {}
    }
  },
  "$": {}
})

s = "ATAAATG$"

let ATAAATG$ = bst(s)

ATAAATG$.realize()
assert.deepEqual(ATAAATG$.json(), {
  "A": {
    "T": {
      "AAATG$": {},
      "G$": {}
    },
    "A": {
      "ATG$": {},
      "TG$": {}
    }
  },
  "T": {
    "AAATG$": {},
    "G$": {}
  },
  "G$": {},
  "$": {}
})

s = "GTCCGAAGCTCCGG$"

let GTCCGAAGCTCCGG$ = bst(s)

GTCCGAAGCTCCGG$.realize()
assert.deepEqual(GTCCGAAGCTCCGG$.json(), {
  "G": {
    "TCCGAAGCTCCGG$": {},
    "AAGCTCCGG$": {},
    "CTCCGG$": {},
    "G$": {},
    "$": {}
  },
  "TCCG": {
    "AAGCTCCGG$": {},
    "G$": {}
  },
  "C": {
    "CG": {
      "AAGCTCCGG$": {},
      "G$": {}
    },
    "G": {
      "AAGCTCCGG$": {},
      "G$": {}
    },
    "TCCGG$": {}
  },
  "A": {
    "AGCTCCGG$": {},
    "GCTCCGG$": {}
  },
  "$": {}
}
)
//-------------------------------------------------------------tests

//console.log("now go")
s = dataset[0]
fs.writeFileSync("answer.txt", "")

let tree = bst(s)

tree.realize()

let out = tree.edges_print([0])[0]
console.log(out)
//fs.writeFileSync("answer.txt", out)

// this one works for: cdddcdc$ ?
// this one works for: abcabxabcd
// this one works for: ATAAATG$
// this one works for: GTCCGAAGCTCCGG$
// xybcdmnabcdexabxybcdmnabcdexx$

// seemingly (well) passes GTGGGGCGGGATGGGGA$
// seemingly (well) passes TGGGGGCGGGATGGGGAA$
// seemingly (well) passes TGTGGGGCGGGATGGGGAA$

// TGTGGGGCGGGATGGGGAA$ NO! (see above now)
// TGGGGGCGGGATGGGGAA$ NO! (see above now)
// GTGGGGCGGGATGGGGA$ NO! (see above now)

s = s.substring(0, s.length - 1)
let max_sub = (sl) => {
	let max = 0
	
	for(let i = 1; i <= sl; i++) {
		max += Math.min(Math.pow(4,i), sl-i + 1)
		////console.log(Math.min(Math.pow(4,i), sl-i + 1))
	}
	
	////console.log(max)
	return max
}

let max = max_sub(s.length)
console.log(max)
fs.writeFileSync("answer.txt", out / max)
