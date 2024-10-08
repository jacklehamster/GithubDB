define(["chai", "testWrapper", "../githubAPI/githubConnector.js"], function (
  chai,
  testWrapper,
  GithubConnector
) {
  var expect = chai.expect;
  var mainName = "githubAPI-githubConnector";

  testWrapper.execTest(
    mainName,
    "should get test file content",
    async function () {
      await GithubConnector.setData("test_key", { "super data": 123 });

      return GithubConnector.getData("test_key").then(function (data) {
        expect(data.data).to.eql({ "super data": 123 });
        return Promise.resolve();
      });
    }
  );

  testWrapper.execTest(mainName, "should return empty if no file", function () {
    return GithubConnector.getData("something_which_dont_exist").then(function (
      data
    ) {
      expect(data).to.eql({ data: null, sha: null });
      return Promise.resolve();
    });
  });

  testWrapper.execTest(mainName, "should set test file content", function () {
    return GithubConnector.setData("test_set_key", {
      key1: 12,
      key2: "key2Value",
    }).then(function (data) {
      expect(data.data).to.eql({
        key1: 12,
        key2: "key2Value",
      });
      return Promise.resolve();
    });
  });

  testWrapper.execTest(mainName, "should get/set keys", function () {
    var key = "test_get_set_key";
    var data = {
      something: 123,
      test: "something like that is a test",
    };
    var data2 = {
      something: 123123123,
      haha: "plop",
    };
    return GithubConnector.setData(key, data).then(function (result) {
      expect(result.data).to.eql(data);
      return GithubConnector.getData(key).then(function (result) {
        expect(result.data).to.eql(data);
        return GithubConnector.setData(key, data2).then(function (result) {
          expect(result.data).to.eql(data2);
          return GithubConnector.getData(key).then(function (result) {
            expect(result.data).to.eql(data2);
          });
        });
      });
    });
  });

  testWrapper.execTest(mainName, "should set test file content", function () {
    return GithubConnector.setData("test_set_key", {
      key1: 12,
      key2: "key2Value",
    }).then(function (data) {
      expect(data.data).to.eql({
        key1: 12,
        key2: "key2Value",
      });
      return Promise.resolve();
    });
  });

  testWrapper.execTest(
    mainName,
    "should set test binary content",
    async function () {
      const response = await fetch("icon.png");
      const blob = await response.blob();
      const result = await GithubConnector.setData("test_set_binary.png", blob);
      expect(result.data).to.eql(blob);
    }
  );

  testWrapper.execTest(mainName, "should list keys", async function () {
    await GithubConnector.setData("test_key", { "super data": 123 });
    await GithubConnector.setData("folder/test_key", { "super data": 123 });

    const result = await GithubConnector.listKeys();
    expect(result).to.include({ type: "blob", key: "test_key.json" });
    expect(result).to.include({ type: "blob", key: "folder/test_key.json" });
    expect(result).to.include({ type: "tree", key: "folder" });
  });

  testWrapper.execTest(
    mainName,
    "should delete file content",
    async function () {
      await GithubConnector.setData("to_delete", { "super data": 123 });

      const result = await GithubConnector.listKeys();
      expect(result).to.include({ type: "blob", key: "to_delete.json" });
      await GithubConnector.setData("to_delete", null);

      const result2 = await GithubConnector.listKeys();
      expect(result2).not.to.include({ type: "blob", key: "to_delete.json" });
    }
  );

  testWrapper.execTest(
    mainName,
    "should check list keys after creating new items",
    async function () {
      await GithubConnector.setData("new_item", null);
      await GithubConnector.setData("new_item", { "super data": 123 });

      const result = await GithubConnector.listKeys();
      expect(result).to.include({ type: "blob", key: "new_item.json" });
    }
  );
});
