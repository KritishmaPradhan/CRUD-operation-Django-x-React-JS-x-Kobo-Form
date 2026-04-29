import { useEffect, useState } from "react";
import axios from "axios";
import "./KoboFormStuDetail.css";

function DisplayTableKoboStu({ apiUrl, dataKey, title, onDataLoad }) {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    axios.get(apiUrl)
      .then((res) => {
        console.log(res.data);

        setData(res.data[dataKey]);
        setKeys(res.data.keys);
        
        // Pass data to parent component if callback provided
        if (onDataLoad) {
          onDataLoad(res.data[dataKey]);
        }
      })
      .catch((err) => console.log(err));
  }, [apiUrl, dataKey, onDataLoad]);

  return (
    <div>
      <h1>{title}</h1>

      {data.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              {keys.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {keys.map((key) => (
                  <td key={key}>
                    {item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DisplayTableKoboStu;