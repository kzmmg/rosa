// Inferring mRNA from Protein
// rosalind.info/problems/mrna/

const codons = `
UUU F      
CUU L      
AUU I      
GUU V
UUC F      
CUC L      
AUC I      
GUC V
UUA L      
CUA L      
AUA I      
GUA V
UUG L      
CUG L      
AUG M      
GUG V
UCU S      
CCU P      
ACU T      
GCU A
UCC S      
CCC P      
ACC T      
GCC A
UCA S      
CCA P      
ACA T      
GCA A
UCG S      
CCG P      
ACG T      
GCG A
UAU Y      
CAU H      
AAU N      
GAU D
UAC Y      
CAC H      
AAC N      
GAC D
UAA Stop   
CAA Q      
AAA K      
GAA E
UAG Stop   
CAG Q      
AAG K      
GAG E
UGU C      
CGU R      
AGU S      
GGU G
UGC C      
CGC R      
AGC S      
GGC G
UGA Stop   
CGA R      
AGA R      
GGA G
UGG W      
CGG R      
AGG R      
GGG G 
`

const ctable = codons.split("\n").reduce((a,i) => {
	let i1 = i.split(" ")[0]
	let i2 = i.split(" ")[1]
	
	if (!a[i2]) a[i2] = []
	
	a[i2].push(i1)
	return a
}, [])

console.log(ctable)

const stops = ["UGA", "UAG", "UAA"]


const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n").join("")

let res = 1
for (let i = 0; i < dataset.length; i++) {
	//console.log(ctable[dataset[i]].length)
	res *= ctable[dataset[i]].length
	res %= 1000000
	
	
	console.log(res)
}

res *= stops.length
res %= 1000000

fs.writeFileSync("answer.txt", res)
