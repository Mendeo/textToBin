'use strict';
'use strict';
const fs = require('fs');
const path = require('path');
const input = process.argv[2];

if (!input)
{
	console.log(`INPUT_FILE [-x, --hex]
You should specify input text file with bit simbols (0 or 1) or hex simbols (0-F)
--hex or -x key to force read input file in hex mode`);
	process.exit(0);
}
let data = fs.readFileSync(input).toString();
data = data.replace(/\r|\n|\s/g, '');
if (data.match(/[^0-9A-F]/i) !== null)
{
	console.error('Text must contain bit simbols (0 or 1) or hex simbols (0-F)');
	process.exit(1);
}
let isHex = data.match(/[2-9A-F]/i) !== null;
if (!isHex && (process.argv[3] === '--hex' || process.argv[3] === '-x')) isHex = true;
let result = null;
if (isHex)
{
	if (data.length % 2 !== 0) data = data + '0';
	result = Buffer.from(data, 'hex');
}
else
{
	let zeros = 8 - data.length % 8;
	if (zeros !== 8)
	{
		const strArr = new Array(zeros);
		for (let i = 0; i < zeros; i++)
		{
			strArr[i] = '0';
		}
		data = data + strArr.join('');
	}
	result = new Uint8Array(data.length / 8);
	let j = 0;
	for (let i = 0; i < result.length; i++)
	{
		const strByte = data.slice(j, j + 8);
		j += 8;
		let b = 0;
		for (let k = 7; k >= 0 ; k--)
		{
			if (strByte[k] === '1') b |= 1 << 7 - k;
		}
		result[i] = b;
	}

}

fs.writeFileSync(path.basename(input, '.txt') + '.bin', result);
