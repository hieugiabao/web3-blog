import { ethers } from "hardhat";

describe("Blog", function () {
  it("Should create a post", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();
    await blog.createPost("My first post", "12345");

    const posts = await blog.fetchPosts();
    expect(posts[0].title).toEqual("My first post");
  });

  it("Should edit a post", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();
    await blog.createPost("My Second post", "12345");

    await blog.updatePost(1, "My updated post", "23456", true);

    const posts = await blog.fetchPosts();
    expect(posts[0].title).toEqual("My updated post");
  });

  it("Should add update the name", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();

    expect(await blog.name()).toEqual("My blog");
    await blog.updateName("My new blog");
    expect(await blog.name()).toEqual("My new blog");
  });
});
