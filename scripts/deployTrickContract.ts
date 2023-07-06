import { toNano } from 'ton-core';
import { TrickContract } from '../wrappers/TrickContract';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const trickContract = provider.open(TrickContract.createFromConfig({}, await compile('TrickContract')));

    await trickContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(trickContract.address);

    // run methods on `trickContract`
}
