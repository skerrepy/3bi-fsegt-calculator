import React, { useEffect, useState } from "react";
import ProcessDigits from "./utils/ProcessDigits";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./components/ui/input";
import { NumericFormat } from "react-number-format";

const bg_colors = [
  "rgba(209, 211, 254, 1)", // #D1D3FE
  "rgba(183, 248, 215, 1)", // #B7F8D7
  "rgba(252, 239, 180, 1)", // #FCEFB4
  "rgba(186, 229, 244, 1)", // #BAE5F4
];

const formulas_list = [
  {
    label: "Matières Fondamentales avec TD(0.7*note examen +0.3*note de TD)",
    value: "MFTD",
  },
  {
    label: "Matières Fondamentales sans TD(0.7*note examen +0.3*note de DS)",
    value: "MFSTD",
  },
  {
    label:
      "Matiéres Optionelles et transversales avec TD(0.8*((ds1+ds2)/2)+0.2*note de TD)",
    value: "MOTTD",
  },
  {
    label: "Matiéres Optionelles et transversales sans TD((ds1+ds2)/2)",
    value: "MOTSTD",
  },
];
const constants = { ds: "DS 1", ds2: "DS 2", tdOrCC: "TD/CC", exam: "Examen" };
const calculateAverage = (formula, data) => {
  //     Moyenne par matière
  //     Matières Fondamentales avec TD
  //   Moyenne=0.7*note examen +0.3*note de TD
  //                          Matières Fondamentales sans TD
  //        Moyenne=0.7*note examen +0.3*note de DS
  //       Matiéres Optionelles et transversales avec TD
  //      Moyenne=0.8*((ds1+ds2)/2)+0.2*note de TD
  //       Matiéres Optionelles et transversales sans TD
  //     Moyenne=(ds1+ds2)/2

  switch (formula) {
    case "MFTD":
      return (
        0.7 * data.find((i) => i.name == constants.exam).value +
        0.3 * data.find((i) => i.name == constants.tdOrCC).value
      );
    case "MFSTD":
      return (
        0.7 * data.find((i) => i.name == constants.exam).value +
        0.3 * data.find((i) => i.name == constants.ds).value
      );
    case "MOTTD":
      return (
        0.2 * data.find((i) => i.name == constants.tdOrCC).value +
        0.8 *
          ((data.find((i) => i.name == constants.ds).value +
            data.find((i) => i.name == constants.ds2).value) /
            2)
      );
    case "MOTSTD":
      return (
        (data.find((i) => i.name == constants.ds).value +
          data.find((i) => i.name == constants.ds2).value) /
        2
      );
    default:
      return 0;
  }
};

const DegreeSubjectCard = ({ subject, index, updateTotalAverage }) => {
  const [inputs, setInputs] = useState([
    { name: constants.ds, value: 0, disabled: true },
    { name: constants.ds2, value: 0, disabled: true },
    { name: constants.exam, value: 0, disabled: true },

    // {name: 'TP', value: 0},
    { name: constants.tdOrCC, value: 0, disabled: true },
    // {name: 'CC', value: 0},
  ]);
  const [formula, setFormula] = useState("");
  const [average, setAverage] = useState(0);
  const MetaDataPreview = ({ title, value }) => {
    return (
      <div>
        <span className="font-semibold">{title} </span> {value}
      </div>
    );
  };
  const onInputChange = (name, getValue) => {
    setInputs((marks) => {
      const temp = [...marks];
      temp[temp.findIndex((i) => i.name == name)].value = getValue;
      return temp;
    });
  };
  const resetInputs = () => {
    setInputs((marks) => {
      const temp = [...marks];
      temp.forEach((item) => {
        return (item.disabled = true);
      });
      return temp;
    });
  };
  useEffect(() => {
    let processAverage = ProcessDigits(calculateAverage(formula, inputs));
    setAverage(processAverage);
    if (processAverage > 0) {
      updateTotalAverage({
        name: subject.subject_name,
        coefficientCalculated: ProcessDigits(
          processAverage * parseFloat(subject.subject_coefficient)
        ),
      });
    }
  }, [inputs]);
  useEffect(() => {
    if (formula.length > 0) {
      resetInputs();
      switch (formula) {
        case "MFTD":
          setInputs((marks) => {
            const temp = [...marks];
            temp[
              temp.findIndex((i) => i.name == constants.exam)
            ].disabled = false;
            temp[
              temp.findIndex((i) => i.name == constants.tdOrCC)
            ].disabled = false;

            return temp;
          });
          break;
        case "MFSTD":
          setInputs((marks) => {
            const temp = [...marks];
            temp[
              temp.findIndex((i) => i.name == constants.exam)
            ].disabled = false;
            temp[
              temp.findIndex((i) => i.name == constants.ds)
            ].disabled = false;

            return temp;
          });
          break;
        case "MOTTD":
          setInputs((marks) => {
            const temp = [...marks];
            temp[
              temp.findIndex((i) => i.name == constants.tdOrCC)
            ].disabled = false;
            temp[
              temp.findIndex((i) => i.name == constants.ds)
            ].disabled = false;
            temp[
              temp.findIndex((i) => i.name == constants.ds2)
            ].disabled = false;

            return temp;
          });
          break;
        case "MOTSTD":
          setInputs((marks) => {
            const temp = [...marks];
            temp[
              temp.findIndex((i) => i.name == constants.ds)
            ].disabled = false;
            temp[
              temp.findIndex((i) => i.name == constants.ds2)
            ].disabled = false;

            return temp;
          });
          break;
        default:
          false;
      }
    }
  }, [formula]);
  return (
    <Card
      style={{
        boxShadow: ` 5px 5px 0px 0px ${bg_colors[index % 4]}`,
      }}
      // className={`max-w-[350px]`}
    >
      <CardHeader>
        <CardTitle>
          {" "}
          {subject.subject_name[0].toUpperCase() +
            subject.subject_name.slice(1)}{" "}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:p-4 p-0">
        <Select onValueChange={(value) => setFormula(value)}>
          <SelectTrigger className="ml-4 w-[280px] md:w-[90%] bg-primary-foreground">
            <SelectValue placeholder="Liste des formules" />
          </SelectTrigger>
          <SelectContent className="w-[280px] md:w-auto">
            {formulas_list.map((formulaItem) => (
              <SelectItem value={formulaItem.value}>
                {formulaItem.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-2 ml-2 p-2 md:grid-cols-3 gap-4">
          {inputs.map(
            (i) =>
              i.disabled === false && (
                <div className="flex flex-col  md:w-full">
                  <Label>{i.name}</Label>
                  <NumericFormat
                    allowNegative={false}
                    allowLeadingZeros={false}
                    isAllowed={(values) => {
                      const { formattedValue, value, floatValue } = values;
                      if (value.charAt(0) === "0") {
                        if (value.charAt(1) && value.charAt(1) != ".") {
                          return false;
                        }
                      }
                      return (
                        formattedValue === "" ||
                        (floatValue <= 20 && floatValue >= 0)
                      );
                    }}
                    onValueChange={(value) => {
                      onInputChange(i.name, value.floatValue);
                    }}
                    customInput={Input}
                  />
                </div>
              )
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col mt-2 space-y-1">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 justify-center w-full">
          {subject.subject_regime && (
            <MetaDataPreview title="Régime:" value={subject.subject_regime} />
          )}

          <MetaDataPreview title="Crédits:" value={subject.subject_credits} />
          <MetaDataPreview
            title="Coefficient:"
            value={subject.subject_coefficient}
          />
          {average > 0 && <MetaDataPreview title="Moyenne:" value={average} />}
          {average > 0 && (
            <MetaDataPreview
              title="Score:"
              value={ProcessDigits(
                average * parseFloat(subject.subject_coefficient)
              )}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DegreeSubjectCard;
