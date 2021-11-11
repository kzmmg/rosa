// Catalan Numbers and RNA Secondary Structures
// rosalind.info/problems/cat/


// there are a AU pairs, b CG pairs
// choose 1 AU pair, (1 to m)
// m == 2j, m in (1,a), j in (1,[a/2] + 1)
// there are a-1 and b unmatched pairs
// in (1,m) there are 2k and 2l AU and CG
// in (m, 2(a + b)) there are a-1-2k AU and b-2l CG
// m is such that (1,m) has 2k AU and 2l CG (1)
// (m+1, a+b) has 2c AU and 2d CG (2)
// for each allowed m (per 1 and 2 allowance, each m needs to be tested for allowance) 
// 		add the number of non-crossing matches in each side of split multiplied
// if you figured out that m is allowed, m traversing a choices, you already know the subsets of AU and CG on each side
// for each subset (a smaller graph) apply the same reasoning until the graph is of size 2


// input = String
// procedure splits string to 2 smallers subs (repeatedly) and applies itself to each of the formed subs
// result of each application of self to 2 subs (two invocations) gets multiplied invo1 * invo2
// sum (over multiplied invocations) return that sum
// modulo each number

const fs = require("fs")
const bi = require("big-integer")

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

function is_allowed(str) {
	let numa = 0
	let numu = 0
	let numc = 0
	let numg = 0
	
	for (let i = 0; i < str.length; i++) {
		if (str[i] == "A") numa++
		if (str[i] == "U") numu++
		if (str[i] == "G") numg++
		if (str[i] == "C") numc++
	}
	
	return numa === numu && numc === numg
}

function sub0(i1, i2, str) {
	return str.substring(0, i1)
}

function sub1(i1, i2, str) {
	return str.substring(i1+1,i2)
}

function sub2(i1, i2, str) {
	return str.substring(i2+1)
}

function mod(n) {
	return n % 1000000
}

let memo = []
function num_non_cr_m(str) {
	if (str.length <= 2) return 1
	
	if (str.length % 2) throw 0 // cannot be
	
	let tot = 0
	for (let i = 0; i < 1; i++) {
		let sum = 0
		
		for(let j = i + 1; j < str.length; j++) {
			let sub0_1 = sub0(i, j, str)
			let sub1_1 = sub1(i, j, str)
			let sub2_1 = sub2(i, j, str)
			if (is_allowed(sub0_1) && 
					is_allowed(sub1_1) && 
						is_allowed(sub2_1)) {
				let num1 = memo[sub0_1] || num_non_cr_m(sub0_1)
				let num2 = memo[sub1_1] || num_non_cr_m(sub1_1)
				let num3 = memo[sub2_1] || num_non_cr_m(sub2_1)
				
				/*console.log("------")
				console.log(sub0_1, "is allowed", num1)
				console.log(sub1_1, "is allowed", num2)
				console.log(sub2_1, "is allowed", num3)*/
				
				memo[sub0_1] = num1
				memo[sub1_1] = num2
				memo[sub2_1] = num3
				
				sum += mod(mod(mod(num1) * mod(num2)) * mod(num3))
			}
		}
		
		tot += mod(sum)
		tot = mod(tot)
	}
	
	return tot
	
	
	
}

fs.writeFileSync("answer.txt", num_non_cr_m(str))
