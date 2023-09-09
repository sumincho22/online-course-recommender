require('dotenv').config();

var express = require('express'), 
    router = express.Router(),
    bodyParser = require('body-parser'),
    mysql = require('mysql2'),
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

connection.connect;

var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    next();
};
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/*
    BELOW ARE THE QUERIES THAT WILL BE USED IN THE FRONT END AND BE SENT AS AN API
*/

// Gets the CourseraCourse table
app.get("/coursera", (req, res) => {
    connection.query("SELECT * FROM CourseraCourse", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

// Gets the edXCourse table
app.get("/edx", (req, res) => {
    connection.query("SELECT * FROM edXCourse", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

// Gets the Subject table
app.get("/subject", (req, res) => {
    connection.query("SELECT * FROM Subject", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

// Gets the UdemyCourse table
app.get("/udemy", (req, res) => {
    connection.query("SELECT * FROM UdemyCourse ", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

// Gets the Universities table
app.get("/universities", (req, res) => {
    connection.query("SELECT * FROM Universities", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

// Gets the first advanced query 
app.get("/bestcourse", (req, res) => {
    connection.query(
        "SELECT title, difficulty, price, rating FROM UdemyCourse u LEFT JOIN (SELECT difficulty, AVG(price) as avg_price, AVG(rating) as avg_rating FROM  UdemyCourse GROUP BY difficulty LIMIT 3) as a USING (difficulty) WHERE price < avg_price AND rating > avg_rating ORDER BY price, rating DESC LIMIT 15", 
        (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

app.get("/bestuni", (req, res) => {
    connection.query(
        "SELECT institution, ROUND(AVG(rating), 2) AS avg_rating FROM CourseraCourse c JOIN Universities u ON (c.institution = u.name) GROUP BY institution ORDER BY avg_rating DESC, institution LIMIT 15", 
        (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

app.get("/bestuni/:id", (req, res) => {
    const name = req.params.id.replaceAll("^", " ");
    connection.query(
        "SELECT institution, ROUND(AVG(rating), 2) AS avg_rating FROM CourseraCourse c JOIN Universities u ON (c.institution = u.name) GROUP BY institution HAVING institution LIKE '%" + name + "%' ORDER BY avg_rating DESC, institution LIMIT 15", 
        (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

app.get("/courses/:id", (req, res) => {
    const name = req.params.id.replaceAll("^", " ");
    connection.query("SELECT title, url FROM CourseraCourse WHERE title LIKE '%" + name + "%' UNION SELECT title, url FROM edXCourse WHERE title LIKE '%" + name + "%' UNION SELECT title, url FROM UdemyCourse WHERE title LIKE '%" + name + "%'", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

app.post("/courses", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const institution = req.body.institution;
    const difficulty = req.body.difficulty;
    const rating = req.body.rating;
    const url = req.body.url;
    const description = req.body.description;
    const subject = req.body.subject;
    connection.query("INSERT INTO CourseraCourse (id, title, institution, difficulty, rating, url, description, subject) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [id, title, institution, difficulty, rating, url, description, subject], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

app.put("/courses", (req, res) => {
    const title = req.body.title;
    const url = req.body.url;
    console.log(title, " ", url)
    connection.query("UPDATE CourseraCourse SET url = '" + url + "' WHERE title = '" + title + "'", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
})

app.delete("/courses/:id", (req, res) => {
    const title = req.params.id.replaceAll("^", " ");
    console.log(title)
    connection.query("DELETE FROM CourseraCourse WHERE title = '" + title + "'", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Successfully Deleted " + title)
        }
    });
})


/* Stored Procedure that is already on the gcp sql
delimiter //
CREATE PROCEDURE UniStats()
BEGIN
	DECLARE varInstitution VARCHAR(500);
	DECLARE varNumCourses INT DEFAULT 0;
    DECLARE varBeginner INT DEFAULT 0;
    DECLARE varIntermediate INT DEFAULT 0;
    DECLARE varAdvanced INT DEFAULT 0;
    DECLARE varCredibility VARCHAR(100);
    DECLARE exit_loop BOOLEAN DEFAULT FALSE;

    DECLARE cur CURSOR FOR (
		SELECT institution, COUNT(institution) AS num_courses
		FROM
		(SELECT institution FROM CourseraCourse 
		UNION ALL
		SELECT institution FROM edXCourse
		UNION ALL
		SELECT institution FROM UdemyCourse) AS a
		GROUP BY institution
		ORDER BY institution
	);  
  
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE;

    DROP TABLE FinalTable;
    CREATE TABLE FinalTable(
		institution VARCHAR(500),
		num_beginner INT DEFAULT 0,
		num_intermediate INT DEFAULT 0,
		num_advanced INT DEFAULT 0,
		credibility VARCHAR(100)
    );
    
    OPEN cur;
    cloop: LOOP
        FETCH cur INTO varInstitution, varNumCourses;
        IF (exit_loop) THEN
            LEAVE cloop;
        END IF;
        
        SET varBeginner = (
        SELECT COUNT(institution) AS num_courses
        FROM
		(SELECT institution, difficulty FROM
		CourseraCourse
		UNION ALL
		SELECT institution, difficulty FROM
		edXCourse
		UNION ALL
		SELECT institution, difficulty FROM
		UdemyCourse) AS a
		WHERE difficulty = "Beginner" AND institution = varInstitution
		GROUP BY institution
		ORDER BY institution
		LIMIT 1);

		SET varIntermediate = (
		SELECT COUNT(institution) AS num_courses
		FROM
		(SELECT institution, difficulty FROM
		CourseraCourse
		UNION ALL
		SELECT institution, difficulty FROM
		edXCourse
		UNION ALL
		SELECT institution, difficulty FROM
		UdemyCourse) AS a
		WHERE difficulty = "Intermediate" AND institution = varInstitution
		GROUP BY institution
		ORDER BY institution
		LIMIT 1);

		SET varAdvanced = (SELECT COUNT(institution) AS num_courses
		FROM
		(SELECT institution, difficulty FROM
		CourseraCourse
		UNION ALL
		SELECT institution, difficulty FROM
		edXCourse
		UNION ALL
		SELECT institution, difficulty FROM
		UdemyCourse) AS a
		WHERE difficulty = "Advanced" AND institution = varInstitution
		GROUP BY institution
		ORDER BY institution
		LIMIT 1);

	IF varBeginner IS NULL THEN
		SET varBeginner = 0;
	END IF;

	IF varIntermediate IS NULL THEN
		SET varIntermediate = 0;
	END IF;

	IF varAdvanced IS NULL THEN
		SET varAdvanced = 0;
	END IF;

        IF (varNumCourses >= 100) THEN
            SET varCredibility = 'Very Credible';
        ELSEIF (varNumCourses >= 50) THEN
            SET varCredibility = 'Credible';
        ELSEIF (varNumCourses >= 10) THEN
            SET varCredibility = 'Mid Credibility';
        ELSE
            SET varCredibility = 'Not Credible';
        END IF;
            
		INSERT INTO FinalTable
		VALUES(varInstitution, varBeginner, varIntermediate, varAdvanced, varCredibility);
    END LOOP cloop;
    CLOSE cur;
    
    SELECT *
    FROM FinalTable
    ORDER BY institution;
END;//
delimiter ;

*/


app.get("/table", (req, res) => {
    connection.query("CALL UniStats", (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    })
})

app.listen(80, function () {
    console.log('Node server is running on port 80');
});