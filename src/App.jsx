import { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";

const nations = [
  {
    name: "China",
    icon: "/images/china.png",
    population: 4,
  },
  {
    name: "USA",
    icon: "/images/usa.png",
    population: 4,
  },
  {
    name: "UK",
    icon: "/images/uk.png",
    population: 4,
  },
  {
    name: "France",
    icon: "/images/france.png",
    population: 4,
  },
  {
    name: "Russia",
    icon: "/images/russia.png",
    population: 4,
  },
  {
    name: "Japan",
    icon: "/images/japan.png",
    population: 3,
  },
  {
    name: "Germany",
    icon: "/images/germany.png",
    population: 3,
  },
  {
    name: "Italy",
    icon: "/images/italy.png",
    population: 3,
  },

  {
    name: "India",
    icon: "/images/india.png",
    population: 3,
  },
  {
    name: "Singapore",
    icon: "/images/singapore.png",
    population: 3,
  },
  {
    name: "South Africa",
    icon: "/images/south africa.png",
    population: 3,
  },
  {
    name: "Australia",
    icon: "/images/australia.png",
    population: 3,
  },
  {
    name: "Brazil",
    icon: "/images/brazil.png",
    population: 3,
  },
  {
    name: "Thailand",
    icon: "/images/thailand.png",
    population: 3,
  },
  {
    name: "South Korea",
    icon: "/images/korea.png",
    population: 3,
  },
];

const getStudents = async (callback) => {
  const file = await (await fetch("/students.xlsx")).blob();
  const reader = new FileReader();
  reader.onload = (event) => {
    const bstr = event.target.result;
    const wb = XLSX.read(bstr, { type: "binary" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    callback(data);
  };
  reader.readAsBinaryString(file);
};

const getClearNation2Student = () => {
  let nation2students = {};
  nations.forEach((nation) => {
    nation2students[nation.name] = [];
  });
  return nation2students;
};

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function App() {
  let [shuffled, setShuffled] = useState(false);
  let [students, setStudents] = useState([]);
  let [startLottery, setStartLottery] = useState(false);
  let [nation2students, setNation2students] = useState(
    getClearNation2Student()
  );
  let [fake, setFake] = useState("XXX");

  function NationRow(props) {
    const font = {
      marginLeft: "30px",
      fontWeight: "700",
      fontSize: "2em",
    };
    const nation = props.nation;
    const students = props.students;
    return (
      <div className="NationRow">
        <img src={nation.icon} alt={nation.name} height="100" />
        <div style={font}>{nation.name}</div>
        {shuffled
          ? students.map((student, index) => {
              return (
                <div style={font} key={`${Math.random()}-${student}-${index}`}>
                  {student}
                </div>
              );
            })
          : new Array(nation.population).fill(fake).map((_, index) => {
              return (
                <div style={font} key={`${Math.random()}-${fake}-${index}`}>
                  {fake}
                </div>
              );
            })}
      </div>
    );
  }

  return (
    <div className="App">
      <h1 style={{ marginLeft: "50%", transform: "translateX(-40%)" }}>
        2022 BJUT FGX Honors College Model United Nations Lottery
      </h1>
      <div className="Nations">
        <div className="NationsColumn">
          {nations.slice(0, 9).map((nation, index) => {
            return (
              <NationRow
                key={nation.name}
                nation={nation}
                students={nation2students[nation.name]}
              />
            );
          })}
        </div>
        <div className="NationsColumn">
          {nations.slice(9).map((nation, index) => {
            return (
              <NationRow
                key={nation.name}
                nation={nation}
                students={nation2students[nation.name]}
              />
            );
          })}

          <div
            className="btn btn-three"
            onClick={() => {
              if (shuffled) {
                const element = document.createElement("a");
                let res = "";
                for (let nation of nations) {
                  res += nation.name + ": ";
                  for (let student of nation2students[nation.name]) {
                    res += student + " ";
                  }
                  res += "\n";
                }
                const file = new Blob([res], { type: "text/plain" });
                element.href = URL.createObjectURL(file);
                element.download = "MUN_Group.txt";
                document.body.appendChild(element);
                element.click();
                return;
              }
              setStartLottery(!startLottery);
              getStudents((data) => {
                students = data.split("\n");
                setInterval(() => {
                  setFake(students[parseInt(Math.random() * students.length)]);
                });
                setStudents(students);
              });
              if (startLottery) {
                students = shuffle(students);
                nation2students = getClearNation2Student();
                for (let i = 0; i < nations.length; i++) {
                  if (
                    nation2students[nations[i].name].length <
                    nations[i].population
                  ) {
                    while (
                      nation2students[nations[i].name].length <
                      nations[i].population
                    ) {
                      nation2students[nations[i].name].push(students[0]);
                      students.splice(0, 1);
                    }
                    shuffle(nation2students[nations[i].name]);
                  }
                }
                setNation2students(nation2students);
                setShuffled(true);
              }
            }}
          >
            <span>
              {shuffled ? "Download Result" : startLottery ? "Stop" : "Start"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
