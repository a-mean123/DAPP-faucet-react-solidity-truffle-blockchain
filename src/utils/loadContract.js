import contract from "@truffle/contract";

export const loadContract = async(name, provider) =>{

    const resContract = await fetch(`/contracts/${name}.json`);
    const Artifact = await resContract.json();
    const _contract = contract(Artifact);
    _contract.setProvider(provider);
    let deployed = null;

    try {
        deployed = await _contract.deployed();
    } catch (error) {
        console.log(error);
    }

    return deployed;


}