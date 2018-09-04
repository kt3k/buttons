const { describe, it } = require("kocha");
const assert = require("assert");
const { User } = require("..");

const repository = new User.Repository();

describe("UserRepository", () => {
  describe("save", () => {
    it("saves the user", async () => {
      const mojombo = new User({
        authId: "github|1",
        displayId: "mojombo",
        displayName: "Tom Preston-Werner",
        buttons: []
      });

      await repository.save(mojombo);

      const user = await repository.getByAuthId("github|1");

      assert(user instanceof User);
    });
  });
});
