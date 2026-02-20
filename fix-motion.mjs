import fs from 'fs';
let content = fs.readFileSync('apps/web/src/components/decrypted-text.tsx', 'utf8');

// replace opening span
content = content.replace(
  /return \(\n\t\t<span\n\t\t\tclassName=\{parentClassName\}/,
  'return (\n\t\t<motion.span\n\t\t\tclassName={parentClassName}'
);

// replace closing span
content = content.replace(
  /\t\t<\/span>\n\t\);\n\}/,
  '\t\t</motion.span>\n\t);\n}'
);

fs.writeFileSync('apps/web/src/components/decrypted-text.tsx', content);
