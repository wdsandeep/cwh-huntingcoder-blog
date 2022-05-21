import React, { useEffect, useState } from "react";
import styles from "./../styles/Blog.module.css";
import Link from "next/link";
import * as fs from "fs";
import InfiniteScroll from "react-infinite-scroll-component";

// Step 1: Collect all the files from blog data directory
// Step 2: Iterate through them and display them

const Blog = (props) => {
  // console.log(props);
  const [blogs, setBlogs] = useState(props.allBlogs);

  const fetchData = async () => {
    let d = await fetch(
      `http://localhost:3000/api/blogs/?count=${blogs.length + 2}`
    );
    let data = await d.json();
    setBlogs(data);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <InfiniteScroll
          dataLength={blogs.length} //This is important field to render the next data
          next={fetchData}
          hasMore={props.allCount > blogs.length}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          // below props only if you need pull down functionality
        >
          {blogs.map((blogItem) => (
            <div key={Math.random()} className={styles.blogItem}>
              <Link href={`/blogpost/${blogItem.slug}`}>
                <h2>{blogItem.title}</h2>
              </Link>
              <p className={styles.blogItemp}>{blogItem.metadesc}...</p>
              <Link href={`/blogpost/${blogItem.slug}`}>
                <button className={styles.btn}>Read More..</button>
              </Link>
            </div>
          ))}
        </InfiniteScroll>
      </main>
    </div>
  );
};

export async function getStaticProps(context) {
  // Fetch data from external API
  let data = await fs.promises.readdir("blogdata");
  let allCount = data.length;
  let myfile;
  let allBlogs = [];

  for (let index = 0; index < 3; index++) {
    const item = data[index];
    // console.log(item);
    myfile = await fs.promises.readFile(`blogdata/${item}`, "utf-8");
    allBlogs.push(JSON.parse(myfile));
  }

  // Pass data to the page via props
  return { props: { allBlogs, allCount } };
}

export default Blog;
