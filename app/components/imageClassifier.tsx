"use client";



import { useState, FormEvent } from "react";



export default function ImageClassifier() {

  // set up some variables to help manage component state

  const [file, setFile] = useState<File | null>(null);

  const [image, setImage] = useState<string | null>(null);

  const [response, setResponse] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [inputKey, setInputKey] = useState(new Date().toString());



  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setSubmitted(true);

    // prepare and submit our form

    const formData = new FormData();

    formData.append("file", file as File);

    fetch("/api/classify", {

      method: "POST",

      body: formData,

    }).then((res) => {

      // create a stream from the response

      const reader = res.body?.getReader();

      return new ReadableStream({

        start(controller) {

          return pump();

          function pump(): any {

            return reader?.read().then(({ done, value }) => {

              // no more data - exit our loop

              if (done) {

                controller.close();

                return;

              }

              controller.enqueue(value);
              console.log(value);
              
              // decode the current chunk and append to our response value

              const decoded = new TextDecoder("utf-8").decode(value);
              console.log('############################################');
              console.log(typeof decoded);
              console.log(decoded);
              console.log(decoded.length);
              
              //let removeJunkChars = decoded.substring(3, decoded.length - 2).trim();
              let decoded_trimmed = decoded.trim(); // remove last \n linefeed char
              console.log('#1');
              console.log(decoded_trimmed.length);
              
              
              //decoded_trimmed = decoded_trimmed.replace(/[\r|\n|\r\n]$/, '');
              //console.log('2');
              //console.log(decoded_trimmed.length);
              
              let parts = decoded_trimmed.split("\n"); //split by middle \n chars
              console.log('#2');
              console.log(parts);
              
              let temp = '';
              for(let i=0; i < parts.length; i++){
                let part = parts[i];
                console.log('#3');
                console.log(part);
                let removeJunkChars = part.substring(3, part.length - 1);
                console.log('#4');
                console.log(removeJunkChars);
                temp += removeJunkChars;
              }
              console.log('#5');
              console.log(temp);
              //return;
              //eval("let removeJunkChars = {"+ decoded +"}")
              //let removeJunkChars = {0:"me"}
              //return;
              setResponse((prev) => `${prev}${temp}`);

              return pump();

            });

          }

        },

      });

    });

  };



  // resets the form so we can upload more images

  const onReset = () => {

    setFile(null);

    setImage(null);

    setResponse("");

    setSubmitted(false);

    setInputKey(new Date().toString());

  };



  return (

    <div className="max-w-4xl">

      {image ? (

        <img

          src={image}

          alt="An image to classify"

          className="mb-8 w-full object-contain"

        />

      ) : null}

      <form onSubmit={onSubmit}>

        <input

          key={inputKey}

          type="file"

          accept="image/jpeg"

          onChange={(e) => {

            // sets or clears our image and file variables

            if (e.target.files?.length) {

              setFile(e.target?.files[0]);

              setImage(URL.createObjectURL(e.target?.files[0]));

            } else {

              setFile(null);

              setImage(null);

            }

          }}

        />

        <p className="py-8 text-slate-800">

          {submitted && !response ? "Sending your pic to famous Bostonian, Matt Afleck. He will give a response describing your image ..." : response}

        </p>

        <div className="flex flex-row">

          <button

            className={`${

              submitted || !file ? "opacity-50" : "hover:bg-gray-100"

            } bg-white mr-4 text-slate-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow`}

            type="submit"

            disabled={submitted || !file}

          >

            Describe

          </button>

          <button

            className="bg-white hover:bg-red-100 text-red-800 font-semibold py-2 px-4 border border-red-400 rounded shadow"

            type="button"

            onClick={onReset}

          >

            Reset

          </button>

        </div>

      </form>

    </div>

  );

}