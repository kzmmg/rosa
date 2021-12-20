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

dataset = ds.split("\n")

let d = []
let pot = []
let acc = []
let pl = []

let s1 = dataset[0]
let s2 = dataset[1]
for (let i = 0; i <= s1.length; i++) {
	d[i] = []
	pot[i] = []
	acc[i] = []
	pl[i] = []
	
	d[i][0] = i
	pot[i][0] = 0
	acc[i][0] = 0
	pl[i][0] = 0
}
for (let j = 0; j <= s2.length; j++) {
	d[0][j] = j
	pot[0][j] = 0
	acc[0][j] = 0
	pl[0][j] = 0
}

let s1a = ""
let s2a = ""

for (let i = 1; i <= s1.length; i++) {
	for (let j = 1; j <= s2.length; j++) {
		
		acc[i][j] = 0
		
		let aijm1 = d[i][j-1] || 0
		let aim1j = d[i-1] && d[i-1][j] || 0
		let aim1jm1 = d[i-1] && d[i-1][j-1] || 0
		
		
		let plo = s1[i-1] !== s2[j-1] ? 1 : 0
		pl[i][j] = plo
		
		let min = Math.min(aijm1 + 1,aim1j + 1,aim1jm1 + plo)
		d[i][j] = min
	}
}

let i = s1.length;
let j = s2.length;


acc[s1.length][s2.length] = true

let wf = (fromi, fromj) => {
	let im1 = d[fromi-1] && d[fromi-1][fromj]
	let jm1 = d[fromi][fromj-1]
	let m2 = d[fromi-1] && d[fromi-1][fromj-1]
	m2 = pl[fromi][fromj] + m2
	im1 = im1 + 1
	jm1 = jm1 + 1
	
	let from = d[fromi][fromj]
	
	let wf0 = []
	if (from === m2 && fromi >=0 && fromj >=0) {
		wf0.push([fromi-1,fromj-1])
	}
	
	if (from === im1 && fromi >= 0) {
		wf0.push([fromi-1,fromj])
	}
	
	if (from === jm1 && fromj >= 0) {
		wf0.push([fromi, fromj-1])
	}
	
	return wf0
}

console.log(wf(2,2))


let hasway = (toi, toj, fromi, fromj) => {
	let from = d[fromi] && d[fromi][fromj];
	
	if (from === void 0) return false
	
	let waysfrom = wf(fromi, fromj)
	
	if(toi==1 && toj===1) console.log("WFS", waysfrom);
	
	for (let i = 0; i < waysfrom.length;i++) {
		if (waysfrom[i][0] == toi && waysfrom[i][1] == toj) return true
	}
	
	return false
	
};

console.log("hasWAY", hasway(1,1,2,2))
acc[s1.length][s2.length] = 1
for (let i = s1.length; i>=0; i--) {
	for (let j = s2.length; j>=0; j--) {
		if(acc[i][j]) continue
		
		
		// if ANY neighbor acc and has way to it then cell is acc
		let n1 = acc[i+1] && acc[i+1][j]
		let n2 = acc[i][j+1]
		let n3 = acc[i+1] && acc[i+1][j+1]
				
		if(!n1 && !n2 && !n3) {
			acc[i][j] = 0;
			continue
		}
		
		acc[i][j] = 0
		
		if (n1 && hasway(i, j, i+1,j)) {
			acc[i][j] = 1
		}
		
		if (n2 && hasway(i, j, i,j+1)) {
			acc[i][j] = 1
		}
		
		if (n3 && hasway(i, j, i+1,j+1)) {
			acc[i][j] = 1
		}
		
		if(i==1 && j==1) {
			console.log(acc[i][j], n1, n2, n3, hasway(i, j, i+1,j+1))
		}
	}
}

let n = 1
pot[0][0] = 1
console.log("1,0 acc", acc[1][0], wf(1,0))
for(let i = 0; i <= s1.length; i++) {
	for(let j = 0; j <= s2.length; j++) {
		if (pot[i][j]) continue
		pot[i][j] = 0
		if(!acc[i][j]) continue
		
		let wfs = wf(i,j);
		if(i==1 && j==0) {
			console.log("from ins", wfs)
		}
		for (let k = 0; k < wfs.length; k++) {
			let way = wfs[k];
			
			if (!acc[way[0]][way[1]]) continue
			let pot0 = pot[way[0]][way[1]]
			
			pot[i][j] += pot0
			pot[i][j] %= 134217727
		}
		
	}
}

/*console.log(pot.map(i => i.join(" ")).join("\n"))*/
let [n1,n2] = [1,1]
for(let i =0; i <= s1.length; i++) {
	for(let j = 0; j <= s2.length; j++) {
		if (pot[i][j]) {
			n += pot[i][j]
			n %= 134217727
			n1++
		}
		if (acc[i][j]) {
			n2++
		}
	}
}

while(i > 0 && j > 0) {
	if(d[i-1][j] < d[i][j]) {
		s1a = s1[i-1] + s1a
		s2a = "-" + s2a
		i--
	} else if (d[i][j-1] < d[i][j]) {
		s1a = "-" + s1a
		s2a = s2[j-1] + s2a
		j--
	} else if (d[i-1][j-1] < d[i][j]) {
		s1a = s1[i-1] + s1a
		s2a = s2[j-1] + s2a
		i--
		j--
	} else {
		s1a = s1[i-1] + s1a
		s2a = s2[j-1] + s2a
		i--
		j--
	}
}

/*for(let i = 740; i<=s1.length;i++) {
	for(let j = 800;j <=s2.length;j++) {
		process.stdout.write(d[i][j] + " ")
	}
	console.log()
}
for(let i = 740; i<=s1.length;i++) {
	for(let j = 800;j <=s2.length;j++) {
		process.stdout.write(pl[i][j] + " ")
	}
	console.log()
}


for(let i = 740; i<=s1.length;i++) {
	for(let j = 800;j <=s2.length;j++) {
		process.stdout.write(acc[i][j] + " ")
	}
	console.log()
}


console.log(n1,n2,s1.length, s2.length/*, wf(747,813))
console.log("----d:")
console.log(d.map(i => i.join("\t")).join("\n"))
console.log("----pl:")
console.log(pl.map(i => i.join(" ")).join("\n"))

console.log("----acc:")
console.log(acc.map(i => i.join(" ")).join("\n"))

console.log("----pot:")
console.log(pot.map(i => i.join(" ")).join("\n"))*/





fs.writeFileSync("answer.txt", d[s1.length][s2.length] + "\n" + s1a + "\n" + s2a + "\n" + pot[s1.length][s2.length])
