"use client";

import { css } from "@emotion/css";
import { contractAddress, ownerAddress } from "../../config";
import Blog from "../../artifacts/contracts/Blog.sol/Blog.json";
import { AccountContext } from "../context/accountContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import React, { memo } from "react";

// interface Props {
//   posts?: any[];
// }

function Home() {
  const account = React.useContext(AccountContext);
  const [posts, setPosts] = React.useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    async function getPosts() {
      /* get all posts from the smart contract */
      const posts = await getServerSideProps();
      setPosts(posts);
    }
    getPosts();
  }, []);

  async function navigate() {
    router.push("/create-post");
  }

  return (
    <div>
      <div className={postList}>
        {
          /* map over the posts array and render a button with the post title */
          posts?.map((post, index) => (
            <Link href={`/post/${post[2]}`} key={index}>
              <div className={linkStyle}>
                <p className={postTitle}>{post[1]}</p>
                <div className={arrowContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/right-arrow.svg"
                    alt="Right arrow"
                    className={smallArrow}
                  />
                </div>
              </div>
            </Link>
          ))
        }
      </div>
      <div className={container}>
        {account === ownerAddress && posts && !posts.length && (
          /* if the signed in user is the account owner, render a button */
          /* to create the first post */
          <button className={buttonStyle} onClick={navigate}>
            Create your first post
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/right-arrow.svg" alt="Right arrow" className={arrow} />
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(Home);

async function getServerSideProps(): Promise<any[]> {
  try {
    let provider;
    console.log("NEXT_PUBLIC_ENV: " + process.env.NEXT_PUBLIC_ENV);
    if (process.env.NEXT_PUBLIC_ENV === "local") {
      provider = new ethers.providers.JsonRpcProvider();
    } else if (process.env.NEXT_PUBLIC_ENV === "testnet") {
      provider = new ethers.providers.JsonRpcProvider(
        "https://rpc-mumbai.matic.today"
      );
    } else {
      provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-rpc.com/"
      );
    }

    const contract = new ethers.Contract(contractAddress, Blog.abi, provider);

    // await contract.deployTransaction.wait();
    const data = await contract.fetchPosts();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const arrowContainer = css`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 20px;
`;

const postTitle = css`
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  padding: 20px;
`;

const linkStyle = css`
  border: 1px solid #ddd;
  margin-top: 20px;
  border-radius: 8px;
  display: flex;
`;

const postList = css`
  width: 700px;
  margin: 0 auto;
  padding-top: 50px;
`;

const container = css`
  display: flex;
  justify-content: center;
`;

const buttonStyle = css`
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const arrow = css`
  width: 35px;
  margin-left: 30px;
`;

const smallArrow = css`
  width: 25px;
`;
