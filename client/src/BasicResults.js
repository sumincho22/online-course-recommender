import {useState, useEffect} from 'react'
import "./BasicResults.css";
import Axios from "axios"

function Results({result}) {
  const [allCourses, setAllCourses] = useState([])
  useEffect(() => {
    if(result !== "") {
      Axios.get(`http://localhost:80/courses/${result}`).then(
        (response) => {
          console.log(response);
          setAllCourses(Object.keys(response.data).map((key) => response.data[key]));
      });
    }
  }, [result]);

  console.log(allCourses);
  return <><div className="Results">
    {allCourses.map((courses) => {
        return (
          <a href={courses.url}>
            <div>
              {courses.title}
            </div>
          </a>
        )
    })}
  </div></>
}

export default Results;