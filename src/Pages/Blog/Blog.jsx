import React, { useState } from "react";
import BlogItem from "../../Components/BlogItem/BlogItem";
import BlogListItem from "../../Components/BlogListItem/BlogListItem";
import Joi from "joi";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Blog() {
  let [Posts, setPosts] = useState();
  let navigate = useNavigate();
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState();
  let [errorList, setErrorList] = useState([]);

  async function GetBlogPostsData() {
    let { data } = await axios.get(
      `https://www.googleapis.com/blogger/v3/blogs/509348003349717084/posts?key=AIzaSyCgyWYzOXBbgC3Lfjj0E7G0HxBuo5TiKAA`
    );
    console.log(data);
    if (data !== null) {
      setIsLoading(false);
      setPosts(data.items);
    } else {
      setIsLoading(false);
      setError(data.message);
      console.log(error);
    }
  }

  return (
    <>
      <div className="blog m-2">
        <button onClick={GetBlogPostsData()}></button>
        <div className="">
          <div className="nav-scroller py-1 mb-2">
            <nav className="nav d-flex justify-content-between">
              <a className="p-2 link-secondary" href="#">
                World
              </a>
              <a className="p-2 link-secondary" href="#">
                U.S.
              </a>
              <a className="p-2 link-secondary" href="#">
                Technology
              </a>
              <a className="p-2 link-secondary" href="#">
                Design
              </a>
              <a className="p-2 link-secondary" href="#">
                Culture
              </a>
              <a className="p-2 link-secondary" href="#">
                Business
              </a>
              <a className="p-2 link-secondary" href="#">
                Politics
              </a>
              <a className="p-2 link-secondary" href="#">
                Opinion
              </a>
              <a className="p-2 link-secondary" href="#">
                Science
              </a>
              <a className="p-2 link-secondary" href="#">
                Health
              </a>
              <a className="p-2 link-secondary" href="#">
                Style
              </a>
              <a className="p-2 link-secondary" href="#">
                Travel
              </a>
            </nav>
          </div>
        </div>

        <div className="">
          <div className="p-4 p-md-5 mb-4 text-white rounded bg-dark">
            <div className="col-md-6 px-0">
              <h1 className="display-4 fst-italic">
                Title of a longer featured blog post
              </h1>
              <p className="lead my-3">
                Multiple lines of text that form the lede, informing new readers
                quickly and efficiently about what’s most interesting in this
                post’s contents.
              </p>
              <p className="lead mb-0">
                <a href="#" className="text-white fw-bold">
                  Continue reading...
                </a>
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8 p-5">
              <h3 className="pb-4 mb-4 fst-italic border-bottom">
                From the Firehose
              </h3>

              <BlogItem Post={Posts ? Posts[0] : null}></BlogItem>
              {Posts?.map((post, index) => {
                return <BlogListItem key={index} Post={post}></BlogListItem>;
              })}

              <nav className="blog-pagination" aria-label="Pagination">
                <a className="btn btn-outline-primary" href="#">
                  Older
                </a>
                <a
                  className="btn btn-outline-secondary disabled"
                  href="#"
                  tabindex="0"
                  aria-disabled="true"
                >
                  Newer
                </a>
              </nav>
            </div>

            <div className="col-md-4">
              <div className="position-sticky">
                <div class="input-group mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <span class="input-group-text" id="basic-addon2">
                    Search
                  </span>
                </div>
                <div className="p-4 mb-3 bg-light rounded">
                  <h4 className="fst-italic">About</h4>
                  <p className="mb-0">
                    Customize this section to tell your visitors a little bit
                    about your publication, writers, content, or something else
                    entirely. Totally up to you.
                  </p>
                </div>
                <div class="sidebar-box ftco-animate fadeInUp ftco-animated">
                  <h4 className="fst-italic">Categories</h4>
                  <ul class="categories list-group">
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      Fashion <span>(6)</span>
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      Technology <span>(8)</span>
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      Travel <span>(2)</span>
                    </a>

                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      Food <span>(2)</span>
                    </a>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action"
                    >
                      Photography <span>(7)</span>
                    </a>
                  </ul>
                </div>
                <div className="row mb-2">
                  <h4 className="fst-italic">Popular Articles</h4>
                  <div className="col-md-12">
                    <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                      <div className="col p-4 d-flex flex-column position-static">
                        <h3 className="mb-0">Featured post</h3>
                        <div className="mb-1 text-muted">Nov 12</div>
                        <p className="card-text mb-auto">
                          This is a wider card with supporting text below as a
                          natural lead-in to additional content.
                        </p>
                        <a href="#" className="stretched-link">
                          Continue reading
                        </a>
                      </div>
                      <div className="col-auto d-none d-lg-block">
                        <svg
                          className="bd-placeholder-img"
                          width="200"
                          height="250"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label="Placeholder: Thumbnail"
                          preserveAspectRatio="xMidYMid slice"
                          focusable="false"
                        >
                          <title>Placeholder</title>
                          <rect width="100%" height="100%" fill="#55595c" />
                          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                            Thumbnail
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                      <div className="col p-4 d-flex flex-column position-static">
                        <h3 className="mb-0">Post title</h3>
                        <div className="mb-1 text-muted">Nov 11</div>
                        <p className="mb-auto">
                          This is a wider card with supporting text below as a
                          natural lead-in to additional content.
                        </p>
                        <a href="#" className="stretched-link">
                          Continue reading
                        </a>
                      </div>
                      <div className="col-auto d-none d-lg-block">
                        <svg
                          className="bd-placeholder-img"
                          width="200"
                          height="250"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label="Placeholder: Thumbnail"
                          preserveAspectRatio="xMidYMid slice"
                          focusable="false"
                        >
                          <title>Placeholder</title>
                          <rect width="100%" height="100%" fill="#55595c" />
                          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                            Thumbnail
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="fst-italic">Archives</h4>
                  <ol className="list-unstyled mb-0">
                    <li>
                      <a href="#">March 2021</a>
                    </li>
                    <li>
                      <a href="#">February 2021</a>
                    </li>
                    <li>
                      <a href="#">January 2021</a>
                    </li>
                    <li>
                      <a href="#">December 2020</a>
                    </li>
                    <li>
                      <a href="#">November 2020</a>
                    </li>
                    <li>
                      <a href="#">October 2020</a>
                    </li>
                    <li>
                      <a href="#">September 2020</a>
                    </li>
                    <li>
                      <a href="#">August 2020</a>
                    </li>
                    <li>
                      <a href="#">July 2020</a>
                    </li>
                    <li>
                      <a href="#">June 2020</a>
                    </li>
                    <li>
                      <a href="#">May 2020</a>
                    </li>
                    <li>
                      <a href="#">April 2020</a>
                    </li>
                  </ol>
                </div>

                <div class="sidebar-box ftco-animate fadeInUp ftco-animated">
                  <h4 className="fst-italic">Tag Cloud</h4>
                  <ul class="tagcloud">
                    <a href="#" class="btn btn-outline-dark">
                      animals
                    </a>
                    <a href="#" class="btn btn-outline-dark">
                      human
                    </a>
                    <a href="#" class="btn btn-outline-dark">
                      people
                    </a>
                    <a href="#" class="btn btn-outline-dark">
                      cat
                    </a>
                    <a href="#" class="btn btn-outline-dark">
                      dog
                    </a>
                    <a href="#" class="btn btn-outline-dark">
                      nature
                    </a>
                    <a href="#" class="btn btn-outline-dark">
                      leaves
                    </a>
                    <a href="#" class="btn btn-outline-dark">
                      food
                    </a>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
