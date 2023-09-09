import {useState, useEffect} from "react";
import "./Search.css";
import BasicResults from "./BasicResults";
import AdvResults from "./AdvResults";
import AdvResults2 from "./AdvResults2";
import Table from "./Table"
import Axios from "axios";

function Search() {
  const [currentText, setCurrentText] = useState("");
  const [currentCourse, setCurrentCourse] = useState("");
  const [basicChosen, setBasicChosen] = useState("yes");
  const [adv1Chosen, setAdv1Chosen] = useState("no");
  const [adv2Chosen, setAdv2Chosen] = useState("no");
  const [tableChosen, setTableChosen] = useState("no");
  const [searchCat, setSearchCat] = useState("Courses");
  const [placehld, setPlacehld] = useState("Computer Science");
  const [showQuery1, setShowQuery1] = useState(false)
  const [showQuery2, setShowQuery2] = useState(false)
  const [uniStats, setUniStats] = useState([])
  const [loading, setLoading] = useState(true)

  const handleChange = event => {
    setCurrentText(event.target.value.replaceAll(" ", "^"));
  };

  const clicked = () => {
    console.log(currentText);
    setCurrentCourse(currentText)
  }

  const Query1 = () => {
    setShowQuery1(!showQuery1)
  }

  const Query2 = () => {
    setShowQuery2(!showQuery2)
  }

  const HandleBasic = () => {
    if(basicChosen === "yes") {
        return null;
    }
    setBasicChosen("yes");
    setAdv1Chosen("no");
    setAdv2Chosen("no");
    setTableChosen("no");
    setSearchCat("Courses")
    setPlacehld("Computer Science")
  }

  const HandleAdv1 = () => {
      if(adv1Chosen === "yes") {
          return null;
      }
      setBasicChosen("no");
      setAdv1Chosen("yes");
      setAdv2Chosen("no");
      setTableChosen("no");
      setSearchCat("Top Rated Institutions")
  }

  const HandleAdv2 = () => {
    if(adv2Chosen === "yes") {
        return null;
    }
    setBasicChosen("no");
    setAdv1Chosen("no");
    setAdv2Chosen("yes");
    setTableChosen("no");
    setSearchCat("Top Value Courses")
  }

  const HandleTable = () => {
    if(tableChosen === "yes") {
      return null;
    } else if (loading) {
      alert("Please wait while data is being fetched")
      return null;
    }
    
    setBasicChosen("no");
    setAdv1Chosen("no");
    setAdv2Chosen("no");
    setTableChosen("yes");
    setSearchCat("University Statistics")
  }

  let component;
  if (basicChosen === "yes") {
    component =
    <>
      <div className="searchBar">
        <input
            classname="box"
            size="large"
            placeholder={placehld}
            type="text"
            onChange={handleChange}
        />
        <button onClick={clicked}>Search</button>
      </div>
      <div>
          <BasicResults result={currentCourse}/>
      </div>
    </>
  } else if (adv1Chosen === "yes") {
    component =
    <>
      <div className="searchBar">
        <button onClick={Query1}>Search</button>  
      </div>      
      <div className="Query">
      {showQuery1 ? (<AdvResults />) : (<></>)}
      </div>
    </>
  } else if (adv2Chosen === "yes") {
    component =
    <>
      <div className="searchBar">
        <button onClick={Query2}>Search</button>  
      </div>  
      <div className="Query">
      {showQuery2 ? (<AdvResults2 />) : (<></>)}
      </div>
    </>
  } else if (tableChosen === "yes") {
    component = 
    <>
      <Table stats= {uniStats} />
    </>
  }

  useEffect(() => {
    Axios.get(`http://localhost:80/table`).then(
      (response) => {
        setUniStats(Object.keys(response.data).map((key) => response.data[key]));
        setLoading(false);
      }
    );
  }, []);
  return (
    <>
        <div className="Search">
          <div className="firstbar">
              <div id="word1" className={basicChosen} onClick={HandleBasic}>Basic Query</div>
              <div id="word2" className={adv1Chosen} onClick={HandleAdv1}>Advanced Query #1</div>
              <div id="word2" className={adv2Chosen} onClick={HandleAdv2}>Advanced Query #2</div>
              <div id="word2" className={tableChosen} onClick={HandleTable}>Uni Stats</div>
          </div>
        </div>
        <div className="secondbar">Search {searchCat}</div>
        {component}
    </>
    
  );
}

export default Search;