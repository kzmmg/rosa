// Finding a Shared Spliced Motif
// rosalind.info/problems/lcsq/
const fs = require("fs")
let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n").map(r=>r.split(" ").map(r=>+r))


let mult = []
let multreal = []
for (let i = 0; i < dataset[0].length; i++) {
	
	for(let j = 0; j < dataset[1].length; j++) {
		mult.push(Math.floor(1000*(-dataset[1][j] + dataset[0][i])))
		multreal.push(-dataset[1][j] + dataset[0][i])
	}
}

let count = {}

for (let i = 0; i < mult.length; i++) {
	count[mult[i]] = count[mult[i]] || 0
	count[mult[i]]++
}

let maxkey, max = -1

for (k in count) {
	if(count[k] > max) {
		max = count[k]
		maxkey = +k
	}
}
//console.log(mult.join(" "))
//console.log(count)
/*metki*/

let i
for(i = 0; i < mult.length; i++) {
	console.log(mult[i], maxkey)
	if (mult[i] === maxkey) break
}

fs.writeFileSync("answer.txt", max + "\n" + Math.round(multreal[i] * 100000)/100000)
