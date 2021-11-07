import { resolve } from 'https://deno.land/std@0.113.0/path/mod.ts';

const contract = resolve(Deno.cwd(), 'contracts', 'Inbox.sol');
const output = resolve(Deno.cwd(), 'bin');
const p = Deno.run({
    cmd: ['solc', '-o', output, '--abi', '--bin', '--overwrite', contract]
})

await p.status();
p.close();
