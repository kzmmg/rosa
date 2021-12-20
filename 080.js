// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")


let s1 = dataset[0]
let s2 = dataset[1]

let m = []
let a = []

for(let i = 0; i <= s1.length;i++) {
	m[i] = [0]
	a[i] = [[]]
}

for(let j = 0; j <= s2.length;j++) {
	m[0][j] = 0
	a[0][j] = [[]]
}


for(let i = 1; i <= s1.length;i++) {
	for(let j = 1; j <= s2.length;j++) {
		let im = m[i-1][j]
		let jm = m[i][j-1]
		let m2 = m[i-1][j-1]
		
		let tr = s1[i-1] === s2[j-1] ? 1 : 0
		
		let max
		if (tr === 1) {
			max = m2 + tr
			a[i][j] = ['d']
		} else if (im > jm) {
			max = im
			a[i][j] = ['u']
		} else if (jm > im) {
			a[i][j] = ['l']
			max = jm
		} else {
			a[i][j] = ['u','l']
			max = jm
		}
		m[i][j] = max
	}
}

let lcs = ""
let [i,j] = [s1.length,s2.length]

console.log(s1,s2)
console.log(m)

while(i > 0 && j > 0) {
	console.log(">>", i, j, m[i][j], s1[i-1], s2[j-1])
	let ar = a[i][j]
	
	if (s1[i-1] === s2[j-1]) {
		lcs = s1[i-1] + lcs
		console.log(lcs)
	}
	if (ar.indexOf('d') !== -1) {
		i--
		j--
	} else if (ar.indexOf('u') !== -1) {
		i--
	} else if (ar.indexOf('l') !== -1) {
		j--
	}
}

console.log(lcs)

lcs = lcs.split("")

let sup = ""
for(let i = 0; i <lcs.length; i++) {
	let i1 = s1.indexOf(lcs[i])
	let i2 = s2.indexOf(lcs[i])
	
	
	let c1 = s1.slice(0, i1)
	let c2 = s1.slice(i1 + 1)
	let c3 = s2.slice(0, i2)
	let c4 = s2.slice(i2 + 1)
	
	
	console.log(lcs[i], i1, c1, c2, s1)
	console.log(lcs[i], i2, c3, c4, s2)
	
	sup += c1 + c3 + lcs[i]
	
	console.log(sup)
	
	s1 = c2
	s2 = c4
}

sup += s1 + s2

console.log(sup)

let out = sup

console.log(out)
fs.writeFileSync("answer.txt", out)
