
import * as BiIcons from 'react-icons/bi';
import fs from 'fs';

const allIcons = Object.keys(BiIcons);
fs.writeFileSync('all_bi_icons.txt', allIcons.join('\n'));
console.log('Wrote', allIcons.length, 'icons to all_bi_icons.txt');
