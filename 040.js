// ((dog:4,cat:3):74,robot:98,elephant:58);
// dog:4,cat:3):74,robot:98,elephant:58
// :4,cat:3):74,robot:98,:58
// :4,:3):74,:98,:58
// 4 (start) + 74 (clbr) + 58 (end)
// start + end + clbr*w + opbr*w

// Distances in Trees
// rosalind.info/problems/nwck/

const fs = require("fs")

let dataset = fs.readFileSync("dataset.txt").toString().split("\r\n")

let data = []
for(let i = 0; i < dataset.length; i += 3) {
	let tree = dataset[i]
	let pair = dataset[i+1]
	
	data.push([tree, pair.split(" ")])
}

let dists = []

function redt(t, p) {
	let o1 = p[0]
	let o2 = p[1]
	
	let i1 = t.indexOf(o1)
	let i2 = t.indexOf(o2)
	
	let i, o
	
	if (i1 > i2) {
		i = i1
		o = o1
	} else {
		i = i2
		o = o2
	}
	
	let len = o.length
	
	let i0 = i + len
	for (; i0 < t.length; i0++) {
		let ch = t[i0]
		
		console.log("ch", ch)
		if (ch === ":" || [...Array(10).keys()].indexOf(+ch) !== -1) continue
		else break
	}
	
	console.log(i1,i2, i0, len, o.length)
	console.log(t)
	console.log(o1,o2)
	console.log("=====")
	t = t.substring(Math.min(i1,i2), i0)
	console.log(t)
	console.log("++++++++++")
	
	t = t.replace(/[^\(\)\,0-9\:\>\<]*/g, "")
	
	console.log(t)
	console.log("++++++++++")
	
	return t
}

function nwckd(t) {
	let num_cl = 0
	let num_op = 0
	
	let is_p2 = false
	
	let start = 0
	let end = 0
	
	let i = 0
	for (; i < t.length; i++) {
		let ch = t[i]
		if (is_price(ch)) continue
		else break
	}
	
	console.log(t)
	start = +t.substring(0, i).substr(1)
	
	t = t.substring(i)
	
	i = t.length - 1
	let j = 0
	for (; i >= 0; i--) {
		let ch = t[i]
		if (is_price(ch)) {
			j++
			continue
		}
		else break
	}
	
	end = +t.substr(-j).substr(1)
	
	t = t.substring(0, i + 1)
	
	console.log("STARTEND", start, end)
	
	
	for (i = 0; i < t.length; i++) {
		let ch = t[i]
		
		if (ch == "(") {
			num_op += know_op_w(t, i)
		}
		
		if (ch == ")") {
			if (num_op) num_op-= know_cl_w(t,i)
			else {
				num_cl += know_cl_w(t,i)
			}
		}
	}
	
	let count = start + end + num_op + num_cl
	
	return count
}

function is_price(ch) {
	return ch === ":" || [...Array(10).keys()].indexOf(+ch) !== -1
}

function know_cl_w(t, i0) {
	let i = i0 + 1
	for(; i < t.length; i++) {
		//console.log(t[i], is_price(t[i]))
		if(!is_price(t[i])) {
			break
		}
	}
	
	//console.log(t, i0, i)
	let price = +t.substring(i0 + 1, i).substr(1)
	//console.log("raw price", price)
	if (!price) price = 0
	return price
}

function know_op_w(t, i0) {
	let i = i0 + 1
	for(; i < t.length; i++) {
		//console.log(t[i], is_price(t[i]))
		let ch = t[i]
		if(!(ch === ">" || [...Array(10).keys()].indexOf(+ch) !== -1)) {
			break
		}
	}
	
	//console.log(t, i0, i)
	let price = +t.substring(i0 + 1, i).substr(1)
	//console.log("raw price", price)
	if (!price) price = 0
	return price
}

function mark_op(t) {
	let op_stack = []
	let prices = []
	for (let i = 0; i < t.length; i++) {
		let ch = t[i]
		
		if (ch === "(") {
			op_stack.push(i)
			//console.log(i)
		} else if (ch === ")" && op_stack.length) {
			let op = op_stack.pop()
			prices.push([op, know_cl_w(t, i)])
		}
	}
	
	return prices
}

function mark_tree(t, p) {
	p = p.concat([])
	for(let i = 0; i < t.length/*increasing*/; i++) {
		if(t[i] === "(") {
			let pr = p.pop()
			let pre = t.substring(0, i + 1)
			let post = t.substring(i + 1)
			t = pre + ">" + pr + "<" + post
		}
	}
	
	return t
}

for (let i = 0; i < data.length; i++) {
	let tree = data[i][0]
	let pair = data[i][1]
	
	let prices = mark_op(tree)
	
	prices.sort((a,b) => {
		if(a[0] < b[0]) return 1
		else if (a[0] > b[0]) return -1
		else return 0
	})
	prices = prices.map(a => a[1])
	tree = mark_tree(tree, prices)
	tree = redt(tree, pair)
	let d = nwckd(tree)
	dists.push(d)
}

console.log(dists)	
fs.writeFileSync("answer.txt", dists.join(" "))
