import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { useState, useEffect } from "react";

import { api } from "~/utils/api";

/**
  Souring chat app with chatgpt to help amazon sellers find profitbale products to sell.
  TypeScript
  Probably going to need Python unless I find a way to build a Node web scrapper
  Example
    There would be a chat box for the user to type.
      Hey can you find me the current trending products selling on Amazon in the food category.
    The results come back in for each product and in the product details it says the following:
    Gets the amount sold in the last 30 days
    Current Amazon ranking
    Average price sold at in last 30 days
    Highest price sold at in last 30 days
    Lowest price sold at in last 30 days
    Amazon Ranking in the last 30 days
    Sale price per unit 


  User case 2
    Take in this spreadsheet CVS file that has
    (Each of these would be a column)
      product names, 
      amazon asin, 
      purchase price at wholesale cost, 
      Amazon Buy Box price, 
      Quantity amount per unit,

    Another case is to say
      Hey, go to this website and find every product on here that has a 
      1% BSR ranking on amazon 
      30% profit margin after cost of goods sold
      $X price 

      TODO: 
        Connect OpenAi API to project
        
* */

const Home: NextPage = () => {
  const [result, setResult] = useState('');
  const [input , setInput] = useState('');

  async function onSubmit(event: { preventDefault: () => void; } | undefined) {
    event.preventDefault();
    try{
      const response = await fetch("/api/openAi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({input: input})
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setInput("")
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>SourcingGPT</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-700 text-white">
        <div>
          <div className="flex flex-row items-center">
            <h1 className="text-3xl">SourcingGPT</h1>
            <AuthShowcase />
          </div>
          <div>
            <p>{result}</p>
          </div>
          <div className="bg-black flex flex-row">
            <form onSubmit={onSubmit}>
            <input 
              className="border border-black h-full w-full text-black rounded-lg"
              placeholder="Send a message..."
              value={input}
              onChange={(event) => setInput(event.target.value)}/>
            </form>
            
            <button onClick={()=> onSubmit()}>Send</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-black/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};