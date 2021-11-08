import { resolve } from 'https://deno.land/std@0.113.0/path/mod.ts';
import { filterValues } from 'https://deno.land/std@0.113.0/collections/mod.ts';
import { assert, assertEquals } from 'https://deno.land/std@0.113.0/testing/asserts.ts';
import Web3 from 'https://deno.land/x/web3@v0.4.3/mod.ts'

const web3 = new Web3('ws://localhost:8545');
const Contract = web3.eth.Contract;
const decoder = new TextDecoder('utf8');
const contractData = await Deno.readFile(resolve(Deno.cwd(), 'bin', 'Inbox.bin'));
const abiData = await Deno.readFile(resolve(Deno.cwd(), 'bin', 'Inbox.abi'));
const contract = decoder.decode(contractData);
const abi = decoder.decode(abiData);

let accounts;
let inbox;

Deno.test('Deploy Contract 1', async () => {
    accounts = await web3.eth.getAccounts();

    await deployContract(accounts[0]);
    assert(inbox.options.address);
})

Deno.test('It has a default message', async () => {
    accounts = await web3.eth.getAccounts();

    await deployContract(accounts[0]);

    const message = await inbox.methods.message().call();

    assertEquals(message, 'Its Mente from Ethereum');
})

Deno.test('It can update message', async () => {
    accounts = await web3.eth.getAccounts();

    await deployContract(accounts[0]);
    await inbox.methods.setMessage('Its Mente from the Test').send({
        from: accounts[0]
    });

    const message = await inbox.methods.message().call();

    assertEquals(message, 'Its Mente from the Test');
})

async function deployContract(account) {
    inbox = await new Contract(JSON.parse(abi))
        .deploy({
            data: contract,
            arguments: ['Its Mente from Ethereum']
        })
        .send({ from: account, gas: '1000000' })
}

function closeConnections() {
    const ignore = ['stdin', 'stdout', 'stderr'];
    const openIds = Object.keys(filterValues(Deno.resources(), (it) => ignore.includes(it) == false));

    openIds.forEach((id) => Deno.close(Number(id)));
}
