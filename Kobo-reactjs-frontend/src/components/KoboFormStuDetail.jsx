import { useEffect, useState } from "react";
import axios from "axios";
import "./KoboFormStuDetail.css";

function DisplayTableKoboStu({ apiUrl, dataKey, title, onDataLoad }) {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [keyDisp, setKeysDisp] = useState([]);
  const [list_item, setListItem] = useState(null);

  const showDetails = (item) => {
    console.log("Row data:", item);
    setListItem(item);
  };

  useEffect(() => {
    axios.get(apiUrl)
      .then((res) => {
        console.log("the data",res.data);

        setData(res.data[dataKey]);
        setKeys(res.data.key);
        setKeysDisp(res.data.keyDisp);
        
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
              {keyDisp.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} onClick={() => showDetails(item)} >
                {keyDisp.map((key) => (
                  <td key={key}>
                    {item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {list_item && (
            <div className="home-list-detail-show">
              <div className="detail-header">
                <h2>Details for ID: {list_item.id}</h2>
                <button
                      onClick={() => setListItem(null)}
                      className="exit-btn"
                      title="Exit Display"
                    >
                      ✕
                </button>
              </div>
                <table border="1" cellPadding="10" className = "home-list-detail-table">
                  <tbody>
                    {Object.entries(list_item).map(([key, value]) => (
                        <tr key={key} className="detail-row">
                          <td className="detail-key">{key}</td>
                          <td className="detail-value">{value || "—"}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}
    </div>
  );
}

export default DisplayTableKoboStu;