import Navbars from "./Navbar";
import SearchBox from "./SearchBox";

function Home(){
  return(
    <div className="justify-content-center mb-5">
      <Navbars/>
      <SearchBox/>
    </div>
  );
}

export default Home;