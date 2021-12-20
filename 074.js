/*
1 2 3 4 5 6 7 8 9 10
4 9
1 2 3 9 8 7 6 5 4 10
2 5
1 8 9 3 2 7 6 5 4 10


*/
// Longest Increasing Subsequence 
// rosalind.info/problems/lgis/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n\r\n")

//console.log(dataset)

dataset = dataset.map(i => i.split("\r\n").map(i=>i.split(" ").map(a=>+a)))

//console.log(dataset)

let counters = []

dataset.forEach((i) => {
	let first = i[0]
	let second = i[1]
	let counter = 0
	
	//let [current, target] = trimcurrent([first], second)
	let current = [first]
	let target = second
	current = current.map(e=>[e,[]])
	while(notin(current, target)) {
		//console.log(current, target)
		current = doreversals(current, target)
		//let res = trimcurrent(current, target)
		//current = res[0]
		//target = res[1]
		//console.log("current", current[0])
		//console.log("target", target)
		counter++
	}
	
	counters.push([counter, current[0][1]] )
})

function trimcurrent(current, target) {
//	console.log("t", target)
	let t = target
	current = current.map((i) => {
		let first = i
		let second = t
		let i1 = 0
		for (; i1 < first.length; i1++) {
			if (first[i1] !== second[i1]) {
				break
			}
		}
		
		first = first.slice(i1)
		second = second.slice(i1)
		
		
		for (i1 = first.length - 1; i1 >= 0; i1--) {
			if (first[i1] !== second[i1]) {
				break
			}
		}
		
		
		first = first.slice(0,i1+1)
		second = second.slice(0,i1+1)
		
		//console.log(first, second)
		return [first, second]
	})
	
	let lens = current.map((i) => i[0].length)
	
	let min = Math.min.apply(lens)
	
	if (min < target.length) {
		lens = lens.map(i => i - min)
		current = current.filter((a,i)=> !lens[i])
	}	
	
	target = current[0][1]
	current = current.map(i => i[0])
	
	return [current, target]
}

function notin (seqs, seq) {
	seq = seq.join("")
	seqs = seqs.map(a=>a[0].join(""))
	
	return seqs.indexOf(seq) === -1
}

function findbps(seq, target) {
	let bps = [0]
	
	for (let i = 0; i < seq.length - 1; i++) {
		if (Math.abs(target.indexOf(seq[i]) - target.indexOf(seq[i+1])) > 1) {
			bps.push(i+1)
		}
	}
	
	bps.push(seq.length + 1)
	
	return bps
}

function reverse(seq, i, j) {
	let rev = seq.slice(0, i).concat(seq.slice(i, j).reverse()).concat(seq.slice(j))
	/*console.log("......")
	console.log("ss", seq, i, j)
	console.log("ss", rev)*/
	return rev
}


function doreversals(sequences, target) {
	let res = []
	for (let k = 0; k < sequences.length; k++) {
		let seq = sequences[k][0]
		let trail = sequences[k][1]
		let bps = findbps(seq, target)
		
		for (let i = 0; i < bps.length; i++) {
			for (let j = i + 1; j < bps.length; j++) {
				res.push([reverse(seq, bps[i], bps[j]), trail.concat([[bps[i],bps[j]-1]])])
			}
		}
	}
	
	let bpsl = res.map(r => findbps(r[0], target).length)
	let min = Math.min.apply(void 0, bpsl)
	
	//console.log(min)
	bpsl = bpsl.map(a => a - min)
	
	res = res.filter((a,i) => !bpsl[i])
	
	return res
}

let out = counters.map(e=>e[0] + "\n" + e[1].map(e=>e.map(e=>e+1).join(" ")).join("\n")).join("\n")
console.log(out)
fs.writeFileSync("answer.txt", out)
