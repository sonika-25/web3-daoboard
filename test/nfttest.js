const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
	let aList;
	let account1;
	let account2;

	beforeEach("deploy contract", async () => {
		const accounts = await ethers.getSigners();

		account1 = accounts[1];
		account2 = accounts[2];
		const Nft = await ethers.getContractFactory("NFT");
		nft = await Nft.deploy(account1.address);
		await nft.deployed();
	});

	describe("create", function () {
		it("should create a token", async function () {
      await nft.connect(account1).createToken("https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg")
      let id = await nft.connect(account1).balanceOf(account1.address);
			await expect(id.toNumber()).to.be.an('number');
		});
		it("not create a token", async function () {
      await expect(
				nft.connect(account2).createToken("https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg")
			).to.be.revertedWith("not authorized to create NFTs");
		});
		it("should return tokenURI ", async function () {
			await nft.connect(account1).createToken("https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg")
      let id = await nft.connect(account1).tokenURI(1);
			await expect(id).to.be.a('string');
		});
		it("should return name ", async function () {
      let id = await nft.connect(account1).name();
			console.log(id);
			await expect(id).to.be.a('string');
		});
/*
		it("should revert when invalid animal is provided", async function () {
			await expect(
				petPark.connect(owner).add(AnimalType.None, 5)
			).to.be.revertedWith("Invalid animal");
		});

		it("should emit added event when pet is added", async function () {
			await expect(petPark.connect(owner).add(AnimalType.Fish, 5))
				.to.emit(petPark, "Added")
				.withArgs(AnimalType.Fish, 5);
		});
  */
	});
/*
	describe("borrow", function () {
		it("should revert when age is 0", async function () {
			await expect(
				petPark.borrow(0, Gender.Male, AnimalType.Fish)
			).to.be.revertedWith("Invalid Age");
		});

		it("should revert when animal is not available in park", async function () {
			await expect(
				petPark.borrow(24, Gender.Male, AnimalType.Fish)
			).to.be.revertedWith("Selected animal not available");
		});

		it("should revert when animal type is invalid", async function () {
			await expect(
				petPark.borrow(24, Gender.Male, AnimalType.None)
			).to.be.revertedWith("Invalid animal type");
		});

		it("should revert when men attempt to borrow animals other than fish and dog", async function () {
			await petPark.add(AnimalType.Cat, 5);
			await petPark.add(AnimalType.Rabbit, 5);
			await petPark.add(AnimalType.Parrot, 5);

			await expect(
				petPark.borrow(24, Gender.Male, AnimalType.Cat)
			).to.be.revertedWith("Invalid animal for men");

			await expect(
				petPark.borrow(24, Gender.Male, AnimalType.Rabbit)
			).to.be.revertedWith("Invalid animal for men");

			await expect(
				petPark.borrow(24, Gender.Male, AnimalType.Parrot)
			).to.be.revertedWith("Invalid animal for men");
		});

		it("should revert when women under 40 attempt to borrow cat", async function () {
			await petPark.add(AnimalType.Cat, 5);

			await expect(
				petPark.borrow(24, Gender.Female, AnimalType.Cat)
			).to.be.revertedWith("Invalid animal for women under 40");
		});

		it("should revert when pet is already borrowed", async function () {
			await petPark.add(AnimalType.Fish, 5);
			await petPark.add(AnimalType.Cat, 5);

			await petPark
				.connect(account1)
				.borrow(24, Gender.Male, AnimalType.Fish);

			await expect(
				petPark
					.connect(account1)
					.borrow(24, Gender.Male, AnimalType.Fish)
			).to.be.revertedWith("Already adopted a pet");

			await expect(
				petPark
					.connect(account1)
					.borrow(24, Gender.Male, AnimalType.Cat)
			).to.be.revertedWith("Already adopted a pet");
		});

		it("should revert when address details do not match from previous calls", async function () {
			await petPark.add(AnimalType.Fish, 5);

			await petPark
				.connect(account1)
				.borrow(24, Gender.Male, AnimalType.Fish);

			await expect(
				petPark
					.connect(account1)
					.borrow(23, Gender.Male, AnimalType.Fish)
			).to.be.revertedWith("Invalid Age");

			await expect(
				petPark
					.connect(account1)
					.borrow(24, Gender.Female, AnimalType.Fish)
			).to.be.revertedWith("Invalid Gender");
		});

		it("should emit borrowed event when valid details are provided", async function () {
			await petPark.add(AnimalType.Fish, 5);

			await expect(
				petPark
					.connect(account1)
					.borrow(24, Gender.Male, AnimalType.Fish)
			)
				.to.emit(petPark, "Borrowed")
				.withArgs(AnimalType.Fish);
		});

		it("should decrease pet count when valid details are provided", async function () {
			await petPark.add(AnimalType.Fish, 5);

			let originalPetCount = await petPark.animalCounts(AnimalType.Fish);
			originalPetCount = originalPetCount.toNumber();
			await petPark
				.connect(account1)
				.borrow(24, Gender.Male, AnimalType.Fish);

			let reducedPetCount = await petPark.animalCounts(AnimalType.Fish);
			reducedPetCount = reducedPetCount.toNumber();

			expect(originalPetCount).to.equal(reducedPetCount + 1);
		});
	});

	describe("giveBackAnimal", function () {
		it("should revert when caller has never borrowed a pet", async function () {
			await expect(
				petPark.connect(account1).giveBackAnimal()
			).to.be.revertedWith("No borrowed pets");
		});

		it("should increment the pet count of that animal by 1", async function () {
			await petPark.add(AnimalType.Fish, 5);

			await petPark
				.connect(account1)
				.borrow(24, Gender.Male, AnimalType.Fish);
			let reducedPetCount = await petPark.animalCounts(AnimalType.Fish);
			reducedPetCount = reducedPetCount.toNumber();

			await petPark.connect(account1).giveBackAnimal();
			let currentPetCount = await petPark.animalCounts(AnimalType.Fish);
			currentPetCount = currentPetCount.toNumber();

			expect(reducedPetCount).to.equal(currentPetCount - 1);
		});
	});
  */
});
