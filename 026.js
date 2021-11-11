

// Open Reading Frames
// rosalind.info/problems/orf/

const fs = require("fs")
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
let rev = str.split("").reverse().join("").replace(/T/g, "R").replace(/A/g, "T").
	replace(/R/g, "A").replace(/C/g, "R").replace(/G/g, "C").replace(/R/g, "G")

str = str.replace(/T/g, "U")
rev = rev.replace(/T/g, "U")

let mp = (s) => {
	console.log(s)
	let p = ""
	for (let i = 0; i < s.length; i+=3) {
		let c = s.substr(i,3)
		if (c.length < 3) break
		console.log("codon", c)
		if (stops.indexOf(c) !== -1) {
			console.log("1")
			p += "0"
			break
		}
		p += ctable[c]
	}
	
	if (p.substr(-1) !== "0") return void 0
	
	return p.substr(0, p.length - 1)
}

let prots = []

/*console.log(str)
console.log(rev)*/
for (let i = 0; i < str.length; i++) {
	if (str.substr(i,3) === "AUG") {
		let prot = mp(str.substr(i))
		if (prot) prots.push(prot)
	}
	
	if (rev.substr(i,3) === "AUG") {
		let prot = mp(rev.substr(i))
		if (prot) prots.push(prot)
	}
}

fs.writeFileSync("answer.txt", [...(new Set(prots))].join("\n"))
