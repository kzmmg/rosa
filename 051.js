// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/


const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")
let ds = ""

for (let i = 0; i < dataset.length; i++) {
	if (dataset[i].substr(0,1) === ">") {
		if (ds.length) ds += "\n"
	} else {
		ds += dataset[i]
	}
	
}

dataset = ds.split("\n")

let a = []
let d = []

let s1 = dataset[0]
let s2 = dataset[1]

//console.log(s2)
for (let i = 0; i < s1.length; i++) {
	if (!a[i]) a[i] = []
	if (!d[i]) d[i] = []
	for (let j = 0; j < s2.length; j++) {
		
		let aijm1 = a[i][j-1] || 0
		let aim1j = a[i-1] && a[i-1][j] || 0
		let aim1jm1 = a[i-1] && a[i-1][j-1] || 0
		
		
		let plo = s1[i] === s2[j] ? 1 : 0
		
		if (!plo && aijm1 > aim1j) {
			a[i][j] = aijm1
			d[i][j] = [0,-1]
		} else if (!plo) {
			a[i][j] = aim1j
			d[i][j] = [-1,0]
		} else {
			a[i][j] = aim1jm1 + plo
			d[i][j] = [-1,-1]
		}
		
	}
}

let ti = s1.length - 1, tj = s2.length - 1

//console.log(d.map(i => i.join("\t")).join("\n"))
let res = ""
while(ti >= 0 && tj >= 0) {
	//console.log(ti, tj, a[ti][tj])
	let [nti,ntj] = d[ti][tj]
	
	if (nti == -1 && ntj ==-1) {
		res = s1[ti] + res
	}
	
	ti += nti
	tj += ntj
}


fs.writeFileSync("answer.txt", res)
