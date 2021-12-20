// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/

let blosum = `
   A  C  D  E  F  G  H  I  K  L  M  N  P  Q  R  S  T  V  W  Y
A  4  0 -2 -1 -2  0 -2 -1 -1 -1 -1 -2 -1 -1 -1  1  0  0 -3 -2
C  0  9 -3 -4 -2 -3 -3 -1 -3 -1 -1 -3 -3 -3 -3 -1 -1 -1 -2 -2
D -2 -3  6  2 -3 -1 -1 -3 -1 -4 -3  1 -1  0 -2  0 -1 -3 -4 -3
E -1 -4  2  5 -3 -2  0 -3  1 -3 -2  0 -1  2  0  0 -1 -2 -3 -2
F -2 -2 -3 -3  6 -3 -1  0 -3  0  0 -3 -4 -3 -3 -2 -2 -1  1  3
G  0 -3 -1 -2 -3  6 -2 -4 -2 -4 -3  0 -2 -2 -2  0 -2 -3 -2 -3
H -2 -3 -1  0 -1 -2  8 -3 -1 -3 -2  1 -2  0  0 -1 -2 -3 -2  2
I -1 -1 -3 -3  0 -4 -3  4 -3  2  1 -3 -3 -3 -3 -2 -1  3 -3 -1
K -1 -3 -1  1 -3 -2 -1 -3  5 -2 -1  0 -1  1  2  0 -1 -2 -3 -2
L -1 -1 -4 -3  0 -4 -3  2 -2  4  2 -3 -3 -2 -2 -2 -1  1 -2 -1
M -1 -1 -3 -2  0 -3 -2  1 -1  2  5 -2 -2  0 -1 -1 -1  1 -1 -1
N -2 -3  1  0 -3  0  1 -3  0 -3 -2  6 -2  0  0  1  0 -3 -4 -2
P -1 -3 -1 -1 -4 -2 -2 -3 -1 -3 -2 -2  7 -1 -2 -1 -1 -2 -4 -3
Q -1 -3  0  2 -3 -2  0 -3  1 -2  0  0 -1  5  1  0 -1 -2 -2 -1
R -1 -3 -2  0 -3 -2  0 -3  2 -2 -1  0 -2  1  5 -1 -1 -3 -3 -2
S  1 -1  0  0 -2  0 -1 -2  0 -2 -1  1 -1  0 -1  4  1 -2 -3 -2
T  0 -1 -1 -1 -2 -2 -2 -1 -1 -1 -1  0 -1 -1 -1  1  5  0 -2 -2
V  0 -1 -3 -2 -1 -3 -3  3 -2  1  1 -3 -2 -2 -3 -2  0  4 -3 -1
W -3 -2 -4 -3  1 -2 -2 -3 -3 -2 -1 -4 -4 -2 -3 -3 -2 -3 11  2
Y -2 -2 -3 -2  3 -3  2 -1 -2 -1 -1 -2 -3 -1 -2 -2 -2 -1  2  7
`;

let bm = {}

let pal = blosum.split(/\n/g)[1].split(/\s+/g);
let pal0 = pal
pal.shift()

pal.forEach((e) => bm[e] = {});
/*console.log(pal, bm)*/

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
		bm[pal0[i]][ltr] = el
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

let d = []

let s1 = dataset[0]
let s2 = dataset[1]
for (let i = 0; i <= s1.length; i++) {
	d[i] = []
	
	d[i][0] = -i
}

for (let j = 0; j <= s2.length; j++) {
	d[0][j] = -j
}

for (let i = 1; i <= s1.length; i++) {
	for (let j = 1; j <= s2.length; j++) {
		let aijm1 = d[i][j-1] || 0
		let aim1j = d[i-1] && d[i-1][j] || 0
		let aim1jm1 = d[i-1] && d[i-1][j-1] || 0
		
		let ch1 = s1[i-1]
		let ch2 = s2[j-1]
		
		//console.log(ch1,ch2,bm[ch1][ch2])
		let plo = bm[ch1][ch2]
		
		let max = Math.max(aijm1 - 5,aim1j - 5,aim1jm1 + plo)
		d[i][j] = max
	}
}


//console.log(d.map(i => i.join("\t")).join("\n"))
fs.writeFileSync("answer.txt", d[s1.length][s2.length])
