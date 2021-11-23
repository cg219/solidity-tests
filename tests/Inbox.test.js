import { resolve } from 'https://deno.land/std@0.113.0/path/mod.ts';
import { filterValues } from 'https://deno.land/std@0.113.0/collections/mod.ts';
import { assert, assertEquals } from 'https://deno.land/std@0.113.0/testing/asserts.ts';
import Web3 from 'https://deno.land/x/web3@v0.7.3/mod.ts'

const web3 = new Web3('ws://localhost:7545');
const decoder = new TextDecoder('utf8');
const contractData = await fetch(`file://${resolve(Deno.cwd(), 'bin', 'Inbox.bin')}`);
const abiData = await fetch(`file://${resolve(Deno.cwd(), 'bin', 'Inbox.abi')}`);
const contract = await contractData.text();
const abi = await abiData.json();

let accounts;
let inbox;

Deno.test({
    name: 'Deploy Contract 1',
    async fn() {
        accounts = await web3.eth.getAccounts();
        await deployContract(accounts[0]);
        assert(inbox.options.address);
    },
    sanitizeResources: false
})

Deno.test({
    name: 'It has a default message',
    async fn() {
        accounts = await web3.eth.getAccounts();
        await deployContract(accounts[0]);
        const message = await inbox.methods.message().call();
        assertEquals(message, 'Its Mente from Ethereum');
    },
    sanitizeResources: false
})

Deno.test({
    name: 'It can update message',
    async fn() {
        accounts = await web3.eth.getAccounts();
        await deployContract(accounts[0]);
        await inbox.methods.setMessage('Its Mente from the Test').send({
            from: accounts[0]
        });

        const message = await inbox.methods.message().call();
        assertEquals(message, 'Its Mente from the Test');
    },
    sanitizeResources: false
})

async function deployContract(account) {
    inbox = await new web3.eth.Contract(abi)
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
