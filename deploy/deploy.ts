import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedCipherArena = await deploy("CipherArena", {
    from: deployer,
    log: true,
  });

  console.log(`CipherArena contract: `, deployedCipherArena.address);
};
export default func;
func.id = "deploy_cipherArena"; // id required to prevent reexecution
func.tags = ["CipherArena"];
