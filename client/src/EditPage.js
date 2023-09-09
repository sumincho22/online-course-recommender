import {useState} from 'react';
import Axios from "axios";
import './Edit.css';

function EditPage() {
    const [insertChosen, setInsertChosen] = useState("yes");
    const [updateChosen, setUpdateChosen] = useState("no");
    const [deleteChosen, setDeleteChosen] = useState("no");
    const [currentInstitution, setCurrentInstitution] = useState("");
    const [currentDifficulty, setCurrentDifficulty] = useState("");
    const [currentRating, setCurrentRating] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");
    const [currentDescription, setCurrentDescription] = useState("");
    const [currentSubject, setCurrentSubject] = useState("");
    const [currentTitle, setCurrentTitle] = useState("");
    const [deleteTitle, setDeleteTitle] = useState("");

    const HandleInsert = () => {
        if(insertChosen === "yes") {
            return null;
        }
        setInsertChosen("yes");
        setUpdateChosen("no");
        setDeleteChosen("no");
    }

    const HandleUpdate = () => {
        if(updateChosen === "yes") {
            return null;
        }
        setInsertChosen("no");
        setUpdateChosen("yes");
        setDeleteChosen("no");
    }

    const HandleDelete = () => {
        if(deleteChosen === "yes") {
            return null;
        }
        setInsertChosen("no");
        setUpdateChosen("no");
        setDeleteChosen("yes");
    }

    const SubmitCreate = () => {
        if(currentTitle === "" || currentInstitution === "" || currentDifficulty === "" || currentRating === "" || currentUrl === "" || currentDescription === "" || currentSubject === "") {
            alert("Must fill out every box");
        } else {
            Axios.post("http://localhost:80/courses", {
                id: Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000,
                title: currentTitle,
                institution: currentInstitution,
                difficulty: currentDifficulty,
                rating: currentRating,
                url: currentUrl,
                description: currentDescription,
                subject: currentSubject
            });
            alert("Successfully Created Entry");
        }       
    }

    const SubmitUpdate = () => {
        if(currentTitle === "" || currentUrl === "") {
            alert("Must fill out every box");
        } else {
            Axios.put("http://localhost:80/courses", {
                title: currentTitle,
                url: currentUrl
            });
            alert("Successfully Added Entry");
        }       
    }

    const SubmitDelete = () => {
        if(deleteTitle === "") {
            alert("Must fill out every box");
        } else {
            Axios.delete(`http://localhost:80/courses/${deleteTitle}`);
            alert("Successfully Deleted Entry");
        }       
    }

    let component;
    if(insertChosen === "yes") {
        component = <div className='forms'>
            <div className='title'>Title
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Course Title"
                    type="text"
                    onChange={(e) => setCurrentTitle(e.target.value)}
                /></div>
            </div>
            <div className='institution'>Institution
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Institution Name"
                    type="text"
                    onChange={(e) => setCurrentInstitution(e.target.value)}
                /></div>
            </div>
            <div className='difficulty'>Difficulty
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Difficulty"
                    type="text"
                    onChange={(e) => setCurrentDifficulty(e.target.value)}
                /></div>
            </div>
            <div className='rating'>Rating
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Rating"
                    type="text"
                    onChange={(e) => setCurrentRating(e.target.value)}
                /></div>
            </div>
            <div className='url'>Url
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Url"
                    type="text"
                    onChange={(e) => setCurrentUrl(e.target.value)}
                /></div>
            </div>
            <div className='description'>Description
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Description"
                    type="text"
                    onChange={(e) => setCurrentDescription(e.target.value)}
                /></div>
            </div>
            <div className='subject'>Subject
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Subject"
                    type="text"
                    onChange={(e) => setCurrentSubject(e.target.value)}
                /></div>
            </div>
            <button onClick={SubmitCreate}>Create</button>
        </div>
    } else if (updateChosen === "yes") {
        component = <div className='forms'>
            <div className='title'>Title
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Course Title"
                    type="text"
                    onChange={(e) => setCurrentTitle(e.target.value)}
                /></div>
            </div>
            <div className='url'>Url
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Url"
                    type="text"
                    onChange={(e) => setCurrentUrl(e.target.value)}
                /></div>
            </div>
            <button onClick={SubmitUpdate}>Update</button>
            </div>
    } else {
        component = <div className='forms'>
            <div className='title'>Title
                <div><input
                    classname="box"
                    size="large"
                    placeholder="Course Title"
                    type="text"
                    onChange={(e) => setDeleteTitle(e.target.value.replaceAll(" ", "^"))}
                /></div>
            </div>
            <button onClick={SubmitDelete}>Delete</button>
            </div>
    }

    return (
        <>
        <div className='options'>
            <div className={insertChosen} onClick={HandleInsert}>Insert</div>
            <div className={updateChosen} onClick={HandleUpdate}>Update</div>
            <div className={deleteChosen} onClick={HandleDelete}>Delete</div>
        </div>
            {component}
        
        </>
    )
}

export default EditPage