import { loadGeneratedData } from "@contentkit/generated";

const main = async () => {
    const data = await loadGeneratedData("Post");
    console.log(data);
};

main();