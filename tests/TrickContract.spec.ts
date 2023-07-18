import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { TrickContract } from '../wrappers/TrickContract';
import '@ton/test-utils';
import {randomAddress} from "@ton-community/test-utils";
import { compile } from '@ton/blueprint';

describe('TrickContract', () => {
    let code: Cell;
    let sender: SandboxContract<TreasuryContract>;

    beforeAll(async () => {
        code = await compile('TrickContract');
    });

    let blockchain: Blockchain;
    let main: SandboxContract<TrickContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        sender = await blockchain.treasury('sender');

        main = blockchain.openContract(TrickContract.createFromConfig({
            addr: randomAddress()
        }, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await main.sendDeploy(deployer.getSender(), toNano('2.00'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: main.address,
            deploy: true,
            success: true,
        });
    });

   it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and trickContract are ready to use
    });

    it('should throw calculate fees', async () => {

        const time1 = Math.floor(Date.now() / 1000)
        const time2 = time1 + 365 * 24 * 60 * 60;  // offset 1 year

        blockchain.now = time1;
        const res = await main.sendMessage(sender.getSender(), toNano('0.05'));

        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: main.address,
            success: true,
        });


        printTransactionFees(res.transactions);

        blockchain.now = time2;
        const res2 = await main.sendMessage(sender.getSender(), toNano('0.05'));

        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: main.address,
            success: true,
            outMessagesCount: 1
        });

        printTransactionFees(res2.transactions);

    })


});


