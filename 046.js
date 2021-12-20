/*
((((Aa,aa),(Aa,Aa)),((aa,aa),(aa,AA))),Aa);
((((p1,p2)
*/

// Inferring Genotype from a Pedigree
// rosalind.info/problems/mend/

const fs = require("fs")

class Tree {
	constructor(expr) {
		this.expr = expr
		this.d1 = void 0
		this.d2 = void 0
		this.AAf = void 0
		this.Aaf = void 0
		this.aaf = void 0
	}
	
	
	findfirstopi() {
		let i
		for (i = 0; i < this.expr.length; i++) {
			if (this.expr[i] === "(") break
		}
		
		return i
	}
	
	findlastcli() {
		let i
		for (i = this.expr.length - 1; i >= 0; i--) {
			if (this.expr[i] === ")") break
		}
		
		return i
	}
	
	findsubs(e) {
		let commaidx
		let opstack = []
		
		let k1, k2
		if (e.indexOf("(") === -1) {
			k1 = e.substring(0, e.indexOf(","))
			k2 = e.substring(e.indexOf(",") + 1)
			return [k1,k2]
		}
		
		let i
		let commaflag = false
		for (i = 0; i < e.length; i++) {
			let ch = e[i]
			
			if (commaflag && ch === ",") break
			
			if (ch === "(") {
				opstack.push(1)
			}
			
			if (ch === ")" && !opstack.length) throw "malformed"
			
			if (ch === ")") {
				opstack.pop()
				
				if (!opstack.length) commaflag = true
			}
		}
		
		commaidx = i
		
		
		k1 = e.substring(0, commaidx)
		k2 = e.substring(commaidx + 1)
		return [k1,k2]
	}
	
	parse() {
		if (this.expr === "AA") {
			this.AAf = 1
			this.Aaf = 0
			this.aaf = 0
			return
		}
		
		if (this.expr === "Aa") {
			this.AAf = 0
			this.Aaf = 1
			this.aaf = 0
			return
		}
		
		if (this.expr === "aa") {
			this.AAf = 0
			this.Aaf = 0
			this.aaf = 1
			return
		}
		
		let firstopi = this.findfirstopi()
		let lastcli = this.findlastcli()
		
		let expr = this.expr
		
		expr = expr.substring(firstopi + 1, lastcli)
		
		let kids = this.findsubs(expr)
		
		//console.log(kids)
		this.d1 = new Tree(kids[0])
		this.d2 = new Tree(kids[1])
		
		this.d1.parse()
		this.d2.parse()
	}
	
	computeFreqs() {
		console.log("thisepxr", this.expr)
		console.log("thiski", this.d1, this.d2)
		if (!isNaN(this.AAf) && !isNaN(this.Aaf) && !isNaN(this.aaf)) return
		
		if (!this.d1 || !this.d2) throw "cannot"
		
		let d1 = this.d1
		let d2 = this.d2
		
		d1.computeFreqs()
		d2.computeFreqs()
		
		// AA - AA (1 AA)
		if (isNaN(this.AAf)) this.AAf = 0
		if (isNaN(this.Aaf)) this.Aaf = 0
		if (isNaN(this.aaf)) this.aaf = 0
		
		this.AAf += d1.AAf * d2.AAf
		
		// AA - Aa (0.5 AA 0.5 Aa)
		
		this.AAf += 0.5 * d1.AAf * d2.Aaf
		this.Aaf += 0.5 * d1.AAf * d2.Aaf
		
		// AA - aa (1 Aa)
		
		this.Aaf += d1.AAf * d2.aaf
		
		// Aa - AA  (0.5 AA 0.5 Aa)
		
		this.AAf += 0.5 * d1.Aaf * d2.AAf
		this.Aaf += 0.5 * d1.Aaf * d2.AAf
		
		// Aa - Aa (0.25 AA 0.5 Aa 0.25 aa)
		
		this.AAf += 0.25 * d1.Aaf * d2.Aaf
		this.Aaf += 0.5 * d1.Aaf * d2.Aaf
		this.aaf += 0.25 * d1.Aaf * d2.Aaf
		
		// Aa - aa (0.5 Aa 0.5 aa)
		
		this.Aaf += 0.5 * d1.Aaf * d2.aaf
		this.aaf += 0.5 * d1.Aaf * d2.aaf
		
		// aa - AA (1 Aa)
		
		this.Aaf += d1.aaf * d2.AAf
		
		// aa - Aa (0.5 Aa 0.5 aa)
		
		this.Aaf += 0.5 * d1.aaf * d2.Aaf
		this.aaf += 0.5 * d1.aaf * d2.Aaf
		
		// aa - aa (1 aa)
		
		this.aaf += d1.aaf * d2.aaf
	}
}

let dataset = fs.readFileSync("dataset.txt").toString()

console.log(dataset)
let t = new Tree(dataset)

t.parse()
t.computeFreqs()

console.log(t.AAf, t.Aaf, t.aaf)


fs.writeFileSync("answer.txt", t.AAf + " " + t.Aaf + " " + t.aaf)
