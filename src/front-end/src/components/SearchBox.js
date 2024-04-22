
function SearchBox() {
  return (
    <div className="search-box">
      <form action="">
        <label htmlFor="exampleInputEmail1" className="form-label">Source Link</label>
        <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Search..." autoComplete="off" />
        <ul className="suggestions" id="suggestions"></ul>
      </form>
      <form action="">
        <label htmlFor="exampleInputEmail2" className="form-label">Destination Link</label>
        <input type="text" className="form-control" id="exampleInputEmail2" placeholder="Search..." autoComplete="off" />
        <ul className="suggestions" id="suggestions"></ul>
      </form>
    </div>
  );
}

export default SearchBox;