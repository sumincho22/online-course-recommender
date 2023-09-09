import "./App.css";
import Search from "./Search";
import Edit from "./EditPage"
import {useState} from "react";

function App() {
  const [homeChosen, setHomeChosen] = useState("yes");
  const [editChosen, setEditChosen] = useState("no");

  const HandleHome = () => {
    if(homeChosen === "yes") {
        return null;
    }
    setHomeChosen("yes");
    setEditChosen("no");
  }

  const HandleEdit = () => {
      if(editChosen === "yes") {
          return null;
      }
      setHomeChosen("no");
      setEditChosen("yes");
  }



  return (
    <div className="App">
      <div>
        <div className="Header">
        <div className="ocr">Online Course Recommender</div>
        <div className="sidebar">
          <div id="homeTab" className={homeChosen} onClick={HandleHome}>Home</div>
          <div id="editTab" className={editChosen} onClick={HandleEdit}>Edit</div>
        </div>
      </div>
        <hr
          style={{
            background: "black",
            color: "black",
            borderColor: "black",
            height: "1px",
          }}
        />
      </div>
      <div>{homeChosen === "yes" ? (<Search />) : (<Edit />)}</div>
    </div>
  );
}

export default App;
