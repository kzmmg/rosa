// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
const assert = require("assert")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let taxa = dataset[0].split(" ")

let chs = dataset.slice(1)

console.log(chs)

//console.log(chs.join("\n"))

let cons = []

let inter = (s1, s2) => {
	for(let i = 0; i < s1.length; i++) {
		if(s2.indexOf(s1[i]) !== -1) return true
	}
	
	return false
}

let consistent = (ch1, ch2) => {
	//console.log(ch1, ch2)
	ch1 = ch1.split("")
	ch2 = ch2.split("")
	let split11 = ch1.map((a,i) => a === '1' ? i : void 0).filter(a=>a === 0 || a)
	//console.log("split11", split11)
	let split12 = ch1.map((a,i) => a === '0' ? i : void 0).filter(a=>a === 0 || a)
	//console.log("split12", split12)
	let split21 = ch2.map((a,i) => a === '1' ? i : void 0).filter(a=>a === 0 || a)
	//console.log("split21", split21)
	let split22 = ch2.map((a,i) => a === '0' ? i : void 0).filter(a=>a === 0 || a)
	//console.log("split22", split22)
	
	//console.log("i11-21", inter(split11,split21))
	if(inter(split11,split21) && inter(split11, split22) &&
		inter(split12,split21) && inter(split12, split22)) {
			return false
	}
	
	//console.log("inconsistent")
	return true
}
assert(!consistent("1010","1100"))

for(let i = 0; i < chs.length; i++) {
	for(let j = 0; j < chs.length; j++) {
		if(consistent(chs[i], chs[j])) {
			if(!cons[i]) {
				cons[i] = []
			}
			cons[i].push(j)
		}
	}
}

console.log("..consss", cons.map(e=>e.length).join(" "), chs.length)

if(cons.filter(e=>e.length !== chs.length).length !== 0) {
	throw "inconsistent char table"
}

class node {
	constructor(id) {
		this.id = id
		this.es = {}
		this.es_a = []
	}
	
	adde(n) {
		this.es_a.push(n)
		this.es[n.id] = this.es_a.length - 1
	}
	
	print(force_direction) {
		let p
		if(force_direction) {
			p = force_direction
		}
		
		if(this.es_a.length <= 1) {
			assert(taxa[this.id], [this.id + "sss"])
			
			return taxa[this.id]
		}
		
		let res = "(";
		
		for(let i = 0; i < this.es_a.length;i++) {
			let n = this.es_a[i]
			
			if(n.id === p) continue
			
			res += n.print(this.id) + ","
		}
		
		res = res.substring(0, res.length - 1)
		res += ")"
		
		if(this.id.toString().indexOf("$") === -1) {
			res+=taxa[this.id]
		}
		
		return res
	}
	
	flatten() {
		assert(this.es_a.length === 2)
		
		let n1 = this.es_a[0]
		let n2 = this.es_a[1]
		
		let id = this.id
		
		let idx
		// remove self from n1
		idx = n1.es[id]
		delete n1.es[id]
		n1.es_a[idx] = n2
		n1.es[n2.id] = idx
		
		// remove self from n2
		idx = n2.es[id]
		delete n2.es[id]
		n2.es_a[idx] = n1
		n2.es[n1.id] = idx
		
		let nu
		
		if(n1.id.indexOf("$") === -1) {
			nu = n2
		} else {
			nu = n1
		}
		return nu
	}
	
	contains(id, p) {
		let icontain = this.es[id] !== void 0

		if(this.es_a.length === 1) {
			return this.id === id
		}
		
		let kidcontain = false
		for(let i = 0; i < this.es_a.length; i++) {
			let n = this.es_a[i]
			
			if(p && n.id === p.id) continue
			
			kidcontain = kidcontain || n.contains(id, this)
		}
		
		return icontain || kidcontain
	}
}


let anchors = []

let glob = 0

for (let i = 0; i < taxa.length; i++) {
	anchors[i] = new node(i)
}

fs.writeFileSync("answer.txt", "")
console.log = function () {
	fs.appendFileSync("answer.txt", [...arguments].join(" ")+"\n")
}

let one_anchor_left = () => {
	let d_anch = {}
	let d_anch_a = []

	for(let i = 0; i < anchors.length;i++) {
		if(!d_anch[anchors[i].id]) {
			d_anch[anchors[i].id] = 1
			d_anch_a.push(anchors[i])
		}
	}
	
	return d_anch_a.length === 1
}

let merge_distinct = (anchors) => {
	let d_anch = {}
	let d_anch_a = []

	for(let i = 0; i < anchors.length;i++) {
		if(!d_anch[anchors[i].id]) {
			d_anch[anchors[i].id] = 1
			d_anch_a.push(anchors[i])
		}
	}

	assert(d_anch_a.length <= 2, d_anch_a.length)
	if(d_anch_a.length > 1) {
		while(d_anch_a.length > 1) {
			let pop1 = d_anch_a.pop()
			let pop2 = d_anch_a.pop()
			
			console.log("pops", pop1.print(), pop2.print())
			let par = new node("$"+glob++)
			
			pop1.adde(par)
			par.adde(pop1)
			pop2.adde(par)
			par.adde(pop2)
			
			d_anch_a.push(par)
			
			console.log("formed par", par.print(), par.id)
		}
	}
	
	return d_anch_a[0]
}

console.log("ANCHS", anchors.map(e=>e.print()))

for(let k = 2; k <= taxa.length;k++) {
	console.log("======== k =", k, anchors.filter(e=>e).length)
	console.log(anchors.map(e=>e.print() + "|" + e.id).join("\n"))
	let a_len = 0
	
	if(one_anchor_left()) break
	
	for(let i = 0; i < chs.length; i++) {
		let ch = chs[i]
		
		ch = ch.split("").map(e=>+e)
		
		let i0 = []
		let i1 = []

		for(let j = 0; j < ch.length; j++) {
			if(ch[j] === 1) i1.push(j)
			if(ch[j] === 0) i0.push(j)
		}

		let split = [i0,i1]
		
		
		for(let j = 0; j < split.length; j++) {
			let consti = split[j]
			if(consti.length === k) {
				console.log("consti", consti.map(e=>taxa[e] + "|" + e).join(" "))
				let anchs = []
				
				for(let a = 0; a < consti.length; a++) {
					anchs.push(anchors[consti[a]])
				}
				
				console.log("anchs", anchs.map(e=>e.print() + "|" + e.id).join("\n"))
				let nu_anch = merge_distinct(anchs)
				
				for(let a = 0; a < taxa.length; a++) {
					if(nu_anch.contains(a))
						anchors[a] = nu_anch
				}
			}
		}
	}
}

start = merge_distinct(anchors)
start = start.flatten()

let out = start.print()
console.log(out)
//fs.writeFileSync("answer.txt", out)
