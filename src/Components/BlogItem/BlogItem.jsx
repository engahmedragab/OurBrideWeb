import React from "react";
import ReactMarkdown from "react-markdown";
import ReactDom from "react-dom";
import remarkGfm from "remark-gfm";

export default function BlogItem(props) {
  return (
    <>
      <article className="blog-post">
        <h2 className="blog-post-title">{props.Post?.title}</h2>
        <p className="blog-post-meta">
          {props.Post?.published} by{" "}
          <a href="#">{props.Post?.author.displayName}</a>
        </p>
        <div dangerouslySetInnerHTML={{ __html: props.Post?.content }} />
      </article>
    </>
  );
}
