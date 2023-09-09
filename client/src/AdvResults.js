import {useState, useEffect} from 'react'
import "./AdvResults.css";
import Axios from "axios"

function Results() {
  const [allUni, setAllUni] = useState([])
  useEffect(() => {
    Axios.get(`http://localhost:80/bestuni`).then(
        (response) => {
          console.log(response);
          setAllUni(Object.keys(response.data).map((key) => response.data[key]));
      });
  }, []);

  console.log(allUni);
  return <><div className="Results">
    {allUni.map((University) => {
        return (
          <>
            <div>{University.institution} with an average score of {University.avg_rating}</div>
          </>
        )
    })}
  </div></>
}

export default Results;