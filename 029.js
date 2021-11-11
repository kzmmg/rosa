 
// Calculating Protein Mass 
// rosalind.info/problems/prtm/

const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n").join("")

let mmt = `
A   71.03711
C   103.00919
D   115.02694
E   129.04259
F   147.06841
G   57.02146
H   137.05891
I   113.08406
K   128.09496
L   113.08406
M   131.04049
N   114.04293
P   97.05276
Q   128.05858
R   156.10111
S   87.03203
T   101.04768
V   99.06841
W   186.07931
Y   163.06333 
`

mmt = mmt.replace(/( )+/g, " ")

mmt = mmt.replace(/\r?\n/g, "\n")
mmt = mmt.split("\n")
mmt = mmt.filter( e => e.length)

//console.log(mmt)

let ams = {}

mmt.forEach((e) => {
	let s = e.split(" ")
	ams[s[0].trim()] = +s[1].trim()
})

console.log(ams)
let m = 0
for(let i = 0; i < dataset.length;i++)
	m += ams[dataset[i]]


fs.writeFileSync("answer.txt", m)
