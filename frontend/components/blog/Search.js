import Link from "next/link";
import renderHTML from "react-render-html";
import { useState, useEffect } from "react";
import { listSearch } from "../../actions/blog"; // action

const Search = () => {
  // state
  const [values, setValues] = useState({
    search: undefined, // search text
    results: [], // will be the blogs result
    searched: false, // was the search submitted?
    message: ""
  });

  // destructure values
  const { search, results, searched, message } = values;

  // event handlers
  const submitSearch = e => {
    e.preventDefault();
    // query backend
    listSearch({ search }).then(data => {
      // set state with the data that comes back
      setValues({
        ...values,
        results: data,
        searched: true,
        message: `${data.length} blogs found`
      });
    });
  };

  const handleChange = e => {
    // populate 'search' in our state with the input text.
    // set 'searched' back to false and clear 'results' to complete the current search
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: []
    });
  };

  // results message
  const searchedBlogs = (results = []) => {
    return (
      <div className="jumbotron bg-white">
        {/* if there's a message, show it */}
        {message && <p className="pt-4 text-muted font-italic">{message}</p>}

        {/* loop through the results and display them */}
        {results.map((blog, i) => {
          return (
            <div key={i}>
              <Link href={`/blogs/${blog.slug}`}>
                <a className="text-primary">{blog.title}</a>
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  // create search form
  const searchForm = () => (
    <form onSubmit={submitSearch}>
      <div className="row">
        <div className="col-md-11">
          <input
            type="search"
            className="form-control"
            placeholder="Search blogs"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1">
          <button className="btn btn-block btn-outline-primary" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="pt-3 pb-5">{searchForm()}</div>

      {/* if the user has performed the search, pass the results and display them */}
      {searched && (
        <div style={{ marginTop: "-120px", marginBottom: "-80px" }}>
          {searchedBlogs(results)}
        </div>
      )}
    </div>
  );
};

export default Search;
