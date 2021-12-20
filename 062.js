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

//console.log(amt, amt.get("A"))

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n").map(r=>+r)

let tma = dataset[0]

dataset = dataset.slice(1)

//console.log(dataset.join(" "))
dataset.sort((a,b) => a-b)

let by = []
for (let i = 0; i < dataset.length / 2; i++) {
	let b = dataset[i]
	let y = dataset[dataset.length - 1 - i]
	
	if (Math.floor((b+y) * 100) !== Math.floor(tma * 100)) 
		throw [[b,y], Math.floor((b+y) * 100), Math.floor(tma * 100)]
	by.push([b,y])
}

console.log(by)

/*
(ABC/(KEKEP)ABC) 610 1377 0
(ABC(K/EKEP)ABC) 738 1249 1
(ABC(KE/KEP)ABC) 863 1124 4

so much for fwd



(ABC(KEK/EP)ABC)
(ABC(KEKE/P)ABC)
(ABC(KEKEP)/ABC)
*/
//console.log("\n\n\n\n\n\n\n\n\n\n")
let pr = ""
let pra = []

while(by.length > 1) {
	let fst = by[0]
	let fst_one = fst[0]
	
	//find second
	let j = 1
	for(; j < by.length; j++) {
		if(amt.get(Math.floor(100*(by[j][0]-fst_one)))) break
	}
	
	if (j === by.length) {
		let rest = by.slice(1).map(e=>e.reverse())
		
		rest.sort((a,b)=>a[0]-b[0])
		by = by.slice(0,1).concat(rest)
	//	console.log(fst,by)
	} else {
		pra.push([by[0].concat([]), by[j].concat([])])
		let by0 = by.slice(1,j)
		let by1 = by.slice(j)
		
		by = by1.concat(by0.map(e=>e.reverse()))
		by.sort((a,b)=>a[0]-b[0])
	}
	
	//console.log(j,by)
}

console.log(pra)
console.log(pra = pra.map(e=>e[1][0]-e[0][0]))
/*for (let i = 0; i < by.length; i++) {
	for(let j = i + 1; j < by.length; j++) {
		let cur = by[j][0]
		let pre = by[i][0]
		
		
		let dif = cur-pre
		dif = Math.floor(dif * 100)
		
		//console.log(i, j, dif, amt.get(dif))
		
		if (amt.get(dif)) {
			pr += amt.get(dif)
			pra.push([amt.get(dif), i,j])
			
			console.log(by[i][1]-by[j][1], amt.get(Math.floor(100*(by[i][1]-by[j][1]))), i, j)
		}
	}
}*/

//console.log(by.length, pr.length, pra)

fs.writeFileSync("answer.txt", pra.map(e=>amt.get(Math.floor(e*100))).join(""))
