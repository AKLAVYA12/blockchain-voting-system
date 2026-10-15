
const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
  await deployer.deploy(Voting, [
    "Candidate A",
    "Candidate B",
  ]);
};
