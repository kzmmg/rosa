// Translating RNA into Protein
// rosalind.info/problems/prot/

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
	a[i1] = i2
	return a
}, [])

console.log(ctable)

const stops = ["UGA", "UAG", "UAA"]

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")[0]
	
let i
for (i = 0; i < dataset.length; i++) {
	if (dataset.substr(i,3) === 'AUG') break
}

let ps = ""
for (; i < dataset.length; i+=3) {
	let cd = dataset.substr(i,3)
	if (stops.indexOf(cd) !== -1) break
	ps += ctable[dataset.substr(i,3)]
}


fs.writeFileSync("answer.txt", ps)
