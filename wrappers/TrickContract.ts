import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type TrickContractConfig = {
    addr: Address
};

export function trickContractConfigToCell(config: TrickContractConfig): Cell {
    return beginCell()
        .storeAddress(config.addr)
        .endCell();
}

export class TrickContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new TrickContract(address);
    }

    static createFromConfig(config: TrickContractConfig, code: Cell, workchain = 0) {
        const data = trickContractConfigToCell(config);
        const init = { code, data };
        return new TrickContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendMessage(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(1, 32)
                .endCell(),
        });
    }
}
