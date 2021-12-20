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
amt = amt.map(e => { 
	return [Math.floor(+e.split(/\s+/g)[1] * 100) , e.split(/\s+/g)[0]]
});

amt = new Map(amt)


let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n").map(r=>+r)


dataset.sort((a,b) => a-b)

let hm = []
let next = []
hm[dataset.length - 1] = 0
next[dataset.length - 1] = -1

let acc = (i,j) => {
	return amt.get(Math.floor((dataset[j]-dataset[i])*100))
}

for (let i = dataset.length - 2; i >= 0; i--) {
	let b = dataset[i]
	hm[i] = -1
	for (j = i + 1; j < dataset.length; j++) {
		if (acc(i,j)) {
			let supp = hm[j]
			
			if (hm[i] > hm[j]) continue
			
			hm[i] = hm[j] + 1
			next[i] = j
		}
	}
	
	if (hm[i] === -1) {
		hm[i] = 0
		next[i] = -1
	}
}

console.log(acc(0,1), dataset[1]-dataset[0])

let maxi, max = -1;
for (let i = 0; i < hm.length;i++) {
	if(max < hm[i]) {
		max = hm[i]
		maxi = i
	}
}

let s = ""
console.log(maxi)
while(next[maxi] != -1) {
	let ltr = dataset[next[maxi]] - dataset[maxi]
	console.log(">",ltr)
	ltr = amt.get(Math.floor(ltr * 100))
	s += ltr
	
	maxi = next[maxi]
}

console.log(dataset.join(" "))
console.log(hm.join(" "))
console.log(next.join(" "))
console.log(s)
/*metki*/
fs.writeFileSync("answer.txt", s)
