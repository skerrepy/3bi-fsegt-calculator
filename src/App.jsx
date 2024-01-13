import { useEffect, useState } from "react";
import data from "./subjects.json";
import ProcessDigits from "./utils/ProcessDigits";
import DegreeSubjectCard from "./DegreeSubjectCard";

function App() {
  const [curriculum, setCurriculum] = useState([]);
  const [totalAverage, setTotalAverage] = useState([]);
  const [average, setAverage] = useState(0);
  useEffect(() => {
    const convert_subjects_to_average = curriculum.map((i) => {
      return {
        name: i.subject_name,
        coefficientCalculated: 0,
      };
    });
    setTotalAverage(convert_subjects_to_average);
  }, [curriculum]);
  const updateTotalAverage = (average) => {
    setTotalAverage((subjects) => {
      const temp = [...subjects];
      temp[
        temp.findIndex((i) => i.name == average.name)
      ].coefficientCalculated = average.coefficientCalculated;

      return temp;
    });
  };
  useEffect(() => {
    if (totalAverage.length > 0) {
      let getTotalAverage = totalAverage.reduce(
        (prev, curr) => prev + parseFloat(curr.coefficientCalculated),
        0
      );
      setAverage(
        ProcessDigits(
          getTotalAverage /
            curriculum.reduce(
              (prev, curr) => prev + parseFloat(curr.subject_coefficient),
              0
            )
        )
      );
    }
  }, [totalAverage]);
  useEffect(() => {
    setCurriculum(data.subjects);
  }, []);
  return (
    <div className="flex flex-col items-center ">
      <div className="flex flex-col w-[80%] md:w-[70%] ">
        <div className="md:grid grid-cols-[70%_30%] w-[80%] md:w-[70%] z-[99999] bg-secondary rounded-lg p-4 my-4 fixed">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">3BI(FSEGT)</h1>
            <span className="text-xl text-muted-foreground ">Semestre: 5</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-bold text-lg">Moyenne: {average}</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-[60%] md:mt-[13%] mb-[5%]">
          {curriculum.length > 0 &&
            curriculum?.map((i, index) => (
              <DegreeSubjectCard
                updateTotalAverage={updateTotalAverage}
                key={index}
                subject={i}
                index={index}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
