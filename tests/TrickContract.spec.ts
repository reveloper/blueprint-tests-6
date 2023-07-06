import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { TrickContract } from '../wrappers/TrickContract';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

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

        main = blockchain.openContract(TrickContract.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await main.sendDeploy(deployer.getSender(), toNano('0.05'));

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

    it('should send message', async () => {
        const res = await main.sendMessage(sender.getSender(), toNano('0.05'));

        expect(res.transactions).toHaveTransaction({
            from: sender.address,
            to: main.address,
            success: true,

        });

        printTransactionFees(res.transactions);
    })
});
