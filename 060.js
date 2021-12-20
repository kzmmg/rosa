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

let s = ds.split("\n")[0]

let p = [0]

for (let i = 1; i <= s.length; i++) {
	let len = 0
	let s1 = s.substring(0,i)
	for(let j =i-1; j >=1; j--) {
		let pr = s1.substring(0,i-j)
		let su = s1.substring(j,i)
		
		if (pr.length > p[i-2] + 1) break
		//console.log(i,s1,  '[', pr, su, pr.length, "]", len)
		if (pr === su && len < su.length) {
			len = su.length

		}
	}
	p[i-1] = len
}

//console.log(p.join(" "))

fs.writeFileSync("answer.txt", p.join(" "))
