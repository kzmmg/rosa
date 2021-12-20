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

dataset = dataset.slice(1)

let sts = dataset.slice(0,n)

dataset = dataset.slice(n)

dataset = dataset.map(e=>+e)

let weigh = (s) => {
	return Math.round(100000*s.split("").reduce((acc,i)=> acc + amt.get(i), 0))/100000
}

let make_s = (s) => {
	let sp = []
	for(let i = 0; i < s.length - 1; i++) {
		let c1 = s.substring(0,i + 1);
		let c2 = s.substring(i+1)
		
		let w1 = weigh(c1)
		let w2 = weigh(c2)
		
		sp = sp.concat([w1,w2])
	}
	
	return sp
}

let sra = []
for(let i = 0; i < sts.length; i++) {
	sra.push(make_s(sts[i]))
}

//console.log(sts)
//console.log(sra)
let maxes = []
for (let k = 0; k < sra.length; k++) {
	let sp1 = sra[k]
	let sp2 = dataset
	
	let mult = []
	let multreal = []
	for (let i = 0; i < sp1.length; i++) {
		
		for(let j = 0; j < sp2.length; j++) {
			mult.push(Math.floor(1000*(-sp2[j] + sp1[i])))
		}
	}

	let count = {}

	for (let i = 0; i < mult.length; i++) {
		count[mult[i]] = count[mult[i]] || 0
		count[mult[i]]++
	}

	let max = -1

	for (let k1 in count) {
		if(count[k1] > max) {
			max = count[k1]
		}
	}
	
	//console.log(sts[k], count, mult)
	
	maxes.push(max)
}

//console.log(maxes)
let maxi = -1, max = -1
for(let i = 0; i < maxes.length; i++) {
	if(maxes[i] > max) {
		maxi = i
		max = maxes[i]
	}
}

fs.writeFileSync("answer.txt", max + "\n" + sts[maxi])
