import React, { useState, useEffect } from "react";
import { copy, loader, tick, defaultImage, curious, search } from "../assets";
import { useLazyGetFactsQuery } from "../services/facts";
import { useGenerateImageMutation } from "../services/image";
import toast from "react-hot-toast";

const Output = () => {
  const [fact, setFact] = useState({
    prompt: "",
    facts: [],
    image: "",
  });
  const [allFacts, setAllFacts] = useState([]);
  const [copied, setCopied] = useState("");
  const [getFacts, { error, isFetching }] = useLazyGetFactsQuery();
  const [generateImage, { error: imageError, isLoading }] =
    useGenerateImageMutation();

  useEffect(() => {
    const factsFromLocalStorage = JSON.parse(localStorage.getItem("facts"));

    if (factsFromLocalStorage) {
      setAllFacts(factsFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getFacts({
      prompt: fact.prompt,
    });

    if (data?.facts) {
      const response = await generateImage({
        prompt: `${fact.prompt}, masterpiece, hyper detail, symmetrical balance, in-frame, RAW photo, (high detailed skin:1.2), 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3`,
        negative_prompt:
          "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
        width: "512",
        height: "512",
        samples: "1",
        num_inference_steps: "50",
        seed: null,
        guidance_scale: 7,
        safety_checker: "yes",
        multi_lingual: "no",
        panorama: "no",
        self_attention: "no",
        upscale: "no",
        embeddings_model: null,
        webhook: null,
        track_id: null,
      });
      if (response?.data?.output[0]) {
        const newFact = {
          ...fact,
          facts: data.facts,
          image: response?.data?.output[0],
        };
        const updatedAllFacts = [newFact, ...allFacts];

        setFact(newFact);
        setAllFacts(updatedAllFacts);

        localStorage.setItem("facts", JSON.stringify(updatedAllFacts));
      }
    }
  };

  const handleCopy = (copyFacts) => {
    setCopied(copyFacts);
    navigator.clipboard.writeText(copyFacts);
    toast.success("Copied facts successfully!");
    setTimeout(() => setCopied(""), 3000);
  };

  const downloadImage = async (image, prompt) => {
    try {
      const response = await fetch(image);
      if (!response.ok) {
        throw new Error("Image download failed");
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${prompt}.jpg`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error. Oops, that's unexpected!");
    }
  };

  return (
    <section
      id="visualizer"
      className="mt-16 md:max-w-xl max-w-md md:w-[576px] w-full"
    >
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center w-full"
          onSubmit={handleSubmit}
        >
          <img
            src={curious}
            alt="Curious Icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            placeholder="Try searching for The Milky Way!"
            value={fact.prompt}
            onChange={(e) => {
              setFact({ ...fact, prompt: e.target.value });
            }}
            required
            className="prompt_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <img
              src={search}
              alt="Search Icon"
              className="absolute left-0 my-2 mx-2 w-5"
            />
          </button>
        </form>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allFacts.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setFact(item)}
              className="prompt_card font-satoshi text-sm"
            >
              <div className="flex gap-3 items-center">
                <div key={index} className="image_card">
                  <img
                    src={item.image}
                    alt={item.prompt}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                {/* <div
                  className="copy_btn"
                  onClick={() => downloadImage(item.image, item.prompt)}
                >
                  <img
                    src={download}
                    alt="Download Icon"
                    className="w-[40%] h-[40%] object-contain"
                  />
                </div> */}
                <span className="font-semibold">Facts:</span>{" "}
                {`${item.facts[0].substring(0, 50)}...`}
              </div>
              <div className="copy_btn" onClick={() => handleCopy(item.facts)}>
                <img
                  src={copied === item.facts ? tick : copy}
                  alt="Copy Icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 max-w-full flex justify-center items-center">
        <div className="flex flex-col gap-3 w-full">
          <h2 className="font-satoshi font-bold text-gray-600 text-xl">
            {allFacts.length == 0 || fact.facts.length == 0
              ? "Let's craft your very first masterpiece!"
              : "Presenting you fascinating facts and captivating visuals!"}
            <span className="blue_gradient"></span>
          </h2>
          <div className="result_box">
            {isFetching || isLoading ? (
              <div className="w-full aspect-square flex justify-center items-center">
                <img
                  src={loader}
                  alt="Loader"
                  className="w-20 h-20 object-contain"
                />
              </div>
            ) : error || imageError ? (
              <div className="w-full aspect-square flex justify-center items-center">
                <p className="font-inter font-bold text-black text-center">
                  Oops, that's unexpected! Give it another shot, and let's see
                  if the digital dice roll in your favor this time!
                  <br />
                  <span className="font-satoshi font-normal text-gray-700">
                    {(error && error?.data?.error) ||
                      (imageError && imageError?.data?.error)}
                  </span>
                </p>
              </div>
            ) : (
              <div>
                <ol className="list-decimal ml-[25px]">
                  {fact.facts?.map((item, index) => (
                    <li key={index} className="mb-2 font-satoshi">
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                      {!item.endsWith(".") && "."}
                    </li>
                  ))}
                </ol>
                <img
                  src={fact.facts?.length ? fact.image : defaultImage}
                  alt={fact.prompt}
                  className={`${
                    fact.facts?.length ? "mt-[24px]" : ""
                  } w-full aspect-square rounded-md object-cover`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Output };
