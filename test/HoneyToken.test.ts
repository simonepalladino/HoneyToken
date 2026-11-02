import { expect } from "chai";
import { ethers } from "hardhat";

describe("HoneyToken Security Tests", function () {
  let honey: any;
  let owner: any;
  let user: any;
  let attacker: any;

  beforeEach(async () => {
    [owner, user, attacker] = await ethers.getSigners();
    const HoneyToken = await ethers.getContractFactory("HoneyToken");
    honey = await HoneyToken.deploy();
    await honey.waitForDeployment();
    await honey.setWhitelist(await user.getAddress(), true);
  });

  it("Whitelisted user can transfer", async () => {
    await honey.transfer(await user.getAddress(), ethers.parseEther("10"));
    expect(await honey.balanceOf(await user.getAddress())).to.equal(ethers.parseEther("10"));
  });

  it("Attacker is blocked", async () => {
    await honey.transfer(await attacker.getAddress(), ethers.parseEther("5"));

    await expect(
      honey.connect(attacker).transfer(await user.getAddress(), ethers.parseEther("1"))
    ).to.be.revertedWith("HoneyToken: Unauthorized transfer detected");

    expect(await honey.flaggedAsAttacker(await attacker.getAddress())).to.equal(true);
    expect(await honey.lockedFunds(await attacker.getAddress())).to.equal(ethers.parseEther("1"));
  });
});

