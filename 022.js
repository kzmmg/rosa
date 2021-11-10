// RNA Splicing
// rosalind.info/problems/splc/

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
let str = dataset[0]
let introns = dataset.slice(1)

console.log(str)
for (let i = 0; i < introns.length; i++) {
	let intron = introns[i]
	
	str = str.replace(new RegExp(intron, "g"), "")
}


console.log(str)
/*let i
for (i = 0; i < str.length; i++) {
	if (str.substr(i,3) === 'AUG') break
}*/

str = str.replace(/T/g, "U")

let ps = ""
for (let i = 0; i < str.length; i+=3) {
	let cd = str.substr(i,3)
	if (stops.indexOf(cd) !== -1) break
	ps += ctable[cd]
}

fs.writeFileSync("answer.txt", ps)
