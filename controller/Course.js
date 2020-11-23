const querystring = require("querystring");
const { default: Axios } = require("axios");

exports.getCourses = (req, res, next) => {
    const body = req.body;
    Axios.get(
        "https://www.udemy.com/api-2.0/courses/" +
            "?" +
            querystring.stringify(body),
        {
            headers: {
                Authorization:
                    "Basic djV2RmVUYTBiU2I5UmhYVmdFajRnczhqTXJqTFkzWkxzOEpmZVc4TzpuaTZKMVRpZ2c4MzBwSVg0VWFranRlNmJyRUhDRVVXdVZ2V1JIaHR0SXZUVjZrdHRUa3EwckZqaGxQMm41a0xub25KdjB6a0tqVG9zTDg2T0JBSUhubHpJQUdlN2RMWkNKVDA1em9lWUZwMHZ1YjF1bXBCSTRXZmFJSVJPRDNzeQ==",
            },
        }
    )
        .then((result) => {
            console.log(result);
            res.status(200).json(result.data);
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = err.response.status;
            }
            next(err);
        });
};
