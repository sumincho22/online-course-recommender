import {useState, useEffect} from 'react'
import Axios from "axios"

function Results({cashedState}) {
  const [allCourse, setAllCourse] = useState([])
  useEffect(() => {
    Axios.get(`http://localhost:80/bestcourse`).then(
        (response) => {
          console.log(response);
          setAllCourse(Object.keys(response.data).map((key) => response.data[key]));
      });
  }, []);

  return (
  <>
  <div className="Results">
    {allCourse.map((Course) => {
        return (
          <>
            <div>{Course.title} with a difficulty of {Course.difficulty}, a price of {Course.price}, and a rating of {Course.rating}</div>
          </>
        )
    })}
  </div>
  </>
  )
}

export default Results;