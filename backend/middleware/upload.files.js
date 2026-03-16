Parse.Cloud.define("uploadImage", async (request) => {

  const files = request.files;

  if (!files || !files.file) {
    throw new Error("No file uploaded");
  }

  const fileData = files.file;

  const parseFile = new Parse.File(fileData.name, fileData);

  await parseFile.save({ useMasterKey: true });

  return {
    url: parseFile.url()
  };

});