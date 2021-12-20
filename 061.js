// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")

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
//amt = amt.map(e=>{ e.split(/\s+/g)[0] : (+e.split(/\s+/g)[1])})
amt = amt.map(e => { 
	return [Math.floor(+e.split(/\s+/g)[1] * 100) , e.split(/\s+/g)[0]]
});

amt = new Map(amt)

console.log(amt, amt.get("A"))

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n").map(r=>+r)
let ds = ""

let pr = ""

for (let i = 1; i < dataset.length; i++) {
	let cur = dataset[i]
	let pre = dataset[i-1]
	let dif = cur-pre
	
	dif = Math.floor(dif * 100)
	
	//console.log(dif)
	pr += amt.get(dif)
}

console.log(pr)

fs.writeFileSync("answer.txt", pr)
