// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
let amt = `
G   57.02146
A   71.03711
S   87.03203
P   97.05276
V   99.06841
T   101.04768
C   103.00919
I   113.08406
L   113.08406
N   114.04293
D   115.02694
Q   128.05858
K   128.09496
E   129.04259
M   131.04049
H   137.05891
F   147.06841
R   156.10111
Y   163.06333
W   186.07931
`

amt = amt.split(/\n+/g)
amt = amt.slice(1,amt.length-1)
amt = amt.map(e => { 
	return [e.split(/\s+/g)[0], +e.split(/\s+/g)[1]]
});

amt = new Map(amt)


const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let n = +dataset[0]
let u = [...Array(n).keys()].map(e=>e+1)

let a = dataset[1]
let b = dataset[2]

let parse = (s) => {
	s = s.replace(/[\{\}]+/g, "")
	s = s.split(",")
	
	return s.map(e=>+e)
}

a = parse(a)
b = parse(b)

let union = (a,b) => {
	let c = a.concat(b)
	
	return [...new Set(c)]
}

let inter = (a,b) => {
	let c = []
	
	for(let i = 0; i < a.length; i++) {
		for (let j = 0; j < b.length; j++) {
			if (a[i] === b[j]) c.push(a[i])
		}
	}
	
	return [...new Set(c)]
}

let diff = (a,b) => {
	let c = []
	
	for(let i = 0; i < a.length; i++) {
		let was = false
		for (let j = 0; j < b.length; j++) {
			if (a[i] === b[j]) {
				was = true
				continue
			}
			
			if (j=== b.length - 1 && !was) {
				c.push(a[i])
			}
		}
	}
	
	return [...new Set(c)]
}

let comp = (a) => {
	return diff(u,a)
}

/*console.log("------")
console.log(a)
console.log(b)
console.log(union(a,b))
console.log(inter(a,b))
console.log(diff(a,b))
console.log(diff(b,a))
console.log(comp(a))
console.log(comp(b))*/

let print = (s) => {
	return "{" + s.join(", ") + "}\n"
}

fs.writeFileSync("answer.txt", print(union(a,b)) + print(inter(a,b)) + print(diff(a,b)) + print(diff(b,a)) + print(comp(a)) + print(comp(b)))
