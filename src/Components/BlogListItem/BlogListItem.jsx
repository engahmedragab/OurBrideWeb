import React from "react";
import img1 from "../../Assets/profile.png";

export default function BlogListItem(props) {
  function tick() {
    //const root = ReactDOM.createRoot(document.getElementById("root"));
    //const element = <h1>Hello, world</h1>;
    //root.render(element);
  }
  return (
    <>
      <div className="col-md-12">
        <div className="row g-0 rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
          <div className="col-auto d-none d-lg-block">
            <img
              className="rounded"
              src={img1}
              width="250"
              height="250"
              alt="image not found"
            />
          </div>
          <button onClick={tick()}>Content</button>
          <div id="root"></div>
          <div className="col p-4 d-flex flex-column position-static">
            <h3 className="mb-0">{props.Post?.title}</h3>
            <div className="mb-1 text-muted">
              {props.Post?.published} {"  "}
              <strong className="d-inline-block mb-2">Design</strong>
              {"  "}
              <span> {props.Post?.replies.totalItems} Comment</span>
            </div>
            <p className="mb-auto fs-4">
              {props.Post?.content?.substring(
                props.Post?.content?.indexOf(">") +
                  props.Post?.content?.indexOf("<h4/>"),
                props.Post?.content?.indexOf("<h4/>")
              )}
            </p>
            <a href="#" className="stretched-link">
              Continue reading
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
