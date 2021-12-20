// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/

let blosum = `
   A  C  D  E  F  G  H  I  K  L  M  N  P  Q  R  S  T  V  W  Y
A  2 -2  0  0 -3  1 -1 -1 -1 -2 -1  0  1  0 -2  1  1  0 -6 -3
C -2 12 -5 -5 -4 -3 -3 -2 -5 -6 -5 -4 -3 -5 -4  0 -2 -2 -8  0
D  0 -5  4  3 -6  1  1 -2  0 -4 -3  2 -1  2 -1  0  0 -2 -7 -4
E  0 -5  3  4 -5  0  1 -2  0 -3 -2  1 -1  2 -1  0  0 -2 -7 -4
F -3 -4 -6 -5  9 -5 -2  1 -5  2  0 -3 -5 -5 -4 -3 -3 -1  0  7
G  1 -3  1  0 -5  5 -2 -3 -2 -4 -3  0  0 -1 -3  1  0 -1 -7 -5
H -1 -3  1  1 -2 -2  6 -2  0 -2 -2  2  0  3  2 -1 -1 -2 -3  0
I -1 -2 -2 -2  1 -3 -2  5 -2  2  2 -2 -2 -2 -2 -1  0  4 -5 -1
K -1 -5  0  0 -5 -2  0 -2  5 -3  0  1 -1  1  3  0  0 -2 -3 -4
L -2 -6 -4 -3  2 -4 -2  2 -3  6  4 -3 -3 -2 -3 -3 -2  2 -2 -1
M -1 -5 -3 -2  0 -3 -2  2  0  4  6 -2 -2 -1  0 -2 -1  2 -4 -2
N  0 -4  2  1 -3  0  2 -2  1 -3 -2  2  0  1  0  1  0 -2 -4 -2
P  1 -3 -1 -1 -5  0  0 -2 -1 -3 -2  0  6  0  0  1  0 -1 -6 -5
Q  0 -5  2  2 -5 -1  3 -2  1 -2 -1  1  0  4  1 -1 -1 -2 -5 -4
R -2 -4 -1 -1 -4 -3  2 -2  3 -3  0  0  0  1  6  0 -1 -2  2 -4
S  1  0  0  0 -3  1 -1 -1  0 -3 -2  1  1 -1  0  2  1 -1 -2 -3
T  1 -2  0  0 -3  0 -1  0  0 -2 -1  0  0 -1 -1  1  3  0 -5 -3
V  0 -2 -2 -2 -1 -1 -2  4 -2  2  2 -2 -1 -2 -2 -1  0  4 -6 -2
W -6 -8 -7 -7  0 -7 -3 -5 -3 -2 -4 -4 -6 -5  2 -2 -5 -6 17  0
Y -3  0 -4 -4  7 -5  0 -1 -4 -1 -2 -2 -5 -4 -4 -3 -3 -2  0 10
`;

let bm = {}

let pal = blosum.split(/\n/g)[1].split(/\s+/g);
let pal0 = pal
pal.shift()

pal.forEach((e) => bm[e] = {});

pal = blosum.split(/\n/g)
pal.shift()
pal.shift()
pal.pop()

pal.forEach((e) => {
	let spl = e.split(/\s+/g)
	let ltr = spl[0]
	
	spl.shift()
	
	for(let i = 0; i < spl.length; i++) {
		let el = +spl[i]
		bm[pal0[i]][ltr] = el/*pal0[i] === ltr ? 3 : -3;*/
	}
});

/*console.log(bm)

console.log(pal)*/

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

let m = []

let s1 = dataset[0]
let s2 = dataset[1]
for (let i = 0; i <= s1.length; i++) {
	m[i] = []
	m[i][0] = 0
}

for (let j = 0; j <= s2.length; j++) {
	m[0][j] = 0
}

let gp = 5/*2*/

let goleft = (i,j) => {
	let u = 1
	let arc = []
	for(let k = j - u; k>=0;u++,k--) {
		arc.push(m[i][k] - u * gp)
	}
	
	return Math.max.apply(null, arc)
}
let goup = (i,j) => {
	let u = 1
	let arc = []
	for(let k = i - u; k>=0;u++,k--) {
		arc.push(m[k][j] - u * gp)
	}
	
	return Math.max.apply(null, arc)
}

let max = -1, maxi, maxj
let s1a = "", s2a = ""
for (let i = 1; i <= s1.length; i++) {
	for (let j = 1; j <= s2.length; j++) {		
		let ch1 = s1[i-1]
		let ch2 = s2[j-1]
		
		m[i][j] = Math.max(m[i-1][j-1] + bm[ch1][ch2], m[i-1][j]-gp, m[i][j-1]-gp,0)
		
		if (m[i][j] > max) {
			max = m[i][j]
			maxi = i
			maxj = j
		}
	}
}

let i = maxi
let j = maxj
let rmax = max
while(max != 0) {
	let n1, n2, n3
		
	let ch1 = s1[i-1]
	let ch2 = s2[j-1]
	
	n1 = m[i-1][j-1]
	n2 = m[i-1][j]
	n3 = m[i][j-1]
	
	if(n1 === max) n1 = -1
	if(n2 === max) n2 = -1
	if(n3 === max) n3 = -1
	
	let max0 = Math.max(n1,n2,n3)
	
	if(max0 === max) throw 1
	
	max = max0
	if(n1 === max0) {
		s1a = ch1 + s1a
		s2a = ch2 + s2a
		j--
		i--
	}else if(n2 === max0) {
		s1a = ch1 + s1a
		s2a = "" + s2a
		i--
	} else if(n3 === max0) {
		s1a = "" + s1a
		s2a = ch2 + s2a
		j--
	}
}

//console.log(m.map(i => i.join("\t")).join("\n"))
fs.writeFileSync("answer.txt", rmax + "\n" + s1a + "\n" + s2a)
