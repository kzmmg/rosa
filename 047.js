// Transitions and Transversions
// rosalind.info/problems/tran/

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

let str1 = dataset[0]
let str2 = dataset[1]

let [t,v] = [0,0]
for(let i = 0; i < str1.length; i++) {
	let ch1 = str1[i]
	let ch2 = str2[i]
		
	if (ch1 === ch2) continue
		
	// no no and No@
		
	let str = ch1 + ch2
		
	if (["AG", "GA", "TC", "CT"].indexOf(str) !== -1) {
		t++
	} else {
		v++
	}
}

fs.writeFileSync("answer.txt", t/v)
